# 重構計劃書：為 Gemini 題目生成引入可配置的 Temperature 與 ThinkingBudget

**版本：** 1.0
**日期：** 2024-05-24
**目標：** 允許針對不同題型配置 Gemini API 調用時的 `temperature` 和 `thinkingBudget` 參數，以優化題目生成質量和控制資源使用。

---

**1. 整體架構概述**

本重構將引入一個新的配置文件 (`GeneratorConfig.json`) 用於存儲各題型的 LLM 參數，一個新的服務 (`LLMConfigService.ts`) 用於讀取和提供這些參數，並修改現有的題目生成服務 (`XXXGenerator.ts`) 和 `GeminiAPIService.ts` 以應用這些參數。

**數據流：**
`XXXGenerator.ts` -> `LLMConfigService.ts` (獲取配置) -> `GeminiAPIService.ts` (傳遞配置並調用 Gemini API)

---

**2. 詳細執行步驟**

**步驟 2.1：創建配置文件 `GeneratorConfig.json`**

*   **執行者：** AI (我)
*   **操作：** 創建新文件。
*   **路徑：** `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/src/config/GeneratorConfig.json`
*   **初始內容 (範例，具體數值待定)：**
    ```json
    {
      "1.1.1": {,
        "temperature": 1,
        "thinkingBudget": 10000
      },
      "default": {
        "description": "適用於未單獨配置的題型的預設值",
        "temperature": 1,
        "thinkingBudget": nul
      }
    }
    ```
    *   **說明：**
        *   鍵為題型 ID (例如 "1.1.1")。
        *   包含一個 `default` 配置，用於處理未在文件中明確指定的題型。
        *   `description` 欄位為可選，用於註釋。
        *   `temperature`：浮點數，範圍 0.0 - 2.0。
        *   `thinkingBudget`：整數，範圍 0 - 24576。

**步驟 2.2：創建 `LLMConfigService.ts`**

*   **執行者：** AI (我)
*   **操作：** 創建新文件。
*   **路徑：** `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/src/utils/LLMConfigService.ts`
*   **主要實現：**
    *   **`LLMConfig` 介面定義：**
        ```typescript
        interface LLMConfig {
          temperature?: number;
          thinkingBudget?: number;
        }

        interface FullLLMConfig extends LLMConfig {
            description?: string;
        }

        interface GeneratorConfigs {
          [questionType: string]: FullLLMConfig;
        }
        ```
    *   **`LLMConfigService` 類：**
        *   **私有屬性 `configPath`**: 儲存 `GeneratorConfig.json` 的絕對路徑。
        *   **私有屬性 `configs: GeneratorConfigs | null`**: 緩存從 JSON 文件讀取的配置。
        *   **私有屬性 `defaultConfig: LLMConfig`**: 定義一個硬編碼的預設配置，以防文件讀取失敗或 `default` 未配置。
            ```typescript
            private readonly defaultConfig: LLMConfig = {
              temperature: 1, // 硬編碼預設值
              thinkingBudget: null // 硬編碼預設值
            };
            ```
        *   **`constructor()`**: 初始化 `configPath`。可考慮在此處或首次調用 `getConfigForType` 時異步加載配置。
        *   **私有方法 `loadConfigs(): Promise<void>`**:
            *   異步讀取 `GeneratorConfig.json` 文件。
            *   解析 JSON 內容到 `this.configs`。
            *   處理文件不存在、JSON 解析錯誤等情況（打印錯誤日誌，`this.configs` 保持為 `null` 或空物件）。
        *   **公共方法 `getConfigForType(questionType: string): Promise<LLMConfig>`**:
            *   如果 `this.configs` 未初始化，則先調用 `await this.loadConfigs()`。
            *   嘗試從 `this.configs` 中獲取 `questionType` 對應的配置。
            *   如果找不到特定題型配置，則嘗試獲取 `this.configs['default']`。
            *   如果連 `default` 配置都找不到，或者 `this.configs` 為 `null`，則返回 `this.defaultConfig`。
            *   返回的物件應只包含 `temperature` 和 `thinkingBudget`。
        *   **單例模式 (可選但推薦)：** 確保應用中只有一個 `LLMConfigService` 實例，避免重複讀取文件。
            ```typescript
            // private static instance: LLMConfigService;
            // public static getInstance(): LLMConfigService { ... }
            ```

**步驟 2.3：修改 `GeminiAPIService.ts`**

