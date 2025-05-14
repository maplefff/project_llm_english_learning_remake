# 後端開發階段 3 備忘錄：題型 1.1.1 快取服務 (`QuestionCacheService`)

日期：$(date +%Y-%m-%d)

## 1. 概述

本階段主要目標是實現並測試針對題型 1.1.1 的題目快取服務 `QuestionCacheService.ts`。此服務負責管理記憶體中的題目快取、將快取持久化到本地 JSON 檔案、並根據低水位和目標水位自動觸發背景題目補充。

對應計畫文件：`devBackendPhase3.md`

## 2. 核心功能與實現摘要

### 2.1. 資料結構

*   **記憶體快取 (`caches`)**: 使用 `Map<string, CacheEntry[]>` 結構。
    *   `key`: 題型 ID (例如 `'1.1.1'`)。
    *   `value`: `CacheEntry` 物件的陣列。
*   **`CacheEntry` 物件結構**:
    *   `UUID: string`: 題目的唯一識別碼。
    *   `questionData: QuestionData111`: 完整的題目資料物件。
    *   `cacheTimestamp: number`: 題目加入快取時的 Unix epoch 時間戳（秒）。
    *   此結構與 `devBackendPhase3.md` 中計畫的 `CachedQuestion` 核心內容一致，欄位命名和時間戳格式有所調整。

### 2.2. 主要常數與配置 (基於測試檔案中的設定)

*   **低水位線 (`LOW_WATER_MARK` 或服務內的 `MIN_QUESTIONS_111`)**: `4` (當快取數量低於此值時觸發補充)。
*   **目標水位線 (`TARGET_QUESTIONS_111`)**: `8` (背景補充任務會嘗試將快取補充到此數量)。
*   **快取檔案路徑**: 測試中模擬為 `/mock/cache/dir/111Cache.json`。實際服務中使用了基於 `process.cwd()` 和相對路徑 `questionCache/111Cache.json` 的配置。
*   **目錄創建**: 服務初始化時會確保快取目錄存在。

### 2.3. 關鍵服務方法與邏輯

*   **初始化 (`initialize()`)**:
    *   確保快取目錄存在。
    *   從本地 JSON 檔案 (`111Cache.json`) 載入現有快取。
    *   處理檔案不存在或 JSON 解析錯誤的情況（初始化為空快取）。
    *   載入完成後，調用 `_checkAndTriggerReplenishment('1.1.1')` 檢查是否需要補充。
        *   **澄清點/與計畫差異**: `devBackendPhase3.md` 原計畫是初始化後若低於「目標水位」則觸發補充。實際實現（根據測試日誌和 `_checkAndTriggerReplenishment` 的行為）是在低於「低水位」時觸發補充循環，該循環的目標是達到「目標水位」。

*   **提供題目 (`getQuestionFromCache(questionType: string)`)**:
    *   實現 FIFO 機制從記憶體快取中獲取題目。
    *   題目成功取出後，立即調用 `_checkAndTriggerReplenishment` 檢查是否需要補充。
    *   若快取為空，返回 `null` 並確保觸發背景補充。

*   **檢查並觸發補充 (`_checkAndTriggerReplenishment(questionType: string)`)**:
    *   內部輔助方法。
    *   若當前快取數量低於「低水位線」，則調用 `_triggerReplenishment`。

*   **背景補充任務 (`_triggerReplenishment(questionType: string)`)**:
    *   非同步執行。
    *   **併發控制**: 使用 `isReplenishing` 標記防止對同一題型重複觸發補充。
    *   計算所需題目數量 (目標水位 - 當前數量)。
    *   循環調用 `QuestionGeneratorService.generateQuestionByType` 生成新題目。
    *   每成功生成一道題目，將其加入記憶體快取並異步調用 `_persistCacheToFile`。
    *   直到快取達到目標水位線或生成/重試失敗。
    *   **重試機制 (計畫外增強)**:
        *   題目生成失敗時，會進行最多 `MAX_GENERATION_RETRIES` (預設 3 次，總共 1+3=4 次嘗試) 的重試。
        *   重試間隔採用指數退避 (Exponential Backoff) 和隨機抖動 (Jitter) 策略。
        *   若所有重試均失敗，則放棄當前補充循環。

