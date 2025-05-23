"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate152Question = generate152Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_152_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        passage: { type: genai_1.Type.STRING },
        question: { type: genai_1.Type.STRING },
        options: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    id: { type: genai_1.Type.STRING },
                    text: { type: genai_1.Type.STRING }
                },
                required: ['id', 'text']
            },
            minItems: 4,
            maxItems: 4,
        },
        standard_answer: { type: genai_1.Type.STRING },
        explanation_of_Question: { type: genai_1.Type.STRING },
    },
    required: ['passage', 'question', 'options', 'standard_answer', 'explanation_of_Question'],
};
const QUESTION_DATA_152_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_152_ITEM_SCHEMA,
};
/**
 * 生成 1.5.2 作者目的與語氣題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData152[] | null>
 */
async function generate152Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 152_generate.ts] Starting generation for ${numberOfQuestions} author purpose and tone questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} questions about author's purpose and tone.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Identifying author's intention, purpose, attitude, and tone in writing
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 150-250 words with clear authorial voice and purpose

Output STRICT JSON array format:
[{
  "passage": "It's absolutely mind-boggling how people continue to ignore the devastating effects of single-use plastics on our oceans. Every minute, a garbage truck's worth of plastic waste enters our marine ecosystems, yet consumers mindlessly grab plastic bags at checkout counters and sip from disposable cups as if there's no tomorrow. The evidence is overwhelming – marine life is suffocating, ecosystems are collapsing, and our food chain is contaminated. We don't need more studies or debates; we need immediate action. Every individual must take responsibility now, because frankly, our planet can't afford to wait for politicians to finally wake up and enact meaningful legislation.",
  "question": "What is the author's primary tone in this passage?",
  "options": [
    {"id": "A", "text": "Neutral and objective"},
    {"id": "B", "text": "Frustrated and urgent"},
    {"id": "C", "text": "Optimistic and encouraging"},
    {"id": "D", "text": "Scholarly and detached"}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "作者的主要語調是沮喪和急迫的。從用詞可以看出：'absolutely mind-boggling'表達強烈的不解和挫折；'mindlessly'批評人們的無知行為；'overwhelming evidence'強調問題的嚴重性；'we don't need more studies'顯示急迫感；'frankly, our planet can't afford to wait'直接表達迫切性。選項 A 的中性客觀不符合強烈的情感表達；選項 C 的樂觀鼓勵與批評性語調相反；選項 D 的學術超然與直接呼籲行動的語調不符。"
}]

Tone types: urgent, critical, optimistic, pessimistic, humorous, serious, sarcastic, neutral, passionate, analytical
Purpose types: persuade, inform, entertain, criticize, argue, explain, warn, inspire, describe, analyze

Return ONLY the JSON array. No markdown formatting.`;
        // 取得 LLM 設定
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.5.2');
        console.log(`[DEBUG 152_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_152_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.MEDIUM, 'generator_152');
        console.log(`[DEBUG 152_generate.ts] Received response from LLM`);
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 152_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }
        console.log(`[DEBUG 152_generate.ts] Generated ${response.length} question(s) for type 1.5.2.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 152_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=152_generate.js.map