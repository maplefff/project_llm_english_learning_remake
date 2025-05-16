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
const _111_generate_1 = require("../../../src/services/generators/111_generate");
const GeminiAPIService_1 = __importDefault(require("../../../src/services/GeminiAPIService"));
const CleanJSON_1 = require("../../../src/utils/CleanJSON");
// Mock a часть GeminiAPIService
jest.mock('../../../src/services/GeminiAPIService');
describe('generate111Question', () => {
    // Typed mock for GeminiAPIService
    let mockGetCompletion;
    // Mock for CleanJSON instance
    let mockExtractAndParse;
    beforeEach(() => {
        // Reset mocks before each test
        mockGetCompletion = GeminiAPIService_1.default.getCompletion;
        mockGetCompletion.mockReset();
        // For CleanJSON, we mock the prototype's method
        // Or, if CleanJSON methods were static, we'd mock them directly on the class.
        // Here, we assume we'll mock the instance method when CleanJSON is instantiated in generate111Question
        // This requires a slightly different approach if we want to control its behavior per test.
        // A common way is to mock the constructor and the instance method.
        mockExtractAndParse = jest.fn();
        CleanJSON_1.CleanJSON.prototype.extractAndParse = mockExtractAndParse;
        mockExtractAndParse.mockReset();
    });
    // Helper to create a valid LLM response string
    const createMockLLMResponse = (questionData) => {
        return JSON.stringify([questionData]); // The prompt expects an array
    };
    const validQuestionData = {
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
    test('should return valid question data on successful generation', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResponse = createMockLLMResponse(validQuestionData);
        mockGetCompletion.mockResolvedValue(mockResponse);
        mockExtractAndParse.mockReturnValue([validQuestionData]); // CleanJSON successfully parses and returns the array
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toEqual(validQuestionData);
        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        // We can also check the prompt if needed, by inspecting mockGetCompletion.mock.calls[0][0]
        expect(mockExtractAndParse).toHaveBeenCalledWith(mockResponse);
    }));
    test('should return null if LLM response is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        mockGetCompletion.mockResolvedValue(""); // Empty response
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        expect(mockExtractAndParse).not.toHaveBeenCalled(); // Should not be called if response is empty
    }));
    test('should return null if CleanJSON fails to parse (returns null)', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGarbledResponse = "This is not JSON";
        mockGetCompletion.mockResolvedValue(mockGarbledResponse);
        mockExtractAndParse.mockReturnValue(null); // CleanJSON returns null
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
        expect(mockExtractAndParse).toHaveBeenCalledWith(mockGarbledResponse);
    }));
    test('should return null if CleanJSON returns an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLLMResponseWithEmptyArray = "[]";
        mockGetCompletion.mockResolvedValue(mockLLMResponseWithEmptyArray);
        mockExtractAndParse.mockReturnValue([]); // CleanJSON returns an empty array
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
    }));
    test('should handle cases where CleanJSON returns a single object when an array was expected by prompt', () => __awaiter(void 0, void 0, void 0, function* () {
        // This test assumes generate111Question handles wrapping a single object into an array if questionNumber is 1
        // as per the logic in generate111Question:  `parsedJsonArray = [parsedResult as QuestionData111];`
        const mockLLMSingleObjectString = JSON.stringify(validQuestionData); // Not an array
        mockGetCompletion.mockResolvedValue(mockLLMSingleObjectString);
        // CleanJSON might return a single object if the LLM didn't wrap it in an array.
        mockExtractAndParse.mockReturnValue(validQuestionData);
        const result = yield (0, _111_generate_1.generate111Question)(1, "", 70);
        expect(result).toEqual(validQuestionData);
    }));
    test('should return null if GeminiAPIService.getCompletion throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockGetCompletion.mockRejectedValue(new Error("Gemini API Error"));
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
    }));
    // Test for when CleanJSON.prototype.extractAndParse itself throws an error
    test('should return null if CleanJSON.extractAndParse throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockGetCompletion.mockResolvedValue("Some valid-looking JSON string");
        mockExtractAndParse.mockImplementation(() => {
            throw new Error("CleanJSON internal error");
        });
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
    }));
    test('should return null if the parsed question data fails validation (e.g. missing field)', () => __awaiter(void 0, void 0, void 0, function* () {
        const incompleteData = Object.assign(Object.assign({}, validQuestionData), { passage: undefined });
        const mockResponse = createMockLLMResponse(incompleteData); // Technically, createMockLLMResponse expects QuestionData111
        mockGetCompletion.mockResolvedValue(JSON.stringify([incompleteData])); // LLM returns array with one incomplete object
        mockExtractAndParse.mockReturnValue([incompleteData]);
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
    }));
    test('should return null if standard_answer is not a valid option key', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataWithInvalidAnswer = Object.assign(Object.assign({}, validQuestionData), { standard_answer: "X" });
        mockGetCompletion.mockResolvedValue(createMockLLMResponse(dataWithInvalidAnswer));
        mockExtractAndParse.mockReturnValue([dataWithInvalidAnswer]);
        const result = yield (0, _111_generate_1.generate111Question)();
        expect(result).toBeNull();
    }));
    // Test for prompt construction (more advanced, requires inspecting mock call arguments)
    test('should construct the prompt correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        mockGetCompletion.mockResolvedValue(createMockLLMResponse(validQuestionData));
        mockExtractAndParse.mockReturnValue([validQuestionData]);
        const qNum = 1;
        const histSum = "Test history summary";
        const diffSet = 80;
        yield (0, _111_generate_1.generate111Question)(qNum, histSum, diffSet);
        expect(mockGetCompletion).toHaveBeenCalledTimes(1);
        const actualPrompt = mockGetCompletion.mock.calls[0][0];
        expect(actualPrompt).toContain(`Generate exactly ${qNum} multiple-choice questions.`);
        expect(actualPrompt).toContain(`Learner context: ${histSum}`);
        expect(actualPrompt).toContain(`accuracy targets ${diffSet}%`);
    }));
});
//# sourceMappingURL=111_generate.test.js.map