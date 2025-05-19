import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path'; // Node.js 內置模組

// 解析 .env 文件的正確路徑
// __dirname 在 CommonJS 模組中是當前文件所在的目錄路徑
// 假設 GeminiAPIService.ts 位於 backend/src/services/
// .env 位於 backend 的父目錄, 即 llm_english_learning_read&write/
const projectRoot = path.resolve(__dirname, '..', '..', '..'); // 退三層到 backend 的父目錄
const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

const MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // 根據 project_rule

// 初始化 Gemini API 服務
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

class GeminiAPIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error(`環境變數中未設定 GEMINI_API_KEY。`);
    }
    // 不需再初始化 genAI/model，直接用 ai 實例
    console.log('GeminiAPIService 已使用模型初始化：' + MODEL_NAME);
  }

  /**
   * 根據提供的提示生成內容。可選 responseSchema 與 config。
   * @param prompt 要傳送至 Gemini API 的文字提示。
   * @param options 可選參數，包含 responseSchema 與 config。
   * @returns 回傳 JSON 或純文字。
   */
  async getResponse(
    prompt: string,
    options?: { responseSchema?: any, config?: any }
  ): Promise<string | object | any[]> {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GeminiAPIService：呼叫 getResponse 時缺少 API_KEY。");
      throw new Error("缺少 API 金鑰。無法連接至 Gemini API。");
    }
    try {
      // 新增：每次請求前打印 prompt 內容
      console.log(`[DEBUG GeminiAPIService.ts] Prompt: ${prompt}`);
      // 組合 generationConfig
      const generationConfig: any = {};
      if (options?.config) {
        if (options.config.temperature !== undefined) generationConfig.temperature = options.config.temperature;
        if (options.config.thinkingBudget !== undefined && options.config.thinkingBudget !== null) generationConfig.thinkingBudget = options.config.thinkingBudget;
      }
      // 組合請求物件
      const request = {
        model: MODEL_NAME,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: "You need to guide students to learn English by generating questions. Please analyze their answer history to determine the appropriate difficulty and whether certain words need to be reinforced.",
        config: {
          ...generationConfig,
          responseMimeType: options?.responseSchema ? "application/json" : undefined,
          responseSchema: options?.responseSchema,
        },
      };
      // 發送請求
      const response = await ai.models.generateContent(request);
      // 暫時性 debug：直接打印 Gemini API 原始回應
      console.log('[DEBUG GeminiAPIService.ts] [TEMP] Raw Gemini API response:', response);
      // 若有 responseSchema，回傳 JSON
      if (options?.responseSchema) {
        if (typeof response.text === 'string') {
          try {
            return JSON.parse(response.text);
          } catch (e) {
            console.error("[DEBUG GeminiAPIService.ts] JSON 解析失敗：", response.text, e);
            throw new Error("Gemini API 回傳非有效 JSON。");
          }
        } else {
          console.error("[DEBUG GeminiAPIService.ts] 預期 JSON 但 response.text 為 undefined 或非字串：", response.text);
          throw new Error("Gemini API 返回了預期為 JSON 但無效的文字回應。");
        }
      } else {
        return response.text || "";
      }
    } catch (e) {
      console.error("呼叫 Gemini API 時發生錯誤：", e);
      throw new Error("Gemini API 請求失敗。");
    }
  }
}

export default new GeminiAPIService();
// 或用於 DI 或多個實例：export { GeminiAPIService }; 