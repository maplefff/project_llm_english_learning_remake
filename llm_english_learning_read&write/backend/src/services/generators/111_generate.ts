// llm_english_learning_read&write/backend/src/services/generators/111_generate.ts

import GeminiAPIService from '../GeminiAPIService';
// import { CleanJSON } from '../../utils/CleanJSON';
import { Schema, SchemaType } from '@google/generative-ai';
import { z } from 'zod'; // 用於驗證
import 'dotenv/config'; // 確保環境變數已加載

interface QuestionData111 {
    passage: string;
    targetWord: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    standard_answer: string;
    explanation_of_Question: string;
}

// 定義 LLM 應回傳的 JSON 物件結構 Schema
const QUESTION_DATA_111_SCHEMA: Schema = {
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
                    id: { type: SchemaType.STRING }, // 選項標識符 (例如 "A", "B")
                    text: { type: SchemaType.STRING }, // 選項文字
                },
                required: ['id', 'text'],
            },
        },
        standard_answer: { type: SchemaType.STRING }, // 正確答案的 id
        explanation_of_Question: { type: SchemaType.STRING }, // 繁體中文解釋
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

// 定義使用 Zod 進行更嚴格驗證的 Schema
const QuestionData111ZodSchema = z.object({
    passage: z.string().min(1),
    targetWord: z.string().min(1),
    question: z.string().min(1),
    options: z
        .array(
            z.object({
                id: z.string().min(1), // 驗證 id 是非空字串
                text: z.string().min(1), // 驗證 text 是非空字串
            })
        )
        .length(4, '必須剛好有 4 個選項'), // 確保有 4 個選項
    standard_answer: z.string().min(1), // 驗證 standard_answer 是非空字串
    explanation_of_Question: z.string().min(1),
}).refine(
    (data) => {
        // 驗證 standard_answer 必須是 options 中某個元素的 id
        return data.options.some((option) => option.id === data.standard_answer);
    },
    {
        message: 'standard_answer 必須對應 options 陣列中某個元素的 id',
        path: ['standard_answer'], // 指明錯誤關聯的欄位
    }
);

/**
 * Generates a question for type 1.1.1 (Word Meaning in Sentence).
 * 
 * @param questionNumber The number of questions to generate (always 1 for this function).
 * @param historySummary A summary of the learner's history for difficulty adjustment.
 * @param difficultySetting The target correct answer rate (e.g., 70 for 70%).
 * @returns A Promise that resolves to the question data object or null if generation fails.
 */
export async function generate111Question(
    questionNumber: number = 1,
    historySummary: string = "", 
    difficultySetting: number = 70 
): Promise<QuestionData111 | null> {

    // 使用明確的佔位符，而不是直接嵌入函數參數
    const PROMPT_TEMPLATE_1_1_1 = 
    `You are an expert English-quiz generator for language learners.
    1. Generate exactly {QUESTION_NUMBER} multiple-choice questions.  
    2. Learner context: {HISTORY_SUMMARY}  
    3. 難度設定為：{DIFFICULTY_SETTING}% 目標正確率 (Adjust difficulty with reference to CEFR levels A1–C2).  
    4. Question type: test only vocabulary meaning, synonyms, and near-synonyms (no grammar).  
    5. Output STRICT JSON: a single object (NOT an array), nothing else.  
    The object must contain:  
    • "passage" (string) – context sentence or short passage  
    • "targetWord" (string) – the word being tested  
    • "question" (string) – the question prompt  
    • "options" (array of 4 objects { "id": string, "text": string }, e.g., [{"id":"A", "text":"..."}, ...])  
    • "standard_answer" (string) – one of the "id" values from the options array (e.g., "A", "B", "C", or "D")  
    • "explanation_of_Question" (string) – concise Traditional-Chinese explanation of why the answer is correct and why the other options are wrong.  
    6. Example of ONE valid object (format must be matched exactly):
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
    Return ONLY the JSON object when you generate the question. Do not include markdown keywords such as \`\`\`json in your response. 
    `;
    
    // 使用定義的佔位符進行替換 (嘗試另一種語法確保更新)
    let prompt = PROMPT_TEMPLATE_1_1_1;
    prompt = prompt.replace('{QUESTION_NUMBER}', questionNumber.toString());
    prompt = prompt.replace('{HISTORY_SUMMARY}', historySummary);
    prompt = prompt.replace('{DIFFICULTY_SETTING}', difficultySetting.toString());

    // console.log("[DEBUG 111_generate.ts] Generated Prompt for 1.1.1:\n", prompt);

    try {
        const geminiService = GeminiAPIService; // 使用導入的單例
        // 使用 GeminiAPIService 獲取結構化回應
        const response = await geminiService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_111_SCHEMA,
        });

        // 3. 驗證與清理回應
        // console.log('[DEBUG 111_generate.ts] Raw LLM Response:', response); // 除錯用

        // 因為我們請求了結構化輸出，理論上回應應該已經是物件
        // 驗證回應是否為物件（非陣列，非 null）
        if (typeof response !== 'object' || response === null || Array.isArray(response)) {
            console.error('[DEBUG 111_generate.ts] Invalid response type:', typeof response);
            throw new Error(
                '從 LLM 收到的回應不是有效的物件。'
            );
        }

        // 使用 Zod 進行嚴格驗證 (直接驗證收到的 response 物件)
        const validationResult = QuestionData111ZodSchema.safeParse(response);

        if (!validationResult.success) {
            console.error(
                '[DEBUG 111_generate.ts] Zod validation failed:',
                validationResult.error.errors
            );
            throw new Error(
                `LLM 回應驗證失敗: ${validationResult.error.errors
                    .map((e) => `${e.path.join('.')} - ${e.message}`)
                    .join(', ')}`
            );
        }

        // 驗證成功，返回驗證後的數據
        // console.log('[DEBUG 111_generate.ts] Validation successful:', validationResult.data); // 除錯用
        return validationResult.data as QuestionData111;

    } catch (error: any) {
        console.error(`[DEBUG 111_generate.ts] Error in generate111: ${(error instanceof Error) ? error.message : error}`);
        // 在測試環境或需要詳細錯誤時，重新拋出錯誤
        // 在生產環境中，根據需要可能返回 null 或其他錯誤處理
        throw error; // 重新拋出錯誤，以便測試可以捕捉到它
        // return null; // 或者返回 null
    }
}

// Example usage (for testing purposes):
/*
async function testGenerate() {
    console.log("Testing 1.1.1 question generation...");
    // Ensure GEMINI_API_KEY is set in your .env file for this test to run properly.
    const question = await generate111Question(
        1, 
        "Learner has average accuracy with B1 vocabulary.", 
        70
    );
    if (question) {
        console.log("Successfully generated question:", JSON.stringify(question, null, 2));
    } else {
        console.log("Failed to generate question.");
    }
}

testGenerate();
*/ 