/**
 * @fileoverview 定義各種題型數據的共享介面和類型。
 */

/**
 * 選項結構
 */
export interface Option {
  id: string; // 選項標識符，如 "A", "B", "C", "D"
  text: string; // 選項的文本內容
}

/**
 * 評分結果結構
 */
export interface EvaluationResult {
  isCorrect?: boolean;         // 選擇題用
  score?: number;              // 自由文本題用 (0-100)
  correctAnswer?: any;         // 標準答案
  feedback: string;            // 詳細反饋
  breakdown?: ScoreBreakdown;  // 分項評分
}

export interface ScoreBreakdown {
  grammar?: number;
  vocabulary?: number;
  coherence?: number;
  task_achievement?: number;
  accuracy?: number;
  fluency?: number;
}

// ========== 1.1 詞彙理解 ==========

/**
 * 題型 1.1.1 (詞義選擇題) 的數據結構
 */
export interface QuestionData111 {
  passage: string; // 文章段落
  targetWord: string; // 目標單字
  question: string; // 問題文本
  options: Option[]; // 選項列表
  standard_answer: string; // 標準答案 (選項的 id)
  explanation_of_Question: string; // 題目的中文解釋
}

/**
 * 題型 1.1.2 (詞彙填空題) 的數據結構
 */
export interface QuestionData112 {
  passage: string; // 包含空格的文章段落
  question: string; // 問題文本
  options: Option[]; // 選項列表
  standard_answer: string; // 標準答案 (選項的 id)
  explanation_of_Question: string; // 題目的中文解釋
}

// ========== 1.2 文法結構 ==========

/**
 * 題型 1.2.1 (句子改錯) 的數據結構
 */
