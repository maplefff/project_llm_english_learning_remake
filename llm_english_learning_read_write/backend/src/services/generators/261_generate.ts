import { QuestionData261 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { PRIORITY_LEVELS } from '../../interfaces/RateLimiter';
import { Type } from '@google/genai';

const QUESTION_DATA_261_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        original_sentence: { type: Type.STRING },
        instruction: { type: Type.STRING },
        transformation_type: { type: Type.STRING },
        standard_answers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        hints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        explanation_of_Question: { type: Type.STRING }
    },
    required: ['original_sentence', 'instruction', 'transformation_type', 'standard_answers', 'hints', 'explanation_of_Question'],
};

const QUESTION_DATA_261_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_261_ITEM_SCHEMA,
};

export async function generate261Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData261[] | null> {
    console.log(`[DEBUG 261_generate.ts] Starting generation for ${numberOfQuestions} sentence transformation questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `Generate ${numberOfQuestions} sentence transformation questions. Return JSON array format.`;
        const config = LLMConfigService.getInstance().getConfig('2.6.1');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_261_ARRAY_SCHEMA,
            config,
        }, PRIORITY_LEVELS.LOW, 'generator_261');
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 261_generate.ts] Invalid response type from LLM');
            return null;
        }

        console.log(`[DEBUG 261_generate.ts] Generated ${response.length} question(s) for type 2.6.1.`);
        return response as QuestionData261[];
    } catch (error) {
        console.error('[DEBUG 261_generate.ts] Error during question generation:', error);
        return null;
    }
} 