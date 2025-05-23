"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate153Question = generate153Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_153_ITEM_SCHEMA = {
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
const QUESTION_DATA_153_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_153_ITEM_SCHEMA,
};
/**
 * 生成 1.5.3 文本結構與組織題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData153[] | null>
 */
async function generate153Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 153_generate.ts] Starting generation for ${numberOfQuestions} text structure questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} questions about text structure and organization.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Identifying organizational patterns, text structure, logical flow, and information arrangement
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 150-250 words with clear organizational structure

Output STRICT JSON array format:
[{
  "passage": "The problem of urban air pollution has reached critical levels in many major cities worldwide. First, vehicle emissions contribute approximately 60% of urban air pollutants, releasing harmful substances like nitrogen oxides and particulate matter. Second, industrial activities add another 25% through factory smokestacks and chemical processes. Additionally, construction dust and residential heating account for the remaining 15%. However, several solutions are being implemented to address this crisis. Many cities are expanding public transportation systems to reduce car dependency. Furthermore, governments are enforcing stricter emissions standards for both vehicles and industries. Finally, green building initiatives and renewable energy adoption are helping to minimize pollution from construction and residential sources.",
  "question": "How is the information in this passage primarily organized?",
  "options": [
    {"id": "A", "text": "Chronological order from past to present"},
    {"id": "B", "text": "Problem-solution structure with detailed causes"},
    {"id": "C", "text": "Comparison between different cities"},
    {"id": "D", "text": "Cause and effect analysis of a single event"}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "這段文章的主要組織結構是問題-解決方案結構，並詳細說明原因。文章先提出都市空氣污染問題，然後用 'First', 'Second', 'Additionally' 依序說明污染的三個主要來源（車輛排放60%、工業活動25%、建築和住宅15%）。接著用 'However' 轉折，介紹幾種解決方案，並用 'Many cities', 'Furthermore', 'Finally' 來組織解決方案。選項 A 的時間順序不符合；選項 C 的城市比較文中沒有；選項 D 的單一事件因果分析太狹隘，文中討論的是整體問題和多重解決方案。"
}]

Structure types: problem-solution, cause-effect, compare-contrast, chronological, spatial, classification, process/sequence, general-specific
Signal words: first, second, however, furthermore, in contrast, as a result, for example, finally, meanwhile, nevertheless

Return ONLY the JSON array. No markdown formatting.`;
        // 取得 LLM 設定
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.5.3');
        console.log(`[DEBUG 153_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_153_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.MEDIUM, 'generator_153');
        console.log(`[DEBUG 153_generate.ts] Received response from LLM`);
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 153_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }
        console.log(`[DEBUG 153_generate.ts] Generated ${response.length} question(s) for type 1.5.3.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 153_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=153_generate.js.map