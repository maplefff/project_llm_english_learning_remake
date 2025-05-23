"use strict";
// test/services/QuestionGeneratorService.test.ts
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
const QuestionGeneratorService_1 = require("../../src/services/QuestionGeneratorService");
// 我們需要模擬的函數，從原始路徑導入
const _111_generate_1 = require("../../src/services/generators/111_generate");
// 模擬 generate111Question 函數
// 注意路徑是相對於當前測試文件的
jest.mock('../../src/services/generators/111_generate');
// 將模擬函數強制轉換為 Jest Mock 類型，以便使用 .mockResolvedValue 等方法
const mockGenerate111Question = _111_generate_1.generate111Question;
// 定義一個用於測試的模擬 QuestionData111 物件
const mockQuestionData = {
    passage: "Mock passage",
    targetWord: "mock",
    question: "What does mock mean?",
    options: [
        { id: "A", text: "Fake" },
        { id: "B", text: "Real" },
        { id: "C", text: "Test" },
        { id: "D", text: "Bird" },
    ],
    standard_answer: "A",
    explanation_of_Question: "Mock means fake or imitation.",
};
describe('QuestionGeneratorService', () => {
    // 在每個測試前清除所有模擬信息，確保測試隔離
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('應該成功為類型 1.1.1 調用 generate111Question 並返回結果', () => __awaiter(void 0, void 0, void 0, function* () {
        // 安排: 讓模擬函數在被調用時返回成功的 mock 資料
        mockGenerate111Question.mockResolvedValue(mockQuestionData);
        const questionType = '1.1.1';
        const difficulty = 75;
        const history = 'some history';
        // 行動: 調用服務函數
        const result = yield QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType(questionType, difficulty, history);
        // 斷言:
        // 1. 驗證 generate111Question 是否被調用了一次
        expect(mockGenerate111Question).toHaveBeenCalledTimes(1);
        // 2. 驗證 generate111Question 是否使用了正確的參數調用
        expect(mockGenerate111Question).toHaveBeenCalledWith(difficulty, history);
        // 3. 驗證返回結果是否是模擬函數提供的結果
        expect(result).toEqual(mockQuestionData);
    }));
    it('當請求不支援的題型時應該返回 null', () => __awaiter(void 0, void 0, void 0, function* () {
        const questionType = '1.1.2'; // 一個目前不支援的類型
        const difficulty = 70;
        const history = '';
        // 行動: 調用服務函數
        const result = yield QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType(questionType, difficulty, history);
        // 斷言:
        // 1. 驗證返回結果是否為 null
        expect(result).toBeNull();
        // 2. 驗證 generate111Question 從未被調用
        expect(mockGenerate111Question).not.toHaveBeenCalled();
    }));
    it('當 generate111Question 返回 null 時應該返回 null', () => __awaiter(void 0, void 0, void 0, function* () {
        // 安排: 讓模擬函數在被調用時返回 null
        mockGenerate111Question.mockResolvedValue(null);
        const questionType = '1.1.1';
        const difficulty = 70;
        const history = '';
        // 行動: 調用服務函數
        const result = yield QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType(questionType, difficulty, history);
        // 斷言:
        // 1. 驗證 generate111Question 被調用了一次
        expect(mockGenerate111Question).toHaveBeenCalledTimes(1);
        // 2. 驗證 generate111Question 使用了正確的參數
        expect(mockGenerate111Question).toHaveBeenCalledWith(difficulty, history);
        // 3. 驗證最終返回結果是 null
        expect(result).toBeNull();
    }));
    it('當 generate111Question 拋出錯誤時應該捕獲錯誤並返回 null', () => __awaiter(void 0, void 0, void 0, function* () {
        // 安排: 讓模擬函數在被調用時拋出錯誤
        const errorMessage = 'LLM API Error';
        mockGenerate111Question.mockRejectedValue(new Error(errorMessage));
        const questionType = '1.1.1';
        const difficulty = 70;
        const history = '';
        // 抑制測試期間預期的錯誤日誌輸出
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        // 行動: 調用服務函數
        const result = yield QuestionGeneratorService_1.QuestionGeneratorService.generateQuestionByType(questionType, difficulty, history);
        // 斷言:
        // 1. 驗證 generate111Question 被調用了一次
        expect(mockGenerate111Question).toHaveBeenCalledTimes(1);
        // 2. 驗證 generate111Question 使用了正確的參數
        expect(mockGenerate111Question).toHaveBeenCalledWith(difficulty, history);
        // 3. 驗證最終返回結果是 null
        expect(result).toBeNull();
        // 4. (可選) 驗證 console.error 是否被調用以記錄錯誤
        expect(consoleErrorSpy).toHaveBeenCalled();
        // 恢復 console.error 的原始實現
        consoleErrorSpy.mockRestore();
    }));
    // 接下來將在這裡添加更多測試案例...
});
//# sourceMappingURL=QuestionGeneratorService.test.js.map