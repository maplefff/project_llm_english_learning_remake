# 後端開發階段 4：題型 1.1.1 的歷史記錄服務

**對應 `devPlanRead&Write.md` 第 6 點中的 6.3 (階段二 - 部分)**

## 目標

本階段的目標是實現 `HistoryService.js` (或 `.ts`)，用於管理和儲存使用者針對題型 1.1.1 的作答歷史。初期，歷史記錄將以 JSON 檔案的形式存儲在本地。此服務需包含單元測試。

## 主要產出物

*   `HistoryService.js` 模組，具備記錄和讀取題型 1.1.1 作答歷史的功能。
*   `HistoryService.js` 的單元測試。
*   本地歷史記錄檔案 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/history.json` 的結構定義和處理邏輯。

## 詳細步驟

### Phase4.1 `HistoryService.js` (或 `.ts`) 實現 (針對題型 1.1.1)
1.  **歷史記錄資料結構定義**:
    *   參考 `devPlanRead&Write.md` 3.6 節關於「記錄資訊 (每條記錄)」的描述。
    *   單條歷史記錄物件 (`HistoryEntry`) 結構示例：
        ```json
        {
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
    *   定義歷史記錄檔案路徑: `HISTORY_FILE_PATH = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/history.json"`。
    *   確保 `historyData` 目錄存在，如果不存在則創建。
3.  **儲存作答記錄 (`async saveHistoryEntry(entryData: Omit<HistoryEntry, 'recordId' | 'timestamp'>): Promise<HistoryEntry | null>`)**:
    *   接收包含 `testItem`, `questionDataSnapshot`, `userAnswer`, `isCorrect` 的物件。
    *   生成 `recordId` (例如使用 `uuid` 庫)。
    *   獲取當前 `timestamp`。
    *   組裝完整的 `HistoryEntry` 物件。
    *   **讀取現有歷史**: 異步讀取 `HISTORY_FILE_PATH` 的內容。如果檔案不存在或為空，則初始化為一個空陣列 `[]`。如果解析失敗，記錄錯誤並返回 `null`。
    *   **追加新記錄**: 將新的 `HistoryEntry` 添加到歷史記錄陣列的開頭 (或末尾，根據展示順序決定)。
    *   **寫回檔案**: 將更新後的歷史記錄陣列序列化為 JSON 字串，並異步寫回到 `HISTORY_FILE_PATH`，覆蓋舊內容。處理檔案寫入錯誤。
    *   如果成功，返回創建的 `HistoryEntry`。
4.  **檢索歷史記錄 (`async getHistory(limit?: number, offset?: number): Promise<HistoryEntry[]>`)**:
    *   可選參數 `limit` 和 `offset` 用於將來實現分頁。初期可忽略，直接返回所有記錄。
    *   異步讀取 `HISTORY_FILE_PATH` 的內容。
    *   如果檔案不存在或為空，返回空陣列 `[]`。
    *   如果解析失敗，記錄錯誤並返回空陣列。
    *   成功則返回解析後的 `HistoryEntry` 陣列。
5.  **錯誤處理**:
    *   統一處理檔案讀寫錯誤、JSON 解析/序列化錯誤。

### Phase4.2 單元測試 (`HistoryService.test.js` 或 `.test.ts`)
1.  **模擬依賴**:
    *   模擬 Node.js 的 `fs` 模組 (例如使用 `jest.mock('fs')` 或 `memfs` 庫) 來測試檔案的讀寫操作。
    *   如果使用 `uuid`，可以模擬它以返回固定的 ID 便於測試。
2.  **測試案例**:
    *   **儲存記錄**:
        *   測試成功儲存一條新的歷史記錄到空的歷史檔案中。驗證檔案內容是否正確，返回的 `HistoryEntry` 是否包含所有必要欄位 (如 `recordId`, `timestamp`)。
        *   測試連續儲存多條歷史記錄，驗證它們都被正確追加。
        *   測試輸入數據不完整時的處理 (根據設計，是拋出錯誤還是記錄部分資訊)。
    *   **檢索記錄**:
        *   測試當歷史檔案為空或不存在時，`getHistory` 返回空陣列。
        *   測試當歷史檔案包含多條記錄時，`getHistory` 能否正確讀取並返回所有記錄。
        *   (未來可擴展) 測試 `limit` 和 `offset` 分頁參數的行為。
    *   **檔案操作錯誤**:
        *   測試當模擬的檔案讀取失敗時，服務的行為 (例如返回 `null` 或空陣列，並記錄錯誤)。
        *   測試當模擬的檔案寫入失敗時，服務的行為。
    *   **JSON 格式錯誤**:
        *   測試當歷史檔案內容不是有效的 JSON 時，`saveHistoryEntry` (讀取現有歷史時) 和 `getHistory` 的行為。

## 驗收標準

*   `HistoryService.js` 模組功能完整，能夠為題型 1.1.1 的作答歷史進行 JSON 檔案的儲存和讀取。
*   歷史記錄條目的 JSON 結構符合定義。
*   所有為 `HistoryService.js` 編寫的單元測試全部通過。
*   本地歷史記錄檔案 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/history.json` 能夠被正確創建、讀取和更新。
*   所有程式碼已提交到版本控制系統。 