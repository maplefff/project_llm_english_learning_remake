"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate112Question = generate112Question;
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai"); // 新 SDK 的型別定義
require("dotenv/config"); // 確保環境變數已加載
const LLMConfigService_1 = require("../../utils/LLMConfigService"); // 匯入 LLMConfigService
// 定義 LLM 應回傳的單個 JSON 物件結構 Schema
const QUESTION_DATA_112_ITEM_SCHEMA = {
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
        'question',
        'options',
        'standard_answer',
        'explanation_of_Question',
    ],
};
// 定義 LLM 應回傳的 JSON 陣列結構 Schema
const QUESTION_DATA_112_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_112_ITEM_SCHEMA,
};
/**
 * Generates a question for type 1.1.2 (Vocabulary Cloze Test).
 *
 * @param questionNumber The number of questions to generate.
 * @param historySummary A summary of the learner's history for difficulty adjustment.
 * @param difficultySetting The target correct answer rate (e.g., 70 for 70%).
 * @returns A Promise that resolves to an array of question data objects or null if generation fails.
 */
async function generate112Question(questionNumber = 1, historySummary = "", difficultySetting = 70) {
    const PROMPT_TEMPLATE_1_1_2 = `You are an expert English-quiz generator for language learners.
1. Generate exactly {QUESTION_NUMBER} cloze test questions. The output must be an array containing this number of question objects.
2. Learner context: {HISTORY_SUMMARY}  
3. Difficulty is set to: {DIFFICULTY_SETTING}% target accuracy (Adjust difficulty with reference to CEFR levels A1–C2).  
4. Question type: vocabulary cloze test - choose the best word to complete the sentence.  
5. Output STRICT JSON: an array of question objects. If "questionNumber" (from point 1) is 1, the array should contain a single question object. The length of the array must exactly match the "questionNumber".  
Each object in the array must contain:  
• "passage" (string) – sentence with one blank marked as "_______" (use exactly 7 underscores)
• "question" (string) – the question prompt asking to choose the best word
• "options" (array of 4 objects { "id": string, "text": string }, e.g., [{"id":"A", "text":"..."}, ...])  
• "standard_answer" (string) – one of the "id" values from the options array (e.g., "A", "B", "C", or "D")  
• "explanation_of_Question" (string) – concise Traditional-Chinese explanation of why the answer is correct and why the other options are wrong.  
6. Example of ONE valid array containing ONE question object (the format of each object must be matched exactly):
[
  {
    "passage": "The ancient castle stood on a hill, its walls _______ against the stormy sky.",
    "question": "Choose the best word to complete the sentence.",
    "options": [
        { "id": "A", "text": "illuminated" },
        { "id": "B", "text": "silhouetted" },
        { "id": "C", "text": "decorated" },
        { "id": "D", "text": "vanished" }
    ],
    "standard_answer": "B",
    "explanation_of_Question": "Silhouetted 指在明亮背景下形成暗影輪廓。城堡的牆壁在暴風雨天空的襯托下形成輪廓，因此選項 B 正確。選項 A「illuminated」意為照亮，與語境不符；選項 C「decorated」意為裝飾，無關；選項 D「vanished」意為消失，邏輯不合。"
  }
]
Return ONLY the JSON array when you generate the questions. Do not include markdown keywords such as \`\`\`json in your response. 
`;
    let prompt = PROMPT_TEMPLATE_1_1_2;
    prompt = prompt.replace('{QUESTION_NUMBER}', questionNumber.toString());
    prompt = prompt.replace('{HISTORY_SUMMARY}', historySummary);
    prompt = prompt.replace('{DIFFICULTY_SETTING}', difficultySetting.toString());
    // 取得 LLM 設定
    const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('1.1.2');
    try {
        const geminiService = GeminiAPIService_1.default;
        // console.log("[DEBUG 112_generate.ts] Sending prompt:", prompt); // 調試時可取消註釋
        const response = await geminiService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_112_ARRAY_SCHEMA, // 使用陣列 Schema
            config, // 傳遞 LLM 設定
        });
        // console.log("[DEBUG 112_generate.ts] Received raw response:", response); // 調試時可取消註釋
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 112_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null; // 直接返回 null
        }
        // 簡單驗證題目數量 (可選，但有助於調試 Prompt)
        if (response.length !== questionNumber) {
            console.warn(`[DEBUG 112_generate.ts] LLM returned ${response.length} questions, but ${questionNumber} were requested. Proceeding with received data.`);
        }
        // 假設 Gemini 的 Schema 功能已確保內部結構基本正確
        // 如果需要更嚴格的運行時驗證，可以考慮後續添加 Zod 或類似庫
        return response; // 返回數據陣列
    }
    catch (error) {
        // 簡化錯誤處理：記錄錯誤並返回 null
        console.error(`[DEBUG 112_generate.ts] Error during question generation:`, error);
        return null;
    }
}
//# sourceMappingURL=112_generate.js.map