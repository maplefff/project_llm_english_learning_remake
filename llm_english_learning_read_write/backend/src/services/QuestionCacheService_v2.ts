import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { QuestionGeneratorService } from './QuestionGeneratorService';
import RateLimiterService from './RateLimiterService';
import { PRIORITY_LEVELS } from '../interfaces/RateLimiter';
import { 
  QuestionData, 
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
  QuestionData282
} from './generators/QuestionGeneratorInterface';
import 'dotenv/config';

const CACHE_DIR_NAME = 'questionCache';
const CACHE_DIR_PATH = path.join(__dirname, '..', '..', CACHE_DIR_NAME);

// 題型配置 - 添加優先權設定
const QUESTION_TYPE_CONFIG = {
  '1.1.1': {
    filePath: path.join(CACHE_DIR_PATH, '111Cache.json'),
    minQuestions: 4,
    targetQuestions: 8,
    priority: PRIORITY_LEVELS.MEDIUM, // 基礎類型，中等優先權
  },
  '1.1.2': {
    filePath: path.join(CACHE_DIR_PATH, '112Cache.json'),
    minQuestions: 4,
    targetQuestions: 8,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.2.1': {
    filePath: path.join(CACHE_DIR_PATH, '121Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.2.2': {
    filePath: path.join(CACHE_DIR_PATH, '122Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.2.3': {
    filePath: path.join(CACHE_DIR_PATH, '123Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.3.1': {
    filePath: path.join(CACHE_DIR_PATH, '131Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.4.1': {
    filePath: path.join(CACHE_DIR_PATH, '141Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.5.1': {
    filePath: path.join(CACHE_DIR_PATH, '151Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.5.2': {
    filePath: path.join(CACHE_DIR_PATH, '152Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '1.5.3': {
    filePath: path.join(CACHE_DIR_PATH, '153Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.MEDIUM,
  },
  '2.1.1': {
    filePath: path.join(CACHE_DIR_PATH, '211Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW, // 寫作類型，低優先權（初始化時）
  },
  '2.1.2': {
    filePath: path.join(CACHE_DIR_PATH, '212Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.2.1': {
    filePath: path.join(CACHE_DIR_PATH, '221Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.2.2': {
    filePath: path.join(CACHE_DIR_PATH, '222Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.3.1': {
    filePath: path.join(CACHE_DIR_PATH, '231Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.4.1': {
    filePath: path.join(CACHE_DIR_PATH, '241Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.4.2': {
    filePath: path.join(CACHE_DIR_PATH, '242Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.5.1': {
    filePath: path.join(CACHE_DIR_PATH, '251Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.5.2': {
    filePath: path.join(CACHE_DIR_PATH, '252Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.6.1': {
    filePath: path.join(CACHE_DIR_PATH, '261Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.7.1': {
    filePath: path.join(CACHE_DIR_PATH, '271Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.7.2': {
    filePath: path.join(CACHE_DIR_PATH, '272Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.8.1': {
    filePath: path.join(CACHE_DIR_PATH, '281Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
  '2.8.2': {
    filePath: path.join(CACHE_DIR_PATH, '282Cache.json'),
    minQuestions: 3,
    targetQuestions: 5,
    priority: PRIORITY_LEVELS.LOW,
  },
} as const;

type SupportedQuestionType = keyof typeof QUESTION_TYPE_CONFIG;

// 重試機制常量
const MAX_GENERATION_RETRIES = 3;
const BASE_GENERATION_DELAY_MS = 1000;
const JITTER_MS = 200;

// 統一的快取條目介面
interface CacheEntry<T = any> {
  UUID: string;
  cacheTimestamp: number;
  questionData: T;
}

// 類型保護函數
class TypeGuards {
  static isQuestionData111(data: any): data is QuestionData111 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.targetWord === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData112(data: any): data is QuestionData112 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData121(data: any): data is QuestionData121 {
    return data && typeof data === 'object' &&
           typeof data.original_sentence === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.standard_corrections) &&
           Array.isArray(data.error_types) &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData122(data: any): data is QuestionData122 {
    return data && typeof data === 'object' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData123(data: any): data is QuestionData123 {
    return data && typeof data === 'object' &&
           typeof data.sentence_context === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData131(data: any): data is QuestionData131 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData141(data: any): data is QuestionData141 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData151(data: any): data is QuestionData151 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData152(data: any): data is QuestionData152 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData153(data: any): data is QuestionData153 {
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) &&
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  // 新增題型的類型檢查函數
  static isQuestionData211(data: any): data is QuestionData211 {
    return data && typeof data === 'object' &&
           typeof data.prompt === 'string' &&
           typeof data.instruction === 'string' &&
           typeof data.min_words === 'number' &&
           typeof data.max_words === 'number' &&
           data.evaluation_criteria &&
           Array.isArray(data.sample_responses);
  }

  static isQuestionData212(data: any): data is QuestionData212 {
    return data && typeof data === 'object' &&
           typeof data.original_text === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.standard_corrections) &&
           Array.isArray(data.error_types) &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData221(data: any): data is QuestionData221 {
    return data && typeof data === 'object' &&
           typeof data.sentence_a === 'string' &&
           typeof data.sentence_b === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.standard_answers) &&
           typeof data.combining_method === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData222(data: any): data is QuestionData222 {
    return data && typeof data === 'object' &&
           Array.isArray(data.scrambled_words) &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.standard_answers) &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData231(data: any): data is QuestionData231 {
    return data && typeof data === 'object' &&
           typeof data.topic === 'string' &&
           typeof data.instruction === 'string' &&
           typeof data.min_sentences === 'number' &&
           typeof data.max_sentences === 'number' &&
           data.evaluation_criteria &&
           Array.isArray(data.sample_responses);
  }

  static isQuestionData241(data: any): data is QuestionData241 {
    return data && typeof data === 'object' &&
           Array.isArray(data.scrambled_sentences) &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.correct_order) &&
           typeof data.topic_hint === 'string' &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData242(data: any): data is QuestionData242 {
    return data && typeof data === 'object' &&
           typeof data.topic === 'string' &&
           typeof data.prompt === 'string' &&
           typeof data.instruction === 'string' &&
           typeof data.min_words === 'number' &&
           typeof data.max_words === 'number' &&
           Array.isArray(data.required_elements) &&
           data.evaluation_criteria &&
           Array.isArray(data.sample_responses);
  }

  static isQuestionData251(data: any): data is QuestionData251 {
    return data && typeof data === 'object' &&
           typeof data.context === 'string' &&
           typeof data.question === 'string' &&
           typeof data.instruction === 'string' &&
           typeof data.min_words === 'number' &&
           typeof data.max_words === 'number' &&
           Array.isArray(data.key_points) &&
           Array.isArray(data.sample_responses) &&
           Array.isArray(data.evaluation_focus);
  }

  static isQuestionData252(data: any): data is QuestionData252 {
    return data && typeof data === 'object' &&
           typeof data.scenario === 'string' &&
           typeof data.recipient === 'string' &&
           typeof data.purpose === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.required_content) &&
           typeof data.tone === 'string' &&
           typeof data.min_words === 'number' &&
           typeof data.max_words === 'number' &&
           data.evaluation_criteria &&
           Array.isArray(data.sample_responses);
  }

  static isQuestionData261(data: any): data is QuestionData261 {
    return data && typeof data === 'object' &&
           typeof data.original_sentence === 'string' &&
           typeof data.instruction === 'string' &&
           typeof data.transformation_type === 'string' &&
           Array.isArray(data.standard_answers) &&
           Array.isArray(data.hints) &&
           typeof data.explanation_of_Question === 'string';
  }

  static isQuestionData271(data: any): data is QuestionData271 {
    return data && typeof data === 'object' &&
           typeof data.source_text === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.reference_translations) &&
           Array.isArray(data.evaluation_focus);
  }

  static isQuestionData272(data: any): data is QuestionData272 {
    return data && typeof data === 'object' &&
           typeof data.source_text === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.reference_translations) &&
           Array.isArray(data.evaluation_focus);
  }

  static isQuestionData281(data: any): data is QuestionData281 {
    return data && typeof data === 'object' &&
           typeof data.source_text === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.reference_translations) &&
           Array.isArray(data.evaluation_focus) &&
           typeof data.difficulty_hint === 'string';
  }

  static isQuestionData282(data: any): data is QuestionData282 {
    return data && typeof data === 'object' &&
           typeof data.source_text === 'string' &&
           typeof data.instruction === 'string' &&
           Array.isArray(data.reference_translations) &&
           Array.isArray(data.evaluation_focus) &&
           typeof data.context === 'string';
  }

  static validateQuestionData(questionType: SupportedQuestionType, data: any): boolean {
    switch (questionType) {
      case '1.1.1': return TypeGuards.isQuestionData111(data);
      case '1.1.2': return TypeGuards.isQuestionData112(data);
      case '1.2.1': return TypeGuards.isQuestionData121(data);
      case '1.2.2': return TypeGuards.isQuestionData122(data);
      case '1.2.3': return TypeGuards.isQuestionData123(data);
      case '1.3.1': return TypeGuards.isQuestionData131(data);
      case '1.4.1': return TypeGuards.isQuestionData141(data);
      case '1.5.1': return TypeGuards.isQuestionData151(data);
      case '1.5.2': return TypeGuards.isQuestionData152(data);
      case '1.5.3': return TypeGuards.isQuestionData153(data);
      case '2.1.1': return TypeGuards.isQuestionData211(data);
      case '2.1.2': return TypeGuards.isQuestionData212(data);
      case '2.2.1': return TypeGuards.isQuestionData221(data);
      case '2.2.2': return TypeGuards.isQuestionData222(data);
      case '2.3.1': return TypeGuards.isQuestionData231(data);
      case '2.4.1': return TypeGuards.isQuestionData241(data);
      case '2.4.2': return TypeGuards.isQuestionData242(data);
      case '2.5.1': return TypeGuards.isQuestionData251(data);
      case '2.5.2': return TypeGuards.isQuestionData252(data);
      case '2.6.1': return TypeGuards.isQuestionData261(data);
      case '2.7.1': return TypeGuards.isQuestionData271(data);
      case '2.7.2': return TypeGuards.isQuestionData272(data);
      case '2.8.1': return TypeGuards.isQuestionData281(data);
      case '2.8.2': return TypeGuards.isQuestionData282(data);
      default: return false;
    }
  }
}

export class QuestionCacheService {
  private caches: Map<string, CacheEntry[]> = new Map();
  private isReplenishing: Map<string, boolean> = new Map();
  private static instance: QuestionCacheService;

  private constructor() {
    // 初始化所有支援的題型
    Object.keys(QUESTION_TYPE_CONFIG).forEach(questionType => {
      this.isReplenishing.set(questionType, false);
    });
  }

  public static getInstance(): QuestionCacheService {
    if (!QuestionCacheService.instance) {
      QuestionCacheService.instance = new QuestionCacheService();
    }
    return QuestionCacheService.instance;
  }

  /**
   * 初始化快取服務
   * 使用分批初始化策略，避免同時觸發過多API請求
   */
  public async initialize(): Promise<void> {
    console.log('[DEBUG QuestionCacheService_v2.ts] Initializing cache service with rate limiting...');
    try {
      // 1. 確保快取目錄存在
      await fs.mkdir(CACHE_DIR_PATH, { recursive: true });
      console.log(`[DEBUG QuestionCacheService_v2.ts] Cache directory ensured at: ${CACHE_DIR_PATH}`);

      // 2. 檢查速率限制狀態
      const rateLimitStatus = RateLimiterService.getStatus();
      console.log(`[DEBUG QuestionCacheService_v2.ts] Rate limit status - Queue: ${rateLimitStatus.queueLength}, Requests in window: ${rateLimitStatus.requestsInCurrentWindow}`);

      // 3. 載入所有題型的快取（不觸發API請求）
      for (const [questionType, config] of Object.entries(QUESTION_TYPE_CONFIG)) {
        await this.loadCacheFromFile(questionType as SupportedQuestionType, config.filePath);
      }

      // 4. 使用智能初始化策略
      await this.intelligentInitialization();

      console.log('[DEBUG QuestionCacheService_v2.ts] Cache service initialized with rate limiting.');
    } catch (error) {
      console.error('[DEBUG QuestionCacheService_v2.ts] Critical error during cache service initialization:', error);
    }
  }

  /**
   * 智能初始化策略
   * 根據速率限制狀態決定初始化方式
   */
  private async intelligentInitialization(): Promise<void> {
    const questionTypes = Object.keys(QUESTION_TYPE_CONFIG) as SupportedQuestionType[];
    const rateLimitStatus = RateLimiterService.getStatus();
    
    // 計算需要補充的題型
    const needsReplenishment = questionTypes.filter(questionType => {
      const config = QUESTION_TYPE_CONFIG[questionType];
      const currentCount = this.caches.get(questionType)?.length ?? 0;
      return currentCount < config.minQuestions;
    });

    console.log(`[DEBUG QuestionCacheService_v2.ts] Found ${needsReplenishment.length} question types needing replenishment`);

    if (needsReplenishment.length === 0) {
      console.log('[DEBUG QuestionCacheService_v2.ts] All question types have sufficient cache. No initialization needed.');
      return;
    }

    // 根據隊列長度決定策略
    if (rateLimitStatus.queueLength > 20) {
      console.log('[DEBUG QuestionCacheService_v2.ts] Rate limit queue is busy. Using lazy initialization.');
      // 延遲初始化：只處理最重要的幾個類型
      await this.lazyInitialization(needsReplenishment.slice(0, 5));
    } else {
      console.log('[DEBUG QuestionCacheService_v2.ts] Rate limit queue is manageable. Using batch initialization.');
      // 分批初始化
      await this.batchInitialization(needsReplenishment);
    }
  }

  /**
   * 延遲初始化：只處理優先類型
   */
  private async lazyInitialization(priorityTypes: SupportedQuestionType[]): Promise<void> {
    console.log(`[DEBUG QuestionCacheService_v2.ts] Starting lazy initialization for ${priorityTypes.length} priority types`);
    
    for (const questionType of priorityTypes) {
      // 使用高優先權進行初始化
      this.scheduleReplenishment(questionType, PRIORITY_LEVELS.HIGH, 'lazy_init');
      
      // 短暫延遲避免瞬間大量請求
      await this.sleep(500);
    }
  }

  /**
   * 分批初始化：分組處理所有類型
   */
  private async batchInitialization(needsReplenishment: SupportedQuestionType[]): Promise<void> {
    const batchSize = 5; // 每批處理5個類型
    const batchDelay = 2000; // 批次間延遲2秒
    
    console.log(`[DEBUG QuestionCacheService_v2.ts] Starting batch initialization - ${needsReplenishment.length} types in batches of ${batchSize}`);
    
    for (let i = 0; i < needsReplenishment.length; i += batchSize) {
      const batch = needsReplenishment.slice(i, i + batchSize);
      console.log(`[DEBUG QuestionCacheService_v2.ts] Processing batch ${Math.floor(i / batchSize) + 1}: ${batch.join(', ')}`);
      
      // 處理當前批次
      for (const questionType of batch) {
        const config = QUESTION_TYPE_CONFIG[questionType];
        this.scheduleReplenishment(questionType, config.priority, 'batch_init');
      }
      
      // 批次間延遲（除了最後一批）
      if (i + batchSize < needsReplenishment.length) {
        console.log(`[DEBUG QuestionCacheService_v2.ts] Waiting ${batchDelay}ms before next batch...`);
        await this.sleep(batchDelay);
      }
    }
  }

  /**
   * 調度補充任務（非阻塞）
   */
  private scheduleReplenishment(questionType: SupportedQuestionType, priority: number, context: string): void {
    console.log(`[DEBUG QuestionCacheService_v2.ts] Scheduling replenishment for ${questionType} with priority ${priority}, context: ${context}`);
    
    // 非阻塞調度
    setTimeout(() => {
      this.triggerReplenishmentWithPriority(questionType, priority, context);
    }, 0);
  }

  /**
   * 檢查並觸發補充（更新版本，支援優先權）
   */
  private async checkAndTriggerReplenishment(questionType: SupportedQuestionType, priority?: number, context?: string): Promise<void> {
    const config = QUESTION_TYPE_CONFIG[questionType];
    const currentCount = this.caches.get(questionType)?.length ?? 0;
    
    console.log(`[DEBUG QuestionCacheService_v2.ts] Check replenishment for ${questionType}: current ${currentCount}, min ${config.minQuestions}`);
    
    if (currentCount < config.minQuestions) {
      const usePriority = priority ?? config.priority;
      const useContext = context ?? 'auto_check';
      console.log(`[DEBUG QuestionCacheService_v2.ts] Triggering replenishment for ${questionType} with priority ${usePriority}`);
      this.triggerReplenishmentWithPriority(questionType, usePriority, useContext);
    }
  }

  /**
   * 觸發題目補充（支援優先權版本）
   */
  private async triggerReplenishmentWithPriority(questionType: SupportedQuestionType, priority: number, context: string): Promise<void> {
    if (this.isReplenishing.get(questionType)) {
      console.log(`[DEBUG QuestionCacheService_v2.ts] Replenishment for ${questionType} already in progress. Skipping.`);
      return;
    }

    const config = QUESTION_TYPE_CONFIG[questionType];
    const currentQuestions = this.caches.get(questionType) ?? [];
    const currentCount = currentQuestions.length;
    
    if (currentCount >= config.targetQuestions) {
      console.log(`[DEBUG QuestionCacheService_v2.ts] Cache for ${questionType} already at target (${currentCount}/${config.targetQuestions}). No replenishment needed.`);
      return;
    }

    console.log(`[DEBUG QuestionCacheService_v2.ts] Starting replenishment for ${questionType}. Current: ${currentCount}, Target: ${config.targetQuestions}, Priority: ${priority}, Context: ${context}`);
    this.isReplenishing.set(questionType, true);

    try {
      const needed = config.targetQuestions - currentCount;
      console.log(`[DEBUG QuestionCacheService_v2.ts] Attempting to generate ${needed} new questions for ${questionType}`);

      let newQuestionDataArray: any[] | null = null;
      let lastError: Error | null = null;

      // 重試循環（使用速率限制機制）
      for (let attempt = 0; attempt <= MAX_GENERATION_RETRIES; attempt++) {
        try {
          // 使用QuestionGeneratorService，它現在內部會通過速率限制器
          const result: QuestionData = await QuestionGeneratorService.generateQuestionByType(
            questionType,
            70, // 預設難度
            "No history available.", // 預設歷史
            needed
          );

          if (result === null) {
            newQuestionDataArray = null;
          } else if (Array.isArray(result)) {
            newQuestionDataArray = result.filter(q => TypeGuards.validateQuestionData(questionType, q));
          } else if (TypeGuards.validateQuestionData(questionType, result)) {
            newQuestionDataArray = [result];
          } else {
            console.error(`[DEBUG QuestionCacheService_v2.ts] Unexpected result type for ${questionType}:`, result);
            newQuestionDataArray = null;
          }

          if (newQuestionDataArray && newQuestionDataArray.length > 0) {
            console.log(`[DEBUG QuestionCacheService_v2.ts] Successfully generated ${newQuestionDataArray.length} questions on attempt ${attempt} for ${questionType}`);
            break;
          } else {
            throw new Error(`Generator returned null or empty array on attempt ${attempt}`);
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.warn(`[DEBUG QuestionCacheService_v2.ts] Generation attempt ${attempt} failed for ${questionType}:`, lastError.message);

          // 檢查是否為速率限制錯誤
          if (lastError.message.includes('429') || lastError.message.includes('Too Many Requests') || lastError.message.includes('排隊已滿')) {
            console.log(`[DEBUG QuestionCacheService_v2.ts] Rate limit detected for ${questionType}. Will be retried by rate limiter.`);
            break; // 讓速率限制器處理重試
          }

          if (attempt >= MAX_GENERATION_RETRIES) {
            console.error(`[DEBUG QuestionCacheService_v2.ts] Max retries reached for ${questionType}. Giving up.`);
            throw lastError;
          } else {
            const delay = BASE_GENERATION_DELAY_MS * (2 ** attempt);
            const jitter = Math.floor(Math.random() * (JITTER_MS * 2 + 1)) - JITTER_MS;
            const waitTime = Math.max(0, delay + jitter);
            console.log(`[DEBUG QuestionCacheService_v2.ts] Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }

      // 處理生成的題目
      if (newQuestionDataArray && Array.isArray(newQuestionDataArray)) {
        console.log(`[DEBUG QuestionCacheService_v2.ts] Processing ${newQuestionDataArray.length} generated questions for ${questionType}`);
        
        for (const questionData of newQuestionDataArray) {
          if (this.caches.get(questionType)!.length >= config.targetQuestions) {
            console.log(`[DEBUG QuestionCacheService_v2.ts] Target reached for ${questionType} during batch add. Stopping.`);
            break;
          }

          const cachedQuestion: CacheEntry = {
            UUID: uuidv4(),
            questionData: questionData,
            cacheTimestamp: Math.floor(Date.now() / 1000),
          };

          this.caches.get(questionType)!.push(cachedQuestion);
          console.log(`[DEBUG QuestionCacheService_v2.ts] Added question ${cachedQuestion.UUID} to cache for ${questionType}. New count: ${this.caches.get(questionType)!.length}`);
        }
        
        await this.persistCacheToFile(questionType);
      }
    } catch (error) {
      console.error(`[DEBUG QuestionCacheService_v2.ts] Error during replenishment for ${questionType}:`, error);
    } finally {
      this.isReplenishing.set(questionType, false);
      console.log(`[DEBUG QuestionCacheService_v2.ts] Replenishment finished for ${questionType}. Final count: ${this.caches.get(questionType)?.length ?? 0}`);
      
      // 檢查是否需要進一步補充（使用較低優先權）
      setTimeout(() => {
        this.checkAndTriggerReplenishment(questionType, PRIORITY_LEVELS.LOW, 'followup_check');
      }, 30000); // 30秒後檢查
    }
  }

  /**
   * 睡眠工具函數
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 觸發題目補充（保持向後兼容）
   */
  private async triggerReplenishment(questionType: SupportedQuestionType): Promise<void> {
    const config = QUESTION_TYPE_CONFIG[questionType];
    return this.triggerReplenishmentWithPriority(questionType, config.priority, 'legacy_trigger');
  }

  /**
   * 從檔案載入快取
   */
  private async loadCacheFromFile(questionType: SupportedQuestionType, filePath: string): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const loadedQuestions = JSON.parse(fileContent) as CacheEntry[];
      
      if (!Array.isArray(loadedQuestions)) {
        console.warn(`[DEBUG QuestionCacheService_v2.ts] Invalid cache file content for ${questionType}, initializing as empty.`);
        this.caches.set(questionType, []);
        return;
      }

      this.caches.set(questionType, loadedQuestions);
      console.log(`[DEBUG QuestionCacheService_v2.ts] Loaded ${loadedQuestions.length} questions for type ${questionType}`);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`[DEBUG QuestionCacheService_v2.ts] Cache file not found for ${questionType}. Initializing empty cache.`);
      } else {
        console.error(`[DEBUG QuestionCacheService_v2.ts] Error reading cache file for ${questionType}:`, error);
      }
      this.caches.set(questionType, []);
    }
  }

  /**
   * 持久化快取到檔案
   */
  private async persistCacheToFile(questionType: SupportedQuestionType): Promise<void> {
    const config = QUESTION_TYPE_CONFIG[questionType];
    const questionsToSave = this.caches.get(questionType) ?? [];
    
    console.log(`[DEBUG QuestionCacheService_v2.ts] Persisting ${questionsToSave.length} questions for ${questionType}`);
    
    try {
      const jsonString = JSON.stringify(questionsToSave, null, 2);
      await fs.writeFile(config.filePath, jsonString, 'utf-8');
      console.log(`[DEBUG QuestionCacheService_v2.ts] Successfully persisted cache for ${questionType}`);
    } catch (error) {
      console.error(`[DEBUG QuestionCacheService_v2.ts] Error persisting cache for ${questionType}:`, error);
    }
  }

  /**
   * 從快取獲取題目
   */
  public async getQuestionFromCache(questionType: SupportedQuestionType): Promise<CacheEntry | null> {
    const cachedQuestions = this.caches.get(questionType);

    if (cachedQuestions && cachedQuestions.length > 0) {
      const questionToReturn = cachedQuestions.shift();
      
      if (questionToReturn) {
        console.log(`[DEBUG QuestionCacheService_v2.ts] Providing question ${questionToReturn.UUID} from cache for ${questionType}. Remaining: ${cachedQuestions.length}`);
        
        // 持久化更新後的快取
        await this.persistCacheToFile(questionType);
        
        // 檢查是否需要補充
        this.checkAndTriggerReplenishment(questionType);
        
        return questionToReturn;
      }
    }

    console.log(`[DEBUG QuestionCacheService_v2.ts] Cache empty for ${questionType}. Triggering replenishment check.`);
    this.checkAndTriggerReplenishment(questionType);
    return null;
  }

  /**
   * 獲取快取統計
   */
  public getCacheStats(): Record<string, { count: number; target: number; isReplenishing: boolean }> {
    const stats: Record<string, { count: number; target: number; isReplenishing: boolean }> = {};
    
    for (const [questionType, config] of Object.entries(QUESTION_TYPE_CONFIG)) {
      stats[questionType] = {
        count: this.caches.get(questionType)?.length ?? 0,
        target: config.targetQuestions,
        isReplenishing: this.isReplenishing.get(questionType) ?? false,
      };
    }
    
    return stats;
  }
}

// 導出單例實例
export default QuestionCacheService.getInstance(); 