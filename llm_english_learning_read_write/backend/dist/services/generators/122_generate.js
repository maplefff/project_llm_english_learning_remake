"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate122Question = generate122Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_122_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        question: { type: genai_1.Type.STRING },
        options: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    id: { type: genai_1.Type.STRING },
                    text: { type: genai_1.Type.STRING },
                },
                required: ['id', 'text'],
            },
            minItems: 4,
            maxItems: 4,
        },
        standard_answer: { type: genai_1.Type.STRING },
        explanation_of_Question: { type: genai_1.Type.STRING },
    },
    required: ['question', 'options', 'standard_answer', 'explanation_of_Question'],
};
const QUESTION_DATA_122_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_122_ITEM_SCHEMA,
};
/**
 * 生成 1.2.2 語法結構選擇題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData122[] | null>
 */
async function generate122Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 122_generate.ts] Starting generation for ${numberOfQuestions} grammar structure questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `You are an expert English grammar test generator.
Generate exactly ${numberOfQuestions} grammar structure multiple-choice questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Test correct grammatical structures, tenses, subject-verb agreement, word order, articles
3. Learner context: ${historySummary || "No previous learning history available"}

Output STRICT JSON array format:
[{
  "question": "Which sentence is grammatically correct?",
  "options": [
    {"id": "A", "text": "Him and I is going to the park."},
    {"id": "B", "text": "He and I are going to the park."},
    {"id": "C", "text": "Me and him are going to the park."},
    {"id": "D", "text": "He and me is going to the park."}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "選項 B 是正確的，因為主詞 'He and I' 應該搭配複數動詞 'are'，且主詞應使用主格代名詞 'He' 和 'I'。選項 A 中 'Him and I' 混用了受格和主格；選項 C 中 'Me and him' 都是受格；選項 D 中 'is' 是單數動詞不匹配複數主詞。"
}]

Return ONLY the JSON array. No markdown formatting.`;
        // 取得 LLM 設定
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.2.2');
        console.log(`[DEBUG 122_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_122_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.MEDIUM, 'generator_122');
        console.log(`[DEBUG 122_generate.ts] Received response from LLM`);
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 122_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null; // 直接返回 null
        }
        console.log(`[DEBUG 122_generate.ts] Generated ${response.length} question(s) for type 1.2.2.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 122_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=122_generate.js.map