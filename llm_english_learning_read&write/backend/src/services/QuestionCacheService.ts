import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { QuestionGeneratorService } from './QuestionGeneratorService';
import { QuestionData, QuestionData111 } from './generators/QuestionGeneratorInterface';
import 'dotenv/config';

const CACHE_DIR_NAME = 'questionCache';
const CACHE_DIR_PATH = path.join(__dirname, '..', '..', CACHE_DIR_NAME); // 假設 services 在 src/services
const CACHE_FILE_PATH_111 = path.join(CACHE_DIR_PATH, '111Cache.json');

const MIN_QUESTIONS_111 = 4;
const TARGET_QUESTIONS_111 = 8; // 目標快取數量

// --- 重試機制常量 ---
const MAX_GENERATION_RETRIES = 3; // 首次嘗試後的最多重試次數
const BASE_GENERATION_DELAY_MS = 1000; // 基礎延遲 (1秒)
const JITTER_MS = 200; // 抖動範圍 (+/-)
// --- End Retry Constants ---

interface CacheEntry {
  UUID: string;
  cacheTimestamp: number;
  questionData: QuestionData111;
}

export class QuestionCacheService {
  private caches: Map<string, CacheEntry[]> = new Map();
  private isReplenishing: Map<string, boolean> = new Map();
  private static instance: QuestionCacheService;

  private constructor() {
    this.isReplenishing.set('1.1.1', false);
    // 初始化時不立即執行異步操作，提供一個單獨的 initialize 方法
  }

  public static getInstance(): QuestionCacheService {
    if (!QuestionCacheService.instance) {
      QuestionCacheService.instance = new QuestionCacheService();
    }
    return QuestionCacheService.instance;
  }

