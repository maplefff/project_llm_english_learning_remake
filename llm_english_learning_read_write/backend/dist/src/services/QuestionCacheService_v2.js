"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionCacheService = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const QuestionGeneratorService_1 = require("./QuestionGeneratorService");
require("dotenv/config");
const CACHE_DIR_NAME = 'questionCache';
const CACHE_DIR_PATH = path.join(__dirname, '..', '..', CACHE_DIR_NAME);
// 題型配置
const QUESTION_TYPE_CONFIG = {
    '1.1.1': {
        filePath: path.join(CACHE_DIR_PATH, '111Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.1.2': {
        filePath: path.join(CACHE_DIR_PATH, '112Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.2.1': {
        filePath: path.join(CACHE_DIR_PATH, '121Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.2.2': {
        filePath: path.join(CACHE_DIR_PATH, '122Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.2.3': {
        filePath: path.join(CACHE_DIR_PATH, '123Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.3.1': {
        filePath: path.join(CACHE_DIR_PATH, '131Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.4.1': {
        filePath: path.join(CACHE_DIR_PATH, '141Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.5.1': {
        filePath: path.join(CACHE_DIR_PATH, '151Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.5.2': {
        filePath: path.join(CACHE_DIR_PATH, '152Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
    '1.5.3': {
        filePath: path.join(CACHE_DIR_PATH, '153Cache.json'),
        minQuestions: 3,
        targetQuestions: 5,
    },
};
// 重試機制常量
const MAX_GENERATION_RETRIES = 3;
const BASE_GENERATION_DELAY_MS = 1000;
const JITTER_MS = 200;
// 類型保護函數
class TypeGuards {
    static isQuestionData111(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.targetWord === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData112(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData121(data) {
        return data && typeof data === 'object' &&
            typeof data.original_sentence === 'string' &&
            typeof data.instruction === 'string' &&
            Array.isArray(data.standard_corrections) &&
            Array.isArray(data.error_types) &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData122(data) {
        return data && typeof data === 'object' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData123(data) {
        return data && typeof data === 'object' &&
            typeof data.sentence_context === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData131(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData141(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData151(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData152(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static isQuestionData153(data) {
        return data && typeof data === 'object' &&
            typeof data.passage === 'string' &&
            typeof data.question === 'string' &&
            Array.isArray(data.options) &&
            typeof data.standard_answer === 'string' &&
            typeof data.explanation_of_Question === 'string';
    }
    static validateQuestionData(questionType, data) {
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
            default: return false;
        }
    }
}
class QuestionCacheService {
    constructor() {
        this.caches = new Map();
        this.isReplenishing = new Map();
        // 初始化所有支援的題型
        Object.keys(QUESTION_TYPE_CONFIG).forEach(questionType => {
            this.isReplenishing.set(questionType, false);
        });
    }
    static getInstance() {
        if (!QuestionCacheService.instance) {
            QuestionCacheService.instance = new QuestionCacheService();
        }
        return QuestionCacheService.instance;
    }
    /**
     * 初始化快取服務
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[DEBUG QuestionCacheService_v2.ts] Initializing cache service...');
            try {
                // 1. 確保快取目錄存在
                yield fs.mkdir(CACHE_DIR_PATH, { recursive: true });
                console.log(`[DEBUG QuestionCacheService_v2.ts] Cache directory ensured at: ${CACHE_DIR_PATH}`);
                // 2. 載入所有題型的快取
                for (const [questionType, config] of Object.entries(QUESTION_TYPE_CONFIG)) {
                    yield this.loadCacheFromFile(questionType, config.filePath);
                    // 觸發檢查補充，但不等待完成
                    this.checkAndTriggerReplenishment(questionType);
                }
                console.log('[DEBUG QuestionCacheService_v2.ts] Cache service initialized.');
            }
            catch (error) {
                console.error('[DEBUG QuestionCacheService_v2.ts] Critical error during cache service initialization:', error);
            }
        });
    }
    /**
     * 從檔案載入快取
     */
    loadCacheFromFile(questionType, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileContent = yield fs.readFile(filePath, 'utf-8');
                const loadedQuestions = JSON.parse(fileContent);
                if (!Array.isArray(loadedQuestions)) {
                    console.warn(`[DEBUG QuestionCacheService_v2.ts] Invalid cache file content for ${questionType}, initializing as empty.`);
                    this.caches.set(questionType, []);
                    return;
                }
                this.caches.set(questionType, loadedQuestions);
                console.log(`[DEBUG QuestionCacheService_v2.ts] Loaded ${loadedQuestions.length} questions for type ${questionType}`);
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    console.log(`[DEBUG QuestionCacheService_v2.ts] Cache file not found for ${questionType}. Initializing empty cache.`);
                }
                else {
                    console.error(`[DEBUG QuestionCacheService_v2.ts] Error reading cache file for ${questionType}:`, error);
                }
                this.caches.set(questionType, []);
            }
        });
    }
    /**
     * 檢查並觸發補充
     */
    checkAndTriggerReplenishment(questionType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const config = QUESTION_TYPE_CONFIG[questionType];
            const currentCount = (_b = (_a = this.caches.get(questionType)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            console.log(`[DEBUG QuestionCacheService_v2.ts] Check replenishment for ${questionType}: current ${currentCount}, min ${config.minQuestions}`);
            if (currentCount < config.minQuestions) {
                console.log(`[DEBUG QuestionCacheService_v2.ts] Triggering replenishment for ${questionType}`);
                this.triggerReplenishment(questionType); // 非同步執行
            }
        });
    }
    /**
     * 觸發題目補充
     */
    triggerReplenishment(questionType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (this.isReplenishing.get(questionType)) {
                console.log(`[DEBUG QuestionCacheService_v2.ts] Replenishment for ${questionType} already in progress. Skipping.`);
                return;
            }
            const config = QUESTION_TYPE_CONFIG[questionType];
            const currentQuestions = (_a = this.caches.get(questionType)) !== null && _a !== void 0 ? _a : [];
            const currentCount = currentQuestions.length;
            if (currentCount >= config.targetQuestions) {
                console.log(`[DEBUG QuestionCacheService_v2.ts] Cache for ${questionType} already at target (${currentCount}/${config.targetQuestions}). No replenishment needed.`);
                return;
            }
            console.log(`[DEBUG QuestionCacheService_v2.ts] Starting replenishment for ${questionType}. Current: ${currentCount}, Target: ${config.targetQuestions}`);
            this.isReplenishing.set(questionType, true);
            try {
                const needed = config.targetQuestions - currentCount;
                console.log(`[DEBUG QuestionCacheService_v2.ts] Attempting to generate ${needed} new questions for ${questionType}`);
                let newQuestionDataArray = null;
                let lastError = null;
                // 重試循環
                for (let attempt = 0; attempt <= MAX_GENERATION_RETRIES; attempt++) {
                    try {
                        const result = yield QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType(questionType, 70, // 預設難度
                        "No history available.", // 預設歷史
                        needed);
                        if (result === null) {
                            newQuestionDataArray = null;
                        }
                        else if (Array.isArray(result)) {
                            newQuestionDataArray = result.filter(q => TypeGuards.validateQuestionData(questionType, q));
                        }
                        else if (TypeGuards.validateQuestionData(questionType, result)) {
                            newQuestionDataArray = [result];
                        }
                        else {
                            console.error(`[DEBUG QuestionCacheService_v2.ts] Unexpected result type for ${questionType}:`, result);
                            newQuestionDataArray = null;
                        }
                        if (newQuestionDataArray && newQuestionDataArray.length > 0) {
                            console.log(`[DEBUG QuestionCacheService_v2.ts] Successfully generated ${newQuestionDataArray.length} questions on attempt ${attempt} for ${questionType}`);
                            break;
                        }
                        else {
                            throw new Error(`Generator returned null or empty array on attempt ${attempt}`);
                        }
                    }
                    catch (error) {
                        lastError = error instanceof Error ? error : new Error(String(error));
                        console.warn(`[DEBUG QuestionCacheService_v2.ts] Generation attempt ${attempt} failed for ${questionType}:`, lastError.message);
                        if (attempt >= MAX_GENERATION_RETRIES) {
                            console.error(`[DEBUG QuestionCacheService_v2.ts] Max retries reached for ${questionType}. Giving up.`);
                            throw lastError;
                        }
                        else {
                            const delay = BASE_GENERATION_DELAY_MS * (2 ** attempt);
                            const jitter = Math.floor(Math.random() * (JITTER_MS * 2 + 1)) - JITTER_MS;
                            const waitTime = Math.max(0, delay + jitter);
                            console.log(`[DEBUG QuestionCacheService_v2.ts] Waiting ${waitTime}ms before retry...`);
                            yield new Promise(resolve => setTimeout(resolve, waitTime));
                        }
                    }
                }
                // 處理生成的題目
                if (newQuestionDataArray && Array.isArray(newQuestionDataArray)) {
                    console.log(`[DEBUG QuestionCacheService_v2.ts] Processing ${newQuestionDataArray.length} generated questions for ${questionType}`);
                    for (const questionData of newQuestionDataArray) {
                        if (this.caches.get(questionType).length >= config.targetQuestions) {
                            console.log(`[DEBUG QuestionCacheService_v2.ts] Target reached for ${questionType} during batch add. Stopping.`);
                            break;
                        }
                        const cachedQuestion = {
                            UUID: (0, uuid_1.v4)(),
                            questionData: questionData,
                            cacheTimestamp: Math.floor(Date.now() / 1000),
                        };
                        this.caches.get(questionType).push(cachedQuestion);
                        console.log(`[DEBUG QuestionCacheService_v2.ts] Added question ${cachedQuestion.UUID} to cache for ${questionType}. New count: ${this.caches.get(questionType).length}`);
                    }
                    yield this.persistCacheToFile(questionType);
                }
            }
            catch (error) {
                console.error(`[DEBUG QuestionCacheService_v2.ts] Error during replenishment for ${questionType}:`, error);
            }
            finally {
                this.isReplenishing.set(questionType, false);
                console.log(`[DEBUG QuestionCacheService_v2.ts] Replenishment finished for ${questionType}. Final count: ${(_c = (_b = this.caches.get(questionType)) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0}`);
                // 檢查是否需要進一步補充
                this.checkAndTriggerReplenishment(questionType);
            }
        });
    }
    /**
     * 持久化快取到檔案
     */
    persistCacheToFile(questionType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const config = QUESTION_TYPE_CONFIG[questionType];
            const questionsToSave = (_a = this.caches.get(questionType)) !== null && _a !== void 0 ? _a : [];
            console.log(`[DEBUG QuestionCacheService_v2.ts] Persisting ${questionsToSave.length} questions for ${questionType}`);
            try {
                const jsonString = JSON.stringify(questionsToSave, null, 2);
                yield fs.writeFile(config.filePath, jsonString, 'utf-8');
                console.log(`[DEBUG QuestionCacheService_v2.ts] Successfully persisted cache for ${questionType}`);
            }
            catch (error) {
                console.error(`[DEBUG QuestionCacheService_v2.ts] Error persisting cache for ${questionType}:`, error);
            }
        });
    }
    /**
     * 從快取獲取題目
     */
    getQuestionFromCache(questionType) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedQuestions = this.caches.get(questionType);
            if (cachedQuestions && cachedQuestions.length > 0) {
                const questionToReturn = cachedQuestions.shift();
                if (questionToReturn) {
                    console.log(`[DEBUG QuestionCacheService_v2.ts] Providing question ${questionToReturn.UUID} from cache for ${questionType}. Remaining: ${cachedQuestions.length}`);
                    // 持久化更新後的快取
                    yield this.persistCacheToFile(questionType);
                    // 檢查是否需要補充
                    this.checkAndTriggerReplenishment(questionType);
                    return questionToReturn;
                }
            }
            console.log(`[DEBUG QuestionCacheService_v2.ts] Cache empty for ${questionType}. Triggering replenishment check.`);
            this.checkAndTriggerReplenishment(questionType);
            return null;
        });
    }
    /**
     * 獲取快取統計
     */
    getCacheStats() {
        var _a, _b, _c;
        const stats = {};
        for (const [questionType, config] of Object.entries(QUESTION_TYPE_CONFIG)) {
            stats[questionType] = {
                count: (_b = (_a = this.caches.get(questionType)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
                target: config.targetQuestions,
                isReplenishing: (_c = this.isReplenishing.get(questionType)) !== null && _c !== void 0 ? _c : false,
            };
        }
        return stats;
    }
}
exports.QuestionCacheService = QuestionCacheService;
// 導出單例實例
exports.default = QuestionCacheService.getInstance();
//# sourceMappingURL=QuestionCacheService_v2.js.map