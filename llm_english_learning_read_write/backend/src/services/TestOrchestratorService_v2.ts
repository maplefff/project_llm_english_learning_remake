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
  QuestionData211 as GeneratorQuestionData211,
  QuestionData212 as GeneratorQuestionData212,
  QuestionData221 as GeneratorQuestionData221,
  QuestionData222 as GeneratorQuestionData222,
  QuestionData231 as GeneratorQuestionData231,
  QuestionData241 as GeneratorQuestionData241,
  QuestionData242 as GeneratorQuestionData242,
  QuestionData251 as GeneratorQuestionData251,
  QuestionData252 as GeneratorQuestionData252,
  QuestionData261 as GeneratorQuestionData261,
  QuestionData271 as GeneratorQuestionData271,
  QuestionData272 as GeneratorQuestionData272,
  QuestionData281 as GeneratorQuestionData281,
  QuestionData282 as GeneratorQuestionData282,
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
 * 寫作題基礎介面
 */
interface WritingTestOrchestratorQuestion extends BaseTestOrchestratorQuestion {
  instruction: string;
  evaluation_criteria?: any;
}

/**
 * 各題型的特定介面 - 1.x.x 系列
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

/**
 * 2.x.x 系列題型介面
 */
export interface TestOrchestratorQuestion211 extends WritingTestOrchestratorQuestion {
  type: '2.1.1';
  prompt: string;
  min_words: number;
  max_words: number;
  sample_responses: string[];
}

export interface TestOrchestratorQuestion212 extends BaseTestOrchestratorQuestion {
  type: '2.1.2';
  original_text: string;
  instruction: string;
  standard_corrections: string[];
  error_types: string[];
}

export interface TestOrchestratorQuestion221 extends BaseTestOrchestratorQuestion {
  type: '2.2.1';
  sentence_a: string;
  sentence_b: string;
  instruction: string;
  standard_answers: string[];
  combining_method: string;
}

export interface TestOrchestratorQuestion222 extends BaseTestOrchestratorQuestion {
  type: '2.2.2';
  scrambled_words: string[];
  instruction: string;
  standard_answers: string[];
}

export interface TestOrchestratorQuestion231 extends WritingTestOrchestratorQuestion {
  type: '2.3.1';
  topic: string;
  min_sentences: number;
  max_sentences: number;
  sample_responses: string[];
}

export interface TestOrchestratorQuestion241 extends BaseTestOrchestratorQuestion {
  type: '2.4.1';
  scrambled_sentences: string[];
  instruction: string;
  correct_order: number[];
  topic_hint: string;
}

export interface TestOrchestratorQuestion242 extends WritingTestOrchestratorQuestion {
  type: '2.4.2';
  topic: string;
  prompt: string;
  min_words: number;
  max_words: number;
  required_elements: string[];
  sample_responses: string[];
}

export interface TestOrchestratorQuestion251 extends WritingTestOrchestratorQuestion {
  type: '2.5.1';
  context: string;
  question: string;
  min_words: number;
  max_words: number;
  key_points: string[];
  sample_responses: string[];
  evaluation_focus: string[];
}

export interface TestOrchestratorQuestion252 extends WritingTestOrchestratorQuestion {
  type: '2.5.2';
  scenario: string;
  recipient: string;
  purpose: string;
  required_content: string[];
  tone: string;
  min_words: number;
  max_words: number;
  sample_responses: string[];
}

export interface TestOrchestratorQuestion261 extends BaseTestOrchestratorQuestion {
  type: '2.6.1';
  original_sentence: string;
  instruction: string;
  transformation_type: string;
  standard_answers: string[];
  hints: string[];
}

export interface TestOrchestratorQuestion271 extends BaseTestOrchestratorQuestion {
  type: '2.7.1';
  source_text: string;
  instruction: string;
  reference_translations: string[];
  evaluation_focus: string[];
}

export interface TestOrchestratorQuestion272 extends BaseTestOrchestratorQuestion {
  type: '2.7.2';
  source_text: string;
  instruction: string;
  reference_translations: string[];
  evaluation_focus: string[];
}

export interface TestOrchestratorQuestion281 extends BaseTestOrchestratorQuestion {
  type: '2.8.1';
  source_text: string;
  instruction: string;
  reference_translations: string[];
  evaluation_focus: string[];
  difficulty_hint: string;
}

