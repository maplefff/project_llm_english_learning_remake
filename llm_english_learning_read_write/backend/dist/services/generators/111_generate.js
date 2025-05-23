"use strict";
// llm_english_learning_read&write/backend/src/services/generators/111_generate.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate111Question = generate111Question;
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai"); // 新 SDK 的型別定義
require("dotenv/config"); // 確保環境變數已加載
const LLMConfigService_1 = require("../../utils/LLMConfigService"); // 匯入 LLMConfigService
// 定義 LLM 應回傳的單個 JSON 物件結構 Schema
const QUESTION_DATA_111_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        passage: { type: genai_1.Type.STRING },
        targetWord: { type: genai_1.Type.STRING },
        question: { type: genai_1.Type.STRING },
        options: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    id: { type: genai_1.Type.STRING },
                    text: { type: genai_1.Type.STRING },
                },
                required: ['id', 'text'],
            },
            minItems: 4, // 確保至少有4個選項
            maxItems: 4, // 確保最多有4個選項
        },
        standard_answer: { type: genai_1.Type.STRING },
        explanation_of_Question: { type: genai_1.Type.STRING },
    },
    required: [
        'passage',
        'targetWord',
        'question',
        'options',
        'standard_answer',
        'explanation_of_Question',
    ],
};
// 定義 LLM 應回傳的 JSON 陣列結構 Schema
const QUESTION_DATA_111_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_111_ITEM_SCHEMA,
};
/**
 * Generates a question for type 1.1.1 (Word Meaning in Sentence).
 *
 * @param questionNumber The number of questions to generate.
 * @param historySummary A summary of the learner's history for difficulty adjustment.
 * @param difficultySetting The target correct answer rate (e.g., 70 for 70%).
 * @returns A Promise that resolves to an array of question data objects or null if generation fails.
 */
async function generate111Question(questionNumber = 1, historySummary = "", difficultySetting = 70) {
    const PROMPT_TEMPLATE_1_1_1 = `You are an expert English-quiz generator for language learners.
1. Generate exactly {QUESTION_NUMBER} multiple-choice questions. The output must be an array containing this number of question objects.
2. Learner context: {HISTORY_SUMMARY}  
3. Difficulty is set to: {DIFFICULTY_SETTING}% target accuracy (Adjust difficulty with reference to CEFR levels A1–C2)..  
4. Question type: test only vocabulary meaning, synonyms, and near-synonyms (no grammar).  
5. Output STRICT JSON: an array of question objects. If "questionNumber" (from point 1) is 1, the array should contain a single question object. The length of the array must exactly match the "questionNumber".  
Each object in the array must contain:  
• "passage" (string) – context sentence or short passage  
• "targetWord" (string) – the word being tested  
• "question" (string) – the question prompt  
• "options" (array of 4 objects { "id": string, "text": string }, e.g., [{"id":"A", "text":"..."}, ...])  
• "standard_answer" (string) – one of the "id" values from the options array (e.g., "A", "B", "C", or "D")  
• "explanation_of_Question" (string) – concise Traditional-Chinese explanation of why the answer is correct and why the other options are wrong.  
6. Example of ONE valid array containing ONE question object (the format of each object must be matched exactly):
[
  {
    "passage": "The resilient athlete quickly recovered from her injury.",
    "targetWord": "resilient",
    "question": "In the sentence above, the word 'resilient' most nearly means:",
    "options": [
        { "id": "A", "text": "weak" },
        { "id": "B", "text": "determined" },
        { "id": "C", "text": "flexible and quick to recover" },
        { "id": "D", "text": "tired" }
    ],
    "standard_answer": "C",
    "explanation_of_Question": "Resilient 指能夠承受或迅速從困難情況中恢復。此處運動員能快速復原，顯示其高度彈性與復原力，因此選項 C 正確。選項 A「weak」意為虛弱，語意相反；選項 B「determined」僅表意志堅定，未涵蓋恢復力；選項 D「tired」表示疲倦，與原意無關。"
  }
]
Return ONLY the JSON array when you generate the questions. Do not include markdown keywords such as \`\`\`json in your response. 
`;
    let prompt = PROMPT_TEMPLATE_1_1_1;
    prompt = prompt.replace('{QUESTION_NUMBER}', questionNumber.toString());
    prompt = prompt.replace('{HISTORY_SUMMARY}', historySummary);
    prompt = prompt.replace('{DIFFICULTY_SETTING}', difficultySetting.toString());
    // 取得 LLM 設定
    const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.1.1');
    try {
        const geminiService = GeminiAPIService_1.default;
        // console.log("[DEBUG 111_generate.ts] Sending prompt:", prompt); // 調試時可取消註釋
        const response = await geminiService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_111_ARRAY_SCHEMA, // 使用陣列 Schema
            config, // 傳遞 LLM 設定
        });
        // console.log("[DEBUG 111_generate.ts] Received raw response:", response); // 調試時可取消註釋
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 111_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null; // 直接返回 null
        }
        // 移除 Zod 驗證邏輯
        // 簡單驗證題目數量 (可選，但有助於調試 Prompt)
        if (response.length !== questionNumber) {
            console.warn(`[DEBUG 111_generate.ts] LLM returned ${response.length} questions, but ${questionNumber} were requested. Proceeding with received data.`);
        }
        // 假設 Gemini 的 Schema 功能已確保內部結構基本正確
        // 如果需要更嚴格的運行時驗證，可以考慮後續添加 Zod 或類似庫
        return response; // 返回數據陣列
    }
    catch (error) {
        // 簡化錯誤處理：記錄錯誤並返回 null
        console.error(`[DEBUG 111_generate.ts] Error during question generation:`, error);
        return null;
    }
}
//# sourceMappingURL=111_generate.js.map