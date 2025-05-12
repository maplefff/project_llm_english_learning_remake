import { generate111Question } from '../../../src/services/generators/111_generate';
import 'dotenv/config'; // Ensure API Key and other env variables are loaded

async function runManualTest() {
    console.log("--- Starting manual test for generate111Question ---");

    // Check if API Key is loaded
    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is not set in environment variables. Check your .env file in the project root.");
        return;
    }
    console.log("GEMINI_API_KEY loaded.");

    // Set test parameters
    const difficulty = 75; // Use a different difficulty than unit tests for distinction
    const historySummary = "Learner is preparing for an exam and needs practice with B2 level vocabulary.";

    console.log(`\nTest Parameters:
  Difficulty: ${difficulty}
  History Summary: ${historySummary}
`);

    try {
        console.log("Calling generate111Question...");
        // Call the actual generator function
        const questionData = await generate111Question(1, historySummary, difficulty);

        console.log("\n--- Test Complete ---");
        if (questionData) {
            console.log("Successfully generated question data:");
            console.log(JSON.stringify(questionData, null, 2));
        } else {
            // Errors within generate111Question should have been logged already
            console.log("Failed to generate question data successfully (see error logs above).");
        }
    } catch (error: any) {
        console.log("\n--- Test Failed ---");
        console.error("Caught unexpected error during generate111Question call:", error);
    }
}

// Execute the test function
runManualTest(); 