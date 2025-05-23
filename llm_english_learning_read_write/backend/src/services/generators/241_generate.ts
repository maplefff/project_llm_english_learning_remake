import { QuestionData241 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { PRIORITY_LEVELS } from '../../interfaces/RateLimiter';
import { Type } from '@google/genai';

const QUESTION_DATA_241_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        scrambled_sentences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 7
        },
        instruction: { type: Type.STRING },
        correct_order: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER },
            minItems: 4,
            maxItems: 7
        },
        topic_hint: { type: Type.STRING },
        explanation_of_Question: { type: Type.STRING }
    },
    required: ['scrambled_sentences', 'instruction', 'correct_order', 'topic_hint', 'explanation_of_Question'],
};

const QUESTION_DATA_241_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_241_ITEM_SCHEMA,
};

export async function generate241Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData241[] | null> {
    console.log(`[DEBUG 241_generate.ts] Starting generation for ${numberOfQuestions} paragraph sequencing questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English paragraph organization test generator.
Generate exactly ${numberOfQuestions} paragraph sequencing exercises.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Logical sequence, coherence, paragraph organization
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide sentences that form a coherent paragraph when correctly ordered

Output STRICT JSON array format:
[{
  "scrambled_sentences": [
    "Finally, she submitted her application and waited nervously for a response.",
    "Sarah had always dreamed of studying abroad in England.",
    "After months of preparation, she felt confident about her language skills.",
    "First, she researched different universities and their requirements.",
    "Then, she spent a year improving her English through intensive classes."
  ],
  "instruction": "請將這些句子重新排列，組成一個邏輯連貫的段落。請按照正確的時間順序和邏輯關係排列。",
  "correct_order": [2, 4, 5, 3, 1],
  "topic_hint": "一個關於準備出國留學過程的故事",
  "explanation_of_Question": "這個段落按照時間順序描述Sarah準備出國留學的過程：首先介紹她的夢想(句子2)，然後是研究階段(句子4)，接著是語言學習階段(句子5)，再來是準備完成的感受(句子3)，最後是提交申請(句子1)。這種時間順序的安排使故事更加連貫和易於理解。"
}]

Paragraph types: narrative, process description, cause-effect, problem-solution, chronological order
Include transition words and logical connectors for better sequencing cues.
Sentence count: 4-7 sentences depending on difficulty level.

Return ONLY the JSON array. No markdown formatting.`;

        const config = LLMConfigService.getInstance().getConfig('2.4.1');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_241_ARRAY_SCHEMA,
            config,
        }, PRIORITY_LEVELS.LOW, 'generator_241');
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 241_generate.ts] Invalid response type from LLM: expected an array, got', typeof response);
            return null;
        }

        console.log(`[DEBUG 241_generate.ts] Generated ${response.length} question(s) for type 2.4.1.`);
        return response as QuestionData241[];

    } catch (error) {
        console.error('[DEBUG 241_generate.ts] Error during question generation:', error);
        return null;
    }
} 