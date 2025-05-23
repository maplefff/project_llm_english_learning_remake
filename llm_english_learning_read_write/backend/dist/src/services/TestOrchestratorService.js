"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HistoryService_1 = require("./HistoryService");
class TestOrchestratorService {
    questionCacheService;
    constructor(questionCacheService) {
        this.questionCacheService = questionCacheService;
    }
    formatQuestionForClient111(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.1.1',
            explanation: questionBody.explanation_of_Question, // 映射欄位名
        };
    }
    formatQuestionForClient112(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.1.2',
            explanation: questionBody.explanation_of_Question, // 映射欄位名
        };
    }
    formatQuestionForClient122(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.2.2',
            explanation: questionBody.explanation_of_Question, // 映射欄位名
        };
    }
    formatQuestionForClient123(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.2.3',
            explanation: questionBody.explanation_of_Question, // 映射欄位名
        };
    }
    async startSingleTypeTest(questionType) {
        if (questionType !== '1.1.1' && questionType !== '1.1.2') {
            console.warn(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
            return null;
        }
        try {
            console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 正在從快取獲取題型 ${questionType} 的題目`);
            // 根據題型分別處理
            let cachedEntry = null;
            if (questionType === '1.1.1') {
                cachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.1');
            }
            else if (questionType === '1.1.2') {
                cachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.2');
            }
            else {
                console.warn(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
                return null;
            }
            if (!cachedEntry || !cachedEntry.UUID || !cachedEntry.questionData) {
                console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 快取中無可用題目或返回格式不符 (題型 ${questionType})`);
                return null;
            }
            // 根據題型選擇對應的格式化方法
            let questionForClient;
            if (questionType === '1.1.1') {
                questionForClient = this.formatQuestionForClient111(cachedEntry.UUID, cachedEntry.questionData);
            }
            else { // questionType === '1.1.2'
                questionForClient = this.formatQuestionForClient112(cachedEntry.UUID, cachedEntry.questionData);
            }
            console.log(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 成功獲取題目 ${questionForClient.id}`);
            return questionForClient;
        }
        catch (error) {
            console.error(`[DEBUG TestOrchestratorService.ts] startSingleTypeTest: 獲取題目時發生錯誤`, error);
            return null;
        }
    }
    async submitAnswer(userQuestionId, userAnswer, originalQuestionClientData) {
        console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 處理題目 ${userQuestionId} 的答案提交`);
        try {
            if (!originalQuestionClientData || originalQuestionClientData.id !== userQuestionId) {
                console.error(`[DEBUG TestOrchestratorService.ts] submitAnswer: 提供的 originalQuestionClientData 無效或 questionId (${userQuestionId}) 不匹配 (${originalQuestionClientData?.id})`);
                return null;
            }
            const correctAnswer = originalQuestionClientData.standard_answer;
            const isCorrect = userAnswer === correctAnswer;
            console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 使用者答案 "${userAnswer}", 正確答案 "${correctAnswer}", 是否正確: ${isCorrect}`);
            // 根據題型構建歷史記錄快照
            const snapshotForHistory = {
                passage: originalQuestionClientData.passage,
                targetWord: originalQuestionClientData.type === '1.1.1' ? originalQuestionClientData.targetWord : undefined,
                question: originalQuestionClientData.question,
                options: originalQuestionClientData.options.map(opt => ({ id: opt.id, text: opt.text })),
                standard_answer: originalQuestionClientData.standard_answer,
            };
            const historyEntryPayload = {
                UUID: originalQuestionClientData.id,
                questionData: snapshotForHistory,
                userAnswer: userAnswer,
                isCorrect: isCorrect,
            };
            console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 準備儲存歷史記錄`, historyEntryPayload);
            await (0, HistoryService_1.saveHistoryEntry)(originalQuestionClientData.type, historyEntryPayload);
            console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 歷史記錄已儲存`);
            // 暫時只支援1.1.1，1.1.2的支援需要更新QuestionCacheService
            let nextQuestionForClient = null;
            if (originalQuestionClientData.type === '1.1.1') {
                const nextCachedEntry = await this.questionCacheService.getQuestionFromCache('1.1.1'); // nextCachedEntry is CacheEntry | null
                if (nextCachedEntry && nextCachedEntry.UUID && nextCachedEntry.questionData) {
                    // 確保數據類型正確
                    nextQuestionForClient = this.formatQuestionForClient111(nextCachedEntry.UUID, nextCachedEntry.questionData);
                    console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 下一題獲取結果: ${nextQuestionForClient.id}`);
                }
                else {
                    console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 無可用下一題`);
                }
            }
            else {
                console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 1.1.2題型的下一題獲取暫未實現`);
            }
            const submissionResult = {
                isCorrect: isCorrect,
                correctAnswer: correctAnswer,
                explanation: originalQuestionClientData.explanation || originalQuestionClientData.explanation_of_Question || '此題無解釋。',
            };
            return {
                submissionResult: submissionResult,
                nextQuestion: nextQuestionForClient,
            };
        }
        catch (error) {
            console.error(`[DEBUG TestOrchestratorService.ts] submitAnswer: 提交答案時發生錯誤 (題目ID: ${userQuestionId})`, error);
            return null;
        }
    }
}
exports.default = TestOrchestratorService;
//# sourceMappingURL=TestOrchestratorService.js.map