"use strict";
// [已棄用] 移除所有 @google/generative-ai 相關 import、mock、require
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
// 這些 mock 函數會被 jest.mock 內部返回的 GoogleGenerativeAI mock 所使用
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
    generateContent: mockGenerateContent,
}));
// 模擬 @google/generative-ai
jest.mock('@google/generative-ai', () => {
    const actualGenerativeAI = jest.requireActual('@google/generative-ai');
    return {
        __esModule: true, // 如果原始模組是 ES Module
        // 模擬 GoogleGenerativeAI 為一個返回 mock 實例的 jest.fn()
        GoogleGenerativeAI: jest.fn(() => ({
            getGenerativeModel: mockGetGenerativeModel
        })),
        // 保留原始模組中的枚舉和其他必要的導出
        HarmCategory: actualGenerativeAI.HarmCategory,
        HarmBlockThreshold: actualGenerativeAI.HarmBlockThreshold,
        SchemaType: actualGenerativeAI.SchemaType,
        // 如果還有其他需要從原始模組獲取的內容，可以在此處添加
        // 例如: GenerationConfig, Content, Part 等如果測試中需要它們的真實型別定義而非模擬
    };
});
// 模擬 dotenv
jest.mock('dotenv', () => ({
    config: jest.fn(),
}));
// Helper 函數來動態導入服務
const getFreshServiceInstance = async () => {
    const module = await Promise.resolve().then(() => __importStar(require('../../src/services/GeminiAPIService')));
    return module.default;
};
describe('GeminiAPIService', () => {
    let originalApiKey;
    let consoleErrorSpy;
    let consoleLogSpy;
    let service;
    beforeEach(async () => {
        originalApiKey = process.env.GEMINI_API_KEY;
        jest.clearAllMocks(); // 這會清除 mockGenerateContent, mockGetGenerativeModel 的調用記錄
        // 獲取被 mock 的 GoogleGenerativeAI 構造函數並清除其調用記錄
        // 需要 require 而不是 import，因為 import 會被提升
        const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
        if (MockedGoogleGenerativeAIConstructor && typeof MockedGoogleGenerativeAIConstructor.mockClear === 'function') {
            MockedGoogleGenerativeAIConstructor.mockClear();
        }
        // 確保 getGenerativeModel 也被正確重置 (如果它是 constructor mock 的一部分)
        // 由於 mockGetGenerativeModel 是獨立的，它的 clear 由 jest.clearAllMocks() 處理
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });
    afterEach(() => {
        process.env.GEMINI_API_KEY = originalApiKey;
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
        jest.resetModules();
    });
    describe('Constructor (Module Initialization)', () => {
        it('案例 1.1: 應在 API Key 存在時成功初始化模組並導出實例', async () => {
            process.env.GEMINI_API_KEY = 'test-api-key';
            service = await getFreshServiceInstance();
            // 驗證被 mock 的 GoogleGenerativeAI 建構子是否被調用
            const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
            expect(MockedGoogleGenerativeAIConstructor).toHaveBeenCalledWith('test-api-key');
            expect(mockGetGenerativeModel).toHaveBeenCalledWith({
                model: "gemini-2.5-flash-preview-04-17",
                safetySettings: expect.any(Array),
            });
            expect(console.log).toHaveBeenCalledWith('GeminiAPIService 已使用模型初始化：gemini-2.5-flash-preview-04-17');
            expect(service).toHaveProperty('getResponse');
        });
        it('案例 1.2: 若 API Key 缺失，GoogleGenerativeAI 建構子應拋出錯誤...', async () => {
            delete process.env.GEMINI_API_KEY;
            const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
            MockedGoogleGenerativeAIConstructor.mockImplementationOnce(() => {
                throw new Error('Missing API key from mock');
            });
            await expect(getFreshServiceInstance()).rejects.toThrow('Missing API key from mock');
        });
        it('案例 1.2.1: 服務模組應在 API Key 缺失時記錄錯誤...', async () => {
            delete process.env.GEMINI_API_KEY;
            // 確保 mock 的建構子不拋錯，讓服務內部的 console.error 被觸發
            const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
            MockedGoogleGenerativeAIConstructor.mockImplementation(() => ({
                getGenerativeModel: mockGetGenerativeModel
            }));
            service = await getFreshServiceInstance();
            expect(console.error).toHaveBeenCalledWith("GeminiAPIService：缺少 API_KEY，無法初始化。請檢查 .env 文件路徑: /Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/.env (建構子檢查)");
        });
    });
    describe('getResponse', () => {
        const mockPrompt = '測試提示';
        const requestBodyBase = { contents: [{ role: "user", parts: [{ text: mockPrompt }] }] };
        beforeEach(async () => {
            process.env.GEMINI_API_KEY = 'test-api-key';
            // 確保 service 實例在每次 getResponse 測試前都已建立
            // 並且 GoogleGenerativeAI mock 建構子已被調用且清除了先前的調用
            const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
            MockedGoogleGenerativeAIConstructor.mockClear(); // 清除建構子的調用
            mockGetGenerativeModel.mockClear(); // 清除 getGenerativeModel 的調用
            mockGenerateContent.mockClear(); // 清除 generateContent 的調用
            service = await getFreshServiceInstance();
            consoleLogSpy.mockClear();
            consoleErrorSpy.mockClear();
        });
        it('案例 2.1: 不帶 Schema 呼叫，應返回純文字', async () => {
            const mockResponseText = '這是純文字回應';
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { parts: [{ text: mockResponseText }] } }] }
            });
            const result = await service.getResponse(mockPrompt);
            expect(mockGenerateContent).toHaveBeenCalledWith(requestBodyBase);
            expect(result).toBe(mockResponseText);
        });
        it('案例 2.4: 帶 Schema 呼叫，應成功返回解析後的 JSON 物件', async () => {
            const { SchemaType } = require('@google/generative-ai'); // 從 mock 中獲取 SchemaType
            const mockSchema = {
                type: SchemaType.OBJECT,
                properties: { message: { type: SchemaType.STRING } },
                required: ['message']
            };
            const mockJsonResponse = { message: "成功" };
            const mockResponseText = JSON.stringify(mockJsonResponse);
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { parts: [{ text: mockResponseText }] } }] }
            });
            const result = await service.getResponse(mockPrompt, { responseSchema: mockSchema });
            const expectedRequestBody = {
                ...requestBodyBase,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: mockSchema,
                }
            };
            expect(mockGenerateContent).toHaveBeenCalledWith(expectedRequestBody);
            expect(result).toEqual(mockJsonResponse);
        });
        it('案例 2.5: 帶 Schema 呼叫 (陣列)，應成功返回解析後的 JSON 陣列', async () => {
            const { SchemaType } = require('@google/generative-ai');
            const mockSchemaArray = {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
            };
            const mockJsonResponseArray = ["item1", "item2"];
            const mockResponseText = JSON.stringify(mockJsonResponseArray);
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { parts: [{ text: mockResponseText }] } }] }
            });
            const result = await service.getResponse(mockPrompt, { responseSchema: mockSchemaArray });
            const expectedRequestBody = {
                ...requestBodyBase,
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: mockSchemaArray,
                }
            };
            expect(mockGenerateContent).toHaveBeenCalledWith(expectedRequestBody);
            expect(result).toEqual(mockJsonResponseArray);
        });
        it('案例 2.6: 帶 Schema 但 API 返回非 JSON 字串，應拋出解析錯誤', async () => {
            const { SchemaType } = require('@google/generative-ai');
            const mockSchema = { type: SchemaType.OBJECT, properties: {} };
            const mockInvalidResponseText = '這不是JSON';
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { parts: [{ text: mockInvalidResponseText }] } }] }
            });
            await expect(service.getResponse(mockPrompt, { responseSchema: mockSchema }))
                .rejects.toThrow(/解析 Gemini API 的 JSON 回應時失敗/);
        });
        it('案例 2.7: 帶 Schema 但 API 返回空文字，應拋出錯誤', async () => {
            const { SchemaType } = require('@google/generative-ai');
            const mockSchema = { type: SchemaType.OBJECT, properties: {} };
            const mockEmptyResponseText = '';
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { parts: [{ text: mockEmptyResponseText }] } }] }
            });
            await expect(service.getResponse(mockPrompt, { responseSchema: mockSchema }))
                .rejects.toThrow("Gemini API 返回了預期為 JSON 但無效的文字回應。");
        });
        it('案例 2.2: API 呼叫失敗時應拋出錯誤', async () => {
            const errorMessage = 'API 內部錯誤';
            mockGenerateContent.mockRejectedValue(new Error(errorMessage));
            await expect(service.getResponse(mockPrompt))
                .rejects.toThrow(`Gemini API 請求失敗： ${errorMessage}`);
            const { SchemaType } = require('@google/generative-ai');
            const mockSchema = { type: SchemaType.OBJECT, properties: {} };
            await expect(service.getResponse(mockPrompt, { responseSchema: mockSchema }))
                .rejects.toThrow(`Gemini API 請求失敗： ${errorMessage}`);
        });
        it('案例 2.3: 若 API_KEY 缺失，getResponse 應拋出錯誤', async () => {
            delete process.env.GEMINI_API_KEY;
            // 重新實例化服務以模擬 API KEY 缺失的情況
            const { GoogleGenerativeAI: MockedGoogleGenerativeAIConstructor } = require('@google/generative-ai');
            MockedGoogleGenerativeAIConstructor.mockImplementation(() => ({ getGenerativeModel: mockGetGenerativeModel }));
            service = await getFreshServiceInstance();
            consoleErrorSpy.mockClear();
            await expect(service.getResponse(mockPrompt))
                .rejects.toThrow("缺少 API 金鑰。無法連接至 Gemini API。");
            const { SchemaType } = require('@google/generative-ai');
            const mockSchema = { type: SchemaType.OBJECT, properties: {} };
            await expect(service.getResponse(mockPrompt, { responseSchema: mockSchema }))
                .rejects.toThrow("缺少 API 金鑰。無法連接至 Gemini API。");
            expect(console.error).toHaveBeenCalledWith("GeminiAPIService：呼叫 getResponse 時缺少 API_KEY。");
        });
        it('案例 2.8: API 回應結構無效時應拋出錯誤', async () => {
            mockGenerateContent.mockResolvedValue({
                response: { candidates: [{ content: { /* parts: [] */} }] }
            });
            await expect(service.getResponse(mockPrompt))
                .rejects.toThrow("Gemini API 返回了無效或空的回應。");
            const { SchemaType } = require('@google/generative-ai');
            const mockSchema = { type: SchemaType.OBJECT, properties: {} };
            await expect(service.getResponse(mockPrompt, { responseSchema: mockSchema }))
                .rejects.toThrow("Gemini API 返回了無效或空的回應。");
        });
    });
});
//# sourceMappingURL=GeminiAPIService.test.js.map