import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import * as dotenv from 'dotenv';

// 從 .env 檔案載入環境變數
dotenv.config();

const MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // 根據 project_rule
// const API_KEY = process.env.GEMINI_API_KEY; // 移除頂級 const

// 模組級別的 API Key 檢查，現在直接讀取 process.env
if (!process.env.GEMINI_API_KEY) {
  console.error("環境變數中未設定 GEMINI_API_KEY。(模組級別檢查)");
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
      console.error("GeminiAPIService：缺少 API_KEY，無法初始化。(建構子檢查)");
      // 根據錯誤處理策略，您可以在此處拋出錯誤，但 GoogleGenerativeAI 通常會處理
      // throw new Error("GeminiAPIService：缺少 API_KEY。");
    }
    // 如果由於上述檢查導致 apiKey 在此處未定義，GoogleGenerativeAI 將拋出錯誤。
    // 因此，請確保 apiKey 有效或處理來自 GoogleGenerativeAI 構造函數的錯誤。
    this.genAI = new GoogleGenerativeAI(apiKey as string); // 使用動態讀取的 apiKey
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
   * 根據提供的提示生成內容。
   * @param prompt 要傳送至 Gemini API 的文字提示。
   * @returns 一個解析為生成文字內容的 Promise。
   * @throws 如果 API 呼叫失敗或缺少 API 金鑰，則拋出錯誤。
   */
  async getCompletion(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY; // 在方法調用時動態讀取
    if (!apiKey) {
      console.error("GeminiAPIService：呼叫 getCompletion 時缺少 API_KEY。");
      throw new Error("缺少 API 金鑰。無法連接至 Gemini API。");
    }

    try {
      console.log('正在傳送提示至 Gemini：「' + prompt.substring(0, 100) + '...」');
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const generatedText = response.text(); // 重新命名以避免與全域 text 類型衝突
      console.log('已從 Gemini 收到回應：「' + generatedText.substring(0, 100) + '...」');
      return generatedText;
    } catch (e) { // 將變數名稱從 error 改為 e
      console.error("呼叫 Gemini API 時發生錯誤：", e);
      if (e instanceof Error) {
        throw new Error('Gemini API 請求失敗： ' + e.message);
      }
      throw new Error("Gemini API 請求因未知錯誤而失敗。");
    }
  }
}

// 根據偏好的使用方式，匯出單例實例或類別本身
export default new GeminiAPIService();
// 或用於 DI 或多個實例：export { GeminiAPIService }; 