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
// 不需要直接導入 GeminiAPIService 類，因為我們將測試其默認導出的實例
// 模擬 @google/generative-ai
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
}));
const mockGoogleGenerativeAI = jest.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
}));
jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: mockGoogleGenerativeAI,
    HarmCategory: {
        HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
        HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
        HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    },
    HarmBlockThreshold: {
        BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
    },
}));
// 模擬 dotenv
jest.mock('dotenv', () => ({
    config: jest.fn(),
}));
// Helper 函數來動態導入服務，以便在 resetModules 後獲取新實例
const getFreshServiceInstance = () => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield Promise.resolve().then(() => __importStar(require('../../src/services/GeminiAPIService')));
    return module.default;
});
describe('GeminiAPIService', () => {
    let originalApiKey;
    let consoleErrorSpy;
    let consoleLogSpy;
    // 服務實例的類型可以從 getFreshServiceInstance 的返回類型推斷，或設為 any/unknown 稍後斷言
    let service;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        originalApiKey = process.env.GEMINI_API_KEY;
        jest.clearAllMocks(); // 清除所有 mock 的調用記錄
        // 重置 GoogleGenerativeAI mock 的默認實現
        mockGoogleGenerativeAI.mockImplementation(() => ({
            getGenerativeModel: mockGetGenerativeModel,
        }));
        mockGetGenerativeModel.mockImplementation(() => ({
            generateContent: mockGenerateContent,
        }));
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    }));
    afterEach(() => {
        process.env.GEMINI_API_KEY = originalApiKey;
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
        jest.resetModules(); // 在每次測試後重置模組，確保下次測試時重新加載
    });
    describe('Constructor (Module Initialization)', () => {
        it('案例 1.1: 應在 API Key 存在時成功初始化模組並導出實例', () => __awaiter(void 0, void 0, void 0, function* () {
            process.env.GEMINI_API_KEY = 'test-api-key';
            service = yield getFreshServiceInstance();
            expect(mockGoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
            expect(mockGetGenerativeModel).toHaveBeenCalledWith({
                model: "gemini-2.5-flash-preview-04-17",
                safetySettings: expect.any(Array),
            });
            expect(console.log).toHaveBeenCalledWith('GeminiAPIService 已使用模型初始化：gemini-2.5-flash-preview-04-17');
            // 檢查導出的 service 是否是 GeminiAPIService 的一個實例 (間接)
            // 由於我們無法直接訪問類定義，我們可以檢查它是否有預期的方法
            expect(service).toHaveProperty('getCompletion');
        }));
        it('案例 1.2: 若 API Key 缺失，GoogleGenerativeAI 建構子應拋出錯誤，導致模組加載失敗', () => __awaiter(void 0, void 0, void 0, function* () {
            delete process.env.GEMINI_API_KEY;
            mockGoogleGenerativeAI.mockImplementationOnce(() => {
                throw new Error('Missing API key from mock');
            });
            // 模組加載 (即 new GeminiAPIService()) 應該會失敗
            yield expect(getFreshServiceInstance()).rejects.toThrow('Missing API key from mock');
        }));
        it('案例 1.2.1: 服務模組應在 API Key 缺失時記錄錯誤 (如果 GoogleGenerativeAI 未立即拋錯)', () => __awaiter(void 0, void 0, void 0, function* () {
            delete process.env.GEMINI_API_KEY;
            mockGoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: mockGetGenerativeModel,
            }));
            service = yield getFreshServiceInstance();
            expect(console.error).toHaveBeenCalledWith("環境變數中未設定 GEMINI_API_KEY。(模組級別檢查)");
            expect(console.error).toHaveBeenCalledWith("GeminiAPIService：缺少 API_KEY，無法初始化。(建構子檢查)");
        }));
    });
    describe('getCompletion', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // 確保 API Key 存在，以便服務能正常初始化
            process.env.GEMINI_API_KEY = 'test-api-key';
            service = yield getFreshServiceInstance();
            // 清除 beforeEach 中 getFreshServiceInstance 可能產生的初始化日誌，專注於 getCompletion 的日誌
            consoleLogSpy.mockClear();
            consoleErrorSpy.mockClear();
        }));
        it('案例 2.1: 應在 API 呼叫成功時返回生成的文字', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrompt = '你好，世界';
            const mockResponseText = '來自模型的模擬回應';
            mockGenerateContent.mockResolvedValue({
                response: { text: () => mockResponseText }
            });
            const result = yield service.getCompletion(mockPrompt);
            expect(mockGetGenerativeModel).toHaveBeenCalledTimes(1); // Ensure model setup was called once during service init
            expect(mockGenerateContent).toHaveBeenCalledWith(mockPrompt);
            expect(result).toBe(mockResponseText);
            expect(console.log).toHaveBeenCalledWith(`正在傳送提示至 Gemini：「${mockPrompt.substring(0, 100)}...」`);
            expect(console.log).toHaveBeenCalledWith(`已從 Gemini 收到回應：「${mockResponseText.substring(0, 100)}...」`);
        }));
        it('案例 2.2: 當 API 呼叫失敗時應拋出錯誤', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrompt = '測試失敗案例';
            const errorMessage = 'API 錯誤';
            mockGenerateContent.mockRejectedValue(new Error(errorMessage));
            yield expect(service.getCompletion(mockPrompt)).rejects.toThrow(`Gemini API 請求失敗： ${errorMessage}`);
            expect(console.error).toHaveBeenCalledWith("呼叫 Gemini API 時發生錯誤：", expect.any(Error));
        }));
        it('案例 2.2.1: 當 API 呼叫失敗 (非 Error 物件) 時應拋出通用錯誤', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrompt = '測試非 Error 物件失敗案例';
            mockGenerateContent.mockRejectedValue('一個字串錯誤');
            yield expect(service.getCompletion(mockPrompt)).rejects.toThrow("Gemini API 請求因未知錯誤而失敗。");
            expect(console.error).toHaveBeenCalledWith("呼叫 Gemini API 時發生錯誤：", '一個字串錯誤');
        }));
        it('案例 2.3: 若模組加載時 API_KEY 就缺失，getCompletion 應拋出錯誤', () => __awaiter(void 0, void 0, void 0, function* () {
            delete process.env.GEMINI_API_KEY;
            // 確保 GoogleGenerativeAI 不拋錯，讓服務內部的 API_KEY 檢查生效
            mockGoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: mockGetGenerativeModel,
            }));
            service = yield getFreshServiceInstance(); // 模組加載時 API_KEY 已缺失
            consoleErrorSpy.mockClear(); // 清除初始化時的 console.error
            yield expect(service.getCompletion('任何提示')).rejects.toThrow("缺少 API 金鑰。無法連接至 Gemini API。");
            // 這裡的 console.error 應該是 getCompletion 內部的
            expect(console.error).toHaveBeenCalledWith("GeminiAPIService：呼叫 getCompletion 時缺少 API_KEY。");
        }));
    });
});
//# sourceMappingURL=GeminiAPIService.test.js.map