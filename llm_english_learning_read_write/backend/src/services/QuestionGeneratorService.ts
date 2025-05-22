import { generate111Question } from './generators/111_generate';
import { generate112Question } from './generators/112_generate';
// 從接口文件導入 QuestionData111, QuestionData112 和 QuestionData 類型
import { QuestionData111, QuestionData112, QuestionData } from './generators/QuestionGeneratorInterface';
import { getHistory } from '../services/HistoryService'; // 匯入查詢歷史紀錄的函數

/**
 * 根據題目類型生成題目資料。
 * @param questionType - 題目類型代碼 (例如 '1.1.1')。
 * @param difficulty - 難度設定 (0-100)。
 * @param historySummary - 學習者歷史摘要。
 * @param questionNumber - 需要生成的題目數量 (默認為 1)。
 * @returns 返回對應題型的題目資料物件或物件陣列，若不支援該題型或生成失敗則返回 null。
 */
async function generateQuestionByType(
  questionType: string,
  difficulty: number = 70,
  historySummary: string = 'No history available.',
  questionNumber: number = 1
): Promise<QuestionData> { // 返回類型使用導入的 QuestionData
  console.log(`[DEBUG QuestionGeneratorService.ts] Received request for type: ${questionType}, difficulty: ${difficulty}, number: ${questionNumber}`);
  switch (questionType) {
    case '1.1.1':
      try {
        // 查詢歷史紀錄，這裡直接查詢 1.1.1 題型的所有紀錄
        const historyRecords = await getHistory('1.1.1');
        // 直接將歷史紀錄序列化為字串作為 summary 傳遞
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate111Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.1.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.1:`, error);
        return null;
      }
    case '1.1.2':
      try {
        // 查詢歷史紀錄，這裡直接查詢 1.1.2 題型的所有紀錄
        const historyRecords = await getHistory('1.1.2');
        // 直接將歷史紀錄序列化為字串作為 summary 傳遞
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate112Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.1.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.2:`, error);
        return null;
      }
    default:
      console.warn(`[DEBUG QuestionGeneratorService.ts] Unsupported question type: ${questionType}`);
      return null;
  }
}

export const QuestionGeneratorService = {
  generateQuestionByType,
};

// 如果希望直接導出函數而非物件，也可以這樣寫：
// export { generateQuestionByType }; 