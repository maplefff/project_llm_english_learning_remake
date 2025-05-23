"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate251Question = generate251Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const RateLimiter_1 = require("../../interfaces/RateLimiter");
const genai_1 = require("@google/genai");
const QUESTION_DATA_251_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        context: { type: genai_1.Type.STRING },
        question: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        min_words: { type: genai_1.Type.INTEGER },
        max_words: { type: genai_1.Type.INTEGER },
        key_points: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 4
        },
        sample_responses: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 2
        },
        evaluation_focus: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 4
        }
    },
    required: ['context', 'question', 'instruction', 'min_words', 'max_words', 'key_points', 'sample_responses', 'evaluation_focus'],
};
const QUESTION_DATA_251_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_251_ITEM_SCHEMA,
};
async function generate251Question(numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
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
        const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.5.1');
        const response = await GeminiAPIService_1.default.getResponse(prompt, {
            responseSchema: QUESTION_DATA_251_ARRAY_SCHEMA,
            config,
        }, RateLimiter_1.PRIORITY_LEVELS.LOW, 'generator_251');
        if (!Array.isArray(response)) {
            console.error('[DEBUG 251_generate.ts] Invalid response type from LLM');
            return null;
        }
        console.log(`[DEBUG 251_generate.ts] Generated ${response.length} question(s) for type 2.5.1.`);
        return response;
    }
    catch (error) {
        console.error('[DEBUG 251_generate.ts] Error during question generation:', error);
        return null;
    }
}
//# sourceMappingURL=251_generate.js.map