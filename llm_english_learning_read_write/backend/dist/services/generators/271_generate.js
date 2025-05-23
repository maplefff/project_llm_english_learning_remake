"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate271Question = generate271Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
const QUESTION_DATA_271_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        source_text: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        reference_translations: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        evaluation_focus: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 4
        }
    },
    required: ['source_text', 'instruction', 'reference_translations', 'evaluation_focus'],
};
const QUESTION_DATA_271_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_271_ITEM_SCHEMA,
};
async function generate271Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 271_generate.ts] Starting generation for ${numberOfQuestions} Chinese-to-English sentence translation questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `Generate ${numberOfQuestions} Chinese-to-English sentence translation questions. Return JSON array format.`;
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.7.1');
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_271_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.LOW, 'generator_271');
        if (!Array.isArray(response)) {
            console.error('[DEBUG 271_generate.ts] Invalid response type from LLM');
            return null;
        }
        console.log(`[DEBUG 271_generate.ts] Generated ${response.length} question(s) for type 2.7.1.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 271_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=271_generate.js.map