"use strict";
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
const TestOrchestratorService_v2_1 = __importDefault(require("../services/TestOrchestratorService_v2"));
const QuestionCacheService_v2_1 = require("../services/QuestionCacheService_v2"); // 導入類別本身以獲取實例
const HistoryService_1 = require("../services/HistoryService");
// 獲取 QuestionCacheService 的單例實例
const questionCacheService = QuestionCacheService_v2_1.QuestionCacheService.getInstance();
// 創建 TestOrchestratorService 實例並注入依賴
const orchestratorService = new TestOrchestratorService_v2_1.default(questionCacheService);
class ApiController {
    getQuestionTypes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 返回支援的題型列表
                const questionTypes = [
                    { id: '1.1.1', name: '詞義選擇 (Vocabulary - Multiple Choice)' },
                    { id: '1.1.2', name: '詞彙填空 (Vocabulary - Cloze Test)' },
                    { id: '1.2.1', name: '句子改錯 (Sentence Correction)' },
                    { id: '1.2.2', name: '語法結構選擇 (Grammar Structure - Multiple Choice)' },
                    { id: '1.2.3', name: '轉承詞選擇 (Transition Words - Multiple Choice)' },
                    // Future types can be added here
                ];
                res.json(questionTypes);
            }
            catch (error) {
                next(error);
            }
        });
    }
    startTest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionType } = req.body;
                // 驗證題型
                const validTypes = ['1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3'];
                if (!validTypes.includes(questionType)) {
                    res.status(400).json({
                        success: false,
                        message: `不支援的題型: ${questionType}。支援的題型: ${validTypes.join(', ')}`
                    });
                    return;
                }
                console.log(`[DEBUG api.controller.ts] 啟動測驗，題型: ${questionType}`);
                const question = yield orchestratorService.startSingleTypeTest(questionType);
                if (question) {
                    res.json({
                        success: true,
                        question: question
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: '無法生成題目'
                    });
                }
            }
            catch (error) {
                console.error('[DEBUG api.controller.ts] 啟動測驗時發生錯誤:', error);
                res.status(500).json({
                    success: false,
                    message: '伺服器錯誤'
                });
            }
        });
    }
    submitAnswer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, // 前端應傳來作答題目的 ID
                userAnswer, questionDataSnapshot // 前端應傳回作答時的完整題目數據 (TestOrchestratorQuestion 結構)
                 } = req.body;
                console.log(`[DEBUG api.controller.ts] submitAnswer: Received submission for questionId: ${questionId}`);
                if (!questionId || userAnswer === undefined || !questionDataSnapshot) {
                    res.status(400).json({ message: '請求參數不完整 (需要 questionId, userAnswer, questionDataSnapshot)' });
                    return;
                }
                // 確保 questionDataSnapshot 符合 TestOrchestratorQuestion 結構 (或至少有 id)
                if (questionDataSnapshot.id !== questionId) {
                    res.status(400).json({ message: '提交的 questionId 與 questionDataSnapshot.id 不匹配' });
                    return;
                }
                const result = yield orchestratorService.submitAnswer(questionId, userAnswer, questionDataSnapshot);
                if (result) {
                    res.json(result);
                }
                else {
                    res.status(500).json({ message: '答案提交失敗，或處理過程中發生錯誤。' });
                }
            }
            catch (error) {
                console.error('[DEBUG api.controller.ts] submitAnswer: Error', error);
                next(error);
            }
        });
    }
    getHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionType, limit, offset } = req.query;
                if (!questionType || typeof questionType !== 'string') {
                    res.status(400).json({ message: '必須提供 questionType 查詢參數。' });
                    return;
                }
                const limitNum = limit ? parseInt(limit, 10) : undefined;
                const offsetNum = offset ? parseInt(offset, 10) : undefined;
                console.log(`[DEBUG api.controller.ts] getHistory: For type ${questionType}, limit ${limitNum}, offset ${offsetNum}`);
                const historyEntries = yield (0, HistoryService_1.getHistory)(questionType, limitNum, offsetNum);
                res.json(historyEntries);
            }
            catch (error) {
                console.error('[DEBUG api.controller.ts] getHistory: Error', error);
                next(error);
            }
        });
    }
}
exports.default = new ApiController();
//# sourceMappingURL=api.controller.js.map