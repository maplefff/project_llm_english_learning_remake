# 後端開發階段 3：題型 1.1.1 的快取服務

**對應 `devPlanRead_Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段的目標是為題型 1.1.1 實現題目快取服務 `QuestionCacheService.ts`。此服務需要管理記憶體中的題目快取，並實現將快取持久化到本地 JSON 檔案的功能。同時，服務應具備低水位和高水位管理機制，以自動觸發背景題目補充任務，並包含題目生成失敗時的重試邏輯。所有核心功能都需有單元測試覆蓋。

## 主要產出物

*   `QuestionCacheService.ts` 模組，具備針對題型 1.1.1 的記憶體快取、本地 JSON 持久化、水位管理、背景補充觸發及重試功能。
*   `QuestionCacheService.test.ts` 的單元測試。
*   本地快取檔案 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/questionCache/111Cache.json` 的結構定義和處理邏輯。

## 詳細步驟

### Phase3.1 `QuestionCacheService.ts` 實現 (針對題型 1.1.1)
1.  **資料結構定義**:
    *   **記憶體快取 (`caches`)**: 使用 `Map<string, CacheEntry[]>` 結構，其中 `key` 是題型 ID (例如 `'1.1.1'`)，`value` 是 `CacheEntry` 物件的陣列。
    *   **`CacheEntry` 物件結構**: `{ UUID: string, questionData: QuestionData111, cacheTimestamp: number }` (其中 `UUID` 是題目的唯一識別碼，`questionData` 是從 `QuestionGeneratorService` 獲取的完整題目物件，`cacheTimestamp` 是題目加入快取時的 Unix epoch 時間戳（秒）)。
2.  **常數與配置**:
    *   定義題型 `'1.1.1'` 的低水位線 (例如 `MIN_QUESTIONS_111 = 4` 或 `LOW_WATER_MARK = 4`)。
    *   定義題型 `'1.1.1'` 的目標水位線 (例如 `TARGET_QUESTIONS_111 = 8`)。
    *   定義快取檔案路徑，例如實際服務中基於 `process.cwd()` 和相對路徑 `questionCache/111Cache.json`。
    *   確保 `questionCache` 目錄存在，如果不存在則創建。
3.  **初始化與載入 (`async initialize()`)**:
    *   應用程式 (或服務首次使用時) 啟動時調用。
    *   嘗試從快取檔案路徑讀取並解析 JSON 檔案，將題目載入到記憶體快取的 `Map` 中對應 `'1.1.1'` 的條目。
    *   處理檔案不存在或解析失敗的情況 (例如，初始化為空快取)。
    *   載入完成後，調用內部方法 `_checkAndTriggerReplenishment('1.1.1')` 檢查是否需要補充。此方法會在快取數量低於「低水位線」時觸發背景補充，背景補充的目標是將快取填充至「目標水位線」。
4.  **從快取提供題目 (`async getQuestionFromCache(questionType: string): Promise<QuestionData111 | null>`)**:
    *   目前僅處理 `questionType === '1.1.1'`。
    *   如果對應題型的記憶體快取中有題目：
        *   取出並移除陣列中的第一個題目 (FIFO)。
        *   **立即**調用 `_checkAndTriggerReplenishment('1.1.1')` 檢查是否需要補充。
        *   返回取出的 `questionData`。
    *   如果快取中無可用題目：
        *   返回 `null`，並確保 `_checkAndTriggerReplenishment('1.1.1')` (進而可能觸發 `_triggerReplenishment`) 已被調用以進行背景補充。
5.  **檢查並觸發補充 (`async _checkAndTriggerReplenishment(questionType: string)`)**:
    *   私有輔助方法。
    *   獲取指定 `questionType` 的當前快取數量。
    *   如果數量低於 `MIN_QUESTIONS_111` (低水位線)，則調用 `_triggerReplenishment(questionType)`。
6.  **背景補充任務 (`async _triggerReplenishment(questionType: string)`)**:
    *   私有輔助方法，設計為**非同步執行**，不阻塞主調用流程。
    *   **防止併發**: 設置一個標記 (例如 `isReplenishing.get(questionType)`) 防止對同一題型重複觸發過多補充任務。如果已在補充，則直接返回。
    *   計算需要補充的題目數量 (目標水位線 - 當前數量)。
    *   **題目生成與重試**:
        *   循環調用 `QuestionGeneratorService.generateQuestionByType(questionType)` 生成新題目。
        *   **重試機制**: 如果題目生成失敗 (例如 `QuestionGeneratorService` 拋出錯誤或返回 `null`/空陣列)：
            *   系統將進行最多 `MAX_GENERATION_RETRIES` (例如 3 次，即總共 1+3=4 次嘗試) 的重試。
            *   重試之間採用指數退避 (Exponential Backoff) 策略，例如首次延遲 `BASE_RETRY_DELAY` (1秒)，後續延遲時間翻倍。
            *   加入隨機抖動 (Jitter) 到延遲時間，以避免同時發生大量重試。
            *   若所有重試均失敗，則記錄錯誤並放棄當前的補充循環，等待下一次 `_checkAndTriggerReplenishment` 的觸發。
    *   每成功生成一道題目：
        *   將其包裝成 `CacheEntry` 並加入到記憶體快取。
        *   異步調用 `_persistCacheToFile('1.1.1')` 將變動寫入本地檔案。
    *   直到快取達到目標水位線，或生成過程中發生不可恢復錯誤 (且重試已用盡)。
    *   補充完成或失敗後，重置併發標記。
