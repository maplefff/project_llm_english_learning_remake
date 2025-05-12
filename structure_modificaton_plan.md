# 計劃：整合 Gemini 結構化輸出功能

## 1. 目標與背景

本計劃詳述如何重構 `GeminiAPIService.ts` 及其主要使用者（首先是 `111_generate.ts`），以利用 Gemini API 的結構化輸出 (Structured Output) 功能。目標是提升 JSON 解析的可靠性，並減少對 LLM 回應進行手動清理的需求。參考 Gemini API 官方文件 ([https://ai.google.dev/gemini-api/docs/structured-output](https://ai.google.dev/gemini-api/docs/structured-output)) 及 `@geminiAIStructureTextGenerateJavascript.js` 範例，重點在於 `responseMimeType: "application/json"` 和 `responseSchema` 設定。

## 2. 整體目標

*   修改 `GeminiAPIService.ts`，使其能夠接受一個基於 **OpenAPI Schema 物件子集**的回應綱要 (response schema)，並相應地配置 Gemini API 呼叫。
*   更新 `111_generate.ts`（以及後續其他生成器服務），使其定義並傳遞符合規範的回應綱要給 `GeminiAPIService.ts`。
*   如果結構化輸出足夠可靠，則評估簡化或移除 `CleanJSON.ts` 的可能性。
*   確保所有現有測試通過，並為綱要驗證添加新的測試。

## 3. 先決條件與環境檢視

*   **SDK 與綱要規範確認**：
    *   **行動**：仔細檢查目前專案使用的 `@google/generative-ai` SDK 版本是否支援 `responseMimeType` 和 `responseSchema` 功能。官方文件指出，`responseSchema` 參數接受一個代表 **OpenAPI 3.0 Schema 物件子集**的 `Schema` 物件，並加入了如 `propertyOrdering` 等額外欄位。
    *   **調查**：
        1.  再次確認 `@google/generative-ai` SDK 中與範例 (`@google/genai`) 中 `Type.OBJECT`, `Type.STRING` 等對應的綱要定義方式和可用的型別。查閱 SDK 的 API Reference 以獲取精確的 `Schema` 物件結構和欄位 (例如 `type`, `format`, `properties`, `items`, `required`, `propertyOrdering` 等)。
        2.  如果當前 SDK 版本對 OpenAPI Schema 子集的支援方式與最新文件有差異，研究是否有版本更新可用。
        3.  若需重大 SDK 版本變更或切換，將按原計劃視為高風險步驟，並優先處理。
    *   **測試**：根據調查結果，進行小規模原型驗證，確保能使用 `@google/generative-ai` SDK 和 OpenAPI Schema 子集成功實現結構化 JSON 輸出。

## 4. 階段一：修改 `GeminiAPIService.ts`

### 4.1. 子階段 1.1：更新 `getCompletion` 方法
    *   **行動**：
        1.  修改 `GeminiAPIService.ts` 中的 `getCompletion` 方法簽名，使其能接受一個可選的 `responseSchema: genai.Schema` (或 SDK 中對應的 OpenAPI Schema 子集型別) 參數。
        2.  如果 `responseSchema` 被提供：
            *   建構 Gemini API 呼叫時，包含 `responseMimeType: "application/json"` (或 SDK 等效配置) 以及傳入的 `responseSchema`。
            *   Gemini API 的回應應直接是已解析的 JSON 物件/陣列。
        3.  如果 `responseSchema` *未*提供：
            *   方法應回退到目前的行為（生成純文字），以保持對尚未更新的其他服務的向下相容性。
    *   **測試 (模組可用性)**：
        *   建立一個臨時的測試函數（可放在 `GeminiAPIService.test.ts` 或一個新的手動測試腳本中），不帶綱要呼叫 `getCompletion`。驗證其仍如之前一樣返回純文字。
        *   建立另一個測試函數/腳本，帶一個簡單的綱要（例如，請求一個包含單一 "message" 字串欄位的 JSON 物件）呼叫 `getCompletion`。驗證 API 呼叫確實使用了綱要，並且回應是一個已解析的 JSON 物件。
        *   **注意**：此階段尚不修改 `111_generate.ts`。

### 4.2. 子階段 1.2：結構化呼叫的錯誤處理
    *   **行動**：研究並實作針對結構化輸出的錯誤處理。如果 LLM 未能遵循綱要，SDK 會如何反應？`GeminiAPIService.ts` 是否需要額外處理？
    *   **測試**：
        *   嘗試使用一個 LLM 很可能會無法遵循的綱要進行呼叫，觀察並記錄錯誤情況。

## 5. 階段二：更新 `111_generate.ts` (及後續生成器)

### 5.1. 子階段 2.1：定義回應綱要 (Response Schema)
    *   **行動**：
        1.  在 `111_generate.ts` 中，根據 `QuestionData111` 介面定義 `responseSchema` 物件。此綱要的格式需嚴格遵循 Gemini API 的規範，即一個 **OpenAPI 3.0 Schema 物件的子集**。這包括使用如 `TypeString`, `TypeArray`, `TypeObject` (或 SDK 中對應的枚舉/字串值) 等型別，並可參考官方文件 ([https://ai.google.dev/gemini-api/docs/structured-output#json_schemas](https://ai.google.dev/gemini-api/docs/structured-output#json_schemas)) 中的 `Schema` 物件欄位說明（如 `type`, `properties`, `items`, `required`）。
        2.  特別注意 `propertyOrdering` 欄位的使用，以確保輸出 JSON 中屬性順序的一致性，這有助於提升模型回應的質量和可預測性。
        3.  `PROMPT_TEMPLATE_1_1_1` 可能需要微調。雖然綱要定義了*結構*，但提示詞仍需清楚指示 LLM *內容*和*約束*。原提示中「Do not include markdown keywords such as \`\`\`json」這類指令，在使用 `responseMimeType: "application/json"` 後可能不再必要，待測試。
        4.  在設計綱要時，參考官方文件的**最佳實踐**，例如：綱要大小會計入輸入 token 限制；通過 `required` 陣列指定必要欄位；注意過於複雜的綱要可能導致錯誤 (如屬性名稱過長、陣列長度限制過大、可選屬性過多等)；如果結果不理想，嘗試調整提示或綱要。
    *   **測試**：
        *   手動審查定義的綱要與 `QuestionData111` 介面以及 Gemini API 的 OpenAPI Schema 子集規範的一致性。

### 5.2. 子階段 2.2：使用綱要呼叫 `GeminiAPIService`
    *   **行動**：修改 `generate111Question` 函數，將新定義的 `responseSchema` 傳遞給 `GeminiAPIService.getCompletion`。
    *   **行動**：來自 `getCompletion` 的回應（當使用綱要時）理論上應該是預先解析好的 JSON 物件/陣列。
    *   **測試 (模組可用性)**：
        *   執行現有的 `111_generate.test.ts` 單元測試。部分 Mock 需要更新：
            *   `GeminiAPIService.getCompletion` 的 Mock 現在需要能感知 `responseSchema` 參數，並在傳遞綱要時返回已解析的物件/陣列，而不是字串。
        *   執行 `run_111_generate_manual.js` 手動測試腳本。這將是整合的真實考驗。

### 5.3. 子階段 2.3：調整回應處理及 `CleanJSON` 的角色
    *   **行動**：如果 `GeminiAPIService.getCompletion` 在使用綱要時直接返回已解析的 JSON 物件，則 `111_generate.ts` 中對 `cleaner.extractAndParse(rawLLMResponse)` 的呼叫對於此路徑可能變得多餘。
    *   **行動**：`111_generate.ts` 中的驗證邏輯（檢查欄位、型別等）仍然至關重要，因為即使 LLM 遵循了綱要結構，也可能產生語義上不正確的資料。
    *   **決策點**：評估 `CleanJSON.ts` 對於 `111_generate.ts` 是否仍然必要。如果結構化輸出高度可靠，可以考慮繞過或移除 `CleanJSON.ts`。但它可能仍對未遷移的服務或作為備用方案有用。
    *   **測試**：
        *   重新執行 `111_generate.ts` 的所有測試。
        *   手動檢查 `run_111_generate_manual.js` 的輸出，確認正確性和結構。

## 6. 階段三：評估 `CleanJSON.ts` 的未來

### 6.1. 子階段 3.1：可靠性評估
    *   **行動**：在遷移 `111_generate.ts`（如果時間允許，可能還有其他1-2個題型生成器）後，評估 Gemini 結構化輸出的實際可靠性。
    *   **行動**：收集關於 LLM 未能遵循綱要或儘管有綱要但仍產生格式錯誤 JSON 的頻率數據。
    *   **測試**：
        *   這更多是通過多次運行和不同複雜度的提示進行觀察。

### 6.2. 子階段 3.2：關於 `CleanJSON.ts` 的決策
    *   **行動**：基於可靠性評估結果：
        *   如果結構化輸出非常可靠：考慮棄用/移除 `CleanJSON.ts` 或大幅簡化它。
        *   如果結構化輸出偶爾仍有問題：如果 SDK 的解析過於嚴格，`CleanJSON.ts` 可能仍可用於其更積極的清理/修復嘗試。
    *   **測試**：
        *   如果 `CleanJSON.ts` 被修改或移除，確保所有相關的依賴和測試都得到更新或移除。

## 7. 階段四：推廣至其他生成器服務 (範例)

*   對於後續每個生成器服務（例如 `112_generate.ts` 等）：
    *   定義其特定的 `responseSchema`。
    *   更新服務以使用其綱要呼叫 `GeminiAPIService.getCompletion`。
    *   調整其內部回應處理邏輯。
    *   更新其單元測試和手動測試。

## 8.潛在風險與緩解措施

*   **SDK 不相容/變更**：這是最大的風險，如 3.1 所述。
    *   **緩解**：在階段 1.1 中徹底調查。如果需要變更 SDK，需評估對現有 API 呼叫、認證等的影響，甚至可能需要為 SDK 遷移制定一個獨立的、更集中的計劃。
*   **LLM 未遵循綱要**：LLM 可能仍無法完美遵循複雜的綱要。
    *   **緩解**：每個生成器服務中強大的驗證邏輯仍然是必要的。綱要有助於結構，但不一定保證語義正確性。提示詞需要保持清晰。
*   **綱要定義的複雜性**：定義準確且複雜的綱要可能比較棘手。
    *   **緩解**：從簡單的綱要開始，逐步迭代。仔細使用 SDK 提供的型別定義。
*   **效能**：使用結構化輸出是否會對延遲產生影響，目前未知。
    *   **緩解**：在測試過程中進行監控。

## 9. 測試策略總結

*   **單元測試**：將調整每個模組的現有單元測試。`GeminiAPIService` 的 Mock 需要反映新的綱要參數以及返回型別的潛在變化（已解析物件 vs. 字串）。
*   **手動整合測試**：類似 `run_111_generate_manual.js` 的腳本對於使用實際 API 進行端對端驗證至關重要。
*   **綱要驗證測試**：（可能）增加專門用於驗證所定義綱要是否根據 SDK 要求正確結構化的測試。
*   **回退路徑測試**：確保如果*不帶*綱要呼叫 `GeminiAPIService.getCompletion`，它仍能像以前一樣工作（對於分階段推廣很重要）。

## 10. 後續步驟 (計劃批准後)

*   從階段一，子階段 1.1 開始，重點是 SDK 調查和更新 `GeminiAPIService.ts`。 