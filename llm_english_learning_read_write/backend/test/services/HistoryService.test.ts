import * as HistoryService from '../../src/services/HistoryService';
import * as fs from 'fs/promises';
// import { v4 as uuidv4 } from 'uuid'; //不再需要

// 模擬 fs/promises 模組
jest.mock('fs/promises');
// 不再需要模擬 uuid 模組，因為 HistoryService 不再直接使用它生成 ID
// jest.mock('uuid', () => ({
//     v4: jest.fn(() => 'mocked-uuid-string') 
// }));

// const mockedUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>; // 不再需要

const mockedFsReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
const mockedFsWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
const mockedFsAccess = fs.access as jest.MockedFunction<typeof fs.access>;
const mockedFsMkdir = fs.mkdir as jest.MockedFunction<typeof fs.mkdir>;


describe('HistoryService', () => {
    const HISTORY_BASE_DIR = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/";
    const sampleQuestionType = '1.1.1';
    const sampleHistoryFilePath = `${HISTORY_BASE_DIR}history111.json`;
    // 範例數據現在需要包含 UUID
    const sampleEntryData: Omit<HistoryService.HistoryEntry, 'timestamp'> = {
        UUID: 'sample-question-uuid-001', // 題目ID
        questionData: {
            passage: "Test passage",
            targetWord: "test",
            question: "What is test?",
            options: [{ id: "A", text: "option A" }, { id: "B", text: "option B" }],
            standard_answer: "A",
        },
        userAnswer: "A",
        isCorrect: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedFsAccess.mockResolvedValue(undefined as any); 
        mockedFsMkdir.mockResolvedValue(undefined as any);  
        
        // @ts-ignore
        mockedFsReadFile.specificMockImplementation = undefined; // 重置特定模擬
        mockedFsReadFile.mockImplementation(async (path, options) => {
            if (typeof options === 'string' && options === 'utf-8') {
                // @ts-ignore
                if (mockedFsReadFile.specificMockImplementation) {
                    // @ts-ignore
                    return mockedFsReadFile.specificMockImplementation(path, options);
                }
                throw { code: 'ENOENT' }; 
            }
            throw new Error('fs.readFile mock called without utf-8 encoding or specific mock');
        });
        mockedFsWriteFile.mockResolvedValue(undefined); 
    });

    describe('saveHistoryEntry', () => {
        it('應該成功儲存一條新的歷史記錄到空檔案中', async () => {
            const mockTimestamp = 1678886400000;
            // mockedUuidv4.mockReturnValue(mockRecordId); // 不再需要
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });

            const result = await HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord = {
                ...sampleEntryData, // 包含 UUID
                timestamp: mockTimestamp,
            };
            expect(result).toEqual(expectedRecord);
            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsReadFile).toHaveBeenCalledWith(sampleHistoryFilePath, 'utf-8');
            expect(mockedFsWriteFile).toHaveBeenCalledWith(
                sampleHistoryFilePath,
                JSON.stringify([expectedRecord], null, 2),
                'utf-8'
            );
        });

        it('應該將新記錄添加到現有歷史記錄的開頭', async () => {
            const mockTimestamp1 = 1678886400000;
            const mockTimestamp2 = 1678886500000;

            const existingEntry: HistoryService.HistoryEntry = {
                UUID: 'existing-question-uuid-002',
                questionData: { ...sampleEntryData.questionData, passage: "Old passage" },
                userAnswer: "B",
                isCorrect: false,
                timestamp: mockTimestamp1,
            };
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify([existingEntry]));

            const newEntryData: Omit<HistoryService.HistoryEntry, 'timestamp'> = {
                UUID: 'new-question-uuid-003', // 新的題目ID
                questionData: { ...sampleEntryData.questionData, passage: "New passage" },
                userAnswer: "C",
                isCorrect: true,
            };
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp2);
            // mockedUuidv4.mockReturnValue(mockRecordId2); // 不再需要

            const result = await HistoryService.saveHistoryEntry(sampleQuestionType, newEntryData);

            const expectedNewRecord: HistoryService.HistoryEntry = {
                ...newEntryData,
                timestamp: mockTimestamp2,
            };

            expect(result).toEqual(expectedNewRecord);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(
                sampleHistoryFilePath,
                JSON.stringify([expectedNewRecord, existingEntry], null, 2),
                'utf-8'
            );
        });
        
        it('如果 historyData 目錄不存在，應該創建它', async () => {
            mockedFsAccess.mockRejectedValueOnce({ code: 'ENOENT' } as any);
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });

            await HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);

            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsMkdir).toHaveBeenCalledWith(HISTORY_BASE_DIR, { recursive: true });
        });

        it('當讀取歷史檔案失敗時 (非 ENOENT)，應該記錄錯誤但仍嘗試寫入新紀錄 (因為錯誤在內部處理，history初始化為空)', async () => {
            const readError = new Error('Read failed but not ENOENT');
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValue(readError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const mockTimestamp = 1678886400000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

            const result = await HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord = {
                ...sampleEntryData,
                timestamp: mockTimestamp,
            };

            expect(result).toEqual(expectedRecord); // 應仍能保存，因為readFile的錯誤被內部捕獲，history變為[]
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                `[DEBUG HistoryService.ts] Error reading history file ${sampleHistoryFilePath}:`,
                readError
            );
            // 驗證寫入仍然發生，用新紀錄覆蓋（或創建）
            expect(mockedFsWriteFile).toHaveBeenCalledWith(
                sampleHistoryFilePath,
                JSON.stringify([expectedRecord], null, 2),
                'utf-8'
            );
            consoleErrorSpy.mockRestore();
        });

        it('當寫入歷史檔案失敗時，應該記錄錯誤並返回 null', async () => {
            const writeError = new Error('Write failed');
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });
            mockedFsWriteFile.mockRejectedValue(writeError as any);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);

            expect(result).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                `[DEBUG HistoryService.ts] Error saving history entry to ${sampleHistoryFilePath}:`,
                writeError
            );
            consoleErrorSpy.mockRestore();
        });

        it('當歷史檔案內容為無效 JSON 時，saveHistoryEntry 應能處理並覆蓋檔案', async () => {
            const mockTimestamp = 1678886600000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            // mockedUuidv4.mockReturnValue(mockRecordId); // 不再需要

            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('invalid json content');

            const result = await HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord: HistoryService.HistoryEntry = {
                ...sampleEntryData,
                timestamp: mockTimestamp,
            };

            expect(result).toEqual(expectedRecord);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(
                sampleHistoryFilePath,
                JSON.stringify([expectedRecord], null, 2),
                'utf-8'
            );
        });
    });

    describe('getHistory', () => {
        // getHistory 相關測試基本不需要大改，因為它們不依賴於 UUID 的生成方式，只關心 HistoryEntry 的結構
        it('當歷史檔案不存在時，應該返回空陣列', async () => {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValue({ code: 'ENOENT' });
            const result = await HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual([]);
            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsReadFile).toHaveBeenCalledWith(sampleHistoryFilePath, 'utf-8');
        });

        it('當歷史檔案為空時，應該返回空陣列', async () => {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('');
            const result = await HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual([]);
        });

        it('當歷史檔案內容為無效 JSON 時，應該記錄錯誤並返回空陣列', async () => {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('invalid json content');
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await HistoryService.getHistory(sampleQuestionType);

            expect(result).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                `[DEBUG HistoryService.ts] Error reading or parsing history file ${sampleHistoryFilePath}:`,
                expect.any(SyntaxError)
            );
            consoleErrorSpy.mockRestore();
        });

        it('應該成功讀取並返回指定題型的所有歷史記錄', async () => {
            const historyEntries: HistoryService.HistoryEntry[] = [
                { 
                    UUID: 'q-uuid1', 
                    questionData: {...sampleEntryData.questionData, passage: "P1"}, 
                    userAnswer: sampleEntryData.userAnswer, 
                    isCorrect: sampleEntryData.isCorrect,
                    timestamp: Date.now() - 1000 
                },
                { 
                    UUID: 'q-uuid2', 
                    questionData: {...sampleEntryData.questionData, passage: "P2"}, 
                    userAnswer: 'B', 
                    isCorrect: false, 
                    timestamp: Date.now() 
                },
            ];
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify(historyEntries));

            const result = await HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual(historyEntries);
        });

        it('應該根據 limit 和 offset 參數返回分頁結果', async () => {
            const baseQuestionData = sampleEntryData.questionData;
            const historyEntries: HistoryService.HistoryEntry[] = [
                { UUID: 'id1', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 1 }, 
                { UUID: 'id2', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 2 }, 
                { UUID: 'id3', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 3 }, 
                { UUID: 'id4', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 4 }, 
                { UUID: 'id5', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 5 }, 
            ];
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify(historyEntries));

            let result = await HistoryService.getHistory(sampleQuestionType, 2);
            expect(result).toEqual(historyEntries.slice(0, 2));

            result = await HistoryService.getHistory(sampleQuestionType, 2, 1);
            expect(result).toEqual(historyEntries.slice(1, 3));

            result = await HistoryService.getHistory(sampleQuestionType, 2, 10);
            expect(result).toEqual([]);
        });

        it('測試為不同題型 (例如 1.2.1) 成功儲存和讀取記錄，不影響 1.1.1', async () => {
            const questionType111 = '1.1.1';
            const questionType121 = '1.2.1';
            const filePath111 = `${HISTORY_BASE_DIR}history111.json`;
            const filePath121 = `${HISTORY_BASE_DIR}history121.json`;

            const entry111_data: Omit<HistoryService.HistoryEntry, 'timestamp'> = {
                UUID: 'q-uuid-111',
                questionData: {...sampleEntryData.questionData, passage: "Passage 1.1.1"},
                userAnswer: sampleEntryData.userAnswer,
                isCorrect: sampleEntryData.isCorrect
            };
            const entry121_data: Omit<HistoryService.HistoryEntry, 'timestamp'> = {
                UUID: 'q-uuid-121',
                questionData: {...sampleEntryData.questionData, passage: "Passage 1.2.1"},
                userAnswer: sampleEntryData.userAnswer,
                isCorrect: sampleEntryData.isCorrect
            };

            let mockTimestamp = Date.now();

            // @ts-ignore
            const specificMock = jest.fn();
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = specificMock;
            
            specificMock.mockImplementation(async (p) => {
                if (p === filePath111 || p === filePath121) return JSON.stringify([]);
                throw { code: 'ENOENT' };
            });
            
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp); 
            const saved111 = await HistoryService.saveHistoryEntry(questionType111, entry111_data);
            const expectedSaved111: HistoryService.HistoryEntry = {...entry111_data, timestamp: mockTimestamp};
            expect(saved111).toEqual(expectedSaved111);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(filePath111, JSON.stringify([expectedSaved111], null, 2), 'utf-8');

            mockTimestamp += 1000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp); 
            const saved121 = await HistoryService.saveHistoryEntry(questionType121, entry121_data);
            const expectedSaved121: HistoryService.HistoryEntry = {...entry121_data, timestamp: mockTimestamp};
            expect(saved121).toEqual(expectedSaved121);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(filePath121, JSON.stringify([expectedSaved121], null, 2), 'utf-8');
            
            specificMock.mockImplementation(async (p) => {
                if (p === filePath111) return JSON.stringify([expectedSaved111]);
                if (p === filePath121) return JSON.stringify([expectedSaved121]);
                throw { code: 'ENOENT' };
            });

            const history111 = await HistoryService.getHistory(questionType111);
            expect(history111).toEqual([expectedSaved111]);

            const history121 = await HistoryService.getHistory(questionType121);
            expect(history121).toEqual([expectedSaved121]);
        });
    });
}); 