  /**
   * 初始化快取服務，包括創建目錄和從檔案載入快取。
   * 必須在服務首次使用前調用。
   */
  public async initialize(): Promise<void> {
    console.log('[DEBUG QuestionCacheService.ts] Initializing cache service...');
    try {
      // 1. 確保快取目錄存在
      await fs.mkdir(CACHE_DIR_PATH, { recursive: true });
      console.log(`[DEBUG QuestionCacheService.ts] Cache directory ensured at: ${CACHE_DIR_PATH}`);

      // 2. 嘗試從檔案載入題型 1.1.1 的快取
      let loadedQuestions: CacheEntry[] = [];
      try {
        const fileContent = await fs.readFile(CACHE_FILE_PATH_111, 'utf-8');
        loadedQuestions = JSON.parse(fileContent) as CacheEntry[];
        if (!Array.isArray(loadedQuestions)) { // 基本的類型檢查
            console.warn('[DEBUG QuestionCacheService.ts] Invalid cache file content (not an array), initializing as empty for 1.1.1.');
            loadedQuestions = [];
        }
        console.log(`[DEBUG QuestionCacheService.ts] Loaded ${loadedQuestions.length} questions for type 1.1.1 from ${CACHE_FILE_PATH_111}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.log(`[DEBUG QuestionCacheService.ts] Cache file ${CACHE_FILE_PATH_111} not found. Initializing empty cache for 1.1.1.`);
        } else {
          console.error(`[DEBUG QuestionCacheService.ts] Error reading cache file ${CACHE_FILE_PATH_111}:`, error);
        }
        loadedQuestions = []; // 無論何種讀取錯誤，都初始化為空陣列
      }
      this.caches.set('1.1.1', loadedQuestions);

      // 3. 檢查是否需要初次填充
      this._checkAndTriggerReplenishment('1.1.1'); // 非同步執行，不阻塞初始化

      console.log('[DEBUG QuestionCacheService.ts] Cache service initialized.');

    } catch (error) {
      console.error('[DEBUG QuestionCacheService.ts] Critical error during cache service initialization:', error);
      // 根據應用需求，這裡可能需要更嚴重的錯誤處理，例如阻止應用啟動
    }
  }

  // --- 後續將實現 getQuestionFromCache, _checkAndTriggerReplenishment, _triggerReplenishment, _persistCacheToFile ---

  // 佔位符方法，後續實現
  private async _checkAndTriggerReplenishment(questionType: string): Promise<void> {
    if (questionType === '1.1.1') {
        const currentCount = this.caches.get('1.1.1')?.length ?? 0;
        console.log(`[DEBUG QuestionCacheService.ts] Check for replenishment for ${questionType}: current ${currentCount}, min ${MIN_QUESTIONS_111}`);
        if (currentCount < MIN_QUESTIONS_111) {
            console.log(`[DEBUG QuestionCacheService.ts] Current count ${currentCount} is below min ${MIN_QUESTIONS_111} for ${questionType}. Triggering replenishment.`);
            this._triggerReplenishment(questionType); // 非同步執行
        }    
    }
  }

  // --- 背景補充任務 ---
  private async _triggerReplenishment(questionType: '1.1.1'): Promise<void> {
    if (this.isReplenishing.get(questionType)) {
      console.log(`[DEBUG QuestionCacheService.ts] Replenishment for ${questionType} is already in progress. Skipping.`);
      return;
    }

    const currentQuestions = this.caches.get(questionType) ?? [];
    const currentCount = currentQuestions.length;
    
    if (currentCount >= TARGET_QUESTIONS_111) {
      console.log(`[DEBUG QuestionCacheService.ts] Cache for ${questionType} is already at or above target (${currentCount}/${TARGET_QUESTIONS_111}). No replenishment needed.`);
      return;
    }

    console.log(`[DEBUG QuestionCacheService.ts] Starting replenishment for ${questionType}. Current: ${currentCount}, Target: ${TARGET_QUESTIONS_111}`);
    this.isReplenishing.set(questionType, true);

    let success = false; // 標記是否成功生成題目
    try {
      const needed = TARGET_QUESTIONS_111 - currentCount;
      if (needed <= 0) {
        console.log(`[DEBUG QuestionCacheService.ts] No questions needed for ${questionType}.`);
        success = true; // 不需要生成也算成功完成任務
        return; 
      }

      console.log(`[DEBUG QuestionCacheService.ts] Attempting to generate ${needed} new questions for ${questionType}.`);
      
      let newQuestionDataArray: QuestionData111[] | null = null;
      let lastError: Error | null = null;

      // --- 開始重試循環 ---
      for (let attempt = 0; attempt <= MAX_GENERATION_RETRIES; attempt++) {
        try {
          // 調用題目生成服務
          const result: QuestionData = await QuestionGeneratorService.generateQuestionByType(
            questionType,
            70, // 預設難度，需要確認是否應從某處獲取
            "No history available.", // 預設歷史，需要確認是否應從某處獲取
            needed // 請求需要的數量
          );
          
          // 處理 generateQuestionByType 的不同返回類型
          if (result === null) {
             newQuestionDataArray = null; // 生成失敗或返回 null
          } else if (Array.isArray(result)) {
              // 確保數組元素符合 QuestionData111 結構 (如果需要更嚴格的檢查)
              // 這裡我們假設 QuestionGeneratorService 返回的數組元素都是 QuestionData111
              // 如果 QuestionGeneratorService 可能返回混合類型的數組，需要更複雜的過濾/轉換邏輯
              newQuestionDataArray = result.filter(q => this._isQuestionData111(q)) as QuestionData111[]; // 過濾確保類型正確
          } else if (this._isQuestionData111(result)) {
               // 檢查是否為 QuestionData111 類型
              newQuestionDataArray = [result as QuestionData111]; // 包裝成數組
          } else {
               console.error(`[DEBUG QuestionCacheService.ts] Unexpected result type or structure from generator for type ${questionType}:`, result);
               newQuestionDataArray = null;
          }

          if (newQuestionDataArray && newQuestionDataArray.length > 0) {
             console.log(`[DEBUG QuestionCacheService.ts] Successfully generated ${newQuestionDataArray.length} questions on attempt ${attempt}.`);
             success = true; // 標記成功
             break; // 成功，跳出重試循環
          } else {
             // 如果返回 null 或空陣列，也視為一種可重試的失敗
             throw new Error(`Generator returned null or empty array on attempt ${attempt}`);
          }

        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.warn(`[DEBUG QuestionCacheService.ts] Generation attempt ${attempt} failed for ${questionType}:`, lastError.message);

          if (attempt >= MAX_GENERATION_RETRIES) {
            console.error(`[DEBUG QuestionCacheService.ts] Max retries (${MAX_GENERATION_RETRIES}) reached for ${questionType}. Giving up on this replenishment cycle.`);
            // 不再重試，讓外層的 catch 處理最後的錯誤
            throw lastError; // 將最後一次的錯誤拋出
          } else {
            // 計算延遲時間 (指數退避 + 抖動)
            const delay = BASE_GENERATION_DELAY_MS * (2 ** attempt);
            const jitter = Math.floor(Math.random() * (JITTER_MS * 2 + 1)) - JITTER_MS; // +/- JITTER_MS
            const waitTime = Math.max(0, delay + jitter); // 確保延遲不為負
            console.log(`[DEBUG QuestionCacheService.ts] Waiting ${waitTime}ms before retry attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      } // --- 結束重試循環 ---

      // 如果重試成功 (success 為 true)，處理生成的題目
      if (success && Array.isArray(newQuestionDataArray)) {
        // (原有的處理生成題目的邏輯)
        console.log(`[DEBUG QuestionCacheService.ts] Processing ${newQuestionDataArray.length} generated questions for ${questionType}.`);
        for (const questionData of newQuestionDataArray) {
          if (this.caches.get(questionType)!.length >= TARGET_QUESTIONS_111) {
            console.log(`[DEBUG QuestionCacheService.ts] Target for ${questionType} reached during batch add. Stopping.`);
            break;
          }
          const cachedQuestion: CacheEntry = {
            UUID: uuidv4(),
            questionData: questionData as QuestionData111,
            cacheTimestamp: Math.floor(Date.now() / 1000),
          };
          this.caches.get(questionType)!.push(cachedQuestion);
          console.log(`[DEBUG QuestionCacheService.ts] Added new question ${cachedQuestion.UUID} to cache for ${questionType}. New count: ${this.caches.get(questionType)!.length}`);
          this._persistCacheToFile(questionType); // 每次添加都持久化
        }
      } else if (!success) {
         // 如果 success 仍然是 false，表示所有重試都失敗了
         // lastError 應該已經在外層的 throw 中被拋出，這裡只是為了邏輯完整性加個日誌
         console.error(`[DEBUG QuestionCacheService.ts] Replenishment failed for ${questionType} after all retries.`);
         // 注意：由於 lastError 已被 re-throw，這裡的代碼理論上不會執行，錯誤會被外層 catch 捕獲
      }

    } catch (error) {
      // 捕獲重試循環最終拋出的錯誤，或者不需要生成題目時的檢查錯誤
      console.error(`[DEBUG QuestionCacheService.ts] Error during replenishment cycle for ${questionType}:`, error);
    } finally {
      this.isReplenishing.set(questionType, false);
      console.log(`[DEBUG QuestionCacheService.ts] Replenishment process finished for ${questionType}. New count: ${this.caches.get(questionType)?.length ?? 0}`);
      // 再次檢查是否仍低於最小水位 (無論成功或失敗，都檢查一次)
      this._checkAndTriggerReplenishment(questionType);
    }
  }
 
  // --- 持久化快取到檔案 ---
  private async _persistCacheToFile(questionType: '1.1.1'): Promise<void> {
    const questionsToSave = this.caches.get(questionType) ?? [];
    console.log(`[DEBUG QuestionCacheService.ts] Persisting ${questionsToSave.length} questions for type ${questionType} to ${CACHE_FILE_PATH_111}`);
    try {
      const jsonString = JSON.stringify(questionsToSave, null, 2); // 格式化輸出
      await fs.writeFile(CACHE_FILE_PATH_111, jsonString, 'utf-8');
      console.log(`[DEBUG QuestionCacheService.ts] Successfully persisted cache for ${questionType}.`);
    } catch (error) {
      console.error(`[DEBUG QuestionCacheService.ts] Error persisting cache for ${questionType}:`, error);
      // 持久化失敗不應阻塞主流程，但需要記錄錯誤
    }
  }

  // --- 從快取提供題目 ---
  public async getQuestionFromCache(questionType: '1.1.1'): Promise<QuestionData111 | null> {
    const cachedQuestions = this.caches.get(questionType);

    if (cachedQuestions && cachedQuestions.length > 0) {
      // 從陣列開頭取出題目 (FIFO)
      const questionToReturn = cachedQuestions.shift(); 
      
      if (questionToReturn) {
        console.log(`[DEBUG QuestionCacheService.ts] Providing question ${questionToReturn.UUID} from cache for ${questionType}. Remaining: ${cachedQuestions.length}`);
        // 快取已更改，立即觸發持久化 (非同步)
        this._persistCacheToFile(questionType);
        // 檢查是否需要補充 (非同步)
        this._checkAndTriggerReplenishment(questionType);
        return questionToReturn.questionData;
      } else {
        // 理論上如果 length > 0，shift 不應返回 undefined，但做個防禦性處理
        console.warn(`[DEBUG QuestionCacheService.ts] Cache for ${questionType} reported length > 0 but shift() returned undefined.`);
        return null;
      }
    } else {
      console.log(`[DEBUG QuestionCacheService.ts] Cache empty for ${questionType}. Returning null and ensuring replenishment check.`);
      // 即使快取是空的，也要確保觸發一次檢查，以防上次補充失敗或尚未開始
      this._checkAndTriggerReplenishment(questionType);
      return null;
    }
  }

  // 輔助函數，用於類型守衛 (Type Guard)
  private _isQuestionData111(data: any): data is QuestionData111 {
    // 根據 QuestionData111 的實際結構添加更可靠的檢查
    return data && typeof data === 'object' &&
           typeof data.passage === 'string' &&
           typeof data.targetWord === 'string' &&
           typeof data.question === 'string' &&
           Array.isArray(data.options) && // 檢查 options 是否為數組
           typeof data.standard_answer === 'string' &&
           typeof data.explanation_of_Question === 'string'; // 檢查 explanation_of_Question
  }

  // 批量添加問題到快取
  public async addQuestions(type: string, entries: CacheEntry[]): Promise<void> {
      const cache = this.caches.get(type) ?? [];
      cache.push(...entries);
      await this._persistCacheToFile(type as '1.1.1');
      console.log(`[DEBUG QuestionCacheService.ts] Persisted ${entries.length} new entries for cache type ${type}. New count: ${cache.length}`);
  }
}

// 導出單例實例
export default QuestionCacheService.getInstance(); 