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
Object.defineProperty(exports, "__esModule", { value: true });
const _111_generate_1 = require("../../../src/services/generators/111_generate");
require("dotenv/config"); // Ensure API Key and other env variables are loaded
function runManualTest() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("--- Starting manual test for generate111Question ---");
        // Check if API Key is loaded
        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY is not set in environment variables. Check your .env file in the project root.");
            return;
        }
        console.log("GEMINI_API_KEY loaded.");
        // Set test parameters
        const questionNumber = 3;
        const difficulty = 75; // Use a different difficulty than unit tests for distinction
        const historySummary = "Learner is preparing for an exam and needs practice with B2 level vocabulary.";
        console.log(`\nTest Parameters:
  Question Number: ${questionNumber}
  Difficulty: ${difficulty}
  History Summary: ${historySummary}
`);
        try {
            console.log("Calling generate111Question...");
            // Call the actual generator function
            const questionData = yield (0, _111_generate_1.generate111Question)(questionNumber, historySummary, difficulty);
            console.log("\n--- Test Complete ---");
            if (questionData) {
                console.log("Successfully generated question data:");
                console.log(JSON.stringify(questionData, null, 2));
            }
            else {
                // Errors within generate111Question should have been logged already
                console.log("Failed to generate question data successfully (see error logs above).");
            }
        }
        catch (error) {
            console.log("\n--- Test Failed ---");
            console.error("Caught unexpected error during generate111Question call:", error);
        }
    });
}
// Execute the test function
runManualTest();
//# sourceMappingURL=test_111_generate_new.js.map