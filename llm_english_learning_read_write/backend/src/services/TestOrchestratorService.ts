import { QuestionCacheService } from './QuestionCacheService';
import actualQuestionCacheServiceInstance from './QuestionCacheService';
import { 
  QuestionData111 as GeneratorQuestionData111, 
  QuestionData112 as GeneratorQuestionData112,
  QuestionData122 as GeneratorQuestionData122,
  QuestionData123 as GeneratorQuestionData123,
  Option 
} from './generators/QuestionGeneratorInterface';
import { saveHistoryEntry, HistoryEntry, QuestionData as HistoryServiceQuestionData } from './HistoryService';

/**
 * TestOrchestratorService 內部處理和對外暴露的題目數據結構。
 * 包含從快取來的唯一 ID 和題目類型。
 */
export interface TestOrchestratorQuestion111 extends GeneratorQuestionData111 {
  id: string;           // 題目的唯一 ID (來自快取的 UUID)
  type: '1.1.1';      // 題型
  explanation?: string; // 最終提供給前端的解釋欄位名 (映射自 explanation_of_Question)
}

export interface TestOrchestratorQuestion112 extends GeneratorQuestionData112 {
  id: string;           // 題目的唯一 ID (來自快取的 UUID)
  type: '1.1.2';      // 題型
  explanation?: string; // 最終提供給前端的解釋欄位名 (映射自 explanation_of_Question)
}

export interface TestOrchestratorQuestion122 extends GeneratorQuestionData122 {
  id: string;           // 題目的唯一 ID (來自快取的 UUID)
  type: '1.2.2';      // 題型
  explanation?: string; // 最終提供給前端的解釋欄位名 (映射自 explanation_of_Question)
}

export interface TestOrchestratorQuestion123 extends GeneratorQuestionData123 {
  id: string;           // 題目的唯一 ID (來自快取的 UUID)
  type: '1.2.3';      // 題型
  explanation?: string; // 最終提供給前端的解釋欄位名 (映射自 explanation_of_Question)
}

export type TestOrchestratorQuestion = 
  | TestOrchestratorQuestion111 
  | TestOrchestratorQuestion112 
  | TestOrchestratorQuestion122 
  | TestOrchestratorQuestion123;

/**
 * 假設 QuestionCacheService.getQuestionFromCache 返回的結構。
 * 這是一個理想的假設，實際情況可能需要調整 QuestionCacheService。
 */
interface CachedQuestionPayload {
  id: string; // UUID of the question from CacheEntry
  questionBody: GeneratorQuestionData111; // questionData from CacheEntry
}

export interface SubmissionResult {
  isCorrect: boolean;
  correctAnswer: any;
  explanation?: string;
}

export interface SubmitAnswerResponse {
  submissionResult: SubmissionResult;
  nextQuestion: TestOrchestratorQuestion | null;
}

class TestOrchestratorService {
  constructor(
    private questionCacheService: QuestionCacheService
  ) {}

