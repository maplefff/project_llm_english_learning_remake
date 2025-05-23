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
exports.generate121Question = generate121Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_121_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        original_sentence: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        standard_corrections: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 5,
        },
        error_types: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 5,
        },
        explanation_of_Question: { type: genai_1.Type.STRING },
    },
    required: ['original_sentence', 'instruction', 'standard_corrections', 'error_types', 'explanation_of_Question'],
};
const QUESTION_DATA_121_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_121_ITEM_SCHEMA,
};
/**
 * 生成 1.2.1 句子改錯題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData121[] | null>
 */
function generate121Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
        console.log(`[DEBUG 121_generate.ts] Starting generation for ${numberOfQuestions} sentence correction questions, difficulty: ${difficultySetting}`);
        try {
            const prompt = `You are an expert English grammar error correction test generator.
Generate exactly ${numberOfQuestions} sentence correction questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Common grammar errors like tense mistakes, subject-verb agreement, articles, prepositions, word form errors
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each sentence should contain 1-3 clear errors that students need to identify and correct

Output STRICT JSON array format:
[{
  "original_sentence": "She go to the library yesterday for study.",
  "instruction": "Identify the error(s) in the sentence above and rewrite it correctly.",
  "standard_corrections": [
    "She went to the library yesterday to study.",
    "She went to the library yesterday for studying."
  ],
  "error_types": ["verb_tense", "infinitive_vs_gerund"],
  "explanation_of_Question": "句子中有兩個錯誤：1. 'go' 應該改為過去式 'went'，因為有時間副詞 'yesterday'；2. 'for study' 應該改為 'to study' 或 'for studying'，表示目的。正確的句子應該是 'She went to the library yesterday to study.' 或 'She went to the library yesterday for studying.'"
}]

Error types to include: verb_tense, subject_verb_agreement, articles, prepositions, word_form, plural_singular, pronoun_case, infinitive_vs_gerund, comparative_superlative, modal_verbs

Return ONLY the JSON array. No markdown formatting.`;
            // 取得 LLM 設定
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.2.1');
            console.log(`[DEBUG 121_generate.ts] Sending prompt to LLM service`);
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_121_ARRAY_SCHEMA,
                config,
            });
            console.log(`[DEBUG 121_generate.ts] Received response from LLM`);
            // 進行基本的響應驗證 (是否為數組)
            if (!Array.isArray(response)) {
                console.error('[DEBUG 121_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
                return null;
            }
            console.log(`[DEBUG 121_generate.ts] Generated ${response.length} question(s) for type 1.2.1.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 121_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=121_generate.js.map