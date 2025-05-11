import { GoogleGenerativeAI } from '@google/generative-ai';
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
const getFreshServiceInstance = async () => {
  const module = await import('../../src/services/GeminiAPIService');
  return module.default;
};

describe('GeminiAPIService', () => {
  let originalApiKey: string | undefined;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  // 服務實例的類型可以從 getFreshServiceInstance 的返回類型推斷，或設為 any/unknown 稍後斷言
  let service: any; 

  beforeEach(async () => {
    originalApiKey = process.env.GEMINI_API_KEY;
    jest.clearAllMocks(); // 清除所有 mock 的調用記錄
    
    // 重置 GoogleGenerativeAI mock 的默認實現
    mockGoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
    }));
    mockGetGenerativeModel.mockImplementation(() => ({
        generateContent: mockGenerateContent,
    }));

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalApiKey;
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.resetModules(); // 在每次測試後重置模組，確保下次測試時重新加載
  });

  describe('Constructor (Module Initialization)', () => {
    it('案例 1.1: 應在 API Key 存在時成功初始化模組並導出實例', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key';
      service = await getFreshServiceInstance();
      
      expect(mockGoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({
        model: "gemini-2.5-flash-preview-04-17",
        safetySettings: expect.any(Array),
      });
      expect(console.log).toHaveBeenCalledWith('GeminiAPIService 已使用模型初始化：gemini-2.5-flash-preview-04-17');
      // 檢查導出的 service 是否是 GeminiAPIService 的一個實例 (間接)
      // 由於我們無法直接訪問類定義，我們可以檢查它是否有預期的方法
      expect(service).toHaveProperty('getCompletion');
    });

    it('案例 1.2: 若 API Key 缺失，GoogleGenerativeAI 建構子應拋出錯誤，導致模組加載失敗', async () => {
      delete process.env.GEMINI_API_KEY;
      mockGoogleGenerativeAI.mockImplementationOnce(() => {
        throw new Error('Missing API key from mock');
      });

      // 模組加載 (即 new GeminiAPIService()) 應該會失敗
      await expect(getFreshServiceInstance()).rejects.toThrow('Missing API key from mock');
    });

    it('案例 1.2.1: 服務模組應在 API Key 缺失時記錄錯誤 (如果 GoogleGenerativeAI 未立即拋錯)', async () => {
        delete process.env.GEMINI_API_KEY;
        mockGoogleGenerativeAI.mockImplementation(() => ({
            getGenerativeModel: mockGetGenerativeModel,
        }));
        
        service = await getFreshServiceInstance();
        
        expect(console.error).toHaveBeenCalledWith("環境變數中未設定 GEMINI_API_KEY。(模組級別檢查)");
        expect(console.error).toHaveBeenCalledWith("GeminiAPIService：缺少 API_KEY，無法初始化。(建構子檢查)");
    });
  });

  describe('getCompletion', () => {
    beforeEach(async () => {
      // 確保 API Key 存在，以便服務能正常初始化
      process.env.GEMINI_API_KEY = 'test-api-key';
      service = await getFreshServiceInstance();
      // 清除 beforeEach 中 getFreshServiceInstance 可能產生的初始化日誌，專注於 getCompletion 的日誌
      consoleLogSpy.mockClear(); 
      consoleErrorSpy.mockClear();
    });

    it('案例 2.1: 應在 API 呼叫成功時返回生成的文字', async () => {
      const mockPrompt = '你好，世界';
      const mockResponseText = '來自模型的模擬回應';
      mockGenerateContent.mockResolvedValue({ 
        response: { text: () => mockResponseText }
      });

      const result = await service.getCompletion(mockPrompt);

      expect(mockGetGenerativeModel).toHaveBeenCalledTimes(1); // Ensure model setup was called once during service init
      expect(mockGenerateContent).toHaveBeenCalledWith(mockPrompt);
      expect(result).toBe(mockResponseText);
      expect(console.log).toHaveBeenCalledWith(`正在傳送提示至 Gemini：「${mockPrompt.substring(0, 100)}...」`);
      expect(console.log).toHaveBeenCalledWith(`已從 Gemini 收到回應：「${mockResponseText.substring(0, 100)}...」`);
    });

    it('案例 2.2: 當 API 呼叫失敗時應拋出錯誤', async () => {
      const mockPrompt = '測試失敗案例';
      const errorMessage = 'API 錯誤';
      mockGenerateContent.mockRejectedValue(new Error(errorMessage));

      await expect(service.getCompletion(mockPrompt)).rejects.toThrow(`Gemini API 請求失敗： ${errorMessage}`);
      expect(console.error).toHaveBeenCalledWith("呼叫 Gemini API 時發生錯誤：", expect.any(Error));
    });

    it('案例 2.2.1: 當 API 呼叫失敗 (非 Error 物件) 時應拋出通用錯誤', async () => {
      const mockPrompt = '測試非 Error 物件失敗案例';
      mockGenerateContent.mockRejectedValue('一個字串錯誤');

      await expect(service.getCompletion(mockPrompt)).rejects.toThrow("Gemini API 請求因未知錯誤而失敗。");
      expect(console.error).toHaveBeenCalledWith("呼叫 Gemini API 時發生錯誤：", '一個字串錯誤');
    });

    it('案例 2.3: 若模組加載時 API_KEY 就缺失，getCompletion 應拋出錯誤', async () => {
      delete process.env.GEMINI_API_KEY;
      // 確保 GoogleGenerativeAI 不拋錯，讓服務內部的 API_KEY 檢查生效
      mockGoogleGenerativeAI.mockImplementation(() => ({
        getGenerativeModel: mockGetGenerativeModel,
      }));
      service = await getFreshServiceInstance(); // 模組加載時 API_KEY 已缺失
      consoleErrorSpy.mockClear(); // 清除初始化時的 console.error

      await expect(service.getCompletion('任何提示')).rejects.toThrow("缺少 API 金鑰。無法連接至 Gemini API。");
      // 這裡的 console.error 應該是 getCompletion 內部的
      expect(console.error).toHaveBeenCalledWith("GeminiAPIService：呼叫 getCompletion 時缺少 API_KEY。");
    });
  });
}); 