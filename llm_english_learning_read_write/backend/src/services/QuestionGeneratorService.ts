import { generate111Question } from './generators/111_generate';
import { generate112Question } from './generators/112_generate';
import { generate121Question } from './generators/121_generate';
import { generate122Question } from './generators/122_generate';
import { generate123Question } from './generators/123_generate';
import { generate131Question } from './generators/131_generate';
import { generate141Question } from './generators/141_generate';
import { generate151Question } from './generators/151_generate';
import { generate152Question } from './generators/152_generate';
import { generate153Question } from './generators/153_generate';
import { generate211Question } from './generators/211_generate';
import { generate212Question } from './generators/212_generate';
import { generate221Question } from './generators/221_generate';
import { generate222Question } from './generators/222_generate';
import { generate231Question } from './generators/231_generate';
import { generate241Question } from './generators/241_generate';
import { generate242Question } from './generators/242_generate';
import { generate251Question } from './generators/251_generate';
import { generate252Question } from './generators/252_generate';
import { generate261Question } from './generators/261_generate';
import { generate271Question } from './generators/271_generate';
import { generate272Question } from './generators/272_generate';
import { generate281Question } from './generators/281_generate';
import { generate282Question } from './generators/282_generate';
// 從接口文件導入所有題型類型
import { 
  QuestionData111, 
  QuestionData112, 
  QuestionData121,
  QuestionData122, 
  QuestionData123,
  QuestionData131,
  QuestionData141,
  QuestionData151,
  QuestionData152,
  QuestionData153,
  QuestionData211,
  QuestionData212,
  QuestionData221,
  QuestionData222,
  QuestionData231,
  QuestionData241,
  QuestionData242,
  QuestionData251,
  QuestionData252,
  QuestionData261,
  QuestionData271,
  QuestionData272,
  QuestionData281,
  QuestionData282,
  QuestionData 
} from './generators/QuestionGeneratorInterface';
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
    case '1.2.1':
      try {
        const historyRecords = await getHistory('1.2.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate121Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.1:`, error);
        return null;
      }
    case '1.2.2':
      try {
        const historyRecords = await getHistory('1.2.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate122Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.2:`, error);
        return null;
      }
    case '1.2.3':
      try {
        const historyRecords = await getHistory('1.2.3');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate123Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.3.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.3:`, error);
        return null;
      }
    case '1.3.1':
      try {
        const historyRecords = await getHistory('1.3.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate131Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.3.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.3.1:`, error);
        return null;
      }
    case '1.4.1':
      try {
        const historyRecords = await getHistory('1.4.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate141Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.4.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.4.1:`, error);
        return null;
      }
    case '1.5.1':
      try {
        const historyRecords = await getHistory('1.5.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate151Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.1:`, error);
        return null;
      }
    case '1.5.2':
      try {
        const historyRecords = await getHistory('1.5.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate152Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.2:`, error);
        return null;
      }
    case '1.5.3':
      try {
        const historyRecords = await getHistory('1.5.3');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate153Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.3.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.3:`, error);
        return null;
      }
    case '2.1.1':
      try {
        const historyRecords = await getHistory('2.1.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate211Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.1.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.1:`, error);
        return null;
      }
    case '2.1.2':
      try {
        const historyRecords = await getHistory('2.1.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate212Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.1.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.2:`, error);
        return null;
      }
    case '2.2.1':
      try {
        const historyRecords = await getHistory('2.2.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate221Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.2.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.1:`, error);
        return null;
      }
    case '2.2.2':
      try {
        const historyRecords = await getHistory('2.2.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate222Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.2.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.2:`, error);
        return null;
      }
    case '2.3.1':
      try {
        const historyRecords = await getHistory('2.3.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate231Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.3.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.3.1:`, error);
        return null;
      }
    case '2.4.1':
      try {
        const historyRecords = await getHistory('2.4.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate241Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.4.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.1:`, error);
        return null;
      }
    case '2.4.2':
      try {
        const historyRecords = await getHistory('2.4.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate242Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.4.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.2:`, error);
        return null;
      }
    case '2.5.1':
      try {
        const historyRecords = await getHistory('2.5.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate251Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.5.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.1:`, error);
        return null;
      }
    case '2.5.2':
      try {
        const historyRecords = await getHistory('2.5.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate252Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.5.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.2:`, error);
        return null;
      }
    case '2.6.1':
      try {
        const historyRecords = await getHistory('2.6.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate261Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.6.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.6.1:`, error);
        return null;
      }
    case '2.7.1':
      try {
        const historyRecords = await getHistory('2.7.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate271Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.7.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.1:`, error);
        return null;
      }
    case '2.7.2':
      try {
        const historyRecords = await getHistory('2.7.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate272Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.7.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.2:`, error);
        return null;
      }
    case '2.8.1':
      try {
        const historyRecords = await getHistory('2.8.1');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate281Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.8.1.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.8.1:`, error);
        return null;
      }
    case '2.8.2':
      try {
        const historyRecords = await getHistory('2.8.2');
        const historySummary = JSON.stringify(historyRecords);
        const questionDataArray = await generate282Question(questionNumber, historySummary, difficulty);
        console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.8.2.`);
        return questionDataArray;
      } catch (error) {
        console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.8.2:`, error);
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