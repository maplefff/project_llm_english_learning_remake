"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate231Question = generate231Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
// 定義 Schema
const QUESTION_DATA_231_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        topic: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        min_sentences: { type: genai_1.Type.INTEGER },
        max_sentences: { type: genai_1.Type.INTEGER },
        evaluation_criteria: {
            type: genai_1.Type.OBJECT,
            properties: {
                grammar: { type: genai_1.Type.INTEGER },
                vocabulary: { type: genai_1.Type.INTEGER },
                coherence: { type: genai_1.Type.INTEGER },
                task_achievement: { type: genai_1.Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement']
        },
        sample_responses: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 3
        }
    },
    required: ['topic', 'instruction', 'min_sentences', 'max_sentences', 'evaluation_criteria', 'sample_responses'],
};
const QUESTION_DATA_231_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_231_ITEM_SCHEMA,
};
/**
 * 生成 2.3.1 段落寫作題
 * @param numberOfQuestions 要生成的題目數量
 * @param historySummary 歷史學習記錄摘要
 * @param difficultySetting 難度設定 (0-100)
 * @returns Promise<QuestionData231[] | null>
 */
async function generate231Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
    console.log(`[DEBUG 231_generate.ts] Starting generation for ${numberOfQuestions} paragraph writing questions, difficulty: ${difficultySetting}`);
    try {
        const prompt = `You are an expert English paragraph writing test generator.
Generate exactly ${numberOfQuestions} paragraph writing prompts.

Requirements:
1. Difficulty: ${difficultySetting}% target complexity (CEFR A1-C2 reference)
2. Focus: Coherent paragraph writing with clear topic sentences and supporting details
3. Learner context: ${historySummary || "No previous learning history available"}
4. Provide structured writing tasks with clear expectations

Output STRICT JSON array format:
[{
  "topic": "The benefits of reading books",
  "instruction": "寫一個段落討論閱讀書籍的好處。請包含一個明確的主題句，至少三個支持性細節，並用適當的連接詞組織你的想法。確保段落有清楚的結構和邏輯性。",
  "min_sentences": 5,
  "max_sentences": 8,
  "evaluation_criteria": {
    "grammar": 25,
    "vocabulary": 25,
    "coherence": 25,
    "task_achievement": 25
  },
  "sample_responses": [
    "Reading books offers numerous benefits for personal and intellectual development. First, regular reading significantly improves vocabulary and language skills by exposing readers to diverse writing styles and new words in context. Additionally, books provide valuable knowledge and insights about different cultures, historical periods, and scientific discoveries that broaden our understanding of the world. Furthermore, reading enhances critical thinking abilities as readers analyze characters' motivations, evaluate arguments, and draw connections between ideas. Finally, the act of reading serves as an excellent stress-relief activity that allows people to escape from daily pressures and immerse themselves in different worlds. Therefore, incorporating reading into our daily routine is essential for lifelong learning and mental well-being.",
    "The habit of reading books brings multiple advantages to individuals of all ages. To begin with, reading strengthens cognitive function by challenging the brain to process complex information, remember plot details, and make logical connections between concepts. Moreover, books serve as windows to different experiences and perspectives, helping readers develop empathy and cultural awareness through exposure to diverse characters and situations. Reading also improves concentration and focus in our digital age, as it requires sustained attention unlike the quick consumption of social media content. Most importantly, books provide endless entertainment and emotional satisfaction, offering both escapism and personal reflection opportunities that contribute to mental health and happiness."
  ]
}]

Topics to include: personal experiences, social issues, education, technology, environment, health, hobbies, travel, relationships, career goals
Paragraph types: descriptive, narrative, expository, argumentative (adjust complexity based on difficulty)
Encourage use of transition words, topic sentences, and supporting details.

Return ONLY the JSON array. No markdown formatting.`;
        // 取得 LLM 設定
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.3.1');
        console.log(`[DEBUG 231_generate.ts] Sending prompt to LLM service`);
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_231_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.LOW, 'generator_231');
        console.log(`[DEBUG 231_generate.ts] Received response from LLM`);
        // 進行基本的響應驗證 (是否為數組)
        if (!Array.isArray(response)) {
            console.error('[DEBUG 231_generate.ts] Invalid response type from LLM: expected an array, got', typeof response, response);
            return null;
        }
        console.log(`[DEBUG 231_generate.ts] Generated ${response.length} question(s) for type 2.3.1.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 231_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=231_generate.js.map