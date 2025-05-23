import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as path from 'path'; // Node.js 內置模組
import RateLimiterService from './RateLimiterService';
import { PRIORITY_LEVELS } from '../interfaces/RateLimiter';

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
    
    // 將實際API調用方法注入到RateLimiterService
    this.injectAPICallToRateLimiter();
  }

  /**
   * 將實際的API調用方法注入到RateLimiterService
   */
  private injectAPICallToRateLimiter(): void {
    // 使用反射或直接覆寫來注入方法
    (RateLimiterService as any).makeActualAPICall = this.makeDirectAPICall.bind(this);
    console.log('[DEBUG GeminiAPIService.ts] 已將API調用方法注入到RateLimiterService');
  }

  /**
   * 根據提供的提示生成內容。可選 responseSchema 與 config。
   * 現在通過速率限制器處理所有請求
   * @param prompt 要傳送至 Gemini API 的文字提示。
   * @param options 可選參數，包含 responseSchema 與 config。
   * @param priority 請求優先權 (1=高, 2=中, 3=低)，默認為中等
   * @param context 請求來源上下文，用於調試和監控
   * @returns 回傳 JSON 或純文字。
   */
  async getResponse(
    prompt: string, 
    options?: { responseSchema?: any, config?: any },
    priority: number = PRIORITY_LEVELS.MEDIUM,
    context?: string
  ): Promise<string | object | any[]> {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GeminiAPIService：呼叫 getResponse 時缺少 API_KEY。");
      throw new Error("缺少 API 金鑰。無法連接至 Gemini API。");
    }

    try {
      // 新增：每次請求前打印 prompt 內容
      console.log(`[DEBUG GeminiAPIService.ts] 透過速率限制器發送請求 - 優先權: ${priority}, 上下文: ${context || 'unknown'}`);
      console.log(`[DEBUG GeminiAPIService.ts] Prompt: ${prompt.substring(0, 200)}...`);
      
      // 通過速率限制器排隊處理請求
      const result = await RateLimiterService.enqueueRequest(prompt, options, priority, context);
      
      console.log(`[DEBUG GeminiAPIService.ts] 請求處理完成 - 上下文: ${context || 'unknown'}`);
      return result;
      
    } catch (e) { 
      console.error(`[DEBUG GeminiAPIService.ts] 請求失敗 - 上下文: ${context || 'unknown'}:`, e);
      throw e; // 重新拋出錯誤以保持原有的錯誤處理
    }
  }

  /**
   * 直接調用Gemini API的方法（由RateLimiterService調用）
   * 這是實際進行API調用的方法，不經過速率限制器
   * @param prompt 要傳送至 Gemini API 的文字提示
   * @param options 可選參數，包含 responseSchema 與 config
   * @returns 回傳 JSON 或純文字
   */
  private async makeDirectAPICall(prompt: string, options?: { responseSchema?: any, config?: any }): Promise<string | object | any[]> {
    try {
      console.log(`[DEBUG GeminiAPIService.ts] 開始直接API調用`);
      
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

      // ---- 更詳細的 Debugging Start ----
      console.log(">>>> GeminiAPIService: ABOUT TO LOG RAW RESPONSE (Line ~63) <<<<");
      try {
        console.log('[DEBUG GeminiAPIService.ts] [TEMP] typeof response:', typeof response);

        if (response && typeof response === 'object') {
          console.log('[DEBUG GeminiAPIService.ts] [TEMP] Object.keys(response):', Object.keys(response));
          
          if ('candidates' in response) {
            console.log('[DEBUG GeminiAPIService.ts] [TEMP] response.candidates exists. Length:', Array.isArray((response as any).candidates) ? (response as any).candidates.length : 'Not an array');
          } else {
            console.log('[DEBUG GeminiAPIService.ts] [TEMP] response.candidates does NOT exist.');
          }

          if (typeof (response as any).text === 'function') {
            console.log('[DEBUG GeminiAPIService.ts] [TEMP] response.text() output (this is usually the combined, cleaned text from all candidates):');
            try {
                console.log((response as any).text());
            } catch (textFuncError) {
                console.error('[DEBUG GeminiAPIService.ts] [TEMP] Error calling response.text():', textFuncError);
            }
      } else {
            console.log('[DEBUG GeminiAPIService.ts] [TEMP] response.text is NOT a function. Value (if any):', (response as any).text);
      }
        }
        
        // 創建 response 的深拷貝以進行修改
        const clonedResponse = JSON.parse(JSON.stringify(response));

        if (clonedResponse.candidates && Array.isArray(clonedResponse.candidates)) {
          clonedResponse.candidates.forEach((candidate: any) => {
            if (candidate.content && candidate.content.parts && Array.isArray(candidate.content.parts)) {
              candidate.content.parts.forEach((part: any) => {
                if (part.text && typeof part.text === 'string') {
                  try {
                    // 嘗試將 text 解析為 JS 物件/陣列
                    const parsedContent = JSON.parse(part.text);
                    part.text = parsedContent; // 直接將解析後的物件/陣列賦值給 part.text
                  } catch (e) {
                    // 如果 part.text 不是合法的 JSON 字串，則保持其為原始字串
                    console.warn('[DEBUG GeminiAPIService.ts] [TEMP] part.text is not valid JSON, keeping original string. Snippet:', part.text.substring(0,100));
                    // 在這種情況下，原始的 part.text (可能包含 \n) 會在最終 stringify 時被處理
                  }
                }
              });
            }
          });
        }
        
        // 使用 JSON.stringify 打印修改後的整個 clonedResponse 物件
        try {
          console.log('[DEBUG GeminiAPIService.ts] [TEMP] Modified Gemini API response (JSON.stringify):');
          console.log(JSON.stringify(clonedResponse, null, 2));
        } catch (stringifyError) {
          console.error('[DEBUG GeminiAPIService.ts] [TEMP] Error during JSON.stringify(clonedResponse):', stringifyError);
          // 如果 stringify 失敗，嘗試用 util.inspect 作為備選
          try {
            const util = await import('util');
            console.log('[DEBUG GeminiAPIService.ts] [TEMP] Modified Gemini API response (util.inspect fallback after stringify error):', util.inspect(clonedResponse, { depth: null, colors: true, showHidden: false }));
          } catch (inspectError) {
            console.error('[DEBUG GeminiAPIService.ts] [TEMP] Error during util.inspect fallback:', inspectError);
          }
        }

      } catch (logError) {
        console.error('[DEBUG GeminiAPIService.ts] [TEMP] CRITICAL ERROR WHILE TRYING TO LOG RAW RESPONSE:', logError);
        // 如果 util.inspect 失敗，嘗試再次直接打印
        console.log('[DEBUG GeminiAPIService.ts] [TEMP] Raw Gemini API response (fallback direct log after error):', response);
      }
      console.log(">>>> GeminiAPIService: FINISHED LOGGING RAW RESPONSE <<<<");
      // ---- 更詳細的 Debugging End ----

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
      console.error("直接調用 Gemini API 時發生錯誤：", e);
      throw new Error("Gemini API 請求失敗。");
    }
  }

  /**
   * 獲取速率限制器狀態
   */
  public getRateLimitStatus() {
    return RateLimiterService.getStatus();
  }

  /**
   * 更新速率限制器配置
   */
  public updateRateLimitConfig(config: any) {
    return RateLimiterService.updateConfig(config);
  }

  /**
   * 清空速率限制器排隊
   */
  public clearRateLimitQueue() {
    return RateLimiterService.clearQueue();
  }

  /**
   * 切換緊急模式
   */
  public toggleEmergencyMode(enabled: boolean) {
    return RateLimiterService.toggleEmergencyMode(enabled);
  }
}

export default new GeminiAPIService();
// 或用於 DI 或多個實例：export { GeminiAPIService }; 