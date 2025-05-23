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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const QuestionCacheService_1 = __importDefault(require("../../src/services/QuestionCacheService"));
const QuestionGeneratorService_1 = require("../../src/services/QuestionGeneratorService");
const uuid_1 = require("uuid");
require("dotenv/config");
// --- Mocking Dependencies ---
// Mock fs/promises
jest.mock('fs/promises', () => ({
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
}));
// Mock path specifically for path.join
// Remove these as they will be defined inside the mock factory
// const mockTestCachePath = '/mock/cache/dir/111Cache.json'; 
// const mockTestCacheDir = '/mock/cache/dir'; 
jest.mock('path', () => {
    const originalPath = jest.requireActual('path');
    // Define paths directly inside the factory function
    const MOCKED_CACHE_PATH = '/mock/cache/dir/111Cache.json';
    const MOCKED_CACHE_DIR = '/mock/cache/dir';
    return Object.assign(Object.assign({}, originalPath), { join: jest.fn((...args) => {
            // Check for the specific call pattern that creates the cache file path
            if (args.some(arg => arg.includes('questionCache')) && args.some(arg => arg.endsWith('111Cache.json'))) {
                return MOCKED_CACHE_PATH;
            }
            // Check for the pattern creating the directory path
            if (args.some(arg => arg.includes('questionCache')) && !args.some(arg => arg.includes('.json'))) {
                return MOCKED_CACHE_DIR;
            }
            // Fallback to actual implementation for other calls if needed
            return originalPath.join(...args);
        }) });
});
// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(),
}));
// Mock QuestionGeneratorService
jest.mock('../../src/services/QuestionGeneratorService');
// Helper function to create mock cached questions
const createMockCacheEntry = (idValue) => ({
    UUID: idValue,
    cacheTimestamp: Math.floor(Date.now() / 1000),
    questionData: {
        passage: `Passage for ${idValue}`,
        targetWord: `word${idValue}`,
        question: `Question for ${idValue}?`,
        options: [{ id: 'A', text: 'Option A' }, { id: 'B', text: 'Option B' }],
        standard_answer: 'A',
        explanation_of_Question: `Explanation for ${idValue}.`,
    },
});
// Constants for testing (mirroring service values)
const LOW_WATER_MARK = 3;
const TARGET_QUESTIONS_111 = 5;
const testCacheDir = '/mock/cache/dir';
const testCachePath = '/mock/cache/dir/111Cache.json';
describe('QuestionCacheService', () => {
    // Mocks and Spies (typed for clarity)
    const mockGenerateQuestionByType = QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType;
    const mockReadFile = fs.readFile;
    const mockWriteFile = fs.writeFile;
    const mockMkdir = fs.mkdir;
    const mockUuidv4 = uuid_1.v4;
    // let pathJoinSpy: jest.SpyInstance; // No longer needed
    // <<< 移除 cacheService 的類型聲明，因為我們直接使用導入的實例
    // Main beforeEach: Setup mocks that are generally needed, reset state
    beforeEach(() => {
        jest.clearAllMocks();
        // --- Mock UUID ---
        let uuidCounter = 1;
        mockUuidv4.mockImplementation(() => `test-uuid-${uuidCounter++}`);
        // --- Mock fs operations (Defaults) ---
        mockMkdir.mockResolvedValue(undefined);
        mockReadFile.mockResolvedValue('[]'); // Default: empty cache
        mockWriteFile.mockResolvedValue(undefined);
        // --- Mock generator service (Default) ---
        mockGenerateQuestionByType.mockImplementation((type, difficulty, history, num) => __awaiter(void 0, void 0, void 0, function* () {
            if (num && num > 0) {
                return Array.from({ length: num }, (_, i) => ({
                    passage: `Generated Passage ${i + 1}`,
                    targetWord: `gen_word_${i + 1}`,
                    question: `Generated Question ${i + 1}?`,
                    options: [{ id: 'A', text: 'Gen A' }, { id: 'B', text: 'Gen B' }],
                    standard_answer: 'A',
                    explanation_of_Question: `Generated Explanation ${i + 1}.`,
                }));
            }
            return [];
        }));
        // Reset internal state directly on the instance using the correct property name 'caches'
        QuestionCacheService_1.default.caches = new Map();
        QuestionCacheService_1.default.caches.set('1.1.1', []);
        QuestionCacheService_1.default.isReplenishing = new Map().set('1.1.1', false);
        // --- Initialize Service for Test --- // MOVED to specific describe blocks
        // await questionCacheServiceInstance.initialize(); 
    });
    // No top-level afterEach needed for pathJoinSpy anymore
    // afterEach(() => { ... });
    // --- Test Suites ---
    describe('initialize', () => {
        let triggerSpy;
        beforeEach(() => {
            mockReadFile.mockResolvedValue('[]');
            triggerSpy = jest.spyOn(QuestionCacheService_1.default, '_triggerReplenishment').mockImplementation();
        });
        afterEach(() => {
            triggerSpy.mockRestore();
        });
        it('should create cache directory if it does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield QuestionCacheService_1.default.initialize();
            expect(mockMkdir).toHaveBeenCalledWith(testCacheDir, { recursive: true });
        }));
        it('should load existing cache from file', () => __awaiter(void 0, void 0, void 0, function* () {
            // 使用 CacheEntry
            const existingCache = [
                createMockCacheEntry('existing-1'),
                createMockCacheEntry('existing-2'),
            ];
            mockReadFile.mockResolvedValue(JSON.stringify(existingCache));
            yield QuestionCacheService_1.default.initialize();
            expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
            // 修正斷言：檢查 caches Map
            expect(QuestionCacheService_1.default.caches.get('1.1.1')).toEqual(existingCache);
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 2 < 4, should trigger
        }));
        it('should handle non-existent cache file', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('File not found');
            error.code = 'ENOENT';
            mockReadFile.mockRejectedValue(error);
            yield QuestionCacheService_1.default.initialize();
            expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
            // 修正斷言：檢查 caches Map
            expect(QuestionCacheService_1.default.caches.get('1.1.1')).toEqual([]);
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
        }));
        it('should handle invalid JSON in cache file', () => __awaiter(void 0, void 0, void 0, function* () {
            mockReadFile.mockResolvedValue('invalid json{');
            yield QuestionCacheService_1.default.initialize();
            expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
            // 修正斷言：檢查 caches Map
            expect(QuestionCacheService_1.default.caches.get('1.1.1')).toEqual([]);
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
        }));
        it('should trigger replenishment check if cache is below low water mark after load', () => __awaiter(void 0, void 0, void 0, function* () {
            mockReadFile.mockResolvedValue('[]'); // Ensure empty cache is loaded
            yield QuestionCacheService_1.default.initialize();
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
        }));
        it('should NOT trigger replenishment if cache is at or above low water mark after load', () => __awaiter(void 0, void 0, void 0, function* () {
            // 使用 CacheEntry
            const sufficientCache = Array.from({ length: LOW_WATER_MARK }, (_, i) => createMockCacheEntry(`sufficient-${i}`));
            mockReadFile.mockResolvedValue(JSON.stringify(sufficientCache)); // Load cache with 4 items
            yield QuestionCacheService_1.default.initialize();
            // 修正斷言：檢查 caches Map
            expect(QuestionCacheService_1.default.caches.get('1.1.1')).toEqual(sufficientCache);
            // 4 is not < 4, should NOT trigger
            expect(triggerSpy).not.toHaveBeenCalled();
        }));
    });
    describe('getQuestionFromCache', () => {
        let triggerSpy;
        // Initialize with some data for these tests
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // No longer setting cache directly here. 
            // Each test will call initialize with specific readFile mock.
            triggerSpy = jest.spyOn(QuestionCacheService_1.default, '_triggerReplenishment').mockImplementation();
        }));
        afterEach(() => {
            triggerSpy.mockRestore();
        });
        it('should return a question and remove it from the cache (FIFO)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange: Initialize with 4 items
            const initialCache = Array.from({ length: 4 }, (_, i) => createMockCacheEntry(`initial-${i}`));
            mockReadFile.mockResolvedValue(JSON.stringify(initialCache));
            yield QuestionCacheService_1.default.initialize();
            // Reset spy after initialize call if needed
            triggerSpy.mockClear();
            const initialLength = QuestionCacheService_1.default.caches.get('1.1.1').length; // Should be 4
            const expectedQuestionData = initialCache[0].questionData; // FIFO means the first item
            const removedQuestionUUID = initialCache[0].UUID;
            // Act
            const question = yield QuestionCacheService_1.default.getQuestionFromCache('1.1.1');
            // Assert
            expect(question).toEqual(expectedQuestionData);
            const finalCacheState = QuestionCacheService_1.default.caches.get('1.1.1');
            expect(finalCacheState.length).toBe(initialLength - 1); // 4 - 1 = 3
            expect(finalCacheState.some((q) => q.UUID === removedQuestionUUID)).toBe(false);
            expect(mockWriteFile).toHaveBeenCalled(); // Persistence check
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // Should trigger because 3 < 4
        }));
        it('should return null if the cache for the type is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange: Initialize with empty cache
            mockReadFile.mockResolvedValue('[]');
            yield QuestionCacheService_1.default.initialize();
            triggerSpy.mockClear();
            // Act
            const question = yield QuestionCacheService_1.default.getQuestionFromCache('1.1.1');
            // Assert
            expect(question).toBeNull();
            expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // Should trigger because 0 < 4
        }));
        it('should return null if the specified question type is not supported (cache does not exist)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange: Initialize (will only create cache for '1.1.1')
            mockReadFile.mockResolvedValue('[]');
            yield QuestionCacheService_1.default.initialize();
            triggerSpy.mockClear();
            // Act
            const question = yield QuestionCacheService_1.default.getQuestionFromCache('invalid-type');
            // Assert
            expect(question).toBeNull();
            expect(triggerSpy).not.toHaveBeenCalled(); // No cache for 'invalid-type', so no trigger
        }));
        it('should persist the cache after a question is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange: Initialize with 1 item
            const singleItemCache = [createMockCacheEntry('single-item')];
            mockReadFile.mockResolvedValue(JSON.stringify(singleItemCache));
            yield QuestionCacheService_1.default.initialize();
            triggerSpy.mockClear();
            mockWriteFile.mockClear(); // Clear write mock before action
            // Act
            yield QuestionCacheService_1.default.getQuestionFromCache('1.1.1');
            // Assert
            expect(mockWriteFile).toHaveBeenCalledWith(testCachePath, JSON.stringify([], null, 2), 'utf-8'); // Should persist empty cache
        }));
        it('should trigger replenishment if cache drops to low water mark', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange: Initialize with LOW_WATER_MARK + 1 items (e.g., 5 if LWM is 4)
            const initialCache = Array.from({ length: LOW_WATER_MARK + 1 }, (_, i) => createMockCacheEntry(`lwm-check-${i}`));
            mockReadFile.mockResolvedValue(JSON.stringify(initialCache));
            yield QuestionCacheService_1.default.initialize();
            triggerSpy.mockClear(); // initialize should NOT trigger, clear spy
            // Act: Get one question, dropping cache to LWM (e.g. 4)
            yield QuestionCacheService_1.default.getQuestionFromCache('1.1.1');
            // Assert: Replenishment trigger should NOT be called because 4 is not < 4
            expect(triggerSpy).not.toHaveBeenCalled();
        }));
    });
    describe('_triggerReplenishment (testing the private method)', () => {
        // No beforeEach here, each test will set up its specific scenario
        // Spy on _checkAndTriggerReplenishment to prevent recursive calls in some tests
        let checkAgainSpy;
        beforeEach(() => {
            // Reset mocks to defaults for this suite
            mockGenerateQuestionByType.mockImplementation((type, difficulty, history, num) => __awaiter(void 0, void 0, void 0, function* () {
                if (num && num > 0) {
                    return Array.from({ length: num }, (_, i) => createMockCacheEntry(`gen-${i}`).questionData);
                }
                return [];
            }));
            let uuidCounter = 1; // Reset UUID counter for predictable generated UUIDs if needed
            mockUuidv4.mockImplementation(() => `test-uuid-${uuidCounter++}`);
            checkAgainSpy = jest.spyOn(QuestionCacheService_1.default, '_checkAndTriggerReplenishment').mockImplementation();
        });
        afterEach(() => {
            checkAgainSpy.mockRestore();
        });
        it('should NOT run if already replenishing', () => __awaiter(void 0, void 0, void 0, function* () {
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', true);
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            expect(mockGenerateQuestionByType).not.toHaveBeenCalled();
        }));
        it('should NOT run if cache is already at or above target', () => __awaiter(void 0, void 0, void 0, function* () {
            QuestionCacheService_1.default.caches.set('1.1.1', Array(TARGET_QUESTIONS_111).fill(createMockCacheEntry('full')));
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            expect(mockGenerateQuestionByType).not.toHaveBeenCalled();
        }));
        it('should call generator service with the correct number of needed questions', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialCache = [createMockCacheEntry('initial-1')]; // Start with 1 item
            QuestionCacheService_1.default.caches.set('1.1.1', [...initialCache]);
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            const initialCount = initialCache.length; // 1
            const needed = TARGET_QUESTIONS_111 - initialCount; // 8 - 1 = 7
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            // 修正參數期望
            expect(mockGenerateQuestionByType).toHaveBeenCalledWith('1.1.1', 70, "No history available.", needed);
        }));
        it('should add generated questions, assign IDs, and persist for each', () => __awaiter(void 0, void 0, void 0, function* () {
            const generatedData = [
                createMockCacheEntry('gen-1').questionData,
                createMockCacheEntry('gen-2').questionData,
            ];
            mockGenerateQuestionByType.mockResolvedValue([...generatedData]);
            const initialCache = [createMockCacheEntry('initial-single')];
            QuestionCacheService_1.default.caches.set('1.1.1', [...initialCache]);
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            const initialLength = initialCache.length; // 1
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            const finalCache = QuestionCacheService_1.default.caches.get('1.1.1');
            // 修正期望：initialLength (1) + generatedData.length (2) = 3
            expect(finalCache.length).toBe(initialLength + generatedData.length);
            // Assert: Added items structure (IDs generated by mockUuidv4 in this test's beforeEach)
            expect(finalCache[initialLength].UUID).toBe('test-uuid-1');
            expect(finalCache[initialLength + 1].UUID).toBe('test-uuid-2');
            expect(finalCache[initialLength].questionData).toEqual(generatedData[0]);
            expect(mockWriteFile).toHaveBeenCalledTimes(generatedData.length); // Persisted for each added question
            expect(checkAgainSpy).toHaveBeenCalledWith('1.1.1');
        }));
        it('should handle concurrent calls correctly (only one replenishment runs)', () => __awaiter(void 0, void 0, void 0, function* () {
            QuestionCacheService_1.default.caches.set('1.1.1', []);
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            const needed = TARGET_QUESTIONS_111; // 8
            let generatorCallCount = 0;
            mockGenerateQuestionByType.mockImplementation((type, difficulty, history, num) => __awaiter(void 0, void 0, void 0, function* () {
                generatorCallCount++;
                yield new Promise(resolve => setTimeout(resolve, 50)); // Simulate async work
                const actualNum = num !== null && num !== void 0 ? num : 0;
                return Array.from({ length: actualNum }, (_, i) => createMockCacheEntry(`concurrent-gen-${i}`).questionData);
            }));
            const promise1 = QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            const promise2 = QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            yield Promise.all([promise1, promise2]);
            expect(generatorCallCount).toBe(1); // Generator should only be called once
            // 修正參數期望
            expect(mockGenerateQuestionByType).toHaveBeenCalledWith('1.1.1', 70, "No history available.", needed);
            expect(QuestionCacheService_1.default.caches.get('1.1.1').length).toBe(needed);
            expect(QuestionCacheService_1.default.isReplenishing.get('1.1.1')).toBe(false);
            expect(checkAgainSpy).toHaveBeenCalledWith('1.1.1');
        }));
        it('should retry generation on failure up to MAX_RETRIES times', () => __awaiter(void 0, void 0, void 0, function* () {
            QuestionCacheService_1.default.caches.set('1.1.1', []);
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            const needed = TARGET_QUESTIONS_111;
            const successData = [createMockCacheEntry('retry-success').questionData];
            mockGenerateQuestionByType
                .mockRejectedValueOnce(new Error('Gen fail 1'))
                .mockRejectedValueOnce(new Error('Gen fail 2'))
                .mockResolvedValue(successData); // Success on 3rd attempt (0, 1, 2)
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            expect(mockGenerateQuestionByType).toHaveBeenCalledTimes(3);
            expect(QuestionCacheService_1.default.caches.get('1.1.1').length).toBe(successData.length);
            expect(QuestionCacheService_1.default.isReplenishing.get('1.1.1')).toBe(false);
        }));
        xit('should give up after MAX_RETRIES and leave cache as is if all retries fail', () => __awaiter(void 0, void 0, void 0, function* () {
            QuestionCacheService_1.default.caches.set('1.1.1', [createMockCacheEntry('pre-fail')]);
            const initialCacheSize = QuestionCacheService_1.default.caches.get('1.1.1').length;
            QuestionCacheService_1.default.isReplenishing.set('1.1.1', false);
            mockGenerateQuestionByType.mockRejectedValue(new Error('Persistent gen fail'));
            yield QuestionCacheService_1.default._triggerReplenishment('1.1.1');
            // MAX_GENERATION_RETRIES is 3, so 1 initial try + 3 retries = 4 calls
            expect(mockGenerateQuestionByType).toHaveBeenCalledTimes(1 + 3);
            expect(QuestionCacheService_1.default.caches.get('1.1.1').length).toBe(initialCacheSize);
            expect(QuestionCacheService_1.default.isReplenishing.get('1.1.1')).toBe(false);
        }));
    });
});
//# sourceMappingURL=QuestionCacheService.test.js.map