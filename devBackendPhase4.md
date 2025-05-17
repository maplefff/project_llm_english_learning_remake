# 後端開發階段 4：多題型歷史記錄服務

**對應 `devPlanRead_Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段的目標是實現 `HistoryService.ts` (建議使用 TypeScript)，用於管理和儲存使用者針對**不同題型**的作答歷史。每種題型的歷史記錄將以獨立的 JSON 檔案的形式存儲在本地，檔案命名格式為 `history[題型ID移除點號].json` (例如 `history111.json` 代表題型 `1.1.1`)。此服務需包含單元測試。

## 主要產出物

*   `HistoryService.ts` 模組，具備記錄和讀取**不同題型**作答歷史的功能，並能操作對應的題型歷史檔案。
*   `HistoryService.test.ts` 的單元測試。
*   本地歷史記錄檔案，例如 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/historyData/history111.json`, `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/historyData/history121.json` 等，其結構定義和處理邏輯。

## 詳細步驟

### Phase4.1 `HistoryService.ts` 實現
1.  **歷史記錄資料結構定義**:
    *   參考 `devPlanRead_Write.md` 3.6 節關於「記錄資訊 (每條記錄)」的描述。
    *   單條歷史記錄物件 (`HistoryEntry`) 結構示例 (題型通過檔案名和方法參數區分)：
        ```json
        {
            "UUID": "c9dbc356-95db-427e-945a-be379550bce3", // 題目的 UUID (來自題目快取或外部傳入)
            "questionData": { // 作答時的題目完整快照
                "passage": "The resilient athlete quickly recovered from her injury.",
                "targetWord": "resilient",
                "question": "In the sentence above, the word 'resilient' most nearly means:",
                "options": [
                { "id": "A", "text": "weak" },
                { "id": "B", "text": "determined" },
                { "id": "C", "text": "flexible and quick to recover" },
                { "id": "D", "text": "tired" }
                ],
                "standard_answer": "C" // 正確答案
            },
            "userAnswer": "C", // 使用者提交的答案 (例如選項字母)
            "isCorrect": true, // 後端判斷答案是否正確
            "timestamp": 1678886400000 // 作答完成的時間戳 Unix timeStamp
        }
        ```
2.  **常數與配置**:
    *   定義歷史記錄檔案的基礎目錄: `HISTORY_BASE_DIR = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/historyData/"`。
    *   服務內部應有一個輔助方法，例如 `getHistoryFilePath(questionType: string): string`，它接收題型 ID (例如 `'1.1.1'`)，移除題型 ID 中的點號 (例如轉換為 `'111'`)，並返回完整的檔案路徑 (例如 `HISTORY_BASE_DIR + 'history111.json'`)。
    *   確保 `historyData` 目錄存在，如果不存在則創建。
3.  **儲存作答記錄 (`async saveHistoryEntry(questionType: string, entryData: Omit<HistoryEntry, 'timestamp'>): Promise<HistoryEntry | null>`)**:
    *   接收 `questionType` (例如 `'1.1.1'`) 和包含 `UUID` (題目ID), `questionData` (快照), `userAnswer`, `isCorrect` 的物件。
    *   **不再**生成 `recordId`。`UUID` 欄位由調用者在 `entryData` 中提供。
    *   獲取當前 `timestamp`。
    *   組裝完整的 `HistoryEntry` 物件。
    *   **讀取現有歷史**: 根據 `questionType` 獲取對應的歷史檔案路徑。異步讀取該檔案的內容。如果檔案不存在或為空，則初始化為一個空陣列 `[]`。如果解析失敗，記錄錯誤並返回 `null`。
    *   **追加新記錄**: 將新的 `HistoryEntry` 添加到該題型的歷史記錄陣列的開頭 (建議，使最新記錄在前)。
    *   **寫回檔案**: 將更新後的特定題型歷史記錄陣列序列化為 JSON 字串，並異步寫回到其對應的歷史檔案，覆蓋舊內容。處理檔案寫入錯誤。
    *   如果成功，返回創建的 `HistoryEntry`。
4.  **檢索歷史記錄 (`async getHistory(questionType: string, limit?: number, offset?: number): Promise<HistoryEntry[]>`)**:
    *   接收 `questionType` (例如 `'1.1.1'`)。
    *   可選參數 `limit` 和 `offset` 用於將來實現分頁。初期可忽略，直接返回指定題型的所有記錄。
    *   根據 `questionType` 獲取對應的歷史檔案路徑。異步讀取該檔案的內容。
    *   如果檔案不存在或為空，返回空陣列 `[]`。
    *   如果解析失敗，記錄錯誤並返回空陣列。
    *   成功則返回解析後的該題型 `HistoryEntry` 陣列。
5.  **錯誤處理**:
    *   統一處理檔案讀寫錯誤、JSON 解析/序列化錯誤。

### Phase4.2 單元測試 (`HistoryService.test.ts`)
1.  **模擬依賴**:
    *   模擬 Node.js 的 `fs` 模組 (例如使用 `jest.mock('fs/promises')` 以匹配 `async/await`，或 `memfs` 庫) 來測試檔案的讀寫操作。
    *   如果使用 `uuid`，可以模擬它以返回固定的 ID 便於測試。
2.  **測試案例**:
    *   **儲存記錄**:
        *   測試為題型 '1.1.1' 成功儲存一條新的歷史記錄到空的 `history111.json` 檔案中。
        *   測試為另一題型 (例如 '1.2.1') 成功儲存記錄到其對應的 `history121.json` 檔案中，並驗證不影響 '1.1.1' 的歷史檔案。
        *   測試連續儲存多條歷史記錄到同一題型的歷史檔案。
        *   測試輸入數據不完整時的處理。
    *   **檢索記錄**:
        *   測試當特定題型的歷史檔案為空或不存在時，`getHistory('該題型')` 返回空陣列。
        *   測試當特定題型的歷史檔案包含多條記錄時，`getHistory('該題型')` 能否正確讀取並返回其所有記錄，且不包含其他題型的記錄。
        *   (未來可擴展) 測試 `limit` 和 `offset` 分頁參數的行為 (針對特定題型)。
    *   **檔案操作錯誤**:
        *   測試當模擬的特定題型歷史檔案讀取失敗時，服務的行為。
        *   測試當模擬的特定題型歷史檔案寫入失敗時，服務的行為。
    *   **JSON 格式錯誤**:
        *   測試當特定題型的歷史檔案內容不是有效的 JSON 時，`saveHistoryEntry` 和 `getHistory` 的行為。

## 驗收標準

*   `HistoryService.ts` 模組功能完整，能夠為**不同題型**的作答歷史進行獨立 JSON 檔案的儲存和讀取。
*   歷史記錄條目的 JSON 結構符合定義。
*   所有為 `HistoryService.ts` 編寫的單元測試全部通過。
*   不同題型的本地歷史記錄檔案 (例如 `history111.json`, `history121.json`) 能夠被正確創建、讀取和更新，互不影響。
*   所有程式碼已提交到版本控制系統。 