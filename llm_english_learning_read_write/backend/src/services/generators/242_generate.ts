import { QuestionData242 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

const QUESTION_DATA_242_ITEM_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        prompt: { type: Type.STRING },
        instruction: { type: Type.STRING },
        min_words: { type: Type.INTEGER },
        max_words: { type: Type.INTEGER },
        required_elements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 2,
            maxItems: 5
        },
        evaluation_criteria: {
            type: Type.OBJECT,
            properties: {
                grammar: { type: Type.INTEGER },
                vocabulary: { type: Type.INTEGER },
                coherence: { type: Type.INTEGER },
                task_achievement: { type: Type.INTEGER },
                organization: { type: Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement', 'organization']
        },
        sample_responses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 1,
            maxItems: 2
        }
    },
    required: ['topic', 'prompt', 'instruction', 'min_words', 'max_words', 'required_elements', 'evaluation_criteria', 'sample_responses'],
};

const QUESTION_DATA_242_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_242_ITEM_SCHEMA,
};

export async function generate242Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData242[] | null> {
    console.log(`[DEBUG 242_generate.ts] Starting generation for ${numberOfQuestions} short essay questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English essay writing test generator.
Generate exactly ${numberOfQuestions} short essay writing prompts.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Multi-paragraph writing with clear structure and organization
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide comprehensive writing tasks with specific requirements

Output STRICT JSON array format:
[{
  "topic": "The Impact of Social Media on Modern Communication",
  "prompt": "Social media platforms have fundamentally changed how people communicate in the 21st century. Consider both the positive and negative effects of social media on interpersonal relationships and society.",
  "instruction": "寫一篇短文討論社交媒體對現代溝通的影響。請包含引言、至少兩個主體段落（正面和負面影響），以及結論。使用具體例子支持你的論點，並確保段落間有清楚的邏輯連接。",
  "min_words": 200,
  "max_words": 300,
  "required_elements": ["引言段落", "正面影響段落", "負面影響段落", "結論段落", "具體例子"],
  "evaluation_criteria": {
    "grammar": 20,
    "vocabulary": 20,
    "coherence": 20,
    "task_achievement": 20,
    "organization": 20
  },
  "sample_responses": [
    "Social media has revolutionized modern communication, creating both opportunities and challenges for society. On the positive side, platforms like Facebook and Instagram have made it easier for people to maintain long-distance relationships and connect with others who share similar interests. For example, families separated by geography can now share daily moments through photos and video calls, strengthening bonds that might otherwise weaken. Additionally, social media has democratized information sharing, allowing individuals to access news and educational content instantly. However, these platforms also present significant drawbacks. Many people experience decreased face-to-face communication skills and struggle with social anxiety in real-world interactions. Furthermore, the spread of misinformation and cyberbullying has created new social problems that previous generations never faced. In conclusion, while social media offers valuable tools for connection and information sharing, users must be mindful of maintaining balance between online and offline relationships to ensure healthy communication habits."
  ]
}]

Essay topics: technology, environment, education, social issues, health, culture, global challenges
Essay types: argumentative, expository, comparative, cause-effect analysis
Word count: 150-400 words depending on difficulty level.

Return ONLY the JSON array. No markdown formatting.`;

        const config = LLMConfigService.getInstance().getConfig('2.4.2');
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_242_ARRAY_SCHEMA,
            config,
        });
        
        if (!Array.isArray(response)) {
            console.error('[DEBUG 242_generate.ts] Invalid response type from LLM');
            return null;
        }

        console.log(`[DEBUG 242_generate.ts] Generated ${response.length} question(s) for type 2.4.2.`);
        return response as QuestionData242[];
    } catch (error) {
        console.error('[DEBUG 242_generate.ts] Error during question generation:', error);
        return null;
    }
} 