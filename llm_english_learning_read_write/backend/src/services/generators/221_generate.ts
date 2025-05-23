import { QuestionData221 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_221_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sentence_a: { type: Type.STRING },
        sentence_b: { type: Type.STRING },
        instruction: { type: Type.STRING },
        standard_answers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        combining_method: { type: Type.STRING },
        explanation_of_Question: { type: Type.STRING }
    },
    required: ['sentence_a', 'sentence_b', 'instruction', 'standard_answers', 'combining_method', 'explanation_of_Question'],
};

const QUESTION_DATA_221_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_221_ITEM_SCHEMA,
};

/**
 * 生成 2.2.1 句子合併題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData221[] | null>
 */
export async function generate221Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData221[] | null> {
    console.log(`[DEBUG 221_generate.ts] Starting generation for ${numberOfQuestions} sentence combining questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English sentence structure test generator.
Generate exactly ${numberOfQuestions} sentence combining exercises.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Combining two sentences using specific conjunctions, relative clauses, or other structures
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide clear combining instructions with specific methods

Output STRICT JSON array format:
[{
  "sentence_a": "The weather was terrible.",
  "sentence_b": "We decided to go hiking anyway.",
  "instruction": "請使用 'although' 將這兩個句子合併成一個複合句。",
  "standard_answers": [
    "Although the weather was terrible, we decided to go hiking anyway.",
    "We decided to go hiking anyway although the weather was terrible."
  ],
  "combining_method": "讓步子句 (Concessive clause)",
  "explanation_of_Question": "這題考驗學生使用讓步連接詞 'although' 來表達對比關係。兩種語序都正確：1) Although + 從句, 主句；2) 主句 + although + 從句。重點是理解兩個句子之間的邏輯關係：儘管天氣很糟，但還是決定去健行，這是一種對比或讓步的關係。"
}]

Combining methods to include: 
- Coordinating conjunctions (and, but, or, so)
- Subordinating conjunctions (because, although, while, when, if)
- Relative clauses (who, which, that, where, when)
- Participial phrases (using -ing or -ed)
- Infinitive phrases (to + verb)
- Appositives and other structures

Relationship types: contrast, cause-effect, time sequence, condition, addition, comparison
Adjust sentence complexity based on difficulty level.

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('2.2.1');
        
        console.log(`[DEBUG 221_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_221_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 221_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 221_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 221_generate.ts] Generated ${response.length} question(s) for type 2.2.1.`);
        return response as QuestionData221[];

    } catch (error) {
        console.error('[DEBUG 221_generate.ts] Error during question generation:', error);
        return null;
    }
} 