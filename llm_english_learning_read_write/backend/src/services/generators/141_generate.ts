import { QuestionData141 } from './QuestionGeneratorInterface';
import { LLMConfigService } from '../../utils/LLMConfigService';
import GeminiAPIService from '../GeminiAPIService';
import { Type } from '@google/genai';

// 定義 Schema
const QUESTION_DATA_141_ITEM_SCHEMA = {
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

const QUESTION_DATA_141_ARRAY_SCHEMA = {
    type: Type.ARRAY,
    items: QUESTION_DATA_141_ITEM_SCHEMA,
};

/**
 * 生成 1.4.1 細節查找題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData141[] | null>
 */
export async function generate141Question(
    numberOfQuestions: number = 1,
    historySummary: string = "",
    difficultySetting: number = 70
): Promise<QuestionData141[] | null> {
    console.log(`[DEBUG 141_generate.ts] Starting generation for ${numberOfQuestions} detail comprehension questions, difficulty: ${difficultySetting}`);

    try {
        const prompt = `You are an expert English reading comprehension test generator.
Generate exactly ${numberOfQuestions} detail comprehension questions.

Requirements:
1. Difficulty: ${difficultySetting}% target accuracy (CEFR A1-C2 reference)
2. Focus: Finding specific details, facts, numbers, dates, names, locations mentioned in the passage
3. Learner context: ${historySummary || "No previous learning history available"}
4. Each passage should be 80-120 words containing specific factual information

Output STRICT JSON array format:
[{
  "passage": "The Global Climate Summit was held in Copenhagen from December 7-18, 2023. Over 200 delegates from 45 countries attended the conference, including scientists, policy makers, and environmental activists. Dr. Sarah Mitchell, the lead researcher from Oxford University, presented a groundbreaking study showing that renewable energy adoption increased by 23% globally in the past year. The summit concluded with the Copenhagen Declaration, committing participating nations to reduce carbon emissions by 40% by 2030.",
  "question": "According to the passage, by what percentage did renewable energy adoption increase globally?",
  "options": [
    {"id": "A", "text": "20%"},
    {"id": "B", "text": "23%"},
    {"id": "C", "text": "40%"},
    {"id": "D", "text": "45%"}
  ],
  "standard_answer": "B",
  "explanation_of_Question": "根據文章內容，Dr. Sarah Mitchell 提出的研究顯示全球再生能源採用率在過去一年增加了 23%。選項 A 的 20% 不正確；選項 C 的 40% 是減少碳排放的目標，不是再生能源增加率；選項 D 的 45% 是參與會議的國家數量，與問題無關。正確答案是 B 的 23%。"
}]

Detail types to test: numbers, dates, names, locations, quantities, time periods, percentages, specific facts
Topics: conferences, research studies, business reports, historical events, scientific findings, travel information

Return ONLY the JSON array. No markdown formatting.`;

        // 取得 LLM 設定
        const config = LLMConfigService.getInstance().getConfig('1.4.1');
        
        console.log(`[DEBUG 141_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService.getResponse(prompt, {
            responseSchema: QUESTION_DATA_141_ARRAY_SCHEMA,
            config,
        });
        
        console.log(`[DEBUG 141_generate.ts] Received response from LLM`);
        
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 141_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }

        console.log(`[DEBUG 141_generate.ts] Generated ${response.length} question(s) for type 1.4.1.`);
        return response as QuestionData141[];

    } catch (error) {
        console.error('[DEBUG 141_generate.ts] Error during question generation:', error);
        return null;
    }
} 