import { QuestionData252 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { PRIORITY_LEVELS } from '../../interfaces/RateLimiter';
import { Type } from '@google/genai';

const QUESTION_DATA_252_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scenario: { type: Type.STRING },
        recipient: { type: Type.STRING },
        purpose: { type: Type.STRING },
        instruction: { type: Type.STRING },
        required_content: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 5
        },
        tone: { type: Type.STRING },
        min_words: { type: Type.INTEGER },
        max_words: { type: Type.INTEGER },
        evaluation_criteria: {
            type: Type.OBJECT,
            properties: {
                grammar: { type: Type.INTEGER },
                vocabulary: { type: Type.INTEGER },
                coherence: { type: Type.INTEGER },
                task_achievement: { type: Type.INTEGER },
                appropriateness: { type: Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement', 'appropriateness']
        },
        sample_responses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 2
        }
    },
    required: ['scenario', 'recipient', 'purpose', 'instruction', 'required_content', 'tone', 'min_words', 'max_words', 'evaluation_criteria', 'sample_responses'],
};

const QUESTION_DATA_252_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_252_ITEM_SCHEMA,
};

export async function generate252Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData252[] | null> {
    console.log(`[DEBUG 252_generate.ts] Starting generation for ${numberOfQuestions} email/letter writing questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `Generate ${numberOfQuestions} email/letter writing questions. Return JSON array format.`;
        const config = LLMConfigService.getInstance().getConfig('2.5.2');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_252_ARRAY_SCHEMA,
            config,
        }, PRIORITY_LEVELS.LOW, 'generator_252');
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 252_generate.ts] Invalid response type from LLM');
            return null;
        }

        console.log(`[DEBUG 252_generate.ts] Generated ${response.length} question(s) for type 2.5.2.`);
        return response as QuestionData252[];
    } catch (error) {
        console.error('[DEBUG 252_generate.ts] Error during question generation:', error);
        return null;
    }
} 