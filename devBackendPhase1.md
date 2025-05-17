# 後端開發階段 1：環境搭建與基礎服務

**對應 `devPlanRead&Write.md` 第 6 點中的 6.1, 6.2, 及 6.3 (階段一)**

## 目標

本階段的核心目標是完成後端應用程式的基礎環境搭建，並實現與大型語言模型 (LLM - Gemini) 通訊的基礎服務，以及一個通用的 JSON 清理與解析服務。所有核心功能模組都必須包含對應的單元測試，以確保其正確性和穩定性。

## 主要產出物

*   一個可運行的 Node.js + Express + TypeScript 後端專案骨架。
*   `GeminiAPIService.js` 模組及其單元測試。
*   `CleanJSON.js` 模組及其單元測試。
*   配置好的開發與測試環境 (`ESLint`, `Prettier`, `Nodemon`, `Jest` 等)。
*   更新後的 `package.json`，包含必要的依賴和測試腳本。

## 詳細步驟

### Phase1.1 專案初始化與環境配置
1.  **初始化專案**:
    *   在 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/` 目錄下，初始化 Node.js 專案 (`npm init -y` 或 `yarn init -y`)。
    *   安裝 Express.js (`npm install express` 或 `yarn add express`)。
    *   安裝 TypeScript 及相關類型定義 (`npm install typescript @types/node @types/express --save-dev` 或 `yarn add typescript @types/node @types/express --dev`)。相關的 `@types` 套件已加入 `package.json`。
    *   已初始化 TypeScript 設定檔，並調整 `tsconfig.json` 設定，明確指定了 `"outDir": "./dist"`, `"rootDir": "./src"`, 以及 `"sourceMap": true`。
2.  **目錄結構建立**:
    *   依照 `devPlanRead&Write.md` 2.3 節規劃，在 `backend/src/` 下建立 `services/`, `utils/`, `controllers/`, `routes/` 等目錄。
    *   `GeminiAPIService.js` (或 `.ts`) 將位於 `backend/src/services/`。
    *   `CleanJSON.js` (或 `.ts`) 將位於 `backend/src/services/` (或 `backend/src/utils/`，視其通用性決定)。
3.  **開發工具配置**:
    *   安裝並配置 ESLint (`eslint`) 和 Prettier (`prettier`) 以統一程式碼風格和進行靜態分析。
    *   安裝 Nodemon (`nodemon`) 以便在開發過程中自動重啟伺服器。
    *   安裝 ts-node (`ts-node`) 以便可以直接執行 TypeScript 檔案（尤其適用於開發和腳本）。
    *   在 `package.json` 的 `scripts` 中加入相應的啟動、建置、lint 和格式化命令。
4.  **測試框架配置**:
    *   已安裝 Jest (`jest`), `ts-jest`, 及 `@types/jest` 測試框架，相關依賴已加入 `package.json`。
    *   已創建並配置 `jest.config.js` 檔案，使用 `ts-jest` preset 以完整支持 TypeScript 測試。

### Phase1.2 `GeminiAPIService.js` (或 `.ts`) 實現
1.  **API 金鑰管理**:
    *   安裝 `dotenv` (`npm install dotenv` 或 `yarn add dotenv`)。
    *   在專案根目錄 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/` 創建 `.env` 檔案，並加入 `GEMINI_API_KEY=YOUR_API_KEY_HERE` (此檔案應加入 `.gitignore`)。
    *   服務啟動時使用 `dotenv` 加載環境變數。
2.  **服務實現**:
    *   引入 `@google/generative-ai` SDK。
    *   初始化 `GenerativeModel`，指定模型為 `gemini-2.5-flash-preview-04-17`。
    *   實現一個核心函數，例如 `async getCompletion(prompt: string): Promise<string>`，該函數：
        *   接收一個 Prompt 字串作為輸入。
        *   向 Gemini API 發送請求。
        *   返回 LLM 生成的原始文本回應。
        *   包含錯誤處理邏輯 (例如，API 呼叫失敗、超時等)。
        *   實現基本的日誌記錄 (例如，請求發送、收到回應、發生錯誤)。
3.  **單元測試 (`GeminiAPIService.test.js` 或 `.test.ts`)**:
    *   使用 Jest 的 `mock` 功能模擬 `@google/generative-ai` SDK。
    *   測試案例：
        *   成功呼叫 Gemini API 並返回預期回應。
        *   Gemini API 返回錯誤時，服務能正確處理並拋出/返回錯誤。
        *   API 金鑰未配置時的行為。

### Phase1.3 `CleanJSON.js` (或 `.ts`) 實現
1.  **服務實現**:
    *   實現核心函數 `extractAndParse(rawLLMResponse: string): object | null`：
        *   接收 LLM 可能返回的原始字串。
        *   設計正則表達式或字串處理邏輯，以提取被 Markdown \`\`\`json ... \`\`\` 包裹的 JSON 內容，或處理前後可能存在的非 JSON 文本。
        *   嘗試清理常見的 LLM JSON 輸出瑕疵 (例如，移除尾隨逗號 - 可謹慎處理，避免過度修改導致合法 JSON 錯誤)。
        *   使用 `try-catch` 包裹 `JSON.parse()` 進行安全的 JSON 解析。
        *   如果成功解析，返回 JavaScript 物件/陣列。
        *   如果無法提取有效 JSON 或解析失敗，返回 `null` (或根據錯誤處理策略拋出特定錯誤)。
2.  **單元測試 (`CleanJSON.test.js` 或 `.test.ts`)**:
    *   測試案例：
        *   輸入標準的 JSON 字串。
        *   輸入被 Markdown \`\`\`json ... \`\`\` 包裹的 JSON 字串。
        *   輸入前後帶有非 JSON 文本的 JSON 字串。
        *   輸入包含尾隨逗號的 JSON 字串 (視乎是否實現修復邏輯)。
        *   輸入不完整的 JSON 字串。
        *   輸入完全不含 JSON 的字串。
        *   輸入空字串或 `null`。

### Phase1.4 `package.json` 更新
1.  確保所有新安裝的依賴 (dependencies 和 devDependencies) 都已正確記錄。
2.  在 `scripts` 中加入執行所有測試的命令，例如 `"test": "jest"`。

## 驗收標準

*   後端專案可以成功啟動。
*   `GeminiAPIService.js` 的單元測試全部通過。
*   `CleanJSON.js` 的單元測試全部通過。
*   ESLint 和 Prettier 可以成功對程式碼進行檢查和格式化。
*   所有程式碼已提交到版本控制系統 (Git)。 