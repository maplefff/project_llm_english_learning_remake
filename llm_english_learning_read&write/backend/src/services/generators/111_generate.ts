// llm_english_learning_read&write/backend/src/services/generators/111_generate.ts

import GeminiAPIService from '../GeminiAPIService';
// import { CleanJSON } from '../../utils/CleanJSON';
import { Schema, SchemaType } from '@google/generative-ai';
import { z } from 'zod'; // 用於驗證
import 'dotenv/config'; // 確保環境變數已加載

/**
 * @property {string} passage - 上下文句子或簡短段落
 * @property {string} targetWord - 正在測試的單詞
 * @property {string} question - 問題提示
 * @property {Array<{ id: string; text: string }>} options - 選項數組，每個選項包含 ID 和文本
 * @property {string} standard_answer - 正確答案的 ID (例如 'C')
 * @property {string} explanation_of_Question - 題目的繁體中文解釋
 */
export type QuestionData111 = {
    passage: string;
    targetWord: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    standard_answer: string;
    explanation_of_Question: string;
};

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

// 定義使用 Zod 進行更嚴格驗證的單個題目 Schema
const QuestionData111ItemZodSchema = z.object({
    passage: z.string().min(1),
    targetWord: z.string().min(1),
    question: z.string().min(1),
    options: z
        .array(
            z.object({
                id: z.string().min(1),
                text: z.string().min(1),
            })
        )
        .length(4, '必須剛好有 4 個選項'),
    standard_answer: z.string().min(1),
    explanation_of_Question: z.string().min(1),
}).refine(
    (data) => {
        return data.options.some((option) => option.id === data.standard_answer);
    },
    {
        message: 'standard_answer 必須對應 options 陣列中某個元素的 id',
        path: ['standard_answer'],
    }
);

// 定義使用 Zod 進行更嚴格驗證的題目陣列 Schema
const QuestionData111ArrayZodSchema = z.array(QuestionData111ItemZodSchema).min(1, "回應的陣列至少需要包含一個題目");

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
        const response = await geminiService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_111_ARRAY_SCHEMA, // 使用陣列 Schema
        });

        if (!Array.isArray(response)) { // 驗證回應是否為陣列
            console.error('[DEBUG 111_generate.ts] Invalid response type: expected an array, got', typeof response);
            throw new Error('從 LLM 收到的回應不是有效的陣列。');
        }

        const validationResult = QuestionData111ArrayZodSchema.safeParse(response); // 使用陣列 Zod Schema

        if (!validationResult.success) {
            console.error(
                '[DEBUG 111_generate.ts] Zod validation failed for array:',
                validationResult.error.errors
            );
            throw new Error(
                `LLM 回應陣列驗證失敗: ${validationResult.error.errors
                    .map((e) => `${e.path.join('.')} - ${e.message}`)
                    .join(', ')}`
            );
        }
        
        // 驗證成功，檢查題目數量是否符合預期
        if (validationResult.data.length !== questionNumber) {
            console.warn(
                `[DEBUG 111_generate.ts] LLM returned ${validationResult.data.length} questions, but ${questionNumber} were requested. Proceeding with received data, but this might indicate a prompt adherence issue.`
            );
            // 根據需求，這裡也可以選擇拋出錯誤，如果嚴格要求數量一致
            // throw new Error(`LLM did not return the requested number of questions. Expected ${questionNumber}, got ${validationResult.data.length}.`);
        }

        return validationResult.data as QuestionData111[]; // 返回驗證後的數據陣列

    } catch (error: any) {
        console.error(`[DEBUG 111_generate.ts] Error in generate111Question (array mode): ${(error instanceof Error) ? error.message : error}`);
        throw error; 
    }
}

// Example usage (for testing purposes):
/*
async function testGenerate() {
    console.log("Testing 1.1.1 question generation (array mode)...");
    // Ensure GEMINI_API_KEY is set in your .env file for this test to run properly.
    const questions = await generate111Question( // 請求 2 個題目
        2, 
        "Learner has average accuracy with B1 vocabulary and needs more practice.", 
        65
    );
    if (questions && questions.length > 0) {
        console.log(`Successfully generated ${questions.length} questions:`, JSON.stringify(questions, null, 2));
    } else {
        console.log("Failed to generate questions or received an empty array.");
    }
}

testGenerate();
*/ 