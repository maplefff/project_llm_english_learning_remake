import { QuestionData211 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_211_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        prompt: { type: Type.STRING },
        instruction: { type: Type.STRING },
        min_words: { type: Type.INTEGER },
        max_words: { type: Type.INTEGER },
        evaluation_criteria: {
            type: Type.OBJECT,
            properties: {
                grammar: { type: Type.INTEGER },
                vocabulary: { type: Type.INTEGER },
                coherence: { type: Type.INTEGER },
                task_achievement: { type: Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement']
        },
        sample_responses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 3
        }
    },
    required: ['prompt', 'instruction', 'min_words', 'max_words', 'evaluation_criteria', 'sample_responses'],
};

const QUESTION_DATA_211_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_211_ITEM_SCHEMA,
};

/**
 * 生成 2.1.1 看圖/主題寫作題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData211[] | null>
 */
export async function generate211Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData211[] | null> {
    console.log(`[DEBUG 211_generate.ts] Starting generation for ${numberOfQuestions} writing prompts, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English writing test generator.
Generate exactly ${numberOfQuestions} creative writing prompts.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Picture description, topic-based writing, creative expression
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide clear writing prompts with specific instructions

Output STRICT JSON array format:
[{
  "prompt": "Describe the scene in a busy city park on a Sunday afternoon. Include details about the people, activities, and atmosphere you observe.",
  "instruction": "Write a descriptive paragraph about a city park scene. Use vivid adjectives and specific details to help the reader visualize the setting. Include at least 3 different activities happening in the park.",
  "min_words": 80,
  "max_words": 120,
  "evaluation_criteria": {
    "grammar": 25,
    "vocabulary": 25,
    "coherence": 25,
    "task_achievement": 25
  },
  "sample_responses": [
    "The city park buzzes with life on this beautiful Sunday afternoon. Children laugh joyfully as they swing high on the colorful playground equipment, while their parents chat nearby on wooden benches. An elderly man feeds breadcrumbs to a group of eager ducks by the small pond, creating ripples across the calm water. Joggers in bright athletic wear follow the winding paths, breathing in the fresh air. The sweet scent of blooming flowers fills the atmosphere, and the warm sunshine filters through the green canopy above, creating dancing shadows on the grass below.",
    "Sunday afternoon transforms the city park into a vibrant community hub. Families spread colorful picnic blankets under shady oak trees, sharing homemade sandwiches and fresh fruit. A group of teenagers plays an energetic game of frisbee on the open lawn, their laughter echoing across the space. Near the fountain, an artist sits quietly, sketching the peaceful scene with careful strokes. The park feels alive with human connection - people walking their dogs, couples strolling hand-in-hand, and children discovering nature's wonders in this green oasis within the busy city."
  ]
}]

Topics to include: nature scenes, daily activities, social situations, seasonal events, urban life, family moments, travel experiences, cultural celebrations
Writing types: descriptive, narrative, expository, persuasive (adjust complexity based on difficulty)

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('2.1.1');
        
        console.log(`[DEBUG 211_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_211_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 211_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 211_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 211_generate.ts] Generated ${response.length} question(s) for type 2.1.1.`);
        return response as QuestionData211[];

    } catch (error) {
        console.error('[DEBUG 211_generate.ts] Error during question generation:', error);
        return null;
    }
} 