export interface QuestionData121 {
  original_sentence: string; // 包含錯誤的句子
  instruction: string; // 改錯指示
  standard_corrections: string[]; // 多個可接受的正確答案
  error_types: string[]; // 錯誤類型標記
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 1.2.2 (語法結構選擇) 的數據結構
 */
export interface QuestionData122 {
  question: string; // 問題描述
  options: Option[]; // 4個語法選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 1.2.3 (轉承詞選擇) 的數據結構
 */
export interface QuestionData123 {
  sentence_context: string; // 包含空格的句子
  question: string; // 選擇提示
  options: Option[]; // 4個轉承詞選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

// ========== 1.3 主要思想理解 ==========

/**
 * 題型 1.3.1 (段落主旨) 的數據結構
 */
export interface QuestionData131 {
  passage: string; // 100-150字段落
  question: string; // 主旨問題
  options: Option[]; // 4個主旨選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

// ========== 1.4 細節理解 ==========

/**
 * 題型 1.4.1 (細節查找) 的數據結構
 */
export interface QuestionData141 {
  passage: string; // 包含具體資訊的段落
  question: string; // 細節問題
  options: Option[]; // 4個選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

// ========== 1.5 進階閱讀理解 ==========

/**
 * 題型 1.5.1 (推論能力) 的數據結構
 */
export interface QuestionData151 {
  passage: string; // 150-250字段落，適合進行推論
  question: string; // 推論問題
  options: Option[]; // 4個選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 1.5.2 (作者目的與語氣) 的數據結構
 */
export interface QuestionData152 {
  passage: string; // 150-250字段落，包含明顯的作者觀點
  question: string; // 關於作者目的或語氣的問題
  options: Option[]; // 4個選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 1.5.3 (文本結構與組織) 的數據結構
 */
export interface QuestionData153 {
  passage: string; // 150-250字段落，有明確的組織結構
  question: string; // 關於文本結構的問題
  options: Option[]; // 4個選項
  standard_answer: string; // 正確答案
  explanation_of_Question: string; // 詳細解釋
}

// ========== 2.1 文法與力學 ==========

/**
 * 題型 2.1.1 (看圖/主題寫作) 的數據結構
 */
export interface QuestionData211 {
  prompt: string; // 寫作提示或圖片描述
  instruction: string; // 具體要求
  min_words: number; // 最少字數
  max_words: number; // 最多字數
  evaluation_criteria: { // 評分標準
    grammar: number; // 語法權重
    vocabulary: number; // 詞彙權重
    coherence: number; // 連貫性權重
    task_achievement: number; // 任務完成度權重
  };
  sample_responses: string[]; // 範例回答
}

/**
 * 題型 2.1.2 (改錯題) 的數據結構
 */
export interface QuestionData212 {
  original_text: string; // 包含錯誤的文本
  instruction: string; // 改錯指示
  standard_corrections: string[]; // 標準修正版本
  error_types: string[]; // 錯誤類型
  explanation_of_Question: string; // 詳細解釋
}

// ========== 2.2 句子結構 ==========

/**
 * 題型 2.2.1 (句子合併) 的數據結構
 */
export interface QuestionData221 {
  sentence_a: string; // 第一個句子
  sentence_b: string; // 第二個句子
  instruction: string; // 合併指示 (如：用while, although等)
  standard_answers: string[]; // 多個可接受的合併答案
  combining_method: string; // 合併方法提示
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 2.2.2 (句子重組) 的數據結構
 */
export interface QuestionData222 {
  scrambled_words: string[]; // 打亂的詞語陣列
  instruction: string; // 重組指示
  standard_answers: string[]; // 多個可接受答案
  explanation_of_Question: string; // 詳細解釋
}

// ========== 2.3 連貫與一致 ==========

/**
 * 題型 2.3.1 (段落寫作) 的數據結構
 */
export interface QuestionData231 {
  topic: string; // 寫作主題
  instruction: string; // 具體要求
  min_sentences: number; // 最少句數
  max_sentences: number; // 最多句數
  evaluation_criteria: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    task_achievement: number;
  };
  sample_responses: string[];
}

// ========== 2.4 組織與排序 ==========

/**
 * 題型 2.4.1 (段落排序) 的數據結構
 */
export interface QuestionData241 {
  scrambled_sentences: string[]; // 打亂順序的句子陣列
  instruction: string; // 排序指示
  correct_order: number[]; // 正確的順序 (索引陣列)
  topic_hint: string; // 主題提示
  explanation_of_Question: string; // 詳細解釋
}

/**
 * 題型 2.4.2 (短文寫作) 的數據結構
 */
export interface QuestionData242 {
  topic: string; // 寫作主題
  prompt: string; // 寫作提示
  instruction: string; // 具體要求
  min_words: number; // 最少字數
  max_words: number; // 最多字數
  required_elements: string[]; // 必須包含的要素
  evaluation_criteria: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    task_achievement: number;
    organization: number;
  };
  sample_responses: string[];
}

// ========== 2.5 問答與簡答 ==========

/**
 * 題型 2.5.1 (簡答題) 的數據結構
 */
export interface QuestionData251 {
  context: string; // 情境或背景
  question: string; // 問題
  instruction: string; // 回答指示
  min_words: number; // 最少字數
  max_words: number; // 最多字數
  key_points: string[]; // 期望包含的要點
  sample_responses: string[]; // 範例回答
  evaluation_focus: string[]; // 評分重點
}

/**
 * 題型 2.5.2 (郵件/信函寫作) 的數據結構
 */
export interface QuestionData252 {
  scenario: string; // 寫作情境
  recipient: string; // 收件人
  purpose: string; // 寫作目的
  instruction: string; // 具體要求
  required_content: string[]; // 必須包含的內容
  tone: string; // 語調要求 (formal/informal)
  min_words: number; // 最少字數
  max_words: number; // 最多字數
  evaluation_criteria: {
    grammar: number;
    vocabulary: number;
    coherence: number;
    task_achievement: number;
    appropriateness: number; // 語調適當性
  };
  sample_responses: string[];
}

// ========== 2.6 句式變換 ==========

/**
 * 題型 2.6.1 (改寫句子) 的數據結構
 */
export interface QuestionData261 {
  original_sentence: string; // 原始句子
  instruction: string; // 改寫指示 (如：改為被動語態、條件句等)
  transformation_type: string; // 變換類型
  standard_answers: string[]; // 多個可接受的改寫答案
  hints: string[]; // 提示詞彙或結構
  explanation_of_Question: string; // 詳細解釋
}

// ========== 2.7 中翻英 ==========

/**
 * 題型 2.7.1 (中翻英句子) 的數據結構
 */
export interface QuestionData271 {
  source_text: string; // 中文原文
  instruction: string; // 翻譯指示
  reference_translations: string[]; // 參考翻譯
  evaluation_focus: string[]; // 評分重點
}

/**
 * 題型 2.7.2 (中翻英短文) 的數據結構
 */
export interface QuestionData272 {
  source_text: string; // 中文原文
  instruction: string; // 翻譯指示
  reference_translations: string[]; // 參考翻譯
  evaluation_focus: string[]; // 評分重點
}

// ========== 2.8 英翻中 ==========

/**
 * 題型 2.8.1 (英翻中句子) 的數據結構
 */
export interface QuestionData281 {
  source_text: string; // 英文原文
  instruction: string; // 翻譯指示
  reference_translations: string[]; // 參考翻譯
  evaluation_focus: string[]; // 評分重點
  difficulty_hint: string; // 難度提示
}

/**
 * 題型 2.8.2 (英翻中短文) 的數據結構
 */
export interface QuestionData282 {
  source_text: string; // 英文原文
  instruction: string; // 翻譯指示
  reference_translations: string[]; // 參考翻譯
  evaluation_focus: string[]; // 評分重點
  context: string; // 文章背景或情境
}

/**
 * 通用的題目數據聯合類型
 */
export type QuestionData = 
  | QuestionData111 | QuestionData111[]
  | QuestionData112 | QuestionData112[]
  | QuestionData121 | QuestionData121[]
  | QuestionData122 | QuestionData122[]
  | QuestionData123 | QuestionData123[]
  | QuestionData131 | QuestionData131[]
  | QuestionData141 | QuestionData141[]
  | QuestionData151 | QuestionData151[]
  | QuestionData152 | QuestionData152[]
  | QuestionData153 | QuestionData153[]
  | QuestionData211 | QuestionData211[]
  | QuestionData212 | QuestionData212[]
  | QuestionData221 | QuestionData221[]
  | QuestionData222 | QuestionData222[]
  | QuestionData231 | QuestionData231[]
  | QuestionData241 | QuestionData241[]
  | QuestionData242 | QuestionData242[]
  | QuestionData251 | QuestionData251[]
  | QuestionData252 | QuestionData252[]
  | QuestionData261 | QuestionData261[]
  | QuestionData271 | QuestionData271[]
  | QuestionData272 | QuestionData272[]
  | QuestionData281 | QuestionData281[]
  | QuestionData282 | QuestionData282[]
  | null; 