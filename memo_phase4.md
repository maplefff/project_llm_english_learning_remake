# 後端開發階段4備忘錄 (memo_phase4.md)

本備忘錄記錄了後端開發階段4的詳細過程，主要圍繞 `HistoryService.ts` 的實現，用於管理和儲存不同題型的使用者作答歷史。

## 1. 階段目標與初始設定

*   **核心目標**：根據 `devBackendPhase4.md` 的規劃，實現一個 TypeScript 服務 (`HistoryService.ts`)，能夠將不同題型的使用者作答歷史以獨立 JSON 檔案形式儲存於 `backend/historyData/` 目錄下。
*   **檔案命名**：歷史檔案遵循 `history[題型ID移除點號].json` 格式 (例如 `history111.json`)。
*   **目錄創建**：
    *   執行 `mkdir -p backend/src/services backend/test/services backend/historyData`。
    *   初次嘗試因路徑中的 `&` (在父目錄名 `llm_english_learning_read&write` 中) 導致 `cd` 命令失敗 (exit code 127)。
    *   解決方案：將 `cd` 命令中的路徑用雙引號括起來，成功創建目錄。

## 2. `HistoryService.ts` 核心功能實現

*   **`HistoryEntry` 介面**：
    *   初期定義包含 `recordId` (由 `uuidv4()` 生成)、`questionData`、`userAnswer`、`isCorrect` 和 `timestamp`。
*   **主要函數**：
    *   `getHistoryFilePath(questionType: string)`: 輔助函數，根據題型生成對應的 JSON 檔案路徑。
    *   `ensureHistoryDirExists()`: 確保 `historyData` 目錄存在，不存在則創建。
    *   `saveHistoryEntry(questionType: string, entryData)`: 儲存歷史記錄。
        *   讀取現有歷史檔案 (若不存在或為空，則初始化為空陣列)。
        *   將新記錄添加到陣列開頭。
        *   寫回更新後的陣列到 JSON 檔案。
    *   `getHistory(questionType: string, limit?: number, offset?: number)`: 讀取歷史記錄，支持分頁。

## 3. `recordId` 到 `UUID` 的重要變更

*   **使用者回饋**：根據 `memo_phase3.md` 和題目快取 (`111Cache.json`) 的設計，歷史記錄的唯一識別符應直接使用題目快取中的 `UUID`，而非為每條歷史記錄生成新的 `recordId`。欄位名**必須是 `UUID`**。
*   **修改方案**：
    1.  更新 `HistoryEntry` 介面：移除 `recordId`，新增 `UUID: string;`。
    2.  修改 `saveHistoryEntry`：使其接收包含 `UUID` 的 `entryData`，不再內部調用 `uuidv4()`。
    3.  同步更新 `devBackendPhase4.md` 的相關描述。
    4.  調整單元測試 (`HistoryService.test.ts`) 和手動測試 (`testHistoryService.ts`) 以適應此變更。

## 4. 單元測試 (`HistoryService.test.ts`)

*   **模擬 (Mocking)**：
    *   使用 `jest.mock('fs/promises')` 模擬檔案系統操作。
    *   最初模擬了 `uuid` 模組，後因 `UUID` 由外部傳入而移除。
*   **遇到的挑戰**：
    *   多次遇到 TypeScript Linter 錯誤，主要與 Jest Mock 的類型推斷相關，例如 `Argument of type 'string' is not assignable to parameter of type 'Uint8Array<ArrayBufferLike>'`，尤其是在 `mockedFsReadFile.mockResolvedValue(...)` 和 `mockedUuidv4.mockReturnValue(...)` (變更前)。
    *   嘗試了 `as any`、修改 `mockImplementation` 等方法。
    *   執行測試時，由於 Jest 未能找到設定檔 (CWD 不正確) 和上述 TypeScript 類型錯誤，導致測試失敗。
*   **最終狀態**：在 `UUID` 變更並修正測試數據後，**所有單元測試最終通過**。其中一個測試案例驗證了當歷史檔案內容為無效 JSON 時，服務能正確處理錯誤並打印 `console.error`。

## 5. 手動測試 (`testHistoryService.ts`)

*   **創建原因**：由於單元測試初期受阻，創建了手動測試腳本以驗證服務核心邏輯。
*   **遇到的挑戰**：
    *   **模組解析失敗**：執行時出現 `TS2307: Cannot find module '../../../src/services/HistoryService'`。
    *   **解決過程**：
        1.  嘗試安裝並使用 `tsconfig-paths`，未解決。
        2.  檢查 `tsconfig.json`，發現 `manual_test` 目錄被 `exclude`，將其移除。
        3.  將 `manual_test/**/*` 加入 `tsconfig.json` 的 `include` 中，仍未解決。
        4.  **最終發現**：`testHistoryService.ts` 中的相對導入路徑錯誤 (`../../../src/...` 應為 `../../src/...`)。
    *   **`UUID` 重複定義**：在更新測試數據以使用 `UUID` 時，因對象展延和屬性定義順序不當導致 `UUID` 欄位重複定義的 Linter 錯誤，已修正。
*   **檔案清理機制**：
    *   手動測試成功後，發現 `getHistory` 返回的結果中混合了新舊格式的歷史記錄（同時包含帶 `UUID` 和帶 `recordId` 的條目）。
    *   為確保每次手動測試的獨立性和結果的純淨性，在 `testHistoryService.ts` 中加入了 `clearHistoryFile` 函數，並在測試開始前調用，以清除先前測試生成的歷史檔案。
*   **最終狀態**：手動測試腳本功能完善，能夠在清理環境後正確驗證 `HistoryService` 的儲存和讀取功能。

## 6. 最終驗證

*   執行了帶有清理功能的手動測試腳本。
*   檢查了 `historyData` 目錄下生成的 JSON 檔案 (`history111.json`, `history121.json`, `history211.json`)。
*   讀取了 `history111.json` 的內容，確認其結構和數據符合預期，最新的記錄在前，並且只包含 `UUID` 格式的條目。

階段4的核心目標達成。 