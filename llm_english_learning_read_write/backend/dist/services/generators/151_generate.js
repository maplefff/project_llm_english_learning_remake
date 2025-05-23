"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate151Question = generate151Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_151_ITEM_SCHEMA = {
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
const QUESTION_DATA_151_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_151_ITEM_SCHEMA,
};
/**
 * 生成 1.5.1 推論能力題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData151[] | null>
 */
async function generate151Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 151_generate.ts] Starting generation for ${numberOfQuestions} inference questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} inference and implication questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Testing ability to infer meanings, draw conclusions, understand implications not explicitly stated
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 150-250 words with implicit meanings, subtle hints, or unstated conclusions

Output STRICT JSON array format:
[{
  "passage": "The marketing department has been working around the clock for the past month, with employees staying late and working weekends. Despite their exhaustive efforts to boost sales through various campaigns, the quarterly report shows declining numbers across all product lines. Several senior executives have been holding closed-door meetings, and there's been unusual activity in the HR department. The company's latest internal memo emphasized 'strategic restructuring' and 'optimizing human resources for future growth.'",
  "question": "What can be inferred from the passage about the company's likely future actions?",
  "options": [
    {"id": "A", "text": "The company will launch more marketing campaigns."},
    {"id": "B", "text": "The company may implement layoffs or downsizing."},
    {"id": "C", "text": "The marketing department will receive additional funding."},
    {"id": "D", "text": "The company will expand its product lines."}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "從文章中可以推論出公司可能實施裁員或縮編。線索包括：1) 儘管行銷部門努力工作，銷售仍下滑；2) 高層主管頻繁密會；3) 人事部門有異常活動；4) 內部備忘錄提到'策略重組'和'優化人力資源'。這些暗示通常指向人事異動，特別是裁員。選項 A、C、D 都與文中暗示的負面趨勢不符。"
}]

Inference types: implied meaning, cause-effect relationships, future consequences, character motivations, unstated conclusions, reading between the lines
Topics: business situations, social issues, interpersonal relationships, academic scenarios, everyday situations

Return ONLY the JSON array. No markdown formatting.`;
        // 取得 LLM 設定
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.5.1');
        console.log(`[DEBUG 151_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_151_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.MEDIUM, 'generator_151');
        console.log(`[DEBUG 151_generate.ts] Received response from LLM`);
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 151_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }
        console.log(`[DEBUG 151_generate.ts] Generated ${response.length} question(s) for type 1.5.1.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 151_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=151_generate.js.map