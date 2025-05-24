<template>
  <div class="question-renderer">
    <!-- 題型標題 -->
    <div v-if="showTypeHeader" class="question-type-header">
      <span class="question-type-code">{{ question.type }}</span>
      <span class="question-type-name">{{ getQuestionTypeName(question.type) }}</span>
    </div>

    <!-- 閱讀段落（如果有） -->
    <div v-if="question.passage" class="question-passage">
      <h4 class="passage-title">📖 Reading Passage</h4>
      <div class="passage-content" v-html="formatPassage(question.passage)"></div>
    </div>

    <!-- 原句（句子改錯題型使用） -->
    <div v-if="question.original_sentence" class="question-original-sentence">
      <h4 class="original-sentence-title">📝 Original Sentence</h4>
      <div class="original-sentence-content">{{ question.original_sentence }}</div>
    </div>

    <!-- 問題文字（如果有） -->
    <div v-if="question.question" class="question-text">
      <div class="question-label">❓ Question</div>
      <div class="question-content" v-html="formatQuestion(question.question)"></div>
    </div>

    <!-- 指令文字（如果有） -->
    <div v-if="question.instruction" class="question-instruction">
      <div class="instruction-label">📋 Instructions</div>
      <div class="instruction-content" v-html="formatQuestion(question.instruction)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 後端API實際返回的題目結構（根據測試結果修正）
interface BackendQuestion {
  id: string
  type: string  // 後端使用的是 'type' 而不是 'questionType'
  explanation_of_Question?: string
  instruction?: string
  passage?: string
  question?: string  // 有些題型沒有 question 欄位
  original_sentence?: string  // 1.2.1 句子改錯使用
  options?: Array<{ id: string; text: string }>  // 修正：實際是物件陣列
  standard_answer?: string
  standard_corrections?: string[]  // 1.2.1 句子改錯的標準答案
  targetWord?: string
  explanation?: string
  error_types?: string[]
}

interface Props {
  question: BackendQuestion
  showTypeHeader?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTypeHeader: true,
  readonly: false
})

// 方法：獲取題型名稱
const getQuestionTypeName = (typeCode: string): string => {
  const typeNames: Record<string, string> = {
    // 1.x.x 閱讀理解系列
    '1.1.1': '詞義選擇',
    '1.1.2': '詞彙填空',
    '1.2.1': '句子改錯',
    '1.2.2': '語法結構選擇',
    '1.2.3': '轉承詞選擇',
    '1.3.1': '段落主旨',
    '1.4.1': '細節查找',
    '1.5.1': '推論能力',
    '1.5.2': '作者目的與語氣',
    '1.5.3': '文本結構與組織',
    
    // 2.x.x 寫作與應用系列
    '2.1.1': '看圖/主題寫作',
    '2.1.2': '改錯題',
    '2.2.1': '句子合併',
    '2.2.2': '句子重組',
    '2.3.1': '段落寫作',
    '2.4.1': '段落排序',
    '2.4.2': '短文寫作',
    '2.5.1': '簡答題',
    '2.5.2': '郵件/信函寫作',
    '2.6.1': '改寫句子',
    '2.7.1': '中翻英句子',
    '2.7.2': '中翻英短文',
    '2.8.1': '英翻中句子',
    '2.8.2': '英翻中短文'
  }
  
  return typeNames[typeCode] || typeCode
}

// 方法：格式化段落內容
const formatPassage = (passage: string): string => {
  // 支援基本HTML標籤和換行
  return passage
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

// 方法：格式化問題內容
const formatQuestion = (question: string): string => {
  // 支援基本HTML標籤和換行
  return question
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

console.log(`[DEBUG QuestionRenderer.vue] 渲染題目: ${props.question.type}`, props.question)
</script>

<style lang="scss" scoped>
.question-renderer {
  margin-bottom: 20px;
}

.question-type-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.question-type-code {
  background: rgba(0, 122, 255, 0.15);
  color: #007aff;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.question-type-name {
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.1px;
}

// 方案A - Passage使用較柔和的藍色（降低飽和度）
.question-passage,
.question-original-sentence {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border: 2px solid #6b7280;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(75, 85, 99, 0.3);
}

.passage-title,
.original-sentence-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.passage-content,
.original-sentence-content {
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  font-size: 15px;
  letter-spacing: 0.1px;

  :deep(strong) {
    color: #ffffff;
    font-weight: 600;
  }

  :deep(em) {
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
  }

  :deep(br) {
    margin-bottom: 8px;
  }
}

.original-sentence-content {
  font-family: 'SF Mono', Consolas, monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// 方案A - Question使用簡潔樣式，不使用背景容器
.question-text,
.question-instruction {
  margin: 16px 0;
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
}

.question-label,
.instruction-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: inline;
}

.question-content,
.instruction-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
  letter-spacing: -0.1px;
  display: inline;
  margin-left: 8px;

  :deep(strong) {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
  }

  :deep(em) {
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
  }

  :deep(code) {
    background: rgba(255, 255, 255, 0.1);
    color: #ff6b6b;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 14px;
  }

  :deep(br) {
    margin-bottom: 6px;
  }
}
</style> 