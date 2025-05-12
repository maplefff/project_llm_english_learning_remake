import { generate111Question as generate111 } from '../../../src/services/generators/111_generate';
import GeminiAPIService from '../../../src/services/GeminiAPIService';
// import { CleanJSON } from '../../../src/utils/CleanJSON'; // CleanJSON 不再使用
import { Schema } from '@google/generative-ai'; // 導入 Schema 以便在測試中引用

// Mock GeminiAPIService
// 注意：由於 GeminiAPIService 是一個單例，我們模擬的是它的實例方法
jest.mock('../../../src/services/GeminiAPIService');

// 在每次測試後，清除模擬函數的調用記錄
afterEach(() => {
  // 清除默認導出的模擬實例上的方法調用記錄
  (GeminiAPIService.getResponse as jest.Mock).mockClear();
});

interface QuestionData111 {
    passage: string;
    targetWord: string;
    question: string;
    options: Array<{ [key: string]: string }>;
    standard_answer: string;
    explanation_of_Question: string;
}

describe('generate111', () => {
    it('應該使用結構化輸出成功生成問題數據', async () => {
        const mockValidResponse = {
            passage: 'This is a test passage.',
            targetWord: 'test',
            question: 'What does test mean?',
            options: [
                { id: 'A', text: 'Option A Text' },
                { id: 'B', text: 'Option B Text' },
                { id: 'C', text: 'Option C Text' },
                { id: 'D', text: 'Option D Text' },
            ],
            standard_answer: 'B',
            explanation_of_Question: 'This is the explanation in Traditional Chinese.',
        };

        // 配置 getResponse 的模擬實現
        (GeminiAPIService.getResponse as jest.Mock).mockResolvedValue(mockValidResponse);

        const difficulty = 75;
        const historySummary = 'Previous attempt was incorrect.';

        const result = await generate111(difficulty, historySummary);

        expect(result).toEqual(mockValidResponse);
        expect(GeminiAPIService.getResponse).toHaveBeenCalledTimes(1);
        // 檢查傳遞給 getResponse 的參數
        const [prompt, options] = (GeminiAPIService.getResponse as jest.Mock).mock.calls[0];
        expect(prompt).toContain(`難度設定為：${difficulty}% 目標正確率`);
        expect(prompt).toContain(historySummary);
        expect(options).toHaveProperty('responseSchema');
    });

    it('當 LLM 回應的 standard_answer 不存在於 options 的 id 中時，應該拋出錯誤', async () => {
        const mockInvalidResponse = {
            passage: 'Another passage.',
            targetWord: 'another',
            question: 'What about another?',
            options: [
                { id: 'A', text: 'Option A' },
                { id: 'B', text: 'Option B' },
                { id: 'C', text: 'Option C' },
                { id: 'D', text: 'Option D' },
            ],
            standard_answer: 'E', // 無效的答案 ID
            explanation_of_Question: 'Explanation.',
        };

        (GeminiAPIService.getResponse as jest.Mock).mockResolvedValue(mockInvalidResponse);

        await expect(generate111(50, '')).rejects.toThrow(
            'LLM 回應驗證失敗: standard_answer - standard_answer 必須對應 options 陣列中某個元素的 id'
        );
        expect(GeminiAPIService.getResponse).toHaveBeenCalledTimes(1);
    });

    it('當 LLM 回應缺少必要欄位時，應該拋出錯誤', async () => {
        const mockIncompleteResponse = {
            passage: 'Incomplete passage.',
            targetWord: 'incomplete',
            // question 欄位缺失
            options: [
                { id: 'A', text: 'Opt A' },
                { id: 'B', text: 'Opt B' },
                { id: 'C', text: 'Opt C' },
                { id: 'D', text: 'Opt D' },
            ],
            standard_answer: 'A',
            explanation_of_Question: 'Explanation.',
        };

        (GeminiAPIService.getResponse as jest.Mock).mockResolvedValue(mockIncompleteResponse);

        await expect(generate111(60, '')).rejects.toThrow(/LLM 回應驗證失敗: question - Required/);
        expect(GeminiAPIService.getResponse).toHaveBeenCalledTimes(1);
    });

    it('當 LLM 回應的 options 數量不為 4 時，應該拋出錯誤', async () => {
        const mockWrongOptionsCount = {
            passage: 'Passage.',
            targetWord: 'word',
            question: 'Question?',
            options: [
                { id: 'A', text: 'Only one' },
            ], // 只有一個選項
            standard_answer: 'A',
            explanation_of_Question: 'Explanation.',
        };

        (GeminiAPIService.getResponse as jest.Mock).mockResolvedValue(mockWrongOptionsCount);

        await expect(generate111(70, '')).rejects.toThrow(
            'LLM 回應驗證失敗: options - 必須剛好有 4 個選項'
        );
        expect(GeminiAPIService.getResponse).toHaveBeenCalledTimes(1);
    });

    it('當 GeminiAPIService.getResponse 拋出錯誤時，應該向上拋出錯誤', async () => {
        const errorMessage = 'API Error';
        (GeminiAPIService.getResponse as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(generate111(80, '')).rejects.toThrow(errorMessage);
        expect(GeminiAPIService.getResponse).toHaveBeenCalledTimes(1);
    });
}); 