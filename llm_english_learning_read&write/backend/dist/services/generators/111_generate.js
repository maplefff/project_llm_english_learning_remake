"use strict";
// llm_english_learning_read&write/backend/src/services/generators/111_generate.ts
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
exports.generate111Question = generate111Question;
const GeminiAPIService_1 = __importDefault(require("../GeminiAPIService"));
const CleanJSON_1 = require("../../utils/CleanJSON");
/**
 * Generates a question for type 1.1.1 (Word Meaning in Sentence).
 *
 * @param questionNumber The number of questions to generate (expected to be 1 for this specific generator).
 * @param historySummary A summary of the learner's history for difficulty adjustment.
 * @param difficultySetting The target correct answer rate (e.g., 70 for 70%).
 * @returns A Promise that resolves to the question data object or null if generation fails.
 */
function generate111Question() {
    return __awaiter(this, arguments, void 0, function* (questionNumber = 1, historySummary = "", difficultySetting = 70) {
        const PROMPT_TEMPLATE_1_1_1 = `You are an expert English-quiz generator for language learners.

1. Generate exactly ${questionNumber} multiple-choice questions.  
2. Learner context: ${historySummary}  
3. Set difficulty so the average learner accuracy targets {difficuty_setting}%.  
4. Adjust difficulty with reference to CEFR levels (A1–C2).  
5. Question type: test only vocabulary meaning, synonyms, and near-synonyms (no grammar).  
6. Output STRICT JSON: a single array of ${questionNumber} objects, nothing else.  
   Each object must contain:  
   • "passage" (string) – context sentence or short passage  
   • "targetWord" (string) – the word being tested  
   • "question" (string) – the question prompt  
   • "options" (array of 4 objects { "A": string }, { "B": string }, { "C": string }, { "D": string })  
   • "standard_answer" (string) – one of "A" | "B" | "C" | "D"  
   • "explanation_of_Question" (string) – concise Traditional-Chinese explanation of why the answer is correct and why the other options are wrong.  

7. Example of ONE valid object (format must be matched exactly):

{
  "passage": "The resilient athlete quickly recovered from her injury.",
  "targetWord": "resilient",
  "question": "In the sentence above, the word 'resilient' most nearly means:",
  "options": [
    { "A": "weak" },
    { "B": "determined" },
    { "C": "flexible and quick to recover" },
    { "D": "tired" }
  ],
  "standard_answer": "C",
  "explanation_of_Question": "Resilient 指能夠承受或迅速從困難情況中恢復。此處運動員能快速復原，顯示其高度彈性與復原力，因此選項 C 正確。選項 A「weak」意為虛弱，語意相反；選項 B「determined」僅表意志堅定，未涵蓋恢復力；選項 D「tired」表示疲倦，與原意無關。"
}

Return ONLY the JSON array when you generate the questions.
`;
        let prompt = PROMPT_TEMPLATE_1_1_1.replace('{difficuty_setting}', difficultySetting.toString());
        // console.log("Generated Prompt for 1.1.1:\n", prompt); // For debugging
        // --- DEBUG START ---
        console.log("DEBUG: Generated Prompt for 1.1.1:\n", prompt);
        // --- DEBUG END ---
        try {
            const rawLLMResponse = yield GeminiAPIService_1.default.getCompletion(prompt);
            // --- DEBUG START ---
            console.log("DEBUG: Raw LLM Response Text:\n", rawLLMResponse);
            // --- DEBUG END ---
            if (!rawLLMResponse || rawLLMResponse.trim() === "") {
                console.error("LLM response was null or empty.");
                return null;
            }
            const cleaner = new CleanJSON_1.CleanJSON();
            const parsedResult = cleaner.extractAndParse(rawLLMResponse);
            let parsedJsonArray = null;
            if (parsedResult && Array.isArray(parsedResult) && parsedResult.length > 0) {
                // Assuming all elements in parsedResult are compatible with QuestionData111
                // A more robust validation might be needed here depending on CleanJSON's strictness
                parsedJsonArray = parsedResult;
            }
            else if (parsedResult && typeof parsedResult === 'object' && !Array.isArray(parsedResult) && questionNumber === 1) {
                // Handle cases where CleanJSON might return a single object if the LLM didn't provide an array
                // and we only expected one question.
                console.warn("CleanJSON returned a single object; wrapping in an array.");
                parsedJsonArray = [parsedResult];
            }
            else {
                console.warn("CleanJSON did not return a non-empty array or a single object when one was expected. Parsed result:", parsedResult);
            }
            if (!parsedJsonArray || parsedJsonArray.length === 0) {
                console.error("Failed to parse LLM response into a valid question array or array is empty after CleanJSON.");
                return null;
            }
            const questionData = parsedJsonArray[0];
            if (questionData &&
                typeof questionData.passage === 'string' &&
                typeof questionData.targetWord === 'string' &&
                typeof questionData.question === 'string' &&
                Array.isArray(questionData.options) &&
                questionData.options.length === 4 &&
                questionData.options.every(opt => typeof opt === 'object' && opt !== null && Object.keys(opt).length === 1) &&
                typeof questionData.standard_answer === 'string' &&
                ['A', 'B', 'C', 'D'].includes(questionData.standard_answer.toUpperCase()) &&
                typeof questionData.explanation_of_Question === 'string') {
                const answerKey = questionData.standard_answer.toUpperCase();
                const answerKeyExists = questionData.options.some(opt => opt.hasOwnProperty(answerKey));
                if (answerKeyExists) {
                    return questionData;
                }
                else {
                    console.error("Validation failed: standard_answer key does not match any option key.", questionData);
                    return null;
                }
            }
            else {
                console.error("Validation failed: Parsed question data is missing fields or has incorrect types.", questionData);
                return null;
            }
        }
        catch (error) {
            console.error(`Error in generate111Question: ${(error instanceof Error) ? error.message : error}`);
            return null;
        }
    });
}
// Example usage (for testing purposes):
/*
async function testGenerate() {
    console.log("Testing 1.1.1 question generation...");
    // Ensure GEMINI_API_KEY is set in your .env file for this test to run properly.
    const question = await generate111Question(
        1,
        "Learner has average accuracy with B1 vocabulary.",
        70
    );
    if (question) {
        console.log("Successfully generated question:", JSON.stringify(question, null, 2));
    } else {
        console.log("Failed to generate question.");
    }
}

testGenerate();
*/ 
//# sourceMappingURL=111_generate.js.map