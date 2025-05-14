// llm_english_learning_read&write/backend/src/services/generators/111_generate.ts

import GeminiAPIService from '../GeminiAPIService';
import { Schema, SchemaType } from '@google/generative-ai';
import 'dotenv/config'; // 確保環境變數已加載
// 從共享介面導入類型
import { QuestionData111 } from './QuestionGeneratorInterface';

// 定義 LLM 應回傳的單個 JSON 物件結構 Schema
const QUESTION_DATA_111_ITEM_SCHEMA: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        passage: { type: SchemaType.STRING },
        targetWord: { type: SchemaType.STRING },
        question: { type: SchemaType.STRING },
        options: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: { type: SchemaType.STRING },
                    text: { type: SchemaType.STRING },
                },
                required: ['id', 'text'],
            },
            minItems: 4, // 確保至少有4個選項
            maxItems: 4, // 確保最多有4個選項
        },
        standard_answer: { type: SchemaType.STRING },
        explanation_of_Question: { type: SchemaType.STRING },
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
const QUESTION_DATA_111_ARRAY_SCHEMA: Schema = {
    type: SchemaType.ARRAY,
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
export async function generate111Question(
    questionNumber: number = 1,
    historySummary: string = "", 
    difficultySetting: number = 70 
): Promise<QuestionData111[] | null> {

    const PROMPT_TEMPLATE_1_1_1 = 
`You are an expert English-quiz generator for language learners.
1. Generate exactly {QUESTION_NUMBER} multiple-choice questions. The output must be an array containing this number of question objects.
2. Learner context: {HISTORY_SUMMARY}  
3. 難度設定為：{DIFFICULTY_SETTING}% 目標正確率 (Adjust difficulty with reference to CEFR levels A1–C2).  
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

    try {
        const geminiService = GeminiAPIService;
        // console.log("[DEBUG 111_generate.ts] Sending prompt:", prompt); // 調試時可取消註釋
        const response = await geminiService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_111_ARRAY_SCHEMA, // 使用陣列 Schema
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
            console.warn(
                `[DEBUG 111_generate.ts] LLM returned ${response.length} questions, but ${questionNumber} were requested. Proceeding with received data.`
            );
        }
        
        // 假設 Gemini 的 Schema 功能已確保內部結構基本正確
        // 如果需要更嚴格的運行時驗證，可以考慮後續添加 Zod 或類似庫
        return response as QuestionData111[]; // 返回數據陣列

    } catch (error: any) {
        // 簡化錯誤處理：記錄錯誤並返回 null
        console.error(`[DEBUG 111_generate.ts] Error during question generation:`, error);
        return null; 
    }
} 