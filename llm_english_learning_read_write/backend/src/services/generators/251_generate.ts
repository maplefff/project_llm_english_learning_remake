import { QuestionData251 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

const QUESTION_DATA_251_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        context: { type: Type.STRING },
        question: { type: Type.STRING },
        instruction: { type: Type.STRING },
        min_words: { type: Type.INTEGER },
        max_words: { type: Type.INTEGER },
        key_points: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 4
        },
        sample_responses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 2
        },
        evaluation_focus: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 4
        }
    },
    required: ['context', 'question', 'instruction', 'min_words', 'max_words', 'key_points', 'sample_responses', 'evaluation_focus'],
};

const QUESTION_DATA_251_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_251_ITEM_SCHEMA,
};

export async function generate251Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData251[] | null> {
    console.log(`[DEBUG 251_generate.ts] Starting generation for ${numberOfQuestions} short answer questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `Generate exactly ${numberOfQuestions} short answer questions for English learners.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity
2. Focus: Brief but comprehensive responses requiring specific knowledge
3. Learner context: ${historySummary || "No previous learning history available"}

Output STRICT JSON array format:
[{
  "context": "Many people today struggle with work-life balance in our fast-paced society.",
  "question": "What are some effective strategies for maintaining a healthy work-life balance?",
  "instruction": "請用50-80字回答這個問題。提供至少兩個具體的策略，並簡單說明為什麼這些策略有效。",
  "min_words": 50,
  "max_words": 80,
  "key_points": ["具體策略", "簡單解釋", "實用性"],
  "sample_responses": [
    "Effective work-life balance strategies include setting clear boundaries by turning off work devices after hours and prioritizing time management through daily planning. These approaches work because they prevent work from consuming personal time and help individuals focus on what truly matters most each day."
  ],
  "evaluation_focus": ["內容相關性", "語言準確性", "邏輯清晰度", "字數控制"]
}]

Return ONLY the JSON array. No markdown formatting.`;

        const config = LLMConfigService.getInstance().getConfig('2.5.1');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_251_ARRAY_SCHEMA,
            config,
        });
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 251_generate.ts] Invalid response type from LLM');
            return null;
        }

        console.log(`[DEBUG 251_generate.ts] Generated ${response.length} question(s) for type 2.5.1.`);
        return response as QuestionData251[];
    } catch (error) {
        console.error('[DEBUG 251_generate.ts] Error during question generation:', error);
        return null;
    }
} 