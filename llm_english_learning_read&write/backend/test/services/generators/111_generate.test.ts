import { generate111Question } from '../../../src/services/generators/111_generate';
import GeminiAPIService from '../../../src/services/GeminiAPIService';
import { CleanJSON } from '../../../src/utils/CleanJSON';

// Mock a часть GeminiAPIService
jest.mock('../../../src/services/GeminiAPIService');

// Mock CleanJSON
// jest.mock('../../../src/utils/CleanJSON'); // CleanJSON is a class, mocking its instance methods is more typical

// Define a type for the question data for clarity in tests
interface QuestionData111 {
    passage: string;
    targetWord: string;
    question: string;
    options: Array<{ [key: string]: string }>;
    standard_answer: string;
    explanation_of_Question: string;
}


describe('generate111Question', () => {
    // Typed mock for GeminiAPIService
    let mockGetCompletion: jest.MockedFunction<typeof GeminiAPIService.getCompletion>;
    // Mock for CleanJSON instance
    let mockExtractAndParse: jest.Mock;

    beforeEach(() => {
        // Reset mocks before each test
        mockGetCompletion = GeminiAPIService.getCompletion as jest.MockedFunction<typeof GeminiAPIService.getCompletion>;
        mockGetCompletion.mockReset();

        // For CleanJSON, we mock the prototype's method
        // Or, if CleanJSON methods were static, we'd mock them directly on the class.
        // Here, we assume we'll mock the instance method when CleanJSON is instantiated in generate111Question
        // This requires a slightly different approach if we want to control its behavior per test.
        // A common way is to mock the constructor and the instance method.
        mockExtractAndParse = jest.fn();
        CleanJSON.prototype.extractAndParse = mockExtractAndParse;
        mockExtractAndParse.mockReset();
    });

    // Helper to create a valid LLM response string
    const createMockLLMResponse = (questionData: QuestionData111): string => {
        return JSON.stringify([questionData]); // The prompt expects an array
    };

    const validQuestionData: QuestionData111 = {
        passage: "The resilient athlete quickly recovered from her injury.",
        targetWord: "resilient",
        question: "In the sentence above, the word 'resilient' most nearly means:",
        options: [
            { "A": "weak" },
            { "B": "determined" },
            { "C": "flexible and quick to recover" },
            { "D": "tired" }
        ],
        standard_answer: "C",
        explanation_of_Question: "Resilient 指能夠承受或迅速從困難情況中恢復。此處運動員能快速復原，顯示其高度彈性與復原力，因此選項 C 正確。選項 A「weak」意為虛弱，語意相反；選項 B「determined」僅表意志堅定，未涵蓋恢復力；選項 D「tired」表示疲倦，與原意無關。"
    };

    test('should return valid question data on successful generation', async () => {
        const mockResponse = createMockLLMResponse(validQuestionData);
        mockGetCompletion.mockResolvedValue(mockResponse);
        mockExtractAndParse.mockReturnValue([validQuestionData]); // CleanJSON successfully parses and returns the array

        const result = await generate111Question();
        
        expect(result).toEqual(validQuestionData);
        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        // We can also check the prompt if needed, by inspecting mockGetCompletion.mock.calls[0][0]
        expect(mockExtractAndParse).toHaveBeenCalledWith(mockResponse);
    });

    test('should return null if LLM response is empty', async () => {
        mockGetCompletion.mockResolvedValue(""); // Empty response

        const result = await generate111Question();
        expect(result).toBeNull();
        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        expect(mockExtractAndParse).not.toHaveBeenCalled(); // Should not be called if response is empty
    });

    test('should return null if CleanJSON fails to parse (returns null)', async () => {
        const mockGarbledResponse = "This is not JSON";
        mockGetCompletion.mockResolvedValue(mockGarbledResponse);
        mockExtractAndParse.mockReturnValue(null); // CleanJSON returns null

        const result = await generate111Question();
        expect(result).toBeNull();
        expect(mockExtractAndParse).toHaveBeenCalledWith(mockGarbledResponse);
    });

    test('should return null if CleanJSON returns an empty array', async () => {
        const mockLLMResponseWithEmptyArray = "[]";
        mockGetCompletion.mockResolvedValue(mockLLMResponseWithEmptyArray);
        mockExtractAndParse.mockReturnValue([]); // CleanJSON returns an empty array

        const result = await generate111Question();
        expect(result).toBeNull();
    });

    test('should handle cases where CleanJSON returns a single object when an array was expected by prompt', async () => {
        // This test assumes generate111Question handles wrapping a single object into an array if questionNumber is 1
        // as per the logic in generate111Question:  `parsedJsonArray = [parsedResult as QuestionData111];`
        const mockLLMSingleObjectString = JSON.stringify(validQuestionData); // Not an array
        mockGetCompletion.mockResolvedValue(mockLLMSingleObjectString);
        // CleanJSON might return a single object if the LLM didn't wrap it in an array.
        mockExtractAndParse.mockReturnValue(validQuestionData); 

        const result = await generate111Question(1, "", 70);
        expect(result).toEqual(validQuestionData);
    });


    test('should return null if GeminiAPIService.getCompletion throws an error', async () => {
        mockGetCompletion.mockRejectedValue(new Error("Gemini API Error"));

        const result = await generate111Question();
        expect(result).toBeNull();
    });

    // Test for when CleanJSON.prototype.extractAndParse itself throws an error
    test('should return null if CleanJSON.extractAndParse throws an error', async () => {
        mockGetCompletion.mockResolvedValue("Some valid-looking JSON string");
        mockExtractAndParse.mockImplementation(() => {
            throw new Error("CleanJSON internal error");
        });

        const result = await generate111Question();
        expect(result).toBeNull();
    });

    test('should return null if the parsed question data fails validation (e.g. missing field)', async () => {
        const incompleteData = { ...validQuestionData, passage: undefined } as any;
        const mockResponse = createMockLLMResponse(incompleteData); // Technically, createMockLLMResponse expects QuestionData111
        
        mockGetCompletion.mockResolvedValue(JSON.stringify([incompleteData])); // LLM returns array with one incomplete object
        mockExtractAndParse.mockReturnValue([incompleteData]);

        const result = await generate111Question();
        expect(result).toBeNull();
    });

    test('should return null if standard_answer is not a valid option key', async () => {
        const dataWithInvalidAnswer = { ...validQuestionData, standard_answer: "X" };
        mockGetCompletion.mockResolvedValue(createMockLLMResponse(dataWithInvalidAnswer));
        mockExtractAndParse.mockReturnValue([dataWithInvalidAnswer]);

        const result = await generate111Question();
        expect(result).toBeNull();
    });

    // Test for prompt construction (more advanced, requires inspecting mock call arguments)
    test('should construct the prompt correctly', async () => {
        mockGetCompletion.mockResolvedValue(createMockLLMResponse(validQuestionData));
        mockExtractAndParse.mockReturnValue([validQuestionData]);

        const qNum = 1;
        const histSum = "Test history summary";
        const diffSet = 80;

        await generate111Question(qNum, histSum, diffSet);

        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        const actualPrompt = mockGetCompletion.mock.calls[0][0];
        
        expect(actualPrompt).toContain(`Generate exactly ${qNum} multiple-choice questions.`);
        expect(actualPrompt).toContain(`Learner context: ${histSum}`);
        expect(actualPrompt).toContain(`accuracy targets ${diffSet}%`);
    });

}); 