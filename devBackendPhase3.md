# 後端開發階段 3：題型 1.1.1 的快取服務

**對應 `devPlanRead&Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段的目標是為題型 1.1.1 實現題目快取服務 `QuestionCacheService.js` (或 `.ts`)。此服務需要管理記憶體中的題目快取，並實現將快取持久化到本地 JSON 檔案的功能。同時，服務應具備低水位和高水位管理機制，以自動觸發背景題目補充任務。所有核心功能都需有單元測試覆蓋。

## 主要產出物

*   `QuestionCacheService.js` 模組，具備針對題型 1.1.1 的記憶體快取、本地 JSON 持久化、水位管理及背景補充觸發功能。
*   `QuestionCacheService.js` 的單元測試。
*   本地快取檔案 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/questionCache/111Cache.json` 的結構定義和處理邏輯。

## 詳細步驟

### Phase3.1 `QuestionCacheService.js` (或 `.ts`) 實現 (針對題型 1.1.1)
1.  **資料結構定義**:
    *   **記憶體快取**: 使用 `Map<string, CachedQuestion[]>` 結構，其中 `key` 是題型 ID (例如 `'1.1.1'`)，`value` 是 `CachedQuestion` 物件的陣列。
    *   `CachedQuestion` 物件結構: `{ id: string, questionData: object, addedAt: Date }` (其中 `id` 可以是 UUID，`questionData` 是從 `QuestionGeneratorService` 獲取的完整題目物件)。
2.  **常數與配置**:
    *   定義題型 `'1.1.1'` 的低水位線 (例如 `MIN_QUESTIONS_111 = 3`)。
    *   定義題型 `'1.1.1'` 的目標水位線 (例如 `TARGET_QUESTIONS_111 = 8`)。
    *   定義快取檔案路徑: `CACHE_FILE_PATH_111 = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/questionCache/111Cache.json"`。
    *   確保 `questionCache` 目錄存在，如果不存在則創建。
3.  **初始化與載入 (`async initializeCache()`)**:
    *   應用程式 (或服務首次使用時) 啟動時調用。
    *   嘗試從 `CACHE_FILE_PATH_111` 讀取並解析 JSON 檔案，將題目載入到記憶體快取的 `Map` 中對應 `'1.1.1'` 的條目。
    *   處理檔案不存在或解析失敗的情況 (例如，初始化為空快取)。
    *   載入完成後，檢查題型 `'1.1.1'` 的快取數量，如果低於 `TARGET_QUESTIONS_111`，則調用 `_triggerReplenishment('1.1.1')` 進行初次填充。
4.  **從快取提供題目 (`async getQuestionFromCache(questionType: string): Promise<object | null>`)**:
    *   目前僅處理 `questionType === '1.1.1'`。
    *   如果對應題型的記憶體快取中有題目：
        *   取出並移除陣列中的第一個題目 (FIFO)。
        *   **立即**調用 `_checkAndTriggerReplenishment('1.1.1')` 檢查是否需要補充。
        *   返回取出的 `questionData`。
    *   如果快取中無可用題目：
        *   **策略一 (阻塞式，初期可選)**: 立即觸發一次前景生成 `QuestionGeneratorService.generateQuestionByType('1.1.1')`，等待其完成後返回題目，並將新題目加入快取 (同時也觸發一次背景補充以達到目標水位)。這能保證使用者總能拿到題目，但可能有等待。
        *   **策略二 (非阻塞式，更優)**: 返回 `null`，並確保 `_triggerReplenishment` 正在運行。前端可能需要處理 `null` 並稍後重試。
        *   (為了簡化初期實現，可以先採用阻塞式或返回 `null` 並依賴背景補充)。
5.  **檢查並觸發補充 (`async _checkAndTriggerReplenishment(questionType: string)`)**:
    *   私有輔助方法。
    *   獲取指定 `questionType` 的當前快取數量。
    *   如果數量低於 `MIN_QUESTIONS_111`，則調用 `_triggerReplenishment(questionType)`。
