"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path")); // Node.js 內置模組
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
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY; // 在建構時動態讀取
        if (!apiKey) {
            console.error(`GeminiAPIService：缺少 API_KEY，無法初始化。請檢查 .env 文件路徑: ${envPath} (建構子檢查)`);
            // 根據 GoogleGenerativeAI 的行為，如果 apiKey 為 undefined，它會在實例化時拋出錯誤
            // 因此這裡的 throw new Error 可能不是必需的，但保留日誌很重要
        }
        // 如果 apiKey 為 undefined，下一行會拋出錯誤，這是期望的行為
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: MODEL_NAME,
            // 預設安全設定可在此處調整 (如果需要)
            // 請參閱 https://ai.google.dev/docs/safety_setting_gemini
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
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
    getCompletion(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = process.env.GEMINI_API_KEY; // 在方法調用時動態讀取
            if (!apiKey) {
                console.error("GeminiAPIService：呼叫 getCompletion 時缺少 API_KEY。");
                throw new Error("缺少 API 金鑰。無法連接至 Gemini API。");
            }
            try {
                // console.log('正在傳送提示至 Gemini：「' + prompt.substring(0, 100) + '...」'); // 正式環境可考慮移除或改為 debug 級別
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const generatedText = response.text(); // 重新命名以避免與全域 text 類型衝突
                // console.log('已從 Gemini 收到回應：「' + generatedText.substring(0, 100) + '...」'); // 正式環境可考慮移除或改為 debug 級別
                return generatedText;
            }
            catch (e) { // 將變數名稱從 error 改為 e
                console.error("呼叫 Gemini API 時發生錯誤：", e);
                if (e instanceof Error) {
                    throw new Error('Gemini API 請求失敗： ' + e.message);
                }
                throw new Error("Gemini API 請求因未知錯誤而失敗。");
            }
        });
    }
}
// 根據偏好的使用方式，匯出單例實例或類別本身
exports.default = new GeminiAPIService();
// 或用於 DI 或多個實例：export { GeminiAPIService }; 
//# sourceMappingURL=GeminiAPIService.js.map