import { QuestionData271 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { PRIORITY_LEVELS } from '../../interfaces/RateLimiter';
import { Type } from '@google/genai';

const QUESTION_DATA_271_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        source_text: { type: Type.STRING },
        instruction: { type: Type.STRING },
        reference_translations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 3
        },
        evaluation_focus: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 4
        }
    },
    required: ['source_text', 'instruction', 'reference_translations', 'evaluation_focus'],
};

const QUESTION_DATA_271_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_271_ITEM_SCHEMA,
};

export async function generate271Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData271[] | null> {
    console.log(`[DEBUG 271_generate.ts] Starting generation for ${numberOfQuestions} Chinese-to-English sentence translation questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `Generate ${numberOfQuestions} Chinese-to-English sentence translation questions. Return JSON array format.`;
        const config = LLMConfigService.getInstance().getConfig('2.7.1');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_271_ARRAY_SCHEMA,
            config,
        }, PRIORITY_LEVELS.LOW, 'generator_271');
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 271_generate.ts] Invalid response type from LLM');
            return null;
        }

        console.log(`[DEBUG 271_generate.ts] Generated ${response.length} question(s) for type 2.7.1.`);
        return response as QuestionData271[];
    } catch (error) {
        console.error('[DEBUG 271_generate.ts] Error during question generation:', error);
        return null;
    }
} 