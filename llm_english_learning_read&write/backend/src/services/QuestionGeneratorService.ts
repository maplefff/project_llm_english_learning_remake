import { generate111Question, QuestionData111 } from './generators/111_generate';

// 定義一個通用的 QuestionData 類型或 any，取決於後續是否需要統一結構
type QuestionData = QuestionData111 | null; // 暫時只支援 1.1.1 或 null

/**
 * 根據題目類型生成題目資料。
 * @param questionType - 題目類型代碼 (例如 '1.1.1')。
 * @param difficulty - 難度設定 (0-100)。
 * @param historySummary - 學習者歷史摘要。
 * @returns 返回對應題型的題目資料物件，若不支援該題型或生成失敗則返回 null。
 */
async function generateQuestionByType(
  questionType: string,
  difficulty: number = 70, // 保留與 111_generate 一致的預設值
  historySummary: string = 'No history available.' // 保留與 111_generate 一致的預設值
): Promise<QuestionData | null> {
  console.log(`[DEBUG QuestionGeneratorService.ts] Received request for type: ${questionType}, difficulty: ${difficulty}`);
  switch (questionType) {
    case '1.1.1':
      try {
        // 注意：將 difficulty 和 historySummary 傳遞給具體的生成器
        const questionData = await generate111Question(difficulty, historySummary);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated question data for type 1.1.1:`, questionData ? 'Success' : 'Failure');
        return questionData;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.1:`, error);
        return null; // 生成過程中發生錯誤
      }
    // case '1.1.2': // 未來擴展
    //   // return await generate112Question(difficulty, historySummary);
    //   return null;
    default:
      console.warn(`[DEBUG QuestionGeneratorService.ts] Unsupported question type: ${questionType}`);
      return null; // 不支援的題型
  }
}

export const QuestionGeneratorService = {
  generateQuestionByType,
};

// 如果希望直接導出函數而非物件，也可以這樣寫：
// export { generateQuestionByType }; 