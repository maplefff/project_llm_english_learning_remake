# 後端開發階段 2：單一題型 (1.1.1) 生成器與服務

**對應 `devPlanRead_Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段的目標是實現針對特定題型 1.1.1 (詞義選擇) 的專用題目生成器 `111_generate.js` (或 `.ts`)，以及題目生成調度服務 `QuestionGeneratorService.js` (或 `.ts`) 的初步版本。這兩個模組都需要包含相應的單元測試。**完成此階段將為 1.1.1 題型實現初步的端到端功能 (包括與前端的整合) 奠定堅實基礎，讓專案核心流程得以先行運轉。**

## 主要產出物

*   `111_generate.js` 模組及其單元測試。
*   `QuestionGeneratorService.js` 模組 (初步實現，支持調用 `111_generate.js`) 及其單元測試。
*   針對題型 1.1.1 優化的 Prompt 模板。

## 詳細步驟

### Phase2.1 `111_generate.js` (或 `.ts`) 實現
1.  **Prompt 設計與構建**:
    *   **參考依據**: `discussion_read&write.md` 中關於題型 1.1.1 (詞義選擇) 的描述、範例題目、期望的 JSON 輸出結構以及最終確定的 Prompt 模板。
    *   **Prompt 內容**:
        *   明確指示 LLM 扮演的角色（例如：一個英語教學內容創作者）。
        *   清晰說明任務：生成一個詞義選擇題。
        *   提供題目的上下文要求（例如：一個包含目標詞彙的句子）。
        *   要求 LLM 提供目標詞彙 (`targetWord`)。
        *   要求 LLM 提供至少四個選項，其中一個是正確答案，其餘為干擾項。明確標示正確答案 (`standard_answer`)。
        *   **特別要求** LLM 為題目生成一個 `explanation_of_Question` (繁體中文)，解釋為什麼正確答案是正確的，以及為什麼其他選項是錯誤的（或者至少解釋目標詞彙的含義和用法）。
        *   **指定 JSON 輸出格式**: 提供一個清晰的 JSON 結構範例，包含所有必需的鍵，例如 (`111_generate.js` 輸出的 `questionData` 結構):
            ```json
            {
              "passage": "The resilient athlete quickly recovered from her injury.",
              "targetWord": "resilient",
              "question": "In the sentence above, the word 'resilient' most nearly means:",
              "options": [
                { "A": "weak" },
                { "B": "determined" },
                { "C": "flexible and quick to recover" },
                { "D": "tired" }
              ],
              "standard_answer": "C",
              "explanation_of_Question": "Resilient 指能夠承受或迅速從困難情況中恢復。此處運動員能快速復原，顯示其高度彈性與復原力，因此選項 C 正確。選項 A「weak」意為虛弱，語意相反；選項 B「determined」僅表意志堅定，未涵蓋恢復力；選項 D「tired」表示疲倦，與原意無關。"
            }
            ```
        *   可以使用 Few-shot prompting，在 Prompt 中包含1-2個完整的請求與回應範例。
    *   此 Prompt 模板可以直接寫在 `111_generate.js` 內部，或作為單獨的文本資源引入。
2.  **服務邏輯**:
    *   實現一個主要函數，例如 `async generateQuestion(): Promise<object | null>`。
    *   在此函數內，構建完整的 Prompt (可能需要動態組裝部分內容，但初期可為靜態)。
    *   調用已在 `devBackendPhase1` 中實現的 `GeminiAPIService.js` 的 `getCompletion(prompt)` 方法，傳入構建好的 Prompt，獲取 LLM 的原始回應。
    *   調用已在 `devBackendPhase1` 中實現的 `CleanJSON.js` 的 `extractAndParse(rawLLMResponse)` 方法，解析 LLM 回應，獲取結構化的 `questionData` 物件。
    *   **數據驗證與格式化**:
        *   驗證從 `CleanJSON.js` 返回的物件是否包含所有預期的鍵 (`passage`, `targetWord`, `question`, `options`, `standard_answer`, `explanation_of_Question`) 且格式大致正確。
        *   確保 `options` 是一個陣列，每個元素是包含選項字母和文本的物件 (例如 `{"A": "text"}` )。
        *   確保 `standard_answer` 是選項中的一個有效字母。
        *   如果驗證失敗，記錄錯誤並返回 `null` 或拋出特定錯誤。
    *   如果成功，返回格式化後的 `questionData` 物件。
3.  **錯誤處理**:
    *   處理 `GeminiAPIService.js` 或 `CleanJSON.js` 可能拋出的錯誤。
    *   處理 Prompt 過長或 LLM 返回不符合預期內容的情況。

### Phase2.2 單元測試 (`111_generate.test.js` 或 `.test.ts`)
1.  **模擬依賴**:
    *   模擬 `GeminiAPIService.js`，使其在被調用時返回預設的 LLM 原始回應字串 (包括成功生成和生成失敗/格式錯誤的模擬回應)。
    *   模擬 `CleanJSON.js`，使其根據輸入返回預期的解析結果 (物件或 `null`)。
2.  **測試案例**:
    *   **成功生成**:
        *   測試當 `GeminiAPIService` 返回一個包含有效 JSON 的回應，且 `CleanJSON` 成功解析時，`111_generate.js` 是否能返回正確格式化的 `questionData` 物件。
        *   驗證 Prompt 是否按預期構建。
    *   **LLM 回應處理**:
        *   測試當 `GeminiAPIService` 返回的 LLM 回應中 JSON 格式輕微錯誤但可被 `CleanJSON` 修復時的情況。
        *   測試當 `GeminiAPIService` 返回的 LLM 回應無法被 `CleanJSON` 解析 (返回 `null`) 時，`111_generate.js` 是否能妥善處理 (例如返回 `null` 或拋出錯誤)。
    *   **依賴服務錯誤**:
        *   測試當 `GeminiAPIService` 拋出錯誤時，`111_generate.js` 是否能捕獲並適當處理。
        *   測試當 `CleanJSON` 拋出錯誤時 (如果其設計為拋出錯誤而非僅返回 `null`)，`111_generate.js` 是否能處理。

### Phase2.3 `QuestionGeneratorService.js` (或 `.ts`) 初步實現
1.  **服務邏輯**:
    *   實現一個函數，例如 `async generateQuestionByType(questionType: string): Promise<object | null>`。
    *   內部使用 `if-else` 或 `switch` 語句，根據傳入的 `questionType` 參數調用對應的題型生成器。
    *   目前階段，僅需處理 `questionType === '1.1.1'` 的情況，此時調用 `111_generate.js` 中的 `generateQuestion()` 方法。
    *   如果 `questionType` 不被支持，返回 `null` 或拋出錯誤。
2.  **錯誤處理**:
    *   處理從 `111_generate.js` 返回的 `null` 或其可能拋出的錯誤。

### Phase2.4 單元測試 (`QuestionGeneratorService.test.js` 或 `.test.ts`)
1.  **模擬依賴**:
    *   模擬 `111_generate.js` (或其導出的 `generateQuestion` 函數)，使其在被調用時返回預期的 `questionData` 物件或 `null`。
2.  **測試案例**:
    *   **成功調度**:
        *   測試當 `questionType` 為 `'1.1.1'` 時，是否正確調用了 `111_generate.js` 並返回其結果。
    *   **未知題型**:
        *   測試當傳入一個目前不支持的 `questionType` (例如 `'1.1.2'`) 時，服務是否按預期返回 `null` 或拋出錯誤。
    *   **題型生成器返回錯誤/null**:
        *   測試當 `111_generate.js` 返回 `null` (表示生成失敗) 時，`QuestionGeneratorService` 是否也返回 `null`。

## 驗收標準

*   `111_generate.js` 模組功能完整，單元測試全部通過。
*   `QuestionGeneratorService.js` 模組能夠成功調度 `111_generate.js`，其單元測試全部通過。
*   為題型 1.1.1 設計的 Prompt 模板已完成並集成到 `111_generate.js` 中。
*   所有程式碼已提交到版本控制系統。 