*   **執行者：** AI (我)
*   **操作：** 修改現有文件。
*   **路徑：** `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/src/services/GeminiAPIService.ts`
*   **主要實現：**
    *   **修改 `generateContentInternal` (或類似的核心 API 調用方法) 的簽名：**
        *   增加可選參數 `temperature?: number` 和 `thinkingBudget?: number`。
        ```typescript
        // 假設原方法簽名類似：
        // private async generateContentInternal(prompt: string | Parts[] | Content[]): Promise<string | null>
        // 修改為：
        private async generateContentInternal(
          prompt: string | Parts[] | Content[], // 假設 Parts 和 Content 是從 @google/generative-ai 導入的類型
          temperature?: number,
          thinkingBudget?: number
        ): Promise<string | null>
        ```
    *   **在方法內部構建 `generationConfig`：**
        ```typescript
        // ...
        const genConfig: any = {}; // 使用 any 類型以便動態添加屬性，或定義一個更精確的類型

        if (temperature !== undefined) {
          genConfig.temperature = temperature;
        }

        // 根據 Gemini API 文件，thinkingBudget 屬於 thinkingConfig，thinkingConfig 屬於 generationConfig
        if (thinkingBudget !== undefined) {
          genConfig.thinkingConfig = {
            thinkingBudget: thinkingBudget,
          };
        }

        // 調用 Gemini SDK 的 generateContent 方法
        const result = await this.model.generateContent({
          contents: [{ role: "user", parts: /* 處理 prompt 轉換為 parts 的邏輯 */ }],
          // 只有在 genConfig 不是空物件時才傳遞，或者 SDK 能處理空 config
          ...(Object.keys(genConfig).length > 0 && { generationConfig: genConfig }),
        });
        // ...
        ```
        *   **注意：** 具體的 `prompt` 轉換為 `Content[]` 或 `Part[]` 的邏輯需要根據現有代碼來調整。確保 `contents` 結構符合 SDK 要求。
        *   `...(Object.keys(genConfig).length > 0 && { generationConfig: genConfig })` 是一種有條件地展開 `generationConfig` 屬性的寫法。如果 `genConfig` 為空物件，則不傳遞 `generationConfig` 鍵。需確認 Node.js SDK 是否能良好處理空的 `generationConfig: {}`。如果不能，則此條件判斷是必要的。

**步驟 2.4：修改各 `XXXGenerator.ts` (以 `111_generate.ts` 為例)**

*   **執行者：** AI (我)
*   **操作：** 修改現有文件。
*   **路徑 (示例)：** `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/src/services/generators/111_generate.ts`
*   **主要實現：**
    *   **導入 `LLMConfigService` (或其單例)：**
        ```typescript
        // import llmConfigServiceInstance from '../../utils/LLMConfigService'; // 假設是單例
        ```
    *   **在其主要的生成函數 (例如 `generate111Question`) 內部：**
        *   在調用 `GeminiAPIService.generateContent` (或其封裝方法) 之前，獲取配置：
            ```typescript
            // ...
            const questionType = '1.1.1'; // 或從參數獲取
            const config = await llmConfigServiceInstance.getConfigForType(questionType); // 假設 getConfigForType 返回 Promise

            // 假設 GeminiAPIService 的方法現在接受這些參數
            const generatedText = await geminiAPIServiceInstance.generateContent(
              prompt, // 您的 prompt
              config.temperature,
              config.thinkingBudget
            );
            // ...
            ```
        *   如果 `XXXGenerator.ts` 是直接實例化 `GeminiAPIService`，則需要將 `LLMConfigService` 作為依賴注入或使其可訪問。

**步驟 2.5：環境變數與 API Key（檢查項）**

*   確保 `GeminiAPIService.ts` 仍然能正確加載 `GOOGLE_API_KEY`。此重構不應影響 API Key 的加載機制。

---

**3. 潛在風險與緩解措施**

*   **風險：** `GeneratorConfig.json` 文件格式錯誤或讀取失敗。
    *   **緩解：** `LLMConfigService` 中實現了錯誤處理和預設值機制。詳細的日誌記錄有助於排查問題。
*   **風險：** `thinkingBudget` 參數對於 `gemini-2.5-flash-preview-04-17` 模型的 Node.js SDK 支持不完善或行為與文檔不完全一致。
    *   **緩解：** 在開發和測試階段，仔細驗證 `thinkingBudget` 是否按預期工作。查閱最新的 `@google/generative-ai` SDK 文檔，確認其對 `thinkingConfig` 的支持方式。
*   **風險：** 引入新服務和修改現有服務可能導致意外的行為或錯誤。
    *   **緩解：**
        *   逐步實施，每完成一個主要步驟後進行基本測試（例如，手動檢查 `LLMConfigService` 是否能正確讀取和返回配置）。
        *   在 `GeminiAPIService` 修改後，可以先用固定的 `temperature` 和 `thinkingBudget` 測試 API 調用是否成功，再集成 `LLMConfigService`。

---

**4. 測試策略（本階段僅規劃，不執行）**

*   **單元測試：**
    *   `LLMConfigService.ts`：測試文件讀取、JSON 解析、預設值返回、特定題型配置返回等邏輯。可以 mock `fs/promises`。
    *   `GeminiAPIService.ts`：測試在傳入和不傳入 `temperature`/`thinkingBudget` 時，對 Gemini SDK 的調用參數是否正確構造。可以 mock `@google/generative-ai` SDK。
*   **集成測試：**
    *   測試從 `XXXGenerator.ts` -> `LLMConfigService` -> `GeminiAPIService` -> (mocked) Gemini API 的完整流程，驗證配置是否正確傳遞和應用。

---

**5. 回滾計劃（如果出現嚴重問題）**

1.  **版本控制：** 所有修改都在 Git 版本控制下進行。
2.  **回滾步驟：**
    *   如果問題發生在 `GeminiAPIService.ts`，可以先將其恢復到修改前的版本，暫時移除 `temperature` 和 `thinkingBudget` 的支持。
    *   如果問題發生在 `LLMConfigService.ts` 或 `GeneratorConfig.json`，可以讓 `XXXGenerator.ts` 暫時不調用 `LLMConfigService`，直接傳遞 `undefined` 給 `GeminiAPIService` 的新參數，使其使用預設行為。
    *   最壞情況下，可以將所有相關修改回退到上一個穩定提交。

--- 