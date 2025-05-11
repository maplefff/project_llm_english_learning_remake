# 後端開發階段 6：擴展至其他題型與前端初步對接準備

**對應 `devPlanRead&Write.md` 第 6 點中的 6.3 (階段三)**

## 1. 目標

本階段的目標是基於前五個後端開發階段已建立的單一題型 (1.1.1) 處理框架，逐步為 `discussion_read&write.md` 中定義的其他**閱讀題型**和**寫作題型**實現後端支持。這包括為每個新題型創建對應的 `[題型ID]_generate.js` 模組，並擴展現有的 `QuestionGeneratorService`、`QuestionCacheService`、`HistoryService` 和 `TestOrchestratorService` 以適配這些新題型。同時，API 端點 (`APIController.js`) 也將被更新以反映新增的題型。此階段的重點是後端功能的擴展和健壯性，為後續與前端的全面對接做好準備。

## 2. 主要產出物

*   為 `discussion_read&write.md` 中定義的**所有題型**（或一個預先商定的子集）實現的 `[題型ID]_generate.js` 模組及其單元測試。
*   擴展後的 `QuestionGeneratorService.js`，能夠調度所有已實現題型的生成器，及其更新後的單元測試。
*   擴展後的 `QuestionCacheService.js`，能夠為所有已實現題型提供快取服務 (包括記憶體和本地JSON持久化)，及其更新後的單元測試。
*   擴展後的 `HistoryService.js`，能夠記錄所有已實現題型的作答歷史，及其更新後的單元測試。
*   擴展後的 `TestOrchestratorService.js`，能夠處理所有已實現題型的單一練習流程，及其更新後的單元測試。
*   更新後的 `APIController.js`，`GET /api/question-types` 能返回所有支持的題型列表，其他API能處理不同題型的請求。
*   更新後的整合測試，覆蓋新增題型的核心API流程。

## 3. 詳細步驟 (迭代進行)

針對 `discussion_read&write.md` 中**每一個**尚未實現的題型 (例如 1.1.2, 1.2.1, 1.2.2, ... , 2.8.2 等)，重複以下子步驟：

### 3.1. 選擇下一個要實現的題型
    *   **優先順序**: 可以按照 `discussion_read&write.md` 中的順序，或者根據題型複雜度和前端實現的優先級來決定。建議先完成所有閱讀題型，再處理寫作題型。

### 3.2. 實現 `[題型ID]_generate.js` (例如 `112_generate.js`, `121_generate.js`)
    1.  **Prompt 設計與構建**:
        *   仔細研究 `discussion_read&write.md` 中關於該題型的描述、範例、期望的 JSON 輸出結構 (包括 `passageOrPrompt`, `question`, `options` (如果適用), `answer`, `explanation_of_Question` 等)。
        *   為該題型設計專用的、優化的 Prompt 模板。
            *   對於**選擇題類** (如 1.1.2, 1.2.2, 1.2.3, 1.3.1, 1.4.1, 1.5.1, 1.5.2 (複合), 1.5.3)，確保 Prompt 指示 LLM 生成明確的選項和正確答案標識。
            *   對於**改錯題/句子寫作/翻譯題等開放式文本輸入類** (如 1.2.1, 2.1.1, 2.1.2, 2.2.1, 2.2.2, 2.3.1, 2.4.2, 2.5.1, 2.5.2, 2.6.1, 2.7.1, 2.7.2, 2.8.1, 2.8.2)，Prompt 需指示 LLM 生成題目描述/原始文本/寫作提示，並**同時生成一個或多個參考答案或評分標準的關鍵點** (存儲在 `answer` 或一個新的 `referenceAnswer` 欄位中，供後端初步判斷或前端展示)。對於這類題型，`explanation_of_Question` 可能變為 `explanation_of_Task` 或 `scoring_rubric_summary`。
            *   對於**排序題** (如 2.4.1)，Prompt 需指示 LLM 生成待排序的項目和正確順序。
        *   考慮該題型的特殊性，例如 `1.5.2 作者目的與語氣` 是複合型選擇題。
    2.  **服務邏輯**:
        *   實現調用 `GeminiAPIService.js` 和 `CleanJSON.js` 的邏輯。
        *   實現數據驗證與格式化，確保輸出符合前端渲染和後端處理所需。
    3.  **錯誤處理**: 處理特定於該題型生成過程中可能出現的錯誤。
    4.  **單元測試**: 編寫針對此新題型生成器的單元測試，模擬依賴並驗證各種情況下的輸出。

