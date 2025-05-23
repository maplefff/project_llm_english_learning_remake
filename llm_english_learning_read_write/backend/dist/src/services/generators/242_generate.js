"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate242Question = generate242Question;
const LLMConfigService_1 = require("../../utils/LLMConfigService");
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const genai_1 = require("@google/genai");
const QUESTION_DATA_242_ITEM_SCHEMA = {
    type: genai_1.Type.OBJECT,
    properties: {
        topic: { type: genai_1.Type.STRING },
        prompt: { type: genai_1.Type.STRING },
        instruction: { type: genai_1.Type.STRING },
        min_words: { type: genai_1.Type.INTEGER },
        max_words: { type: genai_1.Type.INTEGER },
        required_elements: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 2,
            maxItems: 5
        },
        evaluation_criteria: {
            type: genai_1.Type.OBJECT,
            properties: {
                grammar: { type: genai_1.Type.INTEGER },
                vocabulary: { type: genai_1.Type.INTEGER },
                coherence: { type: genai_1.Type.INTEGER },
                task_achievement: { type: genai_1.Type.INTEGER },
                organization: { type: genai_1.Type.INTEGER }
            },
            required: ['grammar', 'vocabulary', 'coherence', 'task_achievement', 'organization']
        },
        sample_responses: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
            minItems: 1,
            maxItems: 2
        }
    },
    required: ['topic', 'prompt', 'instruction', 'min_words', 'max_words', 'required_elements', 'evaluation_criteria', 'sample_responses'],
};
const QUESTION_DATA_242_ARRAY_SCHEMA = {
    type: genai_1.Type.ARRAY,
    items: QUESTION_DATA_242_ITEM_SCHEMA,
};
function generate242Question() {
    return __awaiter(this, arguments, void 0, function* (numberOfQuestions = 1, historySummary = "", difficultySetting = 70) {
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
            const config = LLMConfigService_1.LLMConfigService.getInstance().getConfig('2.4.2');
            const response = yield GeminiAPIService_1.default.getResponse(prompt, {
                responseSchema: QUESTION_DATA_242_ARRAY_SCHEMA,
                config,
            });
            if (!Array.isArray(response)) {
                console.error('[DEBUG 242_generate.ts] Invalid response type from LLM');
                return null;
            }
            console.log(`[DEBUG 242_generate.ts] Generated ${response.length} question(s) for type 2.4.2.`);
            return response;
        }
        catch (error) {
            console.error('[DEBUG 242_generate.ts] Error during question generation:', error);
            return null;
        }
    });
}
//# sourceMappingURL=242_generate.js.map