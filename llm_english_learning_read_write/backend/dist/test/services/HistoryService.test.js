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
const HistoryService = __importStar(require("../../src/services/HistoryService"));
const fs = __importStar(require("fs/promises"));
// import { v4 as uuidv4 } from 'uuid'; //不再需要
// 模擬 fs/promises 模組
jest.mock('fs/promises');
// 不再需要模擬 uuid 模組，因為 HistoryService 不再直接使用它生成 ID
// jest.mock('uuid', () => ({
//     v4: jest.fn(() => 'mocked-uuid-string') 
// }));
// const mockedUuidv4 = uuidv4 as jest.MockedFunction<typeof uuidv4>; // 不再需要
const mockedFsReadFile = fs.readFile;
const mockedFsWriteFile = fs.writeFile;
const mockedFsAccess = fs.access;
const mockedFsMkdir = fs.mkdir;
describe('HistoryService', () => {
    const HISTORY_BASE_DIR = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/historyData/";
    const sampleQuestionType = '1.1.1';
    const sampleHistoryFilePath = `${HISTORY_BASE_DIR}history111.json`;
    // 範例數據現在需要包含 UUID
    const sampleEntryData = {
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
        mockedFsAccess.mockResolvedValue(undefined);
        mockedFsMkdir.mockResolvedValue(undefined);
        // @ts-ignore
        mockedFsReadFile.specificMockImplementation = undefined; // 重置特定模擬
        mockedFsReadFile.mockImplementation((path, options) => __awaiter(void 0, void 0, void 0, function* () {
            if (typeof options === 'string' && options === 'utf-8') {
                // @ts-ignore
                if (mockedFsReadFile.specificMockImplementation) {
                    // @ts-ignore
                    return mockedFsReadFile.specificMockImplementation(path, options);
                }
                throw { code: 'ENOENT' };
            }
            throw new Error('fs.readFile mock called without utf-8 encoding or specific mock');
        }));
        mockedFsWriteFile.mockResolvedValue(undefined);
    });
    describe('saveHistoryEntry', () => {
        it('應該成功儲存一條新的歷史記錄到空檔案中', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTimestamp = 1678886400000;
            // mockedUuidv4.mockReturnValue(mockRecordId); // 不再需要
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });
            const result = yield HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord = Object.assign(Object.assign({}, sampleEntryData), { timestamp: mockTimestamp });
            expect(result).toEqual(expectedRecord);
            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsReadFile).toHaveBeenCalledWith(sampleHistoryFilePath, 'utf-8');
            expect(mockedFsWriteFile).toHaveBeenCalledWith(sampleHistoryFilePath, JSON.stringify([expectedRecord], null, 2), 'utf-8');
        }));
        it('應該將新記錄添加到現有歷史記錄的開頭', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTimestamp1 = 1678886400000;
            const mockTimestamp2 = 1678886500000;
            const existingEntry = {
                UUID: 'existing-question-uuid-002',
                questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "Old passage" }),
                userAnswer: "B",
                isCorrect: false,
                timestamp: mockTimestamp1,
            };
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify([existingEntry]));
            const newEntryData = {
                UUID: 'new-question-uuid-003', // 新的題目ID
                questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "New passage" }),
                userAnswer: "C",
                isCorrect: true,
            };
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp2);
            // mockedUuidv4.mockReturnValue(mockRecordId2); // 不再需要
            const result = yield HistoryService.saveHistoryEntry(sampleQuestionType, newEntryData);
            const expectedNewRecord = Object.assign(Object.assign({}, newEntryData), { timestamp: mockTimestamp2 });
            expect(result).toEqual(expectedNewRecord);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(sampleHistoryFilePath, JSON.stringify([expectedNewRecord, existingEntry], null, 2), 'utf-8');
        }));
        it('如果 historyData 目錄不存在，應該創建它', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedFsAccess.mockRejectedValueOnce({ code: 'ENOENT' });
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });
            yield HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsMkdir).toHaveBeenCalledWith(HISTORY_BASE_DIR, { recursive: true });
        }));
        it('當讀取歷史檔案失敗時 (非 ENOENT)，應該記錄錯誤但仍嘗試寫入新紀錄 (因為錯誤在內部處理，history初始化為空)', () => __awaiter(void 0, void 0, void 0, function* () {
            const readError = new Error('Read failed but not ENOENT');
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValue(readError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const mockTimestamp = 1678886400000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            const result = yield HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord = Object.assign(Object.assign({}, sampleEntryData), { timestamp: mockTimestamp });
            expect(result).toEqual(expectedRecord); // 應仍能保存，因為readFile的錯誤被內部捕獲，history變為[]
            expect(consoleErrorSpy).toHaveBeenCalledWith(`[DEBUG HistoryService.ts] Error reading history file ${sampleHistoryFilePath}:`, readError);
            // 驗證寫入仍然發生，用新紀錄覆蓋（或創建）
            expect(mockedFsWriteFile).toHaveBeenCalledWith(sampleHistoryFilePath, JSON.stringify([expectedRecord], null, 2), 'utf-8');
            consoleErrorSpy.mockRestore();
        }));
        it('當寫入歷史檔案失敗時，應該記錄錯誤並返回 null', () => __awaiter(void 0, void 0, void 0, function* () {
            const writeError = new Error('Write failed');
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValueOnce({ code: 'ENOENT' });
            mockedFsWriteFile.mockRejectedValue(writeError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = yield HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            expect(result).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(`[DEBUG HistoryService.ts] Error saving history entry to ${sampleHistoryFilePath}:`, writeError);
            consoleErrorSpy.mockRestore();
        }));
        it('當歷史檔案內容為無效 JSON 時，saveHistoryEntry 應能處理並覆蓋檔案', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTimestamp = 1678886600000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            // mockedUuidv4.mockReturnValue(mockRecordId); // 不再需要
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('invalid json content');
            const result = yield HistoryService.saveHistoryEntry(sampleQuestionType, sampleEntryData);
            const expectedRecord = Object.assign(Object.assign({}, sampleEntryData), { timestamp: mockTimestamp });
            expect(result).toEqual(expectedRecord);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(sampleHistoryFilePath, JSON.stringify([expectedRecord], null, 2), 'utf-8');
        }));
    });
    describe('getHistory', () => {
        // getHistory 相關測試基本不需要大改，因為它們不依賴於 UUID 的生成方式，只關心 HistoryEntry 的結構
        it('當歷史檔案不存在時，應該返回空陣列', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockRejectedValue({ code: 'ENOENT' });
            const result = yield HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual([]);
            expect(mockedFsAccess).toHaveBeenCalledWith(HISTORY_BASE_DIR);
            expect(mockedFsReadFile).toHaveBeenCalledWith(sampleHistoryFilePath, 'utf-8');
        }));
        it('當歷史檔案為空時，應該返回空陣列', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('');
            const result = yield HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual([]);
        }));
        it('當歷史檔案內容為無效 JSON 時，應該記錄錯誤並返回空陣列', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue('invalid json content');
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = yield HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith(`[DEBUG HistoryService.ts] Error reading or parsing history file ${sampleHistoryFilePath}:`, expect.any(SyntaxError));
            consoleErrorSpy.mockRestore();
        }));
        it('應該成功讀取並返回指定題型的所有歷史記錄', () => __awaiter(void 0, void 0, void 0, function* () {
            const historyEntries = [
                {
                    UUID: 'q-uuid1',
                    questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "P1" }),
                    userAnswer: sampleEntryData.userAnswer,
                    isCorrect: sampleEntryData.isCorrect,
                    timestamp: Date.now() - 1000
                },
                {
                    UUID: 'q-uuid2',
                    questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "P2" }),
                    userAnswer: 'B',
                    isCorrect: false,
                    timestamp: Date.now()
                },
            ];
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify(historyEntries));
            const result = yield HistoryService.getHistory(sampleQuestionType);
            expect(result).toEqual(historyEntries);
        }));
        it('應該根據 limit 和 offset 參數返回分頁結果', () => __awaiter(void 0, void 0, void 0, function* () {
            const baseQuestionData = sampleEntryData.questionData;
            const historyEntries = [
                { UUID: 'id1', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 1 },
                { UUID: 'id2', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 2 },
                { UUID: 'id3', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 3 },
                { UUID: 'id4', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 4 },
                { UUID: 'id5', questionData: baseQuestionData, userAnswer: 'A', isCorrect: true, timestamp: 5 },
            ];
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = jest.fn().mockResolvedValue(JSON.stringify(historyEntries));
            let result = yield HistoryService.getHistory(sampleQuestionType, 2);
            expect(result).toEqual(historyEntries.slice(0, 2));
            result = yield HistoryService.getHistory(sampleQuestionType, 2, 1);
            expect(result).toEqual(historyEntries.slice(1, 3));
            result = yield HistoryService.getHistory(sampleQuestionType, 2, 10);
            expect(result).toEqual([]);
        }));
        it('測試為不同題型 (例如 1.2.1) 成功儲存和讀取記錄，不影響 1.1.1', () => __awaiter(void 0, void 0, void 0, function* () {
            const questionType111 = '1.1.1';
            const questionType121 = '1.2.1';
            const filePath111 = `${HISTORY_BASE_DIR}history111.json`;
            const filePath121 = `${HISTORY_BASE_DIR}history121.json`;
            const entry111_data = {
                UUID: 'q-uuid-111',
                questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "Passage 1.1.1" }),
                userAnswer: sampleEntryData.userAnswer,
                isCorrect: sampleEntryData.isCorrect
            };
            const entry121_data = {
                UUID: 'q-uuid-121',
                questionData: Object.assign(Object.assign({}, sampleEntryData.questionData), { passage: "Passage 1.2.1" }),
                userAnswer: sampleEntryData.userAnswer,
                isCorrect: sampleEntryData.isCorrect
            };
            let mockTimestamp = Date.now();
            // @ts-ignore
            const specificMock = jest.fn();
            // @ts-ignore
            mockedFsReadFile.specificMockImplementation = specificMock;
            specificMock.mockImplementation((p) => __awaiter(void 0, void 0, void 0, function* () {
                if (p === filePath111 || p === filePath121)
                    return JSON.stringify([]);
                throw { code: 'ENOENT' };
            }));
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            const saved111 = yield HistoryService.saveHistoryEntry(questionType111, entry111_data);
            const expectedSaved111 = Object.assign(Object.assign({}, entry111_data), { timestamp: mockTimestamp });
            expect(saved111).toEqual(expectedSaved111);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(filePath111, JSON.stringify([expectedSaved111], null, 2), 'utf-8');
            mockTimestamp += 1000;
            jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
            const saved121 = yield HistoryService.saveHistoryEntry(questionType121, entry121_data);
            const expectedSaved121 = Object.assign(Object.assign({}, entry121_data), { timestamp: mockTimestamp });
            expect(saved121).toEqual(expectedSaved121);
            expect(mockedFsWriteFile).toHaveBeenCalledWith(filePath121, JSON.stringify([expectedSaved121], null, 2), 'utf-8');
            specificMock.mockImplementation((p) => __awaiter(void 0, void 0, void 0, function* () {
                if (p === filePath111)
                    return JSON.stringify([expectedSaved111]);
                if (p === filePath121)
                    return JSON.stringify([expectedSaved121]);
                throw { code: 'ENOENT' };
            }));
            const history111 = yield HistoryService.getHistory(questionType111);
            expect(history111).toEqual([expectedSaved111]);
            const history121 = yield HistoryService.getHistory(questionType121);
            expect(history121).toEqual([expectedSaved121]);
        }));
    });
});
//# sourceMappingURL=HistoryService.test.js.map