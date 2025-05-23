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
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient112(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.1.2',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient121(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.2.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient122(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.2.2',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient123(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.2.3',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient131(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.3.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient141(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.4.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient151(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.5.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient152(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.5.2',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient153(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '1.5.3',
            explanation: questionBody.explanation_of_Question,
        };
    }
    async startSingleTypeTest(questionType) {
        const supportedTypes = ['1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3'];
        if (!supportedTypes.includes(questionType)) {
            console.log(`[DEBUG TestOrchestratorService_v2.ts] Unsupported question type: ${questionType}`);
            return null;
        }
        console.log(`[DEBUG TestOrchestratorService_v2.ts] Starting test for question type: ${questionType}`);
        try {
            // 嘗試從快取獲取題目
            const cacheEntry = await this.questionCacheService.getQuestionFromCache(questionType);
            if (cacheEntry) {
                console.log(`[DEBUG TestOrchestratorService_v2.ts] Retrieved question from cache with UUID: ${cacheEntry.UUID}`);
                // 根據題型格式化問題
                switch (questionType) {
                    case '1.1.1':
                        return this.formatQuestionForClient111(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.1.2':
                        return this.formatQuestionForClient112(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.2.1':
                        return this.formatQuestionForClient121(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.2.2':
                        return this.formatQuestionForClient122(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.2.3':
                        return this.formatQuestionForClient123(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.3.1':
                        return this.formatQuestionForClient131(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.4.1':
                        return this.formatQuestionForClient141(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.5.1':
                        return this.formatQuestionForClient151(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.5.2':
                        return this.formatQuestionForClient152(cacheEntry.UUID, cacheEntry.questionData);
                    case '1.5.3':
                        return this.formatQuestionForClient153(cacheEntry.UUID, cacheEntry.questionData);
                    default:
                        console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in switch: ${questionType}`);
                        return null;
                }
            }
            else {
                console.log(`[DEBUG TestOrchestratorService_v2.ts] No cached question available for ${questionType}, attempting direct generation...`);
                // 直接生成題目
                const generated = await this.generateQuestionDirectly(questionType);
                if (generated && Array.isArray(generated) && generated.length > 0) {
                    const firstQuestion = generated[0];
                    const tempId = `temp_${Date.now()}`;
                    // 根據題型格式化問題
                    switch (questionType) {
                        case '1.1.1':
                            return this.formatQuestionForClient111(tempId, firstQuestion);
                        case '1.1.2':
                            return this.formatQuestionForClient112(tempId, firstQuestion);
                        case '1.2.1':
                            return this.formatQuestionForClient121(tempId, firstQuestion);
                        case '1.2.2':
                            return this.formatQuestionForClient122(tempId, firstQuestion);
                        case '1.2.3':
                            return this.formatQuestionForClient123(tempId, firstQuestion);
                        case '1.3.1':
                            return this.formatQuestionForClient131(tempId, firstQuestion);
                        case '1.4.1':
                            return this.formatQuestionForClient141(tempId, firstQuestion);
                        case '1.5.1':
                            return this.formatQuestionForClient151(tempId, firstQuestion);
                        case '1.5.2':
                            return this.formatQuestionForClient152(tempId, firstQuestion);
                        case '1.5.3':
                            return this.formatQuestionForClient153(tempId, firstQuestion);
                        default:
                            console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in generation switch: ${questionType}`);
                            return null;
                    }
                }
                else {
                    console.error(`[DEBUG TestOrchestratorService_v2.ts] Failed to generate question for type: ${questionType}`);
                    return null;
                }
            }
        }
        catch (error) {
            console.error(`[DEBUG TestOrchestratorService_v2.ts] Error in startSingleTypeTest:`, error);
            return null;
        }
    }
    async generateQuestionDirectly(questionType) {
        try {
            // 動態導入QuestionGeneratorService
            const { QuestionGeneratorService } = await Promise.resolve().then(() => __importStar(require('./QuestionGeneratorService')));
            const result = await QuestionGeneratorService.generateQuestionByType(questionType, 70, // 預設難度
            "No history available.", // 預設歷史
            1 // 生成1題
            );
            if (!result || (Array.isArray(result) && result.length === 0)) {
                console.log(`[DEBUG TestOrchestratorService.ts] generateQuestionDirectly: 無法生成題型 ${questionType} 的題目`);
                return null;
            }
            // 處理生成結果
            const questionData = Array.isArray(result) ? result : [result];
            const questionIds = questionData.map(data => `direct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            // 根據題型格式化
            const formattedQuestions = questionData.map((data, index) => {
                const questionId = questionIds[index];
                switch (questionType) {
                    case '1.1.1':
                        return this.formatQuestionForClient111(questionId, data);
                    case '1.1.2':
                        return this.formatQuestionForClient112(questionId, data);
                    case '1.2.1':
                        return this.formatQuestionForClient121(questionId, data);
                    case '1.2.2':
                        return this.formatQuestionForClient122(questionId, data);
                    case '1.2.3':
                        return this.formatQuestionForClient123(questionId, data);
                    case '1.3.1':
                        return this.formatQuestionForClient131(questionId, data);
                    case '1.4.1':
                        return this.formatQuestionForClient141(questionId, data);
                    case '1.5.1':
                        return this.formatQuestionForClient151(questionId, data);
                    case '1.5.2':
                        return this.formatQuestionForClient152(questionId, data);
                    case '1.5.3':
                        return this.formatQuestionForClient153(questionId, data);
                    default:
                        return null;
                }
            }).filter((q) => q !== null);
            return formattedQuestions;
        }
        catch (error) {
            console.error(`[DEBUG TestOrchestratorService.ts] generateQuestionDirectly: 錯誤`, error);
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
            // 根據題型處理答案評分
            let correctAnswer;
            let isCorrect;
            if (originalQuestionClientData.type === '1.2.1') {
                // 1.2.1 是改錯題，需要特殊處理
                const question121 = originalQuestionClientData;
                correctAnswer = question121.standard_corrections[0]; // 使用第一個標準答案作為主要答案
                // 檢查用戶答案是否與任何標準答案匹配
                isCorrect = question121.standard_corrections.some(correction => userAnswer.trim().toLowerCase() === correction.trim().toLowerCase());
            }
            else {
                // 選擇題類型
                const mcQuestion = originalQuestionClientData;
                correctAnswer = mcQuestion.standard_answer;
                isCorrect = userAnswer === correctAnswer;
            }
            console.log(`[DEBUG TestOrchestratorService.ts] submitAnswer: 使用者答案 "${userAnswer}", 正確答案 "${correctAnswer}", 是否正確: ${isCorrect}`);
            // 根據題型構建歷史記錄快照
            const snapshotForHistory = {
                passage: this.getPassageFromQuestion(originalQuestionClientData) || '', // 提供預設值
                targetWord: originalQuestionClientData.type === '1.1.1' ? originalQuestionClientData.targetWord : undefined,
                question: this.getQuestionFromData(originalQuestionClientData),
                options: this.getOptionsFromData(originalQuestionClientData),
                standard_answer: correctAnswer,
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
            // 獲取下一題 - 暫時只從相同題型獲取
            const nextQuestionForClient = await this.startSingleTypeTest(originalQuestionClientData.type);
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
    getPassageFromQuestion(question) {
        if ('passage' in question) {
            return question.passage;
        }
        if ('sentence_context' in question) {
            return question.sentence_context;
        }
        if ('original_sentence' in question) {
            return question.original_sentence;
        }
        return undefined;
    }
    getQuestionFromData(question) {
        if ('question' in question) {
            return question.question;
        }
        if ('instruction' in question) {
            return question.instruction;
        }
        return 'No question text available';
    }
    getOptionsFromData(question) {
        if ('options' in question) {
            return question.options.map(opt => ({ id: opt.id, text: opt.text }));
        }
        return [];
    }
}
exports.default = TestOrchestratorService;
//# sourceMappingURL=TestOrchestratorService_v2.js.map