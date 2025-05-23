import { QuestionData212 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_212_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        original_text: { type: Type.STRING },
        instruction: { type: Type.STRING },
        standard_corrections: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        error_types: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 5
        },
        explanation_of_Question: { type: Type.STRING }
    },
    required: ['original_text', 'instruction', 'standard_corrections', 'error_types', 'explanation_of_Question'],
};

const QUESTION_DATA_212_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_212_ITEM_SCHEMA,
};

/**
 * 生成 2.1.2 改錯題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData212[] | null>
 */
export async function generate212Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData212[] | null> {
    console.log(`[DEBUG 212_generate.ts] Starting generation for ${numberOfQuestions} text correction questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English grammar test generator.
Generate exactly ${numberOfQuestions} text correction exercises.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Text-level grammar errors, punctuation, style, coherence
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide text with multiple errors for comprehensive correction

Output STRICT JSON array format:
[{
  "original_text": "Last week I go to the library for studying. There was many students there and the environment were very quite. I spend three hours to reading some books about history. The librarian was very helpful and she give me some good advices about research methods. When I left, I realize that I forgot my notebook in the desk.",
  "instruction": "請找出並修正這段文字中的所有語法錯誤、時態錯誤和用詞不當之處。",
  "standard_corrections": [
    "Last week I went to the library to study. There were many students there and the environment was very quiet. I spent three hours reading some books about history. The librarian was very helpful and she gave me some good advice about research methods. When I left, I realized that I had forgotten my notebook on the desk."
  ],
  "error_types": ["時態錯誤", "主謂一致", "拼字錯誤", "介詞使用", "不可數名詞", "過去完成式"],
  "explanation_of_Question": "這段文字包含多種常見的英語錯誤：1) 'go'應改為'went'（過去式）；2) 'There was many students'應為'There were'（主謂一致）；3) 'quite'應為'quiet'（拼字）；4) 'spend'應為'spent'（過去式）；5) 'for studying'應為'to study'（不定詞表目的）；6) 'advices'應為'advice'（不可數名詞）；7) 'give'應為'gave'（過去式）；8) 'realize'應為'realized'（過去式）；9) 'forgot'應為'had forgotten'（過去完成式）；10) 'in the desk'應為'on the desk'（介詞）。"
}]

Error types to include: tense errors, subject-verb agreement, word choice, prepositions, articles, plural/singular, punctuation, sentence structure
Text types: narratives, descriptions, reports, letters, academic writing (adjust complexity based on difficulty)
Text length: 3-6 sentences with 2-8 errors depending on difficulty level

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('2.1.2');
        
        console.log(`[DEBUG 212_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_212_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 212_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 212_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 212_generate.ts] Generated ${response.length} question(s) for type 2.1.2.`);
        return response as QuestionData212[];

    } catch (error) {
        console.error('[DEBUG 212_generate.ts] Error during question generation:', error);
        return null;
    }
} 