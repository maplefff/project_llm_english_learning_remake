import { QuestionCacheService } from './QuestionCacheService_v2';
import { 
  QuestionData111 as GeneratorQuestionData111, 
  QuestionData112 as GeneratorQuestionData112,
  QuestionData121 as GeneratorQuestionData121,
  QuestionData122 as GeneratorQuestionData122,
  QuestionData123 as GeneratorQuestionData123,
  QuestionData131 as GeneratorQuestionData131,
  QuestionData141 as GeneratorQuestionData141,
  QuestionData151 as GeneratorQuestionData151,
  QuestionData152 as GeneratorQuestionData152,
  QuestionData153 as GeneratorQuestionData153,
  Option 
} from './generators/QuestionGeneratorInterface';
import { saveHistoryEntry, HistoryEntry, QuestionData as HistoryServiceQuestionData } from './HistoryService';

/**
 * 基礎題目介面 - 所有題型的共同屬性
 */
interface BaseTestOrchestratorQuestion {
  id: string;
  type: string;
  explanation?: string;
  explanation_of_Question?: string;
}

/**
 * 選擇題基礎介面
 */
interface MultipleChoiceTestOrchestratorQuestion extends BaseTestOrchestratorQuestion {
  question: string;
  options: Option[];
  standard_answer: string;
}

/**
 * 各題型的特定介面
 */
export interface TestOrchestratorQuestion111 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.1.1';
  passage: string;
  targetWord: string;
}

export interface TestOrchestratorQuestion112 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.1.2';
  passage: string;
}

export interface TestOrchestratorQuestion121 extends BaseTestOrchestratorQuestion {
  type: '1.2.1';
  original_sentence: string;
  instruction: string;
  standard_corrections: string[];
  error_types: string[];
}

export interface TestOrchestratorQuestion122 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.2.2';
}

export interface TestOrchestratorQuestion123 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.2.3';
  sentence_context: string;
}

export interface TestOrchestratorQuestion131 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.3.1';
  passage: string;
}

export interface TestOrchestratorQuestion141 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.4.1';
  passage: string;
}

export interface TestOrchestratorQuestion151 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.5.1';
  passage: string;
}

export interface TestOrchestratorQuestion152 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.5.2';
  passage: string;
}

export interface TestOrchestratorQuestion153 extends MultipleChoiceTestOrchestratorQuestion {
  type: '1.5.3';
  passage: string;
}