### Phase6.3 擴展 `QuestionGeneratorService.js`
    1.  修改 `generateQuestionByType(questionType: string)` 方法，在其 `switch` 或 `if-else` 邏輯中加入對新實現的 `[題型ID]_generate.js` 的調用。
    2.  更新其單元測試，確保能夠正確調度到新的題型生成器。

### Phase6.4 擴展 `QuestionCacheService.js`
    1.  **配置更新**: 為新題型定義低水位線、目標水位線和本地快取檔案路徑 (例如 `/backend/questionCache/[題型ID]Cache.json`)。
    2.  **邏輯擴展**: 確保 `initializeCache`, `getQuestionFromCache`, `_checkAndTriggerReplenishment`, `_triggerReplenishment`, `_persistCacheToFile` 等核心函數能夠正確處理新的 `questionType`。這可能意味著將題型特定的配置（如水位線、檔案路徑）參數化或使用映射表。
    3.  **單元測試擴展**: 為新題型複製並調整現有的快取服務單元測試，確保其快取和持久化邏輯對新題型同樣有效。

### Phase6.5 擴展 `HistoryService.js`
    1.  **邏輯檢查**: 檢查 `saveHistoryEntry` 和 `getHistory` 的邏輯是否能通用地處理新題型的作答歷史。由於歷史條目結構 (`HistoryEntry`) 設計上包含了 `testItem` 和 `questionDataSnapshot`，大部分情況下應該是通用的。
    2.  **儲存策略調整 (可選)**: 考慮是否所有題型的歷史都存儲在單一的 `history.json` 中，或者按題型、日期等因素進行拆分（初期保持單一檔案簡化處理）。
    3.  **單元測試擴展**: 增加測試案例，驗證能夠正確儲存和讀取包含新題型作答數據的歷史條目。

### Phase6.6 擴展 `TestOrchestratorService.js`
    1.  **邏輯擴展**:
        *   修改 `startSingleTypeTest(questionType: string)` 以支持新的 `questionType`，使其能從 `QuestionCacheService` 獲取對應題型的題目。
        *   修改 `submitAnswer(...)` 以處理新題型的答案判斷邏輯。
            *   對於選擇題，判斷邏輯類似。
            *   對於開放式文本題，初期的 `isCorrect` 可能總是 `null` 或 `true` (表示已提交)，或者後端可以進行一些簡單的關鍵詞匹配 (基於LLM生成的參考答案)。更複雜的自動評分超出了初期範圍。前端將主要展示題目和用戶答案，以及可能的參考答案/解釋。
    2.  **單元測試擴展**: 增加測試案例，驗證 `TestOrchestratorService` 能否正確協調新題型的練習流程。

### Phase6.7 更新 `APIController.js` (及相關路由)
    1.  **`GET /api/question-types`**: 更新此端點返回的題型列表，加入新實現的題型及其描述。
    2.  **`POST /api/start-test`**: 確保此端點能接受新的 `questionType` 並正確調用 `TestOrchestratorService`。
    3.  **`POST /api/submit-answer`**: 確保此端點能處理來自新題型的答案提交。
    4.  **整合測試擴展**: 為每個新增題型的核心API流程 (開始測驗 -> 獲取題目 -> 提交答案 -> 記錄歷史) 編寫或擴展整合測試。同樣，模擬 `GeminiAPIService` 以專注於服務間整合。

### Phase6.8 API 設計與前端溝通
    *   在此階段，隨著更多題型的加入，API 的請求和回應格式可能需要根據前端的實際渲染需求進行微調。保持與前端開發的溝通，確保 API 設計能滿足前端展示各種不同題型（選擇題、填空題、寫作題等）的需求。
    *   例如，`questionData` 的結構需要足夠靈活，以容納不同題型的特定字段。

## 4. 驗收標準

*   `devPlanRead&Write.md` 中第六點（6.3 階段三）要求覆蓋的**所有題型**（或預先商定的題型子集）均已完成後端核心服務的實現和擴展。
*   所有新實現的 `[題型ID]_generate.js` 及其依賴服務 (`QuestionGeneratorService`, `QuestionCacheService`, `HistoryService`, `TestOrchestratorService`) 的單元測試和整合測試均已通過。
*   API 端點 `GET /api/question-types` 能返回所有已支持的題型。
*   API 能夠正確處理所有已支持題型的開始測驗、提交答案和歷史記錄請求。
*   後端代碼結構清晰，易於擴展以支持未來可能的新題型。
*   所有程式碼已提交到版本控制系統。
*   (雖然此階段主要關注後端，但理想情況下，API 設計已與前端開發者初步溝通，確保其可用性)。 