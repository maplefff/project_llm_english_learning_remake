// /Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/manual_test/services/generators/run_111_generate_manual.js

// This script assumes that your TypeScript code has been compiled to JavaScript
// in the 'dist' directory, as per typical tsconfig.json settings.

// Adjust the path according to your actual compiled output structure.
// Assuming 'outDir': './dist' in tsconfig.json, and this script is in manual_test/services/generators/
const { generate111Question } = require('../../../dist/services/generators/111_generate');

// Load .env variables, especially GEMINI_API_KEY
// GeminiAPIService.ts already does this, but good to be explicit if running standalone tests often.
require('dotenv').config({ path: '../../../../.env' }); // Adjust path to your .env file

async function runManualTest() {
    console.log("Starting manual test for generate111Question...");
    console.log("Ensure your GEMINI_API_KEY is set in the .env file in the backend root.");

    const testParams = {
        questionNumber: 5,
        historySummary: "",
        difficultySetting: 70 // Target 70% accuracy
    };

    try {
        console.log(`Attempting to generate ${testParams.questionNumber} question(s) with params:`);
        console.log(`History Summary: ${testParams.historySummary}`);
        console.log(`Difficulty Setting: ${testParams.difficultySetting}%`);
        console.log("-----------------------------------------------------");

        const question = await generate111Question(
            testParams.questionNumber,
            testParams.historySummary,
            testParams.difficultySetting
        );

        console.log("-----------------------------------------------------");
        if (question) {
            console.log("Successfully generated question (Raw Object):");
            console.log(question); // Log the raw object
            console.log("\nSuccessfully generated question (JSON Stringified):");
            console.log(JSON.stringify(question, null, 2));
        } else {
            console.error("Failed to generate question. The function returned null.");
        }
    } catch (error) {
        console.error("An error occurred during the manual test execution:", error);
    }
}

runManualTest(); 