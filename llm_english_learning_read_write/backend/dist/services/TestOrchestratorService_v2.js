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
    // 1.x.x 系列格式化方法
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
    // 2.x.x 系列格式化方法
    formatQuestionForClient211(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.1.1',
            explanation: '寫作題型，請根據提示進行創作。',
        };
    }
    formatQuestionForClient212(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.1.2',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient221(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.2.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient222(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.2.2',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient231(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.3.1',
            explanation: '段落寫作題型，請根據主題和要求撰寫文章。',
        };
    }
    formatQuestionForClient241(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.4.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient242(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.4.2',
            explanation: '短文寫作題型，請根據主題和要求撰寫短文。',
        };
    }
    formatQuestionForClient251(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.5.1',
            explanation: '簡答題型，請根據問題進行回答。',
        };
    }
    formatQuestionForClient252(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.5.2',
            explanation: '郵件/信函寫作題型，請根據情境撰寫。',
        };
    }
    formatQuestionForClient261(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.6.1',
            explanation: questionBody.explanation_of_Question,
        };
    }
    formatQuestionForClient271(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.7.1',
            explanation: '中翻英句子題型，請將中文翻譯成英文。',
        };
    }
    formatQuestionForClient272(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.7.2',
            explanation: '中翻英短文題型，請將中文翻譯成英文。',
        };
    }
    formatQuestionForClient281(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.8.1',
            explanation: '英翻中句子題型，請將英文翻譯成中文。',
        };
    }
    formatQuestionForClient282(cacheId, questionBody) {
        return {
            ...questionBody,
            id: cacheId,
            type: '2.8.2',
            explanation: '英翻中短文題型，請將英文翻譯成中文。',
        };
    }
    async startSingleTypeTest(questionType) {
        const supportedTypes = [
            '1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3',
            '2.1.1', '2.1.2', '2.2.1', '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.5.1', '2.5.2', '2.6.1',
            '2.7.1', '2.7.2', '2.8.1', '2.8.2'
        ];
        if (!supportedTypes.includes(questionType)) {
            console.warn(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 不支援的題型 ${questionType}`);
            return null;
        }
        try {
            console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 正在從快取獲取題型 ${questionType} 的題目`);
            // 首先嘗試從快取獲取
            const cachedEntry = await this.questionCacheService.getQuestionFromCache(questionType);
            if (cachedEntry && cachedEntry.UUID && cachedEntry.questionData) {
                // 根據題型選擇對應的格式化方法
                let questionForClient;
                switch (questionType) {
                    // 1.x.x 系列
                    case '1.1.1':
                        questionForClient = this.formatQuestionForClient111(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.1.2':
                        questionForClient = this.formatQuestionForClient112(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.2.1':
                        questionForClient = this.formatQuestionForClient121(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.2.2':
                        questionForClient = this.formatQuestionForClient122(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.2.3':
                        questionForClient = this.formatQuestionForClient123(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.3.1':
                        questionForClient = this.formatQuestionForClient131(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.4.1':
                        questionForClient = this.formatQuestionForClient141(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.5.1':
                        questionForClient = this.formatQuestionForClient151(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.5.2':
                        questionForClient = this.formatQuestionForClient152(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '1.5.3':
                        questionForClient = this.formatQuestionForClient153(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    // 2.x.x 系列
                    case '2.1.1':
                        questionForClient = this.formatQuestionForClient211(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.1.2':
                        questionForClient = this.formatQuestionForClient212(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.2.1':
                        questionForClient = this.formatQuestionForClient221(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.2.2':
                        questionForClient = this.formatQuestionForClient222(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.3.1':
                        questionForClient = this.formatQuestionForClient231(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.4.1':
                        questionForClient = this.formatQuestionForClient241(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.4.2':
                        questionForClient = this.formatQuestionForClient242(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.5.1':
                        questionForClient = this.formatQuestionForClient251(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.5.2':
                        questionForClient = this.formatQuestionForClient252(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.6.1':
                        questionForClient = this.formatQuestionForClient261(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.7.1':
                        questionForClient = this.formatQuestionForClient271(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.7.2':
                        questionForClient = this.formatQuestionForClient272(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.8.1':
                        questionForClient = this.formatQuestionForClient281(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    case '2.8.2':
                        questionForClient = this.formatQuestionForClient282(cachedEntry.UUID, cachedEntry.questionData);
                        break;
                    default:
                        console.error(`[DEBUG TestOrchestratorService_v2.ts] Unexpected question type in cache switch: ${questionType}`);
                        return null;
                }
                console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 成功獲取題目 ${questionForClient.id}`);
                return questionForClient;
            }
            // 如果快取中沒有，嘗試直接生成
            console.log(`[DEBUG TestOrchestratorService_v2.ts] startSingleTypeTest: 快取中無可用題目，嘗試直接生成 (題型 ${questionType})`);
            const generatedQuestions = await this.generateQuestionDirectly(questionType);
            if (generatedQuestions && generatedQuestions.length > 0) {
                const firstQuestion = generatedQuestions[0];
                const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                // 根據題型格式化
                switch (questionType) {
                    // 1.x.x 系列
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
                    // 2.x.x 系列
                    case '2.1.1':
                        return this.formatQuestionForClient211(tempId, firstQuestion);
                    case '2.1.2':
                        return this.formatQuestionForClient212(tempId, firstQuestion);
                    case '2.2.1':
                        return this.formatQuestionForClient221(tempId, firstQuestion);
                    case '2.2.2':
                        return this.formatQuestionForClient222(tempId, firstQuestion);
                    case '2.3.1':
                        return this.formatQuestionForClient231(tempId, firstQuestion);
                    case '2.4.1':
                        return this.formatQuestionForClient241(tempId, firstQuestion);
                    case '2.4.2':
                        return this.formatQuestionForClient242(tempId, firstQuestion);
                    case '2.5.1':
                        return this.formatQuestionForClient251(tempId, firstQuestion);
                    case '2.5.2':
                        return this.formatQuestionForClient252(tempId, firstQuestion);
                    case '2.6.1':
                        return this.formatQuestionForClient261(tempId, firstQuestion);
                    case '2.7.1':
                        return this.formatQuestionForClient271(tempId, firstQuestion);
                    case '2.7.2':
                        return this.formatQuestionForClient272(tempId, firstQuestion);
                    case '2.8.1':
                        return this.formatQuestionForClient281(tempId, firstQuestion);
                    case '2.8.2':
                        return this.formatQuestionForClient282(tempId, firstQuestion);
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
                    // 1.x.x 系列
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
                    // 2.x.x 系列
                    case '2.1.1':
                        return this.formatQuestionForClient211(questionId, data);
                    case '2.1.2':
                        return this.formatQuestionForClient212(questionId, data);
                    case '2.2.1':
                        return this.formatQuestionForClient221(questionId, data);
                    case '2.2.2':
                        return this.formatQuestionForClient222(questionId, data);
                    case '2.3.1':
                        return this.formatQuestionForClient231(questionId, data);
                    case '2.4.1':
                        return this.formatQuestionForClient241(questionId, data);
                    case '2.4.2':
                        return this.formatQuestionForClient242(questionId, data);
                    case '2.5.1':
                        return this.formatQuestionForClient251(questionId, data);
                    case '2.5.2':
                        return this.formatQuestionForClient252(questionId, data);
                    case '2.6.1':
                        return this.formatQuestionForClient261(questionId, data);
                    case '2.7.1':
                        return this.formatQuestionForClient271(questionId, data);
                    case '2.7.2':
                        return this.formatQuestionForClient272(questionId, data);
                    case '2.8.1':
                        return this.formatQuestionForClient281(questionId, data);
                    case '2.8.2':
                        return this.formatQuestionForClient282(questionId, data);
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
            if (originalQuestionClientData.type === '1.2.1' || originalQuestionClientData.type === '2.1.2') {
                // 改錯題，需要特殊處理
                const question = originalQuestionClientData;
                correctAnswer = question.standard_corrections[0]; // 使用第一個標準答案作為主要答案
                // 檢查用戶答案是否與任何標準答案匹配
                isCorrect = question.standard_corrections.some(correction => userAnswer.trim().toLowerCase() === correction.trim().toLowerCase());
            }
            else if (originalQuestionClientData.type === '2.2.1' || originalQuestionClientData.type === '2.2.2' || originalQuestionClientData.type === '2.6.1') {
                // 多標準答案的題型
                const question = originalQuestionClientData;
                correctAnswer = question.standard_answers[0];
                isCorrect = question.standard_answers.some(answer => userAnswer.trim().toLowerCase() === answer.trim().toLowerCase());
            }
            else if (originalQuestionClientData.type === '2.4.1') {
                // 排序題
                const question = originalQuestionClientData;
                correctAnswer = question.correct_order;
                isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
            }
            else if (['2.1.1', '2.3.1', '2.4.2', '2.5.1', '2.5.2', '2.7.1', '2.7.2', '2.8.1', '2.8.2'].includes(originalQuestionClientData.type)) {
                // 寫作題和翻譯題，需要特殊評分
                correctAnswer = '寫作/翻譯題需要人工評分';
                isCorrect = false; // 預設為需要評分
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
        if ('source_text' in question) {
            return question.source_text;
        }
        if ('context' in question) {
            return question.context;
        }
        if ('prompt' in question) {
            return question.prompt;
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
        if ('topic' in question) {
            return question.topic;
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