6.  **背景補充任務 (`async _triggerReplenishment(questionType: string)`)**:
    *   私有輔助方法，設計為**非同步執行**，不阻塞主調用流程。
    *   **防止併發**: 設置一個標記 (例如 `isReplenishing_111 = true`) 防止對同一題型重複觸發過多補充任務。如果已在補充，則直接返回。
    *   計算需要補充的題目數量 (目標水位線 - 當前數量)。
    *   循環調用 `QuestionGeneratorService.generateQuestionByType(questionType)` 生成新題目。
    *   每成功生成一道題目：
        *   將其加入到記憶體快取。
        *   異步調用 `_persistCacheToFile('1.1.1')` 將變動寫入本地檔案。
    *   直到快取達到目標水位線，或生成過程中發生不可恢復錯誤。
    *   補充完成或失敗後，重置併發標記 (例如 `isReplenishing_111 = false`)。
7.  **持久化到檔案 (`async _persistCacheToFile(questionType: string)`)**:
    *   私有輔助方法。
    *   讀取記憶體中對應 `questionType` 的所有題目。
    *   將題目陣列序列化為 JSON 字串。
    *   將 JSON 字串異步寫入到對應的快取檔案 (例如 `CACHE_FILE_PATH_111`)，覆蓋舊內容。
    *   處理檔案寫入錯誤。
8.  **添加題目到快取 (主要由 `_triggerReplenishment` 內部調用)**:
    *   將 `QuestionGeneratorService` 返回的 `questionData` 包裝成 `CachedQuestion` 物件 (生成ID，記錄時間戳)。
    *   添加到記憶體快取的對應題型陣列中。

### Phase3.2 單元測試 (`QuestionCacheService.test.js` 或 `.test.ts`)
1.  **模擬依賴**:
    *   模擬 `QuestionGeneratorService.js`，使其能按需返回模擬的 `questionData` 或 `null`。
    *   模擬 Node.js 的 `fs` 模組 (例如使用 `jest.mock('fs')` 或 `memfs` 庫) 來測試檔案的讀寫操作，避免實際操作檔案系統。
2.  **測試案例 (針對題型 '1.1.1')**:
    *   **初始化**:
        *   測試當本地快取檔案存在且包含有效數據時，`initializeCache` 能否成功載入數據到記憶體。
        *   測試當本地快取檔案不存在或損壞時，`initializeCache` 能否初始化為空快取並觸發初次填充。
        *   測試初次填充是否嘗試將快取補充到目標水位線。
    *   **提供題目 (`getQuestionFromCache`)**:
        *   測試當快取中有足夠題目時，能否成功返回一道題目，並且快取數量減少。
        *   測試當快取中題目數量降至低水位線以下時，是否觸發背景補充 (`_triggerReplenishment` 被調用)。
        *   測試當快取為空時的行為 (根據所選策略，是阻塞等待還是返回 `null`，並驗證是否觸發補充)。
    *   **背景補充 (`_triggerReplenishment`)**:
        *   測試能否成功調用 `QuestionGeneratorService` 生成題目。
        *   測試新生成的題目是否被正確添加到記憶體快取中。
        *   測試快取數量是否能達到目標水位線。
        *   測試併發控制是否有效 (短時間內多次觸發補充，實際補充任務只執行一次)。
    *   **持久化**:
        *   測試添加新題目到記憶體後，是否會觸發 `_persistCacheToFile` 將更新後的快取寫入模擬的檔案系統。
        *   測試從模擬檔案系統讀取時，數據是否正確。
    *   **邊界條件**:
        *   測試快取已滿 (達到目標水位線) 時，補充機制是否停止。
        *   測試 `QuestionGeneratorService` 生成題目失敗 (返回 `null`) 時，補充機制的行為。

## 驗收標準

*   `QuestionCacheService.js` 模組功能完整，能夠為題型 1.1.1 管理記憶體快取和本地 JSON 持久化。
*   水位管理和背景補充機制按預期工作。
*   所有為 `QuestionCacheService.js` 編寫的單元測試全部通過。
*   本地快取檔案 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/questionCache/111Cache.json` 能夠被正確創建、讀取和更新。
*   所有程式碼已提交到版本控制系統。 