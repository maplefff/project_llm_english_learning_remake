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
exports.generate252Question = generate252Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
const QUESTION_DATA_252_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        scenario: { type: genai_1.Type.STRING },
        recipient: { type: genai_1.Type.STRING },
        purpose: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        required_content: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 5
        },
        tone: { type: genai_1.Type.STRING },
        min_words: { type: genai_1.Type.INTEGER },
        max_words: { type: genai_1.Type.INTEGER },
        evaluation_criteria: {
            type: genai_1.Type.OBJECT,
            properties: {
                grammar: { type: genai_1.Type.INTEGER },
                vocabulary: { type: genai_1.Type.INTEGER },
                coherence: { type: genai_1.Type.INTEGER },
                task_achievement: { type: genai_1.Type.INTEGER },
                appropriateness: { type: genai_1.Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement', 'appropriateness']
        },
        sample_responses: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 2
        }
    },
    required: ['scenario', 'recipient', 'purpose', 'instruction', 'required_content', 'tone', 'min_words', 'max_words', 'evaluation_criteria', 'sample_responses'],
};
const QUESTION_DATA_252_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_252_ITEM_SCHEMA,
};
function generate252Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
        console.log(`[DEBUG 252_generate.ts] Starting generation for ${numberOfQuestions} email/letter writing questions, difficulty: ${difficultySetting}`);
        try {
            const prompt = `Generate ${numberOfQuestions} email/letter writing questions. Return JSON array format.`;
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.5.2');
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_252_ARRAY_SCHEMA,
                config,
            });
            if (!Array.isArray(response)) {
                console.error('[DEBUG 252_generate.ts] Invalid response type from LLM');
                return null;
            }
            console.log(`[DEBUG 252_generate.ts] Generated ${response.length} question(s) for type 2.5.2.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 252_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=252_generate.js.map