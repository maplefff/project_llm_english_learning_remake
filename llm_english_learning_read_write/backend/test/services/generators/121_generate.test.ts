import { generate121Question } from '../../../src/services/generators/121_generate';
import { QuestionData121 } from '../../../src/services/generators/QuestionGeneratorInterface';

describe('121_generate', () => {
  // 增加超時時間，因為 LLM 調用可能需要較長時間
  jest.setTimeout(30000);

  test('should generate 1 sentence correction question by default', async () => {
    const result = await generate121Question();
    
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    
    const question = result![0];
    expect(question).toHaveProperty('original_sentence');
    expect(question).toHaveProperty('instruction');
    expect(question).toHaveProperty('standard_corrections');
    expect(question).toHaveProperty('error_types');
    expect(question).toHaveProperty('explanation_of_Question');
    
    expect(typeof question.original_sentence).toBe('string');
    expect(typeof question.instruction).toBe('string');
    expect(Array.isArray(question.standard_corrections)).toBe(true);
    expect(Array.isArray(question.error_types)).toBe(true);
    expect(typeof question.explanation_of_Question).toBe('string');
    
    expect(question.original_sentence.length).toBeGreaterThan(0);
    expect(question.standard_corrections.length).toBeGreaterThan(0);
    expect(question.error_types.length).toBeGreaterThan(0);
  });

  test('should generate multiple questions when requested', async () => {
    const numberOfQuestions = 3;
    const result = await generate121Question(numberOfQuestions);
    
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(numberOfQuestions);
    
    result!.forEach((question: QuestionData121) => {
      expect(question).toHaveProperty('original_sentence');
      expect(question).toHaveProperty('instruction');
      expect(question).toHaveProperty('standard_corrections');
      expect(question).toHaveProperty('error_types');
      expect(question).toHaveProperty('explanation_of_Question');
    });
  });

  test('should handle different difficulty settings', async () => {
    const easyResult = await generate121Question(1, '', 30);
    const hardResult = await generate121Question(1, '', 90);
    
    expect(easyResult).not.toBeNull();
    expect(hardResult).not.toBeNull();
    
    expect(easyResult![0]).toHaveProperty('original_sentence');
    expect(hardResult![0]).toHaveProperty('original_sentence');
  });

  test('should include valid error types', async () => {
    const result = await generate121Question(1);
    
    expect(result).not.toBeNull();
    const question = result![0];
    
    // 檢查錯誤類型是否在預期範圍內
    const validErrorTypes = [
      'verb_tense', 'subject_verb_agreement', 'articles', 'prepositions', 
      'word_form', 'plural_singular', 'pronoun_case', 'infinitive_vs_gerund', 
      'comparative_superlative', 'modal_verbs'
    ];
    
    question.error_types.forEach(errorType => {
      expect(validErrorTypes).toContain(errorType);
    });
  });

  test('should provide explanations in Chinese', async () => {
    const result = await generate121Question(1);
    
    expect(result).not.toBeNull();
    const question = result![0];
    
    // 檢查解釋是否包含中文字符
    expect(question.explanation_of_Question).toMatch(/[\u4e00-\u9fff]/);
  });
}); 