// test/services/generators/112_generate.test.ts

import { generate112Question } from '../../../src/services/generators/112_generate';
import GeminiAPIService from '../../../src/services/generators/../GeminiAPIService';
import { LLMConfigService } from '../../../src/utils/LLMConfigService';

// Mock dependencies
jest.mock('../../../src/services/generators/../GeminiAPIService');
jest.mock('../../../src/utils/LLMConfigService');

describe('112_generate', () => {
  const mockGeminiAPIService = GeminiAPIService as jest.Mocked<typeof GeminiAPIService>;
  const mockLLMConfigService = LLMConfigService as jest.Mocked<typeof LLMConfigService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock LLMConfigService
    const mockLLMInstance = {
      getConfig: jest.fn().mockReturnValue({
        temperature: 0.8,
        thinkingBudget: 12000
      })
    };
    (LLMConfigService.getInstance as jest.Mock).mockReturnValue(mockLLMInstance);
  });

  describe('generate112Question', () => {
    it('應該成功生成一個 1.1.2 題型問題', async () => {
      // Arrange
      const mockResponse = [
        {
          passage: "The ancient castle stood on a hill, its walls _______ against the stormy sky.",
          question: "Choose the best word to complete the sentence.",
          options: [
            { id: "A", text: "illuminated" },
            { id: "B", text: "silhouetted" },
            { id: "C", text: "decorated" },
            { id: "D", text: "vanished" }
          ],
          standard_answer: "B",
          explanation_of_Question: "Silhouetted 指在明亮背景下形成暗影輪廓。城堡的牆壁在暴風雨天空的襯托下形成輪廓，因此選項 B 正確。"
        }
      ];

      mockGeminiAPIService.getResponse.mockResolvedValue(mockResponse);

      // Act
      const result = await generate112Question(1, "No history", 70);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGeminiAPIService.getResponse).toHaveBeenCalledWith(
        expect.stringContaining('cloze test questions'),
        expect.objectContaining({
          responseSchema: expect.any(Object),
          config: { temperature: 0.8, thinkingBudget: 12000 }
        })
      );
    });

    it('應該成功生成多個 1.1.2 題型問題', async () => {
      // Arrange
      const mockResponse = [
        {
          passage: "The scientist made a _______ discovery that changed everything.",
          question: "Choose the best word to complete the sentence.",
          options: [
            { id: "A", text: "remarkable" },
            { id: "B", text: "terrible" },
            { id: "C", text: "small" },
            { id: "D", text: "ordinary" }
          ],
          standard_answer: "A",
          explanation_of_Question: "Remarkable 指值得注意的、非凡的發現。"
        },
        {
          passage: "The weather was _______ for the outdoor concert.",
          question: "Choose the best word to complete the sentence.",
          options: [
            { id: "A", text: "perfect" },
            { id: "B", text: "horrible" },
            { id: "C", text: "acceptable" },
            { id: "D", text: "uncertain" }
          ],
          standard_answer: "A",
          explanation_of_Question: "Perfect 表示完美的天氣適合戶外音樂會。"
        }
      ];

      mockGeminiAPIService.getResponse.mockResolvedValue(mockResponse);

      // Act
      const result = await generate112Question(2, "No history", 70);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockResponse);
    });

    it('當 LLM 回傳非陣列時應該返回 null', async () => {
      // Arrange
      mockGeminiAPIService.getResponse.mockResolvedValue("invalid response");

      // Act
      const result = await generate112Question(1, "No history", 70);

      // Assert
      expect(result).toBeNull();
    });

    it('當 LLM 拋出錯誤時應該返回 null', async () => {
      // Arrange
      mockGeminiAPIService.getResponse.mockRejectedValue(new Error('API Error'));

      // Act
      const result = await generate112Question(1, "No history", 70);

      // Assert
      expect(result).toBeNull();
    });

    it('應該在 prompt 中包含正確的參數', async () => {
      // Arrange
      const questionNumber = 3;
      const historySummary = "User has 80% accuracy";
      const difficultySetting = 85;

      mockGeminiAPIService.getResponse.mockResolvedValue([]);

      // Act
      await generate112Question(questionNumber, historySummary, difficultySetting);

      // Assert
      const calledPrompt = mockGeminiAPIService.getResponse.mock.calls[0][0];
      expect(calledPrompt).toContain(`exactly ${questionNumber} cloze test questions`);
      expect(calledPrompt).toContain(historySummary);
      expect(calledPrompt).toContain(`${difficultySetting}% target accuracy`);
    });
  });
}); 