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
exports.generate222Question = generate222Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_222_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        scrambled_words: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 4,
            maxItems: 12
        },
        instruction: { type: genai_1.Type.STRING },
        standard_answers: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        explanation_of_Question: { type: genai_1.Type.STRING }
    },
    required: ['scrambled_words', 'instruction', 'standard_answers', 'explanation_of_Question'],
};
const QUESTION_DATA_222_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_222_ITEM_SCHEMA,
};
/**
 * 生成 2.2.2 句子重組題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData222[] | null>
 */
function generate222Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
        console.log(`[DEBUG 222_generate.ts] Starting generation for ${numberOfQuestions} sentence scrambling questions, difficulty: ${difficultySetting}`);
        try {
            const prompt = `You are an expert English sentence structure test generator.
Generate exactly ${numberOfQuestions} sentence scrambling exercises.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Word order, sentence structure, syntax understanding
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide scrambled words that form meaningful sentences

Output STRICT JSON array format:
[{
  "scrambled_words": ["yesterday", "to", "went", "I", "the", "library", "some", "books", "borrow", "to"],
  "instruction": "請將這些單字重新排列成一個語法正確且意義完整的句子。",
  "standard_answers": [
    "Yesterday I went to the library to borrow some books.",
    "I went to the library yesterday to borrow some books."
  ],
  "explanation_of_Question": "這題考驗學生對英語基本句型結構的理解。正確的語序應該是：時間副詞 + 主詞 + 動詞 + 介詞片語 + 不定詞片語表目的。'Yesterday' 可以放在句首或主詞後面。句子結構：I (主詞) + went (動詞) + to the library (地點) + to borrow some books (目的)。"
}]

Sentence types to include: simple, compound, complex sentences
Grammar structures: present/past tense, questions, negatives, conditionals, relative clauses
Word count: 6-15 words depending on difficulty
Ensure scrambled words can form grammatically correct and meaningful sentences.

Return ONLY the JSON array. No markdown formatting.`;
            // 取得 LLM 設定
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.2.2');
            console.log(`[DEBUG 222_generate.ts] Sending prompt to LLM service`);
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_222_ARRAY_SCHEMA,
                config,
            });
            console.log(`[DEBUG 222_generate.ts] Received response from LLM`);
            // 進行基本的響應驗證 (是否為數組)
            if (!Array.isArray(response)) {
                console.error('[DEBUG 222_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
                return null;
            }
            console.log(`[DEBUG 222_generate.ts] Generated ${response.length} question(s) for type 2.2.2.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 222_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=222_generate.js.map