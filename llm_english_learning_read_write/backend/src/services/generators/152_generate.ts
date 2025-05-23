import { QuestionData152 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_152_ITEM_SCHEMA = {
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

const QUESTION_DATA_152_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_152_ITEM_SCHEMA,
};

/**
 * 生成 1.5.2 作者目的與語氣題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData152[] | null>
 */
export async function generate152Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData152[] | null> {
    console.log(`[DEBUG 152_generate.ts] Starting generation for ${numberOfQuestions} author purpose and tone questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} questions about author's purpose and tone.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Identifying author's intention, purpose, attitude, and tone in writing
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 150-250 words with clear authorial voice and purpose

Output STRICT JSON array format:
[{
  "passage": "It's absolutely mind-boggling how people continue to ignore the devastating effects of single-use plastics on our oceans. Every minute, a garbage truck's worth of plastic waste enters our marine ecosystems, yet consumers mindlessly grab plastic bags at checkout counters and sip from disposable cups as if there's no tomorrow. The evidence is overwhelming – marine life is suffocating, ecosystems are collapsing, and our food chain is contaminated. We don't need more studies or debates; we need immediate action. Every individual must take responsibility now, because frankly, our planet can't afford to wait for politicians to finally wake up and enact meaningful legislation.",
  "question": "What is the author's primary tone in this passage?",
  "options": [
    {"id": "A", "text": "Neutral and objective"},
    {"id": "B", "text": "Frustrated and urgent"},
    {"id": "C", "text": "Optimistic and encouraging"},
    {"id": "D", "text": "Scholarly and detached"}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "作者的主要語調是沮喪和急迫的。從用詞可以看出：'absolutely mind-boggling'表達強烈的不解和挫折；'mindlessly'批評人們的無知行為；'overwhelming evidence'強調問題的嚴重性；'we don't need more studies'顯示急迫感；'frankly, our planet can't afford to wait'直接表達迫切性。選項 A 的中性客觀不符合強烈的情感表達；選項 C 的樂觀鼓勵與批評性語調相反；選項 D 的學術超然與直接呼籲行動的語調不符。"
}]

Tone types: urgent, critical, optimistic, pessimistic, humorous, serious, sarcastic, neutral, passionate, analytical
Purpose types: persuade, inform, entertain, criticize, argue, explain, warn, inspire, describe, analyze

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('1.5.2');
        
        console.log(`[DEBUG 152_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_152_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 152_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 152_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 152_generate.ts] Generated ${response.length} question(s) for type 1.5.2.`);
        return response as QuestionData152[];

    } catch (error) {
        console.error('[DEBUG 152_generate.ts] Error during question generation:', error);
        return null;
    }
} 