# 開發備忘錄：Phase 2 - 單一題型 (1.1.1) 生成器與服務

**日期:** 2024-07-27

**對應計畫:** `devBackendPhase2.md`

**目標:** 實現題型 1.1.1 (詞義選擇) 的生成器 `111_generate.ts` 和題目調度服務 `QuestionGeneratorService.ts` 的初步版本，並包含單元測試。

## 主要活動與成果

1.  **題型 1.1.1 (`111_generate.ts`) 開發與重構:**
    *   **初始實現:** 基於 `exam_example.html` 和 `discussion_read&write.md` 中的定義，開發了 `111_generate.ts`，用於生成詞義選擇題。
    *   **Prompt 設計:** 設計並迭代了 Prompt，明確要求 LLM 輸出包含 `passage`, `targetWord`, `question`, `options`, `standard_answer`, `explanation_of_Question` 的 JSON 物件。
    *   **結構化輸出:**
        *   重構 `GeminiAPIService.ts` 以支援 Google AI SDK 的結構化輸出 (`responseSchema`)。解決了相關的 TypeScript 類型和 Jest Mock 問題 (`GeminiAPIService.test.ts` 通過)。
        *   在 `111_generate.ts` 中引入 `QUESTION_DATA_111_SCHEMA`，利用結構化輸出獲取更可靠的 JSON。
    *   **`options` 格式:** 將 `options` 格式從 `{"A": "text"}` 統一修改為 `{ id: string, text: string }`，以利於 Schema 定義和前端處理。更新了 `discussion_read&write.md` 中的範例和 Prompt。
    *   **Zod 驗證:** 引入 Zod Schema (`QuestionData111ZodSchema`) 對 LLM 返回的物件進行更嚴格的驗證，包括檢查 `standard_answer` 是否為有效的 `options` ID。
    *   **單元測試 (`111_generate.test.ts`):**
        *   編寫了單元測試，模擬 `GeminiAPIService`。
        *   遇到一個持續性問題：在特定測試案例中，傳遞給模擬 `getResponse` 的 `prompt` 中的 `difficultySetting` 未能正確更新，始終為預設值。
        *   嘗試將 Prompt 模板從模板字面量嵌入改為佔位符 + `.replace()`，但未能完全解決該 Jest 環境下的問題。**此單元測試問題暫時擱置。**
    *   **手動測試 (`test_111_generate_new.ts`):**
        *   創建了手動測試腳本，用於直接調用真實 API 驗證功能。
        *   手動測試**成功**，證明 `111_generate.ts` 在實際執行中功能正常，能夠生成符合預期結構的單個題目物件。
    *   **支援批量生成 (後續修改):**
        *   根據需求，再次重構 `111_generate.ts`，使其能夠**一次請求生成多個題目**。
        *   修改了 Prompt (要求輸出陣列)、LLM Schema (改為 Array Schema)、Zod Schema (改為 Array Schema)，並調整了函數返回類型和內部邏輯。
        *   更新了單元測試 (`111_generate.test.ts`) 以適應陣列輸出，所有測試案例 (包括之前失敗的 `difficultySetting` 案例) **全部通過**。
        *   更新了手動測試 (`test_111_generate_new.ts`) 並執行成功，確認 LLM 能夠按要求返回指定數量的題目陣列。
        *   更新了 `discussion_read&write.md` 以反映陣列輸出和新的 Prompt。

2.  **題目調度服務 (`QuestionGeneratorService.ts`) 實現:**
    *   **創建服務:** 創建了 `src/services/QuestionGeneratorService.ts`。
    *   **初步邏輯:** 實現了 `generateQuestionByType` 函數，能夠根據 `questionType` 參數 (目前僅支援 `'1.1.1'`) 調用對應的生成器 (`generate111Question`)。
    *   **參數傳遞:** 確保 `difficulty` 和 `historySummary` 參數能正確傳遞給 `generate111Question`。
    *   **錯誤處理:** 添加了 `try...catch` 塊來處理 `generate111Question` 可能拋出的錯誤，並在不支持的題型或生成失敗時返回 `null`。
    *   **Linter 錯誤修復:** 解決了因 `111_generate.ts` 未導出 `QuestionData111` 類型而引起的 Linter 錯誤。

3.  **題目調度服務單元測試 (`QuestionGeneratorService.test.ts`):**
    *   **創建測試:** 創建了 `test/services/QuestionGeneratorService.test.ts`。
    *   **模擬依賴:** 成功模擬了 `111_generate.ts` 中的 `generate111Question` 函數。
    *   **測試案例:** 涵蓋了成功調度、處理不支援題型、處理生成器返回 `null`、處理生成器拋出錯誤等情況。
    *   **測試結果:** 所有單元測試案例 **全部通過**。

## 產出物

*   `src/services/generators/111_generate.ts` (已重構支援批量生成)
*   `test/services/generators/111_generate.test.ts` (全部通過)
*   `manual_test/services/generators/test_111_generate_new.ts` (手動測試通過)
*   `src/services/QuestionGeneratorService.ts`
*   `test/services/QuestionGeneratorService.test.ts` (全部通過)
*   `discussion_read&write.md` (已更新 1.1.1 相關內容)
*   `memo_phase2.md` (本文件)

## 狀態

Phase 2 目標已完成。`111_generate.ts` 功能已通過手動測試和更新後的單元測試驗證。`QuestionGeneratorService.ts` 及其單元測試已完成並通過。

準備進入 Phase 3：實現 `QuestionCacheService.ts`。 