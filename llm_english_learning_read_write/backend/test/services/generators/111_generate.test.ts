import { generate111Question, QuestionData111 } from '../../../src/services/generators/111_generate';
import GeminiAPIService from '../../../src/services/GeminiAPIService';
// import { CleanJSON } from '../../src/utils/CleanJSON'; // CleanJSON 不再使用
// import { Schema } from '@google/generative-ai'; // 導入 Schema 以便在測試中引用
// 如需 schema，請改用 import { Type } from '@google/genai';

// Mock GeminiAPIService
// 確保 mock 整個模塊並且可以訪問其 default 導出
jest.mock('../../../src/services/GeminiAPIService', () => {
    // 模擬的 getResponse 方法
    const mockGetResponse = jest.fn();
    // 返回一個模擬的類實例或物件，其中包含 mock 的方法
    // 因為 GeminiAPIService 是 default export，所以需要模擬 default
    return {
        __esModule: true, // 表示這是一個 ES Module
        default: {
            // 模擬單例的 getResponse 方法
            getResponse: mockGetResponse,
        },
    };
});

// 將模擬的 getResponse 方法提取出來，以便在測試中設置返回值
const mockGetResponse = GeminiAPIService.getResponse as jest.Mock;

// 不再需要 Mock CleanJSON
// jest.mock('../../src/utils/CleanJSON');
// const mockExtractAndParse = CleanJSON.extractAndParse as jest.Mock;

// 輔助函數：創建一個符合結構的假題目數據
const createMockQuestionData = (idSuffix: string): QuestionData111 => ({
    passage: `Mock passage ${idSuffix}`,
    targetWord: `mock${idSuffix}`,
    question: `What does mock${idSuffix} mean?`,
    options: [
        { id: "A", text: "Fake" },
        { id: "B", text: "Real" },
        { id: "C", text: "Test" },
        { id: "D", text: "Bird" },
    ],
    standard_answer: "A",
    explanation_of_Question: `Mock${idSuffix} means fake or imitation.`,
});

describe('generate111Question', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockGetResponse.mockClear();
        // mockExtractAndParse.mockClear();
    });

    // --- 成功案例 --- 
    it('成功生成指定數量的題目 (questionNumber > 1)', async () => {
        const requestedNumber = 2;
        const mockApiResponse = [
            createMockQuestionData('1'),
            createMockQuestionData('2'),
        ]; // LLM 回應模擬為陣列
        mockGetResponse.mockResolvedValue(mockApiResponse);

        const result = await generate111Question(requestedNumber, "history", 70);

        expect(mockGetResponse).toHaveBeenCalledTimes(1);
        // 驗證 prompt 是否包含正確的請求數量
        expect(mockGetResponse.mock.calls[0][0]).toContain(`Generate exactly ${requestedNumber} multiple-choice questions.`);
        expect(result).toEqual(mockApiResponse); // 期望結果是完整的陣列
        expect(Array.isArray(result)).toBe(true); // 確保結果是陣列
        expect(result?.length).toBe(requestedNumber); // 確保數量正確
    });

    it('成功生成單個題目 (questionNumber = 1)', async () => {
        const requestedNumber = 1;
        const mockApiResponse = [ // LLM 回應模擬為包含單個元素的陣列
            createMockQuestionData('single'),
        ]; 
        mockGetResponse.mockResolvedValue(mockApiResponse);

        const result = await generate111Question(requestedNumber, "history", 70);

        expect(mockGetResponse).toHaveBeenCalledTimes(1);
        expect(mockGetResponse.mock.calls[0][0]).toContain(`Generate exactly ${requestedNumber} multiple-choice questions.`);
        expect(result).toEqual(mockApiResponse); // 期望結果是包含單個元素的陣列
        expect(Array.isArray(result)).toBe(true);
        expect(result?.length).toBe(requestedNumber);
    });
    
    // --- 失敗案例 --- 

    it('當 LLM 回應不是陣列時應該拋出錯誤', async () => {
        const invalidApiResponse = { message: "I am an object, not an array." }; // 非陣列回應
        mockGetResponse.mockResolvedValue(invalidApiResponse);

        await expect(generate111Question(1, "", 70)).rejects.toThrow('從 LLM 收到的回應不是有效的陣列。');
    });

    it('當 LLM 回應的陣列中物件結構不符合 Zod Schema 時應該拋出錯誤', async () => {
        const invalidApiResponse = [
            { ...createMockQuestionData('valid'), passage: "" }, // passage 為空，不符合 min(1)
        ];
        mockGetResponse.mockResolvedValue(invalidApiResponse);

        await expect(generate111Question(1, "", 70)).rejects.toThrow(/LLM 回應陣列驗證失敗.*passage/);
    });

    it('當 LLM 回應的陣列中物件的 standard_answer 無效時應該拋出錯誤', async () => {
        const invalidApiResponse = [
            { ...createMockQuestionData('invalidRef'), standard_answer: "Z" }, // 'Z' 不在 options 的 id 中
        ];
        mockGetResponse.mockResolvedValue(invalidApiResponse);

        await expect(generate111Question(1, "", 70)).rejects.toThrow(/standard_answer 必須對應 options 陣列中某個元素的 id/);
    });

    it('當 LLM 回應的陣列為空時應該拋出 Zod 錯誤', async () => {
        const emptyApiResponse: QuestionData111[] = []; // 空陣列
        mockGetResponse.mockResolvedValue(emptyApiResponse);

        await expect(generate111Question(1, "", 70)).rejects.toThrow(/回應的陣列至少需要包含一個題目/); // 來自 .min(1)
    });

    it('當 Gemini API 服務拋出錯誤時應該重新拋出', async () => {
        const errorMessage = "Gemini API network error";
        mockGetResponse.mockRejectedValue(new Error(errorMessage));

        await expect(generate111Question(1, "", 70)).rejects.toThrow(errorMessage);
    });

    // 測試 prompt 中的 difficulty setting (之前失敗的案例，觀察是否依然失敗)
    it('應該使用正確的 difficultySetting 構建 Prompt', async () => {
        const requestedNumber = 1;
        const difficulty = 85; 
        const mockApiResponse = [createMockQuestionData('difficultyTest')];
        mockGetResponse.mockResolvedValue(mockApiResponse);

        await generate111Question(requestedNumber, "", difficulty);

        expect(mockGetResponse).toHaveBeenCalledTimes(1);
        const calledPrompt = mockGetResponse.mock.calls[0][0];
        // 檢查 prompt 字符串中是否包含正確的難度百分比
        expect(calledPrompt).toContain(`難度設定為：${difficulty}%`); 
    });

    // 測試 LLM 返回數量與請求數量不符時的警告
    it('當 LLM 返回的題目數量與請求不符時，應記錄警告但仍返回數據', async () => {
        const requestedNumber = 3;
        const returnedNumber = 2; // LLM 只返回了 2 個
        const mockApiResponse = [
            createMockQuestionData('mismatch1'),
            createMockQuestionData('mismatch2'),
        ];
        mockGetResponse.mockResolvedValue(mockApiResponse);
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); // 監控 console.warn

        const result = await generate111Question(requestedNumber, "", 70);

        expect(mockGetResponse).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockApiResponse);
        expect(result?.length).toBe(returnedNumber);
        // 驗證警告被觸發
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining(`LLM returned ${returnedNumber} questions, but ${requestedNumber} were requested`)
        );

        consoleWarnSpy.mockRestore(); // 恢復 console.warn
    });
}); 