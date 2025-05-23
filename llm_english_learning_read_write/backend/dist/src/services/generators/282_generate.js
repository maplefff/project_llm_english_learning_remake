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
exports.generate282Question = generate282Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
const QUESTION_DATA_282_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        source_text: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        reference_translations: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 2
        },
        evaluation_focus: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 4
        },
        context: { type: genai_1.Type.STRING }
    },
    required: ['source_text', 'instruction', 'reference_translations', 'evaluation_focus', 'context'],
};
const QUESTION_DATA_282_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_282_ITEM_SCHEMA,
};
function generate282Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
        console.log(`[DEBUG 282_generate.ts] Starting generation for ${numberOfQuestions} English-to-Chinese paragraph translation questions, difficulty: ${difficultySetting}`);
        try {
            const prompt = `Generate ${numberOfQuestions} English-to-Chinese paragraph translation questions. Return JSON array format.`;
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.8.2');
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_282_ARRAY_SCHEMA,
                config,
            });
            if (!Array.isArray(response)) {
                console.error('[DEBUG 282_generate.ts] Invalid response type from LLM');
                return null;
            }
            console.log(`[DEBUG 282_generate.ts] Generated ${response.length} question(s) for type 2.8.2.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 282_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=282_generate.js.map