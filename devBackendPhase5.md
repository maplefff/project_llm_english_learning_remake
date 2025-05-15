# 後端開發階段 5：題型 1.1.1 的測驗協調與 API 端點

**對應 `devPlanRead&Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段目標是實現 `TestOrchestratorService.js` (或 `.ts`) 對題型 1.1.1 的單一練習流程的協調功能，並建立初步的後端 API 端點 (`APIController.js` 或 `.ts`，使用 Express.js)。此階段將包含 `TestOrchestratorService` 的單元測試，以及針對核心 API 流程的整合測試。

## 主要產出物

*   `TestOrchestratorService.js` 模組，能夠協調題型 1.1.1 的練習流程 (獲取題目、處理答案、記錄歷史)。
*   `TestOrchestratorService.js` 的單元測試。
*   `APIController.js` (或 `routes/api.js`) 模組，包含處理題型 1.1.1 練習流程所需的基本 API 端點。
*   針對 API 端點的核心流程整合測試 (使用 Supertest 和 Jest)。
*   Express 應用的基本入口檔案 (例如 `server.ts` 或 `app.ts`)。

## 詳細步驟

### Phase5.1 `TestOrchestratorService.js` (或 `.ts`) 實現 (針對題型 1.1.1)
1.  **服務邏輯**:
    *   **開始測驗 (`async startSingleTypeTest(questionType: string): Promise<object | null>`)**:
        *   目前僅處理 `questionType === '1.1.1'`。
        *   調用 `QuestionCacheService.getQuestionFromCache('1.1.1')` 獲取第一題的 `questionData`。
        *   (未來可考慮管理測驗會話狀態，但初期可簡化，每次請求都是獨立的)。
        *   如果獲取題目失敗 (例如快取為空且無法立即生成)，返回 `null` 或錯誤。
        *   返回題目數據給調用者 (API Controller)。題目數據中應包含一個唯一標識符 (例如 `questionData.id` 或快取中生成的 `CachedQuestion.id`)，以便後續提交答案時使用。
    *   **提交答案 (`async submitAnswer(questionId: string, userAnswer: any, originalQuestionData: any): Promise<object>`)**:
        *   `questionId`: 用於追溯是哪道題 (如果需要從某處比如 `HistoryService` 或一個臨時的會話存儲中獲取完整題目資訊和正確答案)。
        *   `userAnswer`: 使用者提交的答案。
        *   `originalQuestionData`: 為了判斷答案，需要知道該題目的正確答案。這個數據可以是在 `startSingleTypeTest` 時一併返回給前端，前端提交時再傳回來；或者後端根據 `questionId` 從快取/歷史記錄中重新獲取。**`devPlanRead&Write.md` 的 API 設計 `POST /api/submit-answer` 包含 `questionDataSnapshot`，這意味著前端會傳回作答時的題目數據。**
        *   **判斷答案正確性**:
            *   從 `originalQuestionData.answer` (或類似路徑) 獲取正確答案。
            *   比較 `userAnswer` 與正確答案。對於題型 1.1.1，這通常是比較選項字母。
            *   設置 `isCorrect` (布林值)。
        *   **記錄歷史**:
            *   準備 `HistoryService.saveHistoryEntry` 所需的數據，包括 `testItem: '1.1.1'`, `questionDataSnapshot: originalQuestionData`, `userAnswer`, `isCorrect`。
            *   調用 `HistoryService.saveHistoryEntry()`。
        *   **獲取下一題**:
            *   再次調用 `QuestionCacheService.getQuestionFromCache('1.1.1')` 獲取下一道題。
        *   返回一個包含作答結果 (`isCorrect`, 正確答案, LLM解釋等) 和下一道題目數據 (如果有的話) 的物件。如果沒有下一題，則明確告知。
            ```json
            // 成功提交答案後的回應範例
            {
              "submissionResult": {
                "isCorrect": true,
                "correctAnswer": "C",
                "explanation": "Resilient means..."
              },
              "nextQuestion": { /* questionData for next question or null */ }
            }
            ```
2.  **錯誤處理**:
    *   處理依賴服務 (`QuestionCacheService`, `HistoryService`) 可能返回的錯誤或 `null`。

### Phase5.2 單元測試 (`TestOrchestratorService.test.js` 或 `.test.ts`)
1.  **模擬依賴**:
    *   模擬 `QuestionCacheService` (模擬 `getQuestionFromCache` 返回題目或 `null`)。
    *   模擬 `HistoryService` (模擬 `saveHistoryEntry` 的行為)。
2.  **測試案例**:
    *   **開始測驗**:
        *   測試 `startSingleTypeTest('1.1.1')` 在 `QuestionCacheService` 成功返回題目時，是否也成功返回題目。
        *   測試 `QuestionCacheService` 返回 `null` (無可用題目) 時，`startSingleTypeTest` 的行為。
    *   **提交答案**:
        *   測試提交正確答案時，返回結果中的 `isCorrect` 為 `true`，且 `HistoryService.saveHistoryEntry` 被正確參數調用。
        *   測試提交錯誤答案時，返回結果中的 `isCorrect` 為 `false`，且 `HistoryService.saveHistoryEntry` 被正確參數調用。
        *   測試在提交答案後，是否嘗試從 `QuestionCacheService` 獲取下一題。
        *   測試當 `HistoryService.saveHistoryEntry` 失敗時的錯誤處理。

### Phase5.3 `APIController.js` (或 `routes/api.ts` 與 `controllers/apiController.ts`) 初步實現
1.  **Express 應用設置 (`server.ts` 或 `app.ts`)**:
    *   創建 Express 應用實例。
    *   使用 `express.json()` 中介軟體來解析 JSON 請求體。
    *   設定一個主 API 路由 (例如 `/api`)，並將其指向 `routes/api.ts`。
    *   啟動伺服器監聽特定端口 (例如 3000)。
2.  **API 路由定義 (`routes/api.ts`)**:
    *   創建 Express Router 實例。
    *   定義以下路由，並將其處理邏輯指向 `controllers/apiController.ts` 中的相應方法：
        *   `GET /question-types`: (初期)
        *   `POST /start-test`:
        *   `POST /submit-answer`:
        *   `GET /history`:
3.  **API 控制器邏輯 (`controllers/apiController.ts`)**:
    *   **`getQuestionTypes(req, res)`**:
        *   返回一個硬編碼的題型列表，至少包含 `{ id: '1.1.1', name: '詞義選擇 (Vocabulary - Multiple Choice)' }`。
    *   **`startTest(req, res)`**:
        *   從 `req.body` 獲取 `questionType`。
        *   如果 `questionType` 為 `'1.1.1'`，調用 `TestOrchestratorService.startSingleTypeTest('1.1.1')`。
        *   根據服務返回結果，發送適當的 HTTP 回應 (成功則 200 OK 並附帶題目數據，失敗則 500 或 404)。
    *   **`submitAnswer(req, res)`**:
        *   從 `req.body` 獲取 `questionId` (或前端傳回的 `questionDataSnapshot`) 和 `userAnswer`。
        *   調用 `TestOrchestratorService.submitAnswer()`。
        *   根據服務返回結果，發送 HTTP 回應。
    *   **`getHistory(req, res)`**:
        *   調用 `HistoryService.getHistory()`。
        *   返回歷史記錄陣列。
4.  **錯誤處理中介軟體**: 在 Express 應用中加入一個統一的錯誤處理中介軟體，捕獲來自控制器或服務的錯誤，並返回標準化的錯誤回應。

### Phase5.4 整合測試 (`api.integration.test.js` 或 `.test.ts`)
1.  **測試工具**: 使用 `supertest` 來發送 HTTP 請求到正在運行的 (或模擬運行的) Express 應用，並使用 `jest` 進行斷言。
2.  **測試環境**:
    *   在測試開始前啟動 Express 應用 (可以監聽一個隨機端口或測試專用端口)。
    *   在測試結束後關閉伺服器。
    *   **重要**: 模擬外部依賴，特別是 `GeminiAPIService.js`，以避免實際呼叫 LLM API，並使其返回可預測的、用於生成題目的假數據。同時，`QuestionCacheService` 的檔案操作也應被模擬，以專注於 API 到服務間的整合。`HistoryService` 的檔案操作也應被模擬。
3.  **測試場景 (針對題型 1.1.1)**:
    *   **完整流程測試**:
        1.  調用 `POST /start-test` (body: `{ questionType: '1.1.1' }`)，驗證：
            *   回應狀態碼為 200。
            *   回應內容包含預期結構的題目數據 (基於模擬的 `GeminiAPIService` 和 `QuestionCacheService` 返回)。
        2.  使用上一步返回的題目數據 (特別是題目 ID 或快照) 和一個模擬的用戶答案，調用 `POST /submit-answer`，驗證：
            *   回應狀態碼為 200。
            *   回應內容包含正確的作答結果 (`isCorrect`, `correctAnswer` 等)。
            *   回應內容包含下一題的數據 (或 `null`)。
            *   (間接驗證) `HistoryService` 的 `saveHistoryEntry` 被正確調用 (透過模擬 `HistoryService` 並檢查其是否被以預期參數調用)。
    *   **獲取題型**: 調用 `GET /question-types`，驗證返回包含 '1.1.1' 的列表。
    *   **獲取歷史**: 在提交一些答案後，調用 `GET /history`，驗證返回的歷史記錄是否與預期一致 (基於模擬的 `HistoryService`)。
    *   **錯誤情況**: 測試當請求參數錯誤或服務層返回錯誤時，API 是否返回適當的 HTTP 錯誤碼和錯誤訊息。

## 驗收標準

*   `TestOrchestratorService.js` 能夠正確協調題型 1.1.1 的練習流程，其單元測試全部通過。
*   `APIController.js` (及相關路由和伺服器設置) 提供了可用的 API 端點，用於開始測驗、提交答案、獲取題型和歷史記錄。
*   核心 API 流程的整合測試全部通過，證明服務間調用和數據流動基本正確。
*   所有程式碼已提交到版本控制系統。 