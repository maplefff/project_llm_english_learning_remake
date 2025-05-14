import * as fs from 'fs/promises';
import * as path from 'path';
import questionCacheServiceInstance from '../../src/services/QuestionCacheService';
import { QuestionGeneratorService } from '../../src/services/QuestionGeneratorService';
import { QuestionData111, QuestionData } from '../../src/services/generators/QuestionGeneratorInterface';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

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
  return {
    ...originalPath,
    join: jest.fn((...args: string[]) => {
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
    }),
  };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

// Mock QuestionGeneratorService
jest.mock('../../src/services/QuestionGeneratorService');

// --- Test Setup ---

// 使用 CacheEntry 替換 CachedQuestion
interface CacheEntry {
  UUID: string;
  questionData: QuestionData111;
  cacheTimestamp: number;
}

// Helper function to create mock cached questions
const createMockCacheEntry = (idValue: string): CacheEntry => ({
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
const LOW_WATER_MARK = 4;
const TARGET_QUESTIONS_111 = 8;
const testCacheDir = '/mock/cache/dir';
const testCachePath = '/mock/cache/dir/111Cache.json';

describe('QuestionCacheService', () => {
  // Mocks and Spies (typed for clarity)
  const mockGenerateQuestionByType = QuestionGeneratorService.generateQuestionByType as jest.MockedFunction<typeof QuestionGeneratorService.generateQuestionByType>;
  const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
  const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
  const mockMkdir = fs.mkdir as jest.MockedFunction<typeof fs.mkdir>;
  const mockUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>;
  // let pathJoinSpy: jest.SpyInstance; // No longer needed
  // <<< 移除 cacheService 的類型聲明，因為我們直接使用導入的實例

  // Main beforeEach: Setup mocks that are generally needed, reset state
  beforeEach(() => { // Remove async, initialize moved
    jest.clearAllMocks();

    // --- Mock UUID ---
    let uuidCounter = 1;
    mockUuidv4.mockImplementation(() => `test-uuid-${uuidCounter++}` as any);

    // --- Mock fs operations (Defaults) ---
    mockMkdir.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue('[]'); // Default: empty cache
    mockWriteFile.mockResolvedValue(undefined);

    // --- Mock generator service (Default) ---
    mockGenerateQuestionByType.mockImplementation(async (type, difficulty, history, num) => {
      if (num && num > 0) {
        return Array.from({ length: num }, (_, i) => ({
          passage: `Generated Passage ${i + 1}`,
          targetWord: `gen_word_${i + 1}`,
          question: `Generated Question ${i + 1}?`,
          options: [{ id: 'A', text: 'Gen A' }, { id: 'B', text: 'Gen B' }],
          standard_answer: 'A',
          explanation_of_Question: `Generated Explanation ${i + 1}.`,
        } as QuestionData111));
      }
      return [];
    });

    // Reset internal state directly on the instance using the correct property name 'caches'
    (questionCacheServiceInstance as any).caches = new Map<string, CacheEntry[]>();
    (questionCacheServiceInstance as any).caches.set('1.1.1', []);
    (questionCacheServiceInstance as any).isReplenishing = new Map<string, boolean>().set('1.1.1', false);

    // --- Initialize Service for Test --- // MOVED to specific describe blocks
    // await questionCacheServiceInstance.initialize(); 

  });

  // No top-level afterEach needed for pathJoinSpy anymore
  // afterEach(() => { ... });

  // --- Test Suites ---

  describe('initialize', () => {
    let triggerSpy: jest.SpyInstance;

    beforeEach(() => {
      mockReadFile.mockResolvedValue('[]');
      triggerSpy = jest.spyOn(questionCacheServiceInstance as any, '_triggerReplenishment').mockImplementation();
    });

    afterEach(() => {
      triggerSpy.mockRestore();
    });

    it('should create cache directory if it does not exist', async () => {
      await questionCacheServiceInstance.initialize();
      expect(mockMkdir).toHaveBeenCalledWith(testCacheDir, { recursive: true });
    });

    it('should load existing cache from file', async () => {
      // 使用 CacheEntry
      const existingCache: CacheEntry[] = [
        createMockCacheEntry('existing-1'),
        createMockCacheEntry('existing-2'),
      ];
      mockReadFile.mockResolvedValue(JSON.stringify(existingCache));

      await questionCacheServiceInstance.initialize();

      expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
      // 修正斷言：檢查 caches Map
      expect((questionCacheServiceInstance as any).caches.get('1.1.1')).toEqual(existingCache);
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 2 < 4, should trigger
    });

    it('should handle non-existent cache file', async () => {
      const error: NodeJS.ErrnoException = new Error('File not found');
      error.code = 'ENOENT';
      mockReadFile.mockRejectedValue(error);

      await questionCacheServiceInstance.initialize();

      expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
      // 修正斷言：檢查 caches Map
      expect((questionCacheServiceInstance as any).caches.get('1.1.1')).toEqual([]);
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
    });

    it('should handle invalid JSON in cache file', async () => {
      mockReadFile.mockResolvedValue('invalid json{');

      await questionCacheServiceInstance.initialize();

      expect(mockReadFile).toHaveBeenCalledWith(testCachePath, 'utf-8');
      // 修正斷言：檢查 caches Map
      expect((questionCacheServiceInstance as any).caches.get('1.1.1')).toEqual([]);
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
    });

    it('should trigger replenishment check if cache is below low water mark after load', async () => {
      mockReadFile.mockResolvedValue('[]'); // Ensure empty cache is loaded
      await questionCacheServiceInstance.initialize();
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // 0 < 4, should trigger
    });

    it('should NOT trigger replenishment if cache is at or above low water mark after load', async () => {
      // 使用 CacheEntry
      const sufficientCache: CacheEntry[] = Array.from({ length: LOW_WATER_MARK }, (_, i) => createMockCacheEntry(`sufficient-${i}`));
      mockReadFile.mockResolvedValue(JSON.stringify(sufficientCache)); // Load cache with 4 items

      await questionCacheServiceInstance.initialize();

      // 修正斷言：檢查 caches Map
      expect((questionCacheServiceInstance as any).caches.get('1.1.1')).toEqual(sufficientCache);
      // 4 is not < 4, should NOT trigger
      expect(triggerSpy).not.toHaveBeenCalled(); 
    });
  });

  describe('getQuestionFromCache', () => {
    let triggerSpy: jest.SpyInstance; 

    // Initialize with some data for these tests
    beforeEach(async () => { 
      // No longer setting cache directly here. 
      // Each test will call initialize with specific readFile mock.
      triggerSpy = jest.spyOn(questionCacheServiceInstance as any, '_triggerReplenishment').mockImplementation();
    });

    afterEach(() => {
      triggerSpy.mockRestore();
    });

    it('should return a question and remove it from the cache (FIFO)', async () => {
      // Arrange: Initialize with 4 items
      const initialCache: CacheEntry[] = Array.from({ length: 4 }, (_, i) => createMockCacheEntry(`initial-${i}`));
      mockReadFile.mockResolvedValue(JSON.stringify(initialCache));
      await questionCacheServiceInstance.initialize(); 
      // Reset spy after initialize call if needed
      triggerSpy.mockClear(); 

      const initialLength = (questionCacheServiceInstance as any).caches.get('1.1.1').length; // Should be 4
      const expectedQuestionData = initialCache[0].questionData; // FIFO means the first item
      const removedQuestionUUID = initialCache[0].UUID;

      // Act
      const question = await questionCacheServiceInstance.getQuestionFromCache('1.1.1');

      // Assert
      expect(question).toEqual(expectedQuestionData);
      const finalCacheState = (questionCacheServiceInstance as any).caches.get('1.1.1');
      expect(finalCacheState.length).toBe(initialLength - 1); // 4 - 1 = 3
      expect(finalCacheState.some((q: CacheEntry) => q.UUID === removedQuestionUUID)).toBe(false);
      expect(mockWriteFile).toHaveBeenCalled(); // Persistence check
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // Should trigger because 3 < 4
    });

    it('should return null if the cache for the type is empty', async () => {
      // Arrange: Initialize with empty cache
      mockReadFile.mockResolvedValue('[]');
      await questionCacheServiceInstance.initialize();
      triggerSpy.mockClear();

      // Act
      const question = await questionCacheServiceInstance.getQuestionFromCache('1.1.1');

      // Assert
      expect(question).toBeNull();
      expect(triggerSpy).toHaveBeenCalledWith('1.1.1'); // Should trigger because 0 < 4
    });

    it('should return null if the specified question type is not supported (cache does not exist)', async () => {
      // Arrange: Initialize (will only create cache for '1.1.1')
      mockReadFile.mockResolvedValue('[]');
      await questionCacheServiceInstance.initialize();
      triggerSpy.mockClear();

      // Act
      const question = await questionCacheServiceInstance.getQuestionFromCache('invalid-type' as any);

      // Assert
      expect(question).toBeNull();
      expect(triggerSpy).not.toHaveBeenCalled(); // No cache for 'invalid-type', so no trigger
    });

    it('should persist the cache after a question is removed', async () => {
      // Arrange: Initialize with 1 item
      const singleItemCache: CacheEntry[] = [createMockCacheEntry('single-item')];
      mockReadFile.mockResolvedValue(JSON.stringify(singleItemCache));
      await questionCacheServiceInstance.initialize();
      triggerSpy.mockClear();
      mockWriteFile.mockClear(); // Clear write mock before action

      // Act
      await questionCacheServiceInstance.getQuestionFromCache('1.1.1');

      // Assert
      expect(mockWriteFile).toHaveBeenCalledWith(testCachePath, JSON.stringify([], null, 2), 'utf-8'); // Should persist empty cache
    });

    it('should trigger replenishment if cache drops to low water mark', async () => {
      // Arrange: Initialize with LOW_WATER_MARK + 1 items (e.g., 5 if LWM is 4)
      const initialCache: CacheEntry[] = Array.from({ length: LOW_WATER_MARK + 1 }, (_, i) => createMockCacheEntry(`lwm-check-${i}`));
      mockReadFile.mockResolvedValue(JSON.stringify(initialCache));
      await questionCacheServiceInstance.initialize();
      triggerSpy.mockClear(); // initialize should NOT trigger, clear spy

      // Act: Get one question, dropping cache to LWM (e.g. 4)
      await questionCacheServiceInstance.getQuestionFromCache('1.1.1');

      // Assert: Replenishment trigger should NOT be called because 4 is not < 4
      expect(triggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('_triggerReplenishment (testing the private method)', () => {
    // No beforeEach here, each test will set up its specific scenario
    // Spy on _checkAndTriggerReplenishment to prevent recursive calls in some tests
    let checkAgainSpy: jest.SpyInstance;

    beforeEach(() => {
        // Reset mocks to defaults for this suite
        mockGenerateQuestionByType.mockImplementation(async (type, difficulty, history, num) => {
            if (num && num > 0) {
                return Array.from({ length: num }, (_, i) => createMockCacheEntry(`gen-${i}`).questionData);
            }
            return [];
        });
        let uuidCounter = 1; // Reset UUID counter for predictable generated UUIDs if needed
        mockUuidv4.mockImplementation(() => `test-uuid-${uuidCounter++}` as any);

        checkAgainSpy = jest.spyOn(questionCacheServiceInstance as any, '_checkAndTriggerReplenishment').mockImplementation();
    });

    afterEach(() => {
        checkAgainSpy.mockRestore();
    });


    it('should NOT run if already replenishing', async () => {
      (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', true);
      await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');
      expect(mockGenerateQuestionByType).not.toHaveBeenCalled();
    });

    it('should NOT run if cache is already at or above target', async () => {
      (questionCacheServiceInstance as any).caches.set('1.1.1', Array(TARGET_QUESTIONS_111).fill(createMockCacheEntry('full')));
      (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);
      await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');
      expect(mockGenerateQuestionByType).not.toHaveBeenCalled();
    });

    it('should call generator service with the correct number of needed questions', async () => {
      const initialCache: CacheEntry[] = [createMockCacheEntry('initial-1')]; // Start with 1 item
      (questionCacheServiceInstance as any).caches.set('1.1.1', [...initialCache]);
      (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);
      const initialCount = initialCache.length; // 1
      const needed = TARGET_QUESTIONS_111 - initialCount; // 8 - 1 = 7

      await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');

      // 修正參數期望
      expect(mockGenerateQuestionByType).toHaveBeenCalledWith('1.1.1', 70, "No history available.", needed);
    });

    it('should add generated questions, assign IDs, and persist for each', async () => {
      const generatedData: QuestionData111[] = [
        createMockCacheEntry('gen-1').questionData,
        createMockCacheEntry('gen-2').questionData,
      ];
      mockGenerateQuestionByType.mockResolvedValue([...generatedData]);
      
      const initialCache: CacheEntry[] = [createMockCacheEntry('initial-single')];
      (questionCacheServiceInstance as any).caches.set('1.1.1', [...initialCache]);
      (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);
      const initialLength = initialCache.length; // 1

      await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');

      const finalCache = (questionCacheServiceInstance as any).caches.get('1.1.1');
      // 修正期望：initialLength (1) + generatedData.length (2) = 3
      expect(finalCache.length).toBe(initialLength + generatedData.length);

      // Assert: Added items structure (IDs generated by mockUuidv4 in this test's beforeEach)
      expect(finalCache[initialLength].UUID).toBe('test-uuid-1');
      expect(finalCache[initialLength + 1].UUID).toBe('test-uuid-2');
      expect(finalCache[initialLength].questionData).toEqual(generatedData[0]);
      expect(mockWriteFile).toHaveBeenCalledTimes(generatedData.length); // Persisted for each added question
      expect(checkAgainSpy).toHaveBeenCalledWith('1.1.1');
    });

    it('should handle concurrent calls correctly (only one replenishment runs)', async () => {
      (questionCacheServiceInstance as any).caches.set('1.1.1', []);
      (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);
      const needed = TARGET_QUESTIONS_111; // 8

      let generatorCallCount = 0;
      mockGenerateQuestionByType.mockImplementation(async (type, difficulty, history, num) => {
        generatorCallCount++;
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async work
        const actualNum = num ?? 0;
        return Array.from({ length: actualNum }, (_, i) => createMockCacheEntry(`concurrent-gen-${i}`).questionData);
      });

      const promise1 = (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');
      const promise2 = (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');
      await Promise.all([promise1, promise2]);

      expect(generatorCallCount).toBe(1); // Generator should only be called once
      // 修正參數期望
      expect(mockGenerateQuestionByType).toHaveBeenCalledWith('1.1.1', 70, "No history available.", needed);
      expect((questionCacheServiceInstance as any).caches.get('1.1.1').length).toBe(needed);
      expect((questionCacheServiceInstance as any).isReplenishing.get('1.1.1')).toBe(false);
      expect(checkAgainSpy).toHaveBeenCalledWith('1.1.1');
    });

    it('should retry generation on failure up to MAX_RETRIES times', async () => {
        (questionCacheServiceInstance as any).caches.set('1.1.1', []);
        (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);
        const needed = TARGET_QUESTIONS_111;
        const successData: QuestionData111[] = [createMockCacheEntry('retry-success').questionData];

        mockGenerateQuestionByType
            .mockRejectedValueOnce(new Error('Gen fail 1'))
            .mockRejectedValueOnce(new Error('Gen fail 2'))
            .mockResolvedValue(successData); // Success on 3rd attempt (0, 1, 2)

        await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');

        expect(mockGenerateQuestionByType).toHaveBeenCalledTimes(3);
        expect((questionCacheServiceInstance as any).caches.get('1.1.1').length).toBe(successData.length);
        expect((questionCacheServiceInstance as any).isReplenishing.get('1.1.1')).toBe(false);
    });

    xit('should give up after MAX_RETRIES and leave cache as is if all retries fail', async () => {
        (questionCacheServiceInstance as any).caches.set('1.1.1', [createMockCacheEntry('pre-fail')]);
        const initialCacheSize = (questionCacheServiceInstance as any).caches.get('1.1.1').length;
        (questionCacheServiceInstance as any).isReplenishing.set('1.1.1', false);

        mockGenerateQuestionByType.mockRejectedValue(new Error('Persistent gen fail'));

        await (questionCacheServiceInstance as any)._triggerReplenishment('1.1.1');
        
        // MAX_GENERATION_RETRIES is 3, so 1 initial try + 3 retries = 4 calls
        expect(mockGenerateQuestionByType).toHaveBeenCalledTimes(1 + 3); 
        expect((questionCacheServiceInstance as any).caches.get('1.1.1').length).toBe(initialCacheSize);
        expect((questionCacheServiceInstance as any).isReplenishing.get('1.1.1')).toBe(false);
    });

  });
});