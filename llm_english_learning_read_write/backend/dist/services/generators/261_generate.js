"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate261Question = generate261Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
const QUESTION_DATA_261_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        original_sentence: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        transformation_type: { type: genai_1.Type.STRING },
        standard_answers: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        hints: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        explanation_of_Question: { type: genai_1.Type.STRING }
    },
    required: ['original_sentence', 'instruction', 'transformation_type', 'standard_answers', 'hints', 'explanation_of_Question'],
};
const QUESTION_DATA_261_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_261_ITEM_SCHEMA,
};
async function generate261Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 261_generate.ts] Starting generation for ${numberOfQuestions} sentence transformation questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `Generate ${numberOfQuestions} sentence transformation questions. Return JSON array format.`;
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.6.1');
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_261_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.LOW, 'generator_261');
        if (!Array.isArray(response)) {
            console.error('[DEBUG 261_generate.ts] Invalid response type from LLM');
            return null;
        }
        console.log(`[DEBUG 261_generate.ts] Generated ${response.length} question(s) for type 2.6.1.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 261_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=261_generate.js.map