export type TestOrchestratorQuestion = 
  | TestOrchestratorQuestion111 
  | TestOrchestratorQuestion112 
  | TestOrchestratorQuestion121
  | TestOrchestratorQuestion122 
  | TestOrchestratorQuestion123
  | TestOrchestratorQuestion131
  | TestOrchestratorQuestion141
  | TestOrchestratorQuestion151
  | TestOrchestratorQuestion152
  | TestOrchestratorQuestion153;

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
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient112(cacheId: string, questionBody: GeneratorQuestionData112): TestOrchestratorQuestion112 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.1.2',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient121(cacheId: string, questionBody: GeneratorQuestionData121): TestOrchestratorQuestion121 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.2.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient122(cacheId: string, questionBody: GeneratorQuestionData122): TestOrchestratorQuestion122 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.2.2',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient123(cacheId: string, questionBody: GeneratorQuestionData123): TestOrchestratorQuestion123 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.2.3',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient131(cacheId: string, questionBody: GeneratorQuestionData131): TestOrchestratorQuestion131 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.3.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient141(cacheId: string, questionBody: GeneratorQuestionData141): TestOrchestratorQuestion141 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.4.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient151(cacheId: string, questionBody: GeneratorQuestionData151): TestOrchestratorQuestion151 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.5.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient152(cacheId: string, questionBody: GeneratorQuestionData152): TestOrchestratorQuestion152 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.5.2',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient153(cacheId: string, questionBody: GeneratorQuestionData153): TestOrchestratorQuestion153 {
    return {
      ...questionBody,
      id: cacheId,
      type: '1.5.3',
      explanation: questionBody.explanation_of_Question,
    };
  }

  async startSingleTypeTest(questionType: string): Promise<TestOrchestratorQuestion | null> {
    const supportedTypes = ['1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3'];
    
    if (!supportedTypes.includes(questionType)) {
      console.log(`[DEBUG TestOrchestratorService_v2.ts] Unsupported question type: ${questionType}`);
      return null;
    }

    console.log(`[DEBUG TestOrchestratorService_v2.ts] Starting test for question type: ${questionType}`);

    try {
      // 嘗試從快取獲取題目
      const cacheEntry = await this.questionCacheService.getQuestionFromCache(questionType as any);
      
      if (cacheEntry) {
        console.log(`[DEBUG TestOrchestratorService_v2.ts] Retrieved question from cache with UUID: ${cacheEntry.UUID}`);
        
        // 根據題型格式化問題
        switch (questionType) {
          case '1.1.1':
            return this.formatQuestionForClient111(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData111);
          case '1.1.2':
            return this.formatQuestionForClient112(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData112);
          case '1.2.1':
            return this.formatQuestionForClient121(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData121);
          case '1.2.2':
            return this.formatQuestionForClient122(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData122);
          case '1.2.3':
            return this.formatQuestionForClient123(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData123);
          case '1.3.1':
            return this.formatQuestionForClient131(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData131);
          case '1.4.1':
            return this.formatQuestionForClient141(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData141);
          case '1.5.1':
            return this.formatQuestionForClient151(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData151);
          case '1.5.2':
            return this.formatQuestionForClient152(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData152);
          case '1.5.3':
            return this.formatQuestionForClient153(cacheEntry.UUID, cacheEntry.questionData as GeneratorQuestionData153);
          default:
            console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in switch: ${questionType}`);
            return null;
        }
      } else {
        console.log(`[DEBUG TestOrchestratorService_v2.ts] No cached question available for ${questionType}, attempting direct generation...`);
        
        // 直接生成題目
        const generated = await this.generateQuestionDirectly(questionType);
        
        if (generated && Array.isArray(generated) && generated.length > 0) {
          const firstQuestion = generated[0];
          const tempId = `temp_${Date.now()}`;
          
          // 根據題型格式化問題
          switch (questionType) {
            case '1.1.1':
              return this.formatQuestionForClient111(tempId, firstQuestion as GeneratorQuestionData111);
            case '1.1.2':
              return this.formatQuestionForClient112(tempId, firstQuestion as GeneratorQuestionData112);
            case '1.2.1':
              return this.formatQuestionForClient121(tempId, firstQuestion as GeneratorQuestionData121);
            case '1.2.2':
              return this.formatQuestionForClient122(tempId, firstQuestion as GeneratorQuestionData122);
            case '1.2.3':
              return this.formatQuestionForClient123(tempId, firstQuestion as GeneratorQuestionData123);
            case '1.3.1':
              return this.formatQuestionForClient131(tempId, firstQuestion as GeneratorQuestionData131);
            case '1.4.1':
              return this.formatQuestionForClient141(tempId, firstQuestion as GeneratorQuestionData141);
            case '1.5.1':
              return this.formatQuestionForClient151(tempId, firstQuestion as GeneratorQuestionData151);
            case '1.5.2':
              return this.formatQuestionForClient152(tempId, firstQuestion as GeneratorQuestionData152);
            case '1.5.3':
              return this.formatQuestionForClient153(tempId, firstQuestion as GeneratorQuestionData153);
            default:
              console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in generation switch: ${questionType}`);
              return null;
          }
        } else {
          console.error(`[DEBUG TestOrchestratorService_v2.ts] Failed to generate question for type: ${questionType}`);
          return null;
        }
      }
    } catch (error) {
      console.error(`[DEBUG TestOrchestratorService_v2.ts] Error in startSingleTypeTest:`, error);
      return null;
    }
  }

  private async generateQuestionDirectly(questionType: string): Promise<TestOrchestratorQuestion[] | null> {
    try {
      // 動態導入QuestionGeneratorService
      const { QuestionGeneratorService } = await import('./QuestionGeneratorService');
      
      const result = await QuestionGeneratorService.generateQuestionByType(
        questionType,
        70, // 預設難度
        "No history available.", // 預設歷史
        1 // 生成1題
      );

      if (!result || (Array.isArray(result) && result.length === 0)) {
        console.log(`[DEBUG TestOrchestratorService.ts] generateQuestionDirectly: 無法生成題型 ${questionType} 的題目`);
        return null;
      }

      // 處理生成結果
      const questionData = Array.isArray(result) ? result : [result];
      const questionIds = questionData.map(data => `direct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

      // 根據題型格式化
      const formattedQuestions = questionData.map((data, index) => {
        const questionId = questionIds[index];
        switch (questionType) {
          case '1.1.1':
            return this.formatQuestionForClient111(questionId, data as GeneratorQuestionData111);
          case '1.1.2':
            return this.formatQuestionForClient112(questionId, data as GeneratorQuestionData112);
          case '1.2.1':
            return this.formatQuestionForClient121(questionId, data as GeneratorQuestionData121);
          case '1.2.2':
            return this.formatQuestionForClient122(questionId, data as GeneratorQuestionData122);
          case '1.2.3':
            return this.formatQuestionForClient123(questionId, data as GeneratorQuestionData123);
          case '1.3.1':
            return this.formatQuestionForClient131(questionId, data as GeneratorQuestionData131);
          case '1.4.1':
            return this.formatQuestionForClient141(questionId, data as GeneratorQuestionData141);
          case '1.5.1':
            return this.formatQuestionForClient151(questionId, data as GeneratorQuestionData151);
          case '1.5.2':
            return this.formatQuestionForClient152(questionId, data as GeneratorQuestionData152);
          case '1.5.3':
            return this.formatQuestionForClient153(questionId, data as GeneratorQuestionData153);
          default:
            return null;
        }
      }).filter((q): q is TestOrchestratorQuestion => q !== null);

      return formattedQuestions;
    } catch (error) {
      console.error(`[DEBUG TestOrchestratorService.ts] generateQuestionDirectly: 錯誤`, error);
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

      // 根據題型處理答案評分
      let correctAnswer: any;
      let isCorrect: boolean;

      if (originalQuestionClientData.type === '1.2.1') {
        // 1.2.1 是改錯題，需要特殊處理
        const question121 = originalQuestionClientData as TestOrchestratorQuestion121;
        correctAnswer = question121.standard_corrections[0]; // 使用第一個標準答案作為主要答案
        // 檢查用戶答案是否與任何標準答案匹配
        isCorrect = question121.standard_corrections.some(correction => 
          userAnswer.trim().toLowerCase() === correction.trim().toLowerCase()
        );
      } else {
        // 選擇題類型
        const mcQuestion = originalQuestionClientData as MultipleChoiceTestOrchestratorQuestion;
        correctAnswer = mcQuestion.standard_answer;
        isCorrect = userAnswer === correctAnswer;
      }

      console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 使用者答案 "${userAnswer}", 正確答案 "${correctAnswer}", 是否正確: ${isCorrect}`);

      // 根據題型構建歷史記錄快照
      const snapshotForHistory: HistoryServiceQuestionData = {
        passage: this.getPassageFromQuestion(originalQuestionClientData) || '', // 提供預設值
        targetWord: originalQuestionClientData.type === '1.1.1' ? (originalQuestionClientData as TestOrchestratorQuestion111).targetWord : undefined,
        question: this.getQuestionFromData(originalQuestionClientData),
        options: this.getOptionsFromData(originalQuestionClientData),
        standard_answer: correctAnswer,
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

      // 獲取下一題 - 暫時只從相同題型獲取
      const nextQuestionForClient = await this.startSingleTypeTest(originalQuestionClientData.type);

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

  private getPassageFromQuestion(question: TestOrchestratorQuestion): string | undefined {
    if ('passage' in question) {
      return question.passage;
    }
    if ('sentence_context' in question) {
      return question.sentence_context;
    }
    if ('original_sentence' in question) {
      return question.original_sentence;
    }
    return undefined;
  }

  private getQuestionFromData(question: TestOrchestratorQuestion): string {
    if ('question' in question) {
      return question.question;
    }
    if ('instruction' in question) {
      return question.instruction;
    }
    return 'No question text available';
  }

  private getOptionsFromData(question: TestOrchestratorQuestion): { id: string; text: string }[] {
    if ('options' in question) {
      return question.options.map(opt => ({ id: opt.id, text: opt.text }));
    }
    return [];
  }
}

export default TestOrchestratorService; 