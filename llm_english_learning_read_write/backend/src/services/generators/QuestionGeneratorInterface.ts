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
 * 題型 1.1.1 (字彙選擇題) 的數據結構
 */
export interface QuestionData111 {
  passage: string; // 文章段落
  targetWord: string; // 目標單字
  question: string; // 問題文本
  options: Option[]; // 選項列表
  standard_answer: string; // 標準答案 (選項的 id)
  explanation_of_Question: string; // 題目的中文解釋 (由 LLM 提供)
}

/**
 * 題型 1.1.2 (詞彙填空題) 的數據結構
 */
export interface QuestionData112 {
  passage: string; // 包含空格的文章段落
  question: string; // 問題文本
  options: Option[]; // 選項列表
  standard_answer: string; // 標準答案 (選項的 id)
  explanation_of_Question: string; // 題目的中文解釋 (由 LLM 提供)
}

// --- 其他題型介面可以在這裡添加 ---
// export interface QuestionData121 { ... }

/**
 * 通用的題目數據聯合類型
 * 代表 QuestionGeneratorService 可能返回的任何一種題目數據結構，
 * 或者在生成失敗時返回 null。
 * 也可能返回數組形式。
 */
export type QuestionData = 
  | QuestionData111 
  | QuestionData111[] 
  | QuestionData112 
  | QuestionData112[] 
  | null; 