export interface TestOrchestratorQuestion282 extends BaseTestOrchestratorQuestion {
  type: '2.8.2';
  source_text: string;
  instruction: string;
  reference_translations: string[];
  evaluation_focus: string[];
  context: string;
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
  | TestOrchestratorQuestion153
  | TestOrchestratorQuestion211
  | TestOrchestratorQuestion212
  | TestOrchestratorQuestion221
  | TestOrchestratorQuestion222
  | TestOrchestratorQuestion231
  | TestOrchestratorQuestion241
  | TestOrchestratorQuestion242
  | TestOrchestratorQuestion251
  | TestOrchestratorQuestion252
  | TestOrchestratorQuestion261
  | TestOrchestratorQuestion271
  | TestOrchestratorQuestion272
  | TestOrchestratorQuestion281
  | TestOrchestratorQuestion282;

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

  // 1.x.x 系列格式化方法
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

  // 2.x.x 系列格式化方法
  private formatQuestionForClient211(cacheId: string, questionBody: GeneratorQuestionData211): TestOrchestratorQuestion211 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.1.1',
      explanation: '寫作題型，請根據提示進行創作。',
    };
  }

  private formatQuestionForClient212(cacheId: string, questionBody: GeneratorQuestionData212): TestOrchestratorQuestion212 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.1.2',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient221(cacheId: string, questionBody: GeneratorQuestionData221): TestOrchestratorQuestion221 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.2.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient222(cacheId: string, questionBody: GeneratorQuestionData222): TestOrchestratorQuestion222 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.2.2',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient231(cacheId: string, questionBody: GeneratorQuestionData231): TestOrchestratorQuestion231 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.3.1',
      explanation: '段落寫作題型，請根據主題和要求撰寫文章。',
    };
  }

  private formatQuestionForClient241(cacheId: string, questionBody: GeneratorQuestionData241): TestOrchestratorQuestion241 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.4.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient242(cacheId: string, questionBody: GeneratorQuestionData242): TestOrchestratorQuestion242 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.4.2',
      explanation: '短文寫作題型，請根據主題和要求撰寫短文。',
    };
  }

  private formatQuestionForClient251(cacheId: string, questionBody: GeneratorQuestionData251): TestOrchestratorQuestion251 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.5.1',
      explanation: '簡答題型，請根據問題進行回答。',
    };
  }

  private formatQuestionForClient252(cacheId: string, questionBody: GeneratorQuestionData252): TestOrchestratorQuestion252 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.5.2',
      explanation: '郵件/信函寫作題型，請根據情境撰寫。',
    };
  }

  private formatQuestionForClient261(cacheId: string, questionBody: GeneratorQuestionData261): TestOrchestratorQuestion261 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.6.1',
      explanation: questionBody.explanation_of_Question,
    };
  }

  private formatQuestionForClient271(cacheId: string, questionBody: GeneratorQuestionData271): TestOrchestratorQuestion271 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.7.1',
      explanation: '中翻英句子題型，請將中文翻譯成英文。',
    };
  }

  private formatQuestionForClient272(cacheId: string, questionBody: GeneratorQuestionData272): TestOrchestratorQuestion272 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.7.2',
      explanation: '中翻英短文題型，請將中文翻譯成英文。',
    };
  }

  private formatQuestionForClient281(cacheId: string, questionBody: GeneratorQuestionData281): TestOrchestratorQuestion281 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.8.1',
      explanation: '英翻中句子題型，請將英文翻譯成中文。',
    };
  }

  private formatQuestionForClient282(cacheId: string, questionBody: GeneratorQuestionData282): TestOrchestratorQuestion282 {
    return {
      ...questionBody,
      id: cacheId,
      type: '2.8.2',
      explanation: '英翻中短文題型，請將英文翻譯成中文。',
    };
  }

  async startSingleTypeTest(questionType: string): Promise<TestOrchestratorQuestion | null> {
    const supportedTypes = [
      '1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3',
      '2.1.1', '2.1.2', '2.2.1', '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.5.1', '2.5.2', '2.6.1',
      '2.7.1', '2.7.2', '2.8.1', '2.8.2'
    ];
    
    if (!supportedTypes.includes(questionType)) {
      console.warn(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
      return null;
    }

    try {
      console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 正在從快取獲取題型 ${questionType} 的題目`);
      
      // 首先嘗試從快取獲取
      const cachedEntry = await this.questionCacheService.getQuestionFromCache(questionType as any);
      
      if (cachedEntry && cachedEntry.UUID && cachedEntry.questionData) {
        // 根據題型選擇對應的格式化方法
        let questionForClient: TestOrchestratorQuestion;
        switch (questionType) {
          // 1.x.x 系列
          case '1.1.1':
            questionForClient = this.formatQuestionForClient111(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.1.2':
            questionForClient = this.formatQuestionForClient112(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.2.1':
            questionForClient = this.formatQuestionForClient121(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.2.2':
            questionForClient = this.formatQuestionForClient122(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.2.3':
            questionForClient = this.formatQuestionForClient123(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.3.1':
            questionForClient = this.formatQuestionForClient131(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.4.1':
            questionForClient = this.formatQuestionForClient141(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.5.1':
            questionForClient = this.formatQuestionForClient151(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.5.2':
            questionForClient = this.formatQuestionForClient152(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '1.5.3':
            questionForClient = this.formatQuestionForClient153(cachedEntry.UUID, cachedEntry.questionData);
            break;
          // 2.x.x 系列
          case '2.1.1':
            questionForClient = this.formatQuestionForClient211(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.1.2':
            questionForClient = this.formatQuestionForClient212(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.2.1':
            questionForClient = this.formatQuestionForClient221(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.2.2':
            questionForClient = this.formatQuestionForClient222(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.3.1':
            questionForClient = this.formatQuestionForClient231(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.4.1':
            questionForClient = this.formatQuestionForClient241(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.4.2':
            questionForClient = this.formatQuestionForClient242(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.5.1':
            questionForClient = this.formatQuestionForClient251(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.5.2':
            questionForClient = this.formatQuestionForClient252(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.6.1':
            questionForClient = this.formatQuestionForClient261(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.7.1':
            questionForClient = this.formatQuestionForClient271(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.7.2':
            questionForClient = this.formatQuestionForClient272(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.8.1':
            questionForClient = this.formatQuestionForClient281(cachedEntry.UUID, cachedEntry.questionData);
            break;
          case '2.8.2':
            questionForClient = this.formatQuestionForClient282(cachedEntry.UUID, cachedEntry.questionData);
            break;
          default:
            console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in cache switch: ${questionType}`);
            return null;
        }
        
        console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 成功獲取題目 ${questionForClient.id}`);
        return questionForClient;
      }

      // 如果快取中沒有，嘗試直接生成
      console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 快取中無可用題目，嘗試直接生成 (題型 ${questionType})`);
      const generatedQuestions = await this.generateQuestionDirectly(questionType);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        const firstQuestion = generatedQuestions[0];
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 根據題型格式化
        switch (questionType) {
          // 1.x.x 系列
          case '1.1.1':
            return this.formatQuestionForClient111(tempId, firstQuestion as any);
          case '1.1.2':
            return this.formatQuestionForClient112(tempId, firstQuestion as any);
          case '1.2.1':
            return this.formatQuestionForClient121(tempId, firstQuestion as any);
          case '1.2.2':
            return this.formatQuestionForClient122(tempId, firstQuestion as any);
          case '1.2.3':
            return this.formatQuestionForClient123(tempId, firstQuestion as any);
          case '1.3.1':
            return this.formatQuestionForClient131(tempId, firstQuestion as any);
          case '1.4.1':
            return this.formatQuestionForClient141(tempId, firstQuestion as any);
          case '1.5.1':
            return this.formatQuestionForClient151(tempId, firstQuestion as any);
          case '1.5.2':
            return this.formatQuestionForClient152(tempId, firstQuestion as any);
          case '1.5.3':
            return this.formatQuestionForClient153(tempId, firstQuestion as any);
          // 2.x.x 系列
          case '2.1.1':
            return this.formatQuestionForClient211(tempId, firstQuestion as any);
          case '2.1.2':
            return this.formatQuestionForClient212(tempId, firstQuestion as any);
          case '2.2.1':
            return this.formatQuestionForClient221(tempId, firstQuestion as any);
          case '2.2.2':
            return this.formatQuestionForClient222(tempId, firstQuestion as any);
          case '2.3.1':
            return this.formatQuestionForClient231(tempId, firstQuestion as any);
          case '2.4.1':
            return this.formatQuestionForClient241(tempId, firstQuestion as any);
          case '2.4.2':
            return this.formatQuestionForClient242(tempId, firstQuestion as any);
          case '2.5.1':
            return this.formatQuestionForClient251(tempId, firstQuestion as any);
          case '2.5.2':
            return this.formatQuestionForClient252(tempId, firstQuestion as any);
          case '2.6.1':
            return this.formatQuestionForClient261(tempId, firstQuestion as any);
          case '2.7.1':
            return this.formatQuestionForClient271(tempId, firstQuestion as any);
          case '2.7.2':
            return this.formatQuestionForClient272(tempId, firstQuestion as any);
          case '2.8.1':
            return this.formatQuestionForClient281(tempId, firstQuestion as any);
          case '2.8.2':
            return this.formatQuestionForClient282(tempId, firstQuestion as any);
          default:
            console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in generation switch: ${questionType}`);
            return null;
        }
      } else {
        console.error(`[DEBUG TestOrchestratorService_v2.ts] Failed to generate question for type: ${questionType}`);
        return null;
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
          // 1.x.x 系列
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
          // 2.x.x 系列
          case '2.1.1':
            return this.formatQuestionForClient211(questionId, data as GeneratorQuestionData211);
          case '2.1.2':
            return this.formatQuestionForClient212(questionId, data as GeneratorQuestionData212);
          case '2.2.1':
            return this.formatQuestionForClient221(questionId, data as GeneratorQuestionData221);
          case '2.2.2':
            return this.formatQuestionForClient222(questionId, data as GeneratorQuestionData222);
          case '2.3.1':
            return this.formatQuestionForClient231(questionId, data as GeneratorQuestionData231);
          case '2.4.1':
            return this.formatQuestionForClient241(questionId, data as GeneratorQuestionData241);
          case '2.4.2':
            return this.formatQuestionForClient242(questionId, data as GeneratorQuestionData242);
          case '2.5.1':
            return this.formatQuestionForClient251(questionId, data as GeneratorQuestionData251);
          case '2.5.2':
            return this.formatQuestionForClient252(questionId, data as GeneratorQuestionData252);
          case '2.6.1':
            return this.formatQuestionForClient261(questionId, data as GeneratorQuestionData261);
          case '2.7.1':
            return this.formatQuestionForClient271(questionId, data as GeneratorQuestionData271);
          case '2.7.2':
            return this.formatQuestionForClient272(questionId, data as GeneratorQuestionData272);
          case '2.8.1':
            return this.formatQuestionForClient281(questionId, data as GeneratorQuestionData281);
          case '2.8.2':
            return this.formatQuestionForClient282(questionId, data as GeneratorQuestionData282);
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

      if (originalQuestionClientData.type === '1.2.1' || originalQuestionClientData.type === '2.1.2') {
        // 改錯題，需要特殊處理
        const question = originalQuestionClientData as TestOrchestratorQuestion121 | TestOrchestratorQuestion212;
        correctAnswer = question.standard_corrections[0]; // 使用第一個標準答案作為主要答案
        // 檢查用戶答案是否與任何標準答案匹配
        isCorrect = question.standard_corrections.some(correction => 
          userAnswer.trim().toLowerCase() === correction.trim().toLowerCase()
        );
      } else if (originalQuestionClientData.type === '2.2.1' || originalQuestionClientData.type === '2.2.2' || originalQuestionClientData.type === '2.6.1') {
        // 多標準答案的題型
        const question = originalQuestionClientData as TestOrchestratorQuestion221 | TestOrchestratorQuestion222 | TestOrchestratorQuestion261;
        correctAnswer = question.standard_answers[0];
        isCorrect = question.standard_answers.some(answer => 
          userAnswer.trim().toLowerCase() === answer.trim().toLowerCase()
        );
      } else if (originalQuestionClientData.type === '2.4.1') {
        // 排序題
        const question = originalQuestionClientData as TestOrchestratorQuestion241;
        correctAnswer = question.correct_order;
        isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
      } else if (['2.1.1', '2.3.1', '2.4.2', '2.5.1', '2.5.2', '2.7.1', '2.7.2', '2.8.1', '2.8.2'].includes(originalQuestionClientData.type)) {
        // 寫作題和翻譯題，需要特殊評分
        correctAnswer = '寫作/翻譯題需要人工評分';
        isCorrect = false; // 預設為需要評分
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
    if ('source_text' in question) {
      return question.source_text;
    }
    if ('context' in question) {
      return question.context;
    }
    if ('prompt' in question) {
      return question.prompt;
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
    if ('topic' in question) {
      return (question as any).topic;
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