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
exports.generate241Question = generate241Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
const QUESTION_DATA_241_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        scrambled_sentences: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 4,
            maxItems: 7
        },
        instruction: { type: genai_1.Type.STRING },
        correct_order: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.INTEGER },
            minItems: 4,
            maxItems: 7
        },
        topic_hint: { type: genai_1.Type.STRING },
        explanation_of_Question: { type: genai_1.Type.STRING }
    },
    required: ['scrambled_sentences', 'instruction', 'correct_order', 'topic_hint', 'explanation_of_Question'],
};
const QUESTION_DATA_241_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_241_ITEM_SCHEMA,
};
function generate241Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
        console.log(`[DEBUG 241_generate.ts] Starting generation for ${numberOfQuestions} paragraph sequencing questions, difficulty: ${difficultySetting}`);
        try {
            const prompt = `You are an expert English paragraph organization test generator.
Generate exactly ${numberOfQuestions} paragraph sequencing exercises.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Logical sequence, coherence, paragraph organization
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide sentences that form a coherent paragraph when correctly ordered

Output STRICT JSON array format:
[{
  "scrambled_sentences": [
    "Finally, she submitted her application and waited nervously for a response.",
    "Sarah had always dreamed of studying abroad in England.",
    "After months of preparation, she felt confident about her language skills.",
    "First, she researched different universities and their requirements.",
    "Then, she spent a year improving her English through intensive classes."
  ],
  "instruction": "請將這些句子重新排列，組成一個邏輯連貫的段落。請按照正確的時間順序和邏輯關係排列。",
  "correct_order": [2, 4, 5, 3, 1],
  "topic_hint": "一個關於準備出國留學過程的故事",
  "explanation_of_Question": "這個段落按照時間順序描述Sarah準備出國留學的過程：首先介紹她的夢想(句子2)，然後是研究階段(句子4)，接著是語言學習階段(句子5)，再來是準備完成的感受(句子3)，最後是提交申請(句子1)。這種時間順序的安排使故事更加連貫和易於理解。"
}]

Paragraph types: narrative, process description, cause-effect, problem-solution, chronological order
Include transition words and logical connectors for better sequencing cues.
Sentence count: 4-7 sentences depending on difficulty level.

Return ONLY the JSON array. No markdown formatting.`;
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.4.1');
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_241_ARRAY_SCHEMA,
                config,
            });
            if (!Array.isArray(response)) {
                console.error('[DEBUG 241_generate.ts] Invalid response type from LLM: expected an array, got', typeof response);
                return null;
            }
            console.log(`[DEBUG 241_generate.ts] Generated ${response.length} question(s) for type 2.4.1.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 241_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=241_generate.js.map