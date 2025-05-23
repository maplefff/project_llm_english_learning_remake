import { QuestionData131 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_131_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        passage: { type: Type.STRING },
        question: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                },
                required: ['id', 'text']
            },
            minItems: 4,
            maxItems: 4,
        },
        standard_answer: { type: Type.STRING },
        explanation_of_Question: { type: Type.STRING },
    },
    required: ['passage', 'question', 'options', 'standard_answer', 'explanation_of_Question'],
};

const QUESTION_DATA_131_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_131_ITEM_SCHEMA,
};

/**
 * 生成 1.3.1 段落主旨題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData131[] | null>
 */
export async function generate131Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData131[] | null> {
    console.log(`[DEBUG 131_generate.ts] Starting generation for ${numberOfQuestions} main idea questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} main idea identification questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Identifying the main idea or central theme of a paragraph
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 100-150 words covering topics like environment, technology, education, health, culture

Output STRICT JSON array format:
[{
  "passage": "Environmental conservation has become increasingly important in our modern world. As global temperatures rise and natural resources become scarcer, individuals and governments must take action to protect our planet. Simple changes like reducing plastic use, supporting renewable energy, and choosing sustainable transportation can make a significant difference. Moreover, educating young people about environmental issues ensures that future generations will continue these vital efforts. By working together, we can create a more sustainable future for all living beings on Earth.",
  "question": "What is the main idea of this paragraph?",
  "options": [
    {"id": "A", "text": "Global temperatures are rising rapidly."},
    {"id": "B", "text": "Environmental conservation requires collective action from individuals and governments."},
    {"id": "C", "text": "Young people need more education about environmental issues."},
    {"id": "D", "text": "Renewable energy is the best solution to environmental problems."}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "這段文章的主旨是環境保護需要個人和政府的共同行動。文章首先提到環境保護的重要性，然後說明個人可以採取的行動，接著提到教育年輕人的重要性，最後強調合作的必要性。選項 A 只提到全球暖化這一個細節；選項 C 只強調教育年輕人，不夠全面；選項 D 只提到再生能源，範圍太窄。只有選項 B 涵蓋了文章的核心觀點：環境保護需要集體行動。"
}]

Topics to include: environment, technology, health, education, culture, social issues, science, travel, business, lifestyle
Passage types: informative, persuasive, descriptive, narrative (but focus on main ideas)

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('1.3.1');
        
        console.log(`[DEBUG 131_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_131_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 131_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 131_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 131_generate.ts] Generated ${response.length} question(s) for type 1.3.1.`);
        return response as QuestionData131[];

    } catch (error) {
        console.error('[DEBUG 131_generate.ts] Error during question generation:', error);
        return null;
    }
} 