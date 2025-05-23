import { QuestionData123 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { PRIORITY_LEVELS } from '../../interfaces/RateLimiter';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_123_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sentence_context: { type: Type.STRING },
        question: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                },
                required: ['id', 'text'],
            },
            minItems: 4,
            maxItems: 4,
        },
        standard_answer: { type: Type.STRING },
        explanation_of_Question: { type: Type.STRING },
    },
    required: ['sentence_context', 'question', 'options', 'standard_answer', 'explanation_of_Question'],
};

const QUESTION_DATA_123_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_123_ITEM_SCHEMA,
};

/**
 * 生成 1.2.3 轉承詞選擇題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData123[] | null>
 */
export async function generate123Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData123[] | null> {
    console.log(`[DEBUG 123_generate.ts] Starting generation for ${numberOfQuestions} transition word questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English cohesion test generator.
Generate exactly ${numberOfQuestions} transition word multiple-choice questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Test logical connectors, transition words, discourse markers, cohesion devices
3. Learner context: ${historySummary || "No previous learning history available"}

Output STRICT JSON array format:
[{
  "sentence_context": "She studied hard for the exam; _______, she felt confident about her performance.",
  "question": "Choose the word that best completes the sentence to ensure cohesion.",
  "options": [
    {"id": "A", "text": "however"},
    {"id": "B", "text": "therefore"},
    {"id": "C", "text": "meanwhile"},
    {"id": "D", "text": "despite"}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "選項 B 'therefore' 是正確的，因為它表示因果關係。前句說她努力學習，後句說她有信心，這是邏輯上的結果關係。選項 A 'however' 表示轉折；選項 C 'meanwhile' 表示同時；選項 D 'despite' 表示讓步，都不符合語境的邏輯關係。"
}]

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('1.2.3');
        
        console.log(`[DEBUG 123_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_123_ARRAY_SCHEMA,
            config,
        }, PRIORITY_LEVELS.MEDIUM, 'generator_123');
        
        console.log(`[DEBUG 123_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 123_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 123_generate.ts] Generated ${response.length} question(s) for type 1.2.3.`);
        return response as QuestionData123[];

    } catch (error) {
        console.error('[DEBUG 123_generate.ts] Error during question generation:', error);
        return null;
    }
} 