7.  **持久化到檔案 (`async _persistCacheToFile(questionType: string)`)**:
    *   私有輔助方法。
    *   讀取記憶體中對應 `questionType` 的所有 `CacheEntry`。
    *   將 `CacheEntry` 陣列序列化為 JSON 字串。
    *   將 JSON 字串異步寫入到對應的快取檔案，覆蓋舊內容。
    *   處理檔案寫入錯誤。
8.  **添加題目到快取 (主要由 `_triggerReplenishment` 內部調用)**:
    *   將 `QuestionGeneratorService` 返回的 `questionData` 包裝成 `CacheEntry` 物件 (生成UUID，記錄時間戳)。
    *   添加到記憶體快取的對應題型陣列中。

### Phase3.2 單元測試 (`QuestionCacheService.test.ts`)
1.  **模擬依賴**:
    *   模擬 `QuestionGeneratorService.ts`，使其能按需返回模擬的 `questionData`、`null`，或拋出錯誤以測試重試邏輯。
    *   模擬 Node.js 的 `fs/promises` 模組來測試檔案的讀寫操作。
2.  **測試案例 (針對題型 '1.1.1')**:
    *   **初始化**:
        *   測試當本地快取檔案存在且包含有效數據時，`initialize` 能否成功載入數據到記憶體。
        *   測試當本地快取檔案不存在或損壞 (無效JSON) 時，`initialize` 能否初始化為空快取並正確觸發補充檢查。
        *   測試初始化後，若快取低於低水位，是否觸發補充機制。
        *   測試初始化後，若快取等於或高於低水位，是否 *不* 觸發補充機制。
    *   **提供題目 (`getQuestionFromCache`)**:
        *   測試當快取中有足夠題目時，能否成功返回一道題目 (FIFO)，並且快取數量減少。
        *   測試從快取取出題目後，快取的變動（即使變為空）是否被正確持久化。
        *   測試當快取中題目數量降至低水位線以下時，是否觸發背景補充。
        *   測試當快取中題目數量降至等於低水位線時，是否 *不* 觸發背景補充。
        *   測試當快取為空時，返回 `null` 並觸發補充。
    *   **背景補充 (`_triggerReplenishment`)**:
        *   測試能否成功調用 `QuestionGeneratorService` 生成題目。
        *   測試新生成的題目是否被正確添加到記憶體快取並持久化。
        *   測試快取數量是否能達到目標水位線。
        *   測試併發控制是否有效。
        *   **重試機制測試**:
            *   測試題目生成首次失敗後，能否成功重試並獲取題目。
            *   測試題目生成多次失敗後，達到最大重試次數後是否放棄補充 (此測試目前可選或根據實際情況決定是否保留)。
    *   **持久化**:
        *   測試添加新題目到記憶體後 (在 `_triggerReplenishment` 過程中)，是否會觸發 `_persistCacheToFile` 將每個新題目持久化。
        *   (針對 `getQuestionFromCache`) 測試成功獲取題目並導致快取變動後，是否觸發 `_persistCacheToFile` 持久化更新後的快取狀態。
        *   測試從模擬檔案系統讀取時 (在 `initialize` 過程中)，數據是否正確。
    *   **邊界條件**:
        *   測試快取已滿 (達到目標水位線) 時，補充機制是否正確停止。
        *   (已包含在重試機制測試中) 測試 `QuestionGeneratorService` 生成題目持續失敗時的行為。

## 驗收標準

*   `QuestionCacheService.ts` 模組功能完整，能夠為題型 1.1.1 管理記憶體快取和本地 JSON 持久化，並具備有效的重試機制。
*   水位管理和背景補充機制按預期工作。
*   絕大部分為 `QuestionCacheService.ts` 編寫的單元測試全部通過。
*   本地快取檔案能夠被正確創建、讀取和更新。
*   所有程式碼已提交到版本控制系統。 