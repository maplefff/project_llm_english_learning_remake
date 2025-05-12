import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Schema, SchemaType, GenerateContentResult, GenerationConfig } from "@google/generative-ai";
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
// const API_KEY = process.env.GEMINI_API_KEY; // 移除頂級 const

// 模組級別的 API Key 檢查，現在直接讀取 process.env
if (!process.env.GEMINI_API_KEY) {
  console.error(`環境變數中未設定 GEMINI_API_KEY。期望路徑: ${envPath} (模組級別檢查)`);
  // 在真實應用程式中，您可能需要拋出錯誤或更優雅地處理此問題
  // 目前，我們將允許服務初始化但會記錄錯誤。
  // 如果缺少 API 金鑰，操作將會失敗。
}

class GeminiAPIService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY; // 在建構時動態讀取
    if (!apiKey) {
      console.error(`GeminiAPIService：缺少 API_KEY，無法初始化。請檢查 .env 文件路徑: ${envPath} (建構子檢查)`);
      // 根據 GoogleGenerativeAI 的行為，如果 apiKey 為 undefined，它會在實例化時拋出錯誤
      // 因此這裡的 throw new Error 可能不是必需的，但保留日誌很重要
    }
    // 如果 apiKey 為 undefined，下一行會拋出錯誤，這是期望的行為
    this.genAI = new GoogleGenerativeAI(apiKey as string);
    this.model = this.genAI.getGenerativeModel({
      model: MODEL_NAME,
      // 預設安全設定可在此處調整 (如果需要)
      // 請參閱 https://ai.google.dev/docs/safety_setting_gemini
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    console.log('GeminiAPIService 已使用模型初始化：' + MODEL_NAME);
  }

  /**
   * 根據提供的提示生成內容。可以選擇性地提供 responseSchema 以獲取結構化 JSON 輸出。
   * @param prompt 要傳送至 Gemini API 的文字提示。
   * @param options 可選參數，包含 responseSchema。
   * @param options.responseSchema 一個遵循 OpenAPI 3.0 子集的 Schema 物件，用於結構化輸出。
   * @returns 如果提供了 schema，則返回解析後的 JSON 物件/陣列；否則返回純文字字串。
   * @throws 如果 API 呼叫失敗、缺少 API 金鑰或 JSON 解析失敗，則拋出錯誤。
   */
  async getResponse(
    prompt: string, 
    options?: { responseSchema?: Schema }
  ): Promise<string | object | any[]> {
    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
      console.error("GeminiAPIService：呼叫 getResponse 時缺少 API_KEY。");
      throw new Error("缺少 API 金鑰。無法連接至 Gemini API。");
    }

    try {
      let result: GenerateContentResult;
      const requestBodyBase = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

      if (options?.responseSchema) {
        // 如果提供了 Schema，將 generationConfig 合併到請求體中
        const requestBodyWithSchema = {
          ...requestBodyBase,
          generationConfig: { 
            responseMimeType: "application/json",
            responseSchema: options.responseSchema,
          }
        };
        console.log("[DEBUG GeminiAPIService.ts] 使用 Schema 請求 Gemini:", JSON.stringify(requestBodyWithSchema.generationConfig.responseSchema, null, 2));
        // generateContent 只接受一個參數：請求體
        result = await this.model.generateContent(requestBodyWithSchema);

      } else {
        // 否則，只發送基本的請求體
        console.log("[DEBUG GeminiAPIService.ts] 使用純文字請求 Gemini");
        result = await this.model.generateContent(requestBodyBase);
      }

      const response = result.response;
      
      // 檢查是否有有效的回應和內容
      if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0) {
          console.error("Gemini API 回應無效或為空:", JSON.stringify(response, null, 2));
          throw new Error("Gemini API 返回了無效或空的回應。");
      }

      const responseText = response.candidates[0].content.parts[0].text;

      if (options?.responseSchema) {
        // 如果請求了 Schema，嘗試解析 JSON
        if (responseText && typeof responseText === 'string') {
          try {
            const parsedJson = JSON.parse(responseText);
            // console.log("[DEBUG GeminiAPIService.ts] 成功解析 JSON:", JSON.stringify(parsedJson, null, 2)); // Debug Log - 可選，可能輸出大量資訊
            return parsedJson; 
          } catch (parseError) {
            console.error("GeminiAPIService：解析 JSON 回應時失敗。原始文字:", responseText, parseError);
            throw new Error(`解析 Gemini API 的 JSON 回應時失敗: ${(parseError instanceof Error) ? parseError.message : parseError}`);
          }
        } else {
          console.error("GeminiAPIService：期望 JSON 但收到了無效的文字回應:", responseText);
          throw new Error("Gemini API 返回了預期為 JSON 但無效的文字回應。");
        }
      } else {
        // 否則，返回純文字
        return responseText || ""; // 確保即使 text 為 undefined 也返回空字串
      }

    } catch (e) { 
      console.error("呼叫 Gemini API 時發生錯誤：", e);
      if (e instanceof Error) {
        // 檢查是否有更詳細的 API 錯誤資訊 (例如來自 response)
        // @ts-ignore - 嘗試訪問可能的錯誤屬性
        const apiErrorDetails = (e as any).response?.data || (e as any).details; 
        if (apiErrorDetails) {
          console.error("Gemini API 詳細錯誤:", apiErrorDetails);
        }
        throw new Error(`Gemini API 請求失敗： ${e.message}${apiErrorDetails ? ` (詳細資訊: ${JSON.stringify(apiErrorDetails)})` : ''}`);
      }
      throw new Error("Gemini API 請求因未知錯誤而失敗。");
    }
  }
}

// 根據偏好的使用方式，匯出單例實例或類別本身
export default new GeminiAPIService();
// 或用於 DI 或多個實例：export { GeminiAPIService }; 