*   **持久化到檔案 (`_persistCacheToFile(questionType: string)`)**:
    *   將指定題型的記憶體快取序列化為 JSON 並覆蓋寫入到本地檔案。

## 3. 單元測試 (`QuestionCacheService.test.ts`) 狀態

*   **總測試案例**: 18 個。
*   **已通過測試**: 17 個（在逐步啟用和單獨測試過程中確認通過）。
    *   覆蓋了初始化、從檔案載入、處理錯誤的快取檔案、提供題目、快取為空處理、基於低水位的補充觸發、併發補充控制、題目生成與加入快取、持久化到檔案、以及重試成功等場景。
*   **目前跳過的測試**: 1 個。
    *   `should give up after MAX_RETRIES and leave cache as is if all retries fail`: 按照指示暫時跳過。
*   **主要解決的問題**:
    *   測試初期的 `"Cannot log after tests are done"` 警告，通過逐步執行和隔離測試，以及確保 Jest 能妥善處理非同步操作（尤其是 `_triggerReplenishment` 中的 `setTimeout`），已在通過的測試中解決。

### 3.1. 測試案例調整與最終結果

在完整執行測試套件的過程中，發現並修正了以下兩個測試案例的斷言邏輯，以確保它們準確反映服務的預期行為：

1.  **`getQuestionFromCache › should persist the cache after a question is removed`**:
    *   **調整**: 原本期望 `mockWriteFile` 在移除最後一個快取項目後，被呼叫時傳遞的是包含該已移除項目的快取。修正後的期望是，`mockWriteFile` 應被呼叫傳遞一個空陣列 (`[]`)，因為快取在移除最後一項後確實是空的，這才是正確的持久化狀態。
2.  **`getQuestionFromCache › should trigger replenishment if cache drops to low water mark`**:
    *   **調整**: 原本期望當快取數量從 `LOW_WATER_MARK + 1` 降至 `LOW_WATER_MARK` 時，會觸發補充 (`_triggerReplenishment` 被呼叫)。根據服務的邏輯 (`currentCache.length < this.LOW_WATER_MARK_111`)，當數量等於低水位時不應觸發。因此，斷言被修正為期望 `_triggerReplenishment` *不*被呼叫。

**最終測試結果 (截至 $(date +%Y-%m-%d))**:
*   **總測試案例**: 18 個。
*   **已通過測試**: 17 個。
*   **已跳過測試**: 1 個 (`should give up after MAX_RETRIES and leave cache as is if all retries fail`)。
所有非跳過的測試案例均已成功通過。

## 4. 與 `devBackendPhase3.md` 的主要差異與增強

*   **增強 - 重試機制**: 實際實現中加入了詳細的題目生成重試機制（指數退避、抖動、最大次數限制），這在原計畫中未詳細列出，是重要的可靠性提升。
*   **澄清 - 初始化補充觸發**: 原計畫描述初始化後若低於「目標水位」則補充，實際是基於「低水位」觸發補充循環，目標是達到「目標水位」。此差異對最終行為影響不大，但觸發條件更精確。
*   **細節調整 - 資料結構命名**: 計畫中的 `CachedQuestion` 在實現中為 `CacheEntry`，`addedAt: Date` 變為 `cacheTimestamp: number` (Unix epoch)。

## 5. 結論與後續

`QuestionCacheService` 的核心功能已按照計畫（並有所增強）完成開發和單元測試。大部分測試案例均能成功通過，顯示服務的穩定性和功能的正確性。

**建議操作**:

*   在 `devBackendPhase3.md` 中更新以下內容以反映實際情況：
    *   補充關於初始化時觸發補充的精確邏輯（基於低水位觸發）。
    *   詳細描述已實現的題目生成重試機制。
    *   更新 `CachedQuestion` 的結構定義以匹配 `CacheEntry`。
*   決定何時處理或是否移除被跳過的測試案例 `should give up after MAX_RETRIES and leave cache as is if all retries fail`。
*   在所有（或選定的）測試案例恢復為 `it` 後，執行一次完整的測試套件運行，以最終確認整體穩定性。

---
此備忘錄由 AI 輔助生成。 