  private formatQuestionForClient111(cacheId: string, questionBody: GeneratorQuestionData111): TestOrchestratorQuestion111 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.1.1',
      explanation: questionBody.explanation_of_Question, // 映射欄位名
    };
  }

  private formatQuestionForClient112(cacheId: string, questionBody: GeneratorQuestionData112): TestOrchestratorQuestion112 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.1.2',
      explanation: questionBody.explanation_of_Question, // 映射欄位名
    };
  }

  private formatQuestionForClient122(cacheId: string, questionBody: GeneratorQuestionData122): TestOrchestratorQuestion122 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.2.2',
      explanation: questionBody.explanation_of_Question, // 映射欄位名
    };
  }

  private formatQuestionForClient123(cacheId: string, questionBody: GeneratorQuestionData123): TestOrchestratorQuestion123 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.2.3',
      explanation: questionBody.explanation_of_Question, // 映射欄位名
    };
  }

  async startSingleTypeTest(questionType: string): Promise<TestOrchestratorQuestion | null> {
    if (questionType !== '1.1.1' && questionType !== '1.1.2') {
      console.warn(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
      return null;
    }

    try {
      console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 正在從快取獲取題型 ${questionType} 的題目`);
      
      // 根據題型分別處理
      let cachedEntry: any = null;
      if (questionType === '1.1.1') {
        cachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.1');
      } else if (questionType === '1.1.2') {
        cachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.2');
      } else {
        console.warn(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
        return null;
      }
      
      if (!cachedEntry || !cachedEntry.UUID || !cachedEntry.questionData) {
        console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 快取中無可用題目或返回格式不符 (題型 ${questionType})`);
        return null;
      }
      
      // 根據題型選擇對應的格式化方法
      let questionForClient: TestOrchestratorQuestion;
      if (questionType === '1.1.1') {
        questionForClient = this.formatQuestionForClient111(cachedEntry.UUID, cachedEntry.questionData);
      } else { // questionType === '1.1.2'
        questionForClient = this.formatQuestionForClient112(cachedEntry.UUID, cachedEntry.questionData);
      }
      
      console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 成功獲取題目 ${questionForClient.id}`);
      return questionForClient;
    } catch (error) {
      console.error(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 獲取題目時發生錯誤`, error);
      return null;
    }
  }

  async submitAnswer(
    userQuestionId: string,
    userAnswer: any,
    originalQuestionClientData: TestOrchestratorQuestion
  ): Promise<SubmitAnswerResponse | null> {
    console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 處理題目 ${userQuestionId} 的答案提交`);
    try {
      if (!originalQuestionClientData || originalQuestionClientData.id !== userQuestionId) {
        console.error(`[DEBUG TestOrchestratorService.ts] submitAnswer: 提供的 originalQuestionClientData 無效或 questionId (${userQuestionId}) 不匹配 (${originalQuestionClientData?.id})`);
        return null;
      }

      const correctAnswer = originalQuestionClientData.standard_answer;
      const isCorrect = userAnswer === correctAnswer;
      console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 使用者答案 "${userAnswer}", 正確答案 "${correctAnswer}", 是否正確: ${isCorrect}`);

      // 根據題型構建歷史記錄快照
      const snapshotForHistory: HistoryServiceQuestionData = {
        passage: originalQuestionClientData.passage,
        targetWord: originalQuestionClientData.type === '1.1.1' ? (originalQuestionClientData as TestOrchestratorQuestion111).targetWord : undefined,
        question: originalQuestionClientData.question,
        options: originalQuestionClientData.options.map(opt => ({id: opt.id, text: opt.text})),
        standard_answer: originalQuestionClientData.standard_answer,
      };
      
      const historyEntryPayload: Omit<HistoryEntry, 'timestamp'> = {
        UUID: originalQuestionClientData.id,
        questionData: snapshotForHistory, 
        userAnswer: userAnswer,
        isCorrect: isCorrect,
      };

      console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 準備儲存歷史記錄`, historyEntryPayload);
      await saveHistoryEntry(originalQuestionClientData.type, historyEntryPayload);
      console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 歷史記錄已儲存`);

      // 暫時只支援1.1.1，1.1.2的支援需要更新QuestionCacheService
      let nextQuestionForClient: TestOrchestratorQuestion | null = null;
      if (originalQuestionClientData.type === '1.1.1') {
        const nextCachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.1'); // nextCachedEntry is CacheEntry | null
      if (nextCachedEntry && nextCachedEntry.UUID && nextCachedEntry.questionData) {
          // 確保數據類型正確
          nextQuestionForClient = this.formatQuestionForClient111(nextCachedEntry.UUID, nextCachedEntry.questionData as GeneratorQuestionData111);
        console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 下一題獲取結果: ${nextQuestionForClient.id}`);
      } else {
        console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 無可用下一題`);
        }
      } else {
        console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 1.1.2題型的下一題獲取暫未實現`);
      }

      const submissionResult: SubmissionResult = {
        isCorrect: isCorrect,
        correctAnswer: correctAnswer,
        explanation: originalQuestionClientData.explanation || originalQuestionClientData.explanation_of_Question || '此題無解釋。',
      };

      return {
        submissionResult: submissionResult,
        nextQuestion: nextQuestionForClient,
      };
    } catch (error) {
      console.error(`[DEBUG TestOrchestratorService.ts] submitAnswer: 提交答案時發生錯誤 (題目ID: ${userQuestionId})`, error);
      return null;
    }
  }
}

export default TestOrchestratorService; 