<template>
  <div class="result-display">
    <!-- 結果標題 -->
    <div class="result-header">
      <h3 class="result-title">
        <span class="result-icon">{{ result.submissionResult.isCorrect ? '🎉' : '📚' }}</span>
        {{ result.submissionResult.isCorrect ? '答題正確！' : '繼續加油！' }}
      </h3>
    </div>

    <!-- 分數和狀態卡片 -->
    <div class="result-cards">
      <div class="result-card status-card">
        <div class="card-icon" :class="{ correct: result.submissionResult.isCorrect, incorrect: !result.submissionResult.isCorrect }">
          {{ result.submissionResult.isCorrect ? '✅' : '❌' }}
        </div>
        <div class="card-label">{{ result.submissionResult.isCorrect ? '正確' : '錯誤' }}</div>
      </div>
      
      <div class="result-card score-card">
        <div class="card-value" :class="{ 'high-score': scorePercentage >= 80, 'low-score': scorePercentage < 60 }">
          {{ scorePercentage }}%
        </div>
        <div class="card-label">得分</div>
      </div>

      <div v-if="timeSpent" class="result-card time-card">
        <div class="card-value">{{ formatTime(timeSpent) }}</div>
        <div class="card-label">用時</div>
      </div>
    </div>

    <!-- 答案對比 -->
    <div v-if="showAnswerComparison" class="answer-comparison">
      <div class="comparison-section">
        <div class="comparison-label">
          <span class="comparison-icon">👤</span>
          您的答案
        </div>
        <div class="user-answer" :class="{ correct: result.submissionResult.isCorrect, incorrect: !result.submissionResult.isCorrect }">
          {{ formatAnswer(userAnswer) }}
        </div>
      </div>

      <div v-if="!result.submissionResult.isCorrect" class="comparison-section">
        <div class="comparison-label">
          <span class="comparison-icon">📖</span>
          正確答案
        </div>
        <div class="correct-answer">
          {{ formatAnswer(result.submissionResult.correctAnswer) }}
        </div>
      </div>
    </div>

    <!-- 詳細解釋 -->
    <div v-if="result.submissionResult.explanation" class="explanation-section">
      <div class="explanation-header">
        <span class="explanation-icon">💡</span>
        解題說明
      </div>
      <div class="explanation-content" v-html="formatExplanation(result.submissionResult.explanation)"></div>
    </div>

    <!-- 操作按鈕 -->
    <div class="action-buttons">
      <button 
        class="action-button primary" 
        @click="$emit('next-question')"
        :disabled="disabled"
      >
        <span class="button-icon">🔄</span>
        下一題
      </button>
      
      <button 
        v-if="!result.submissionResult.isCorrect" 
        class="action-button secondary" 
        @click="$emit('bookmark-question')"
        :disabled="disabled"
      >
        <span class="button-icon">⭐</span>
        收藏錯題
      </button>
      
      <button 
        class="action-button secondary" 
        @click="$emit('view-history')"
        :disabled="disabled"
      >
        <span class="button-icon">📊</span>
        查看歷史
      </button>
      
      <button 
        class="action-button secondary" 
        @click="$emit('back-to-selection')"
        :disabled="disabled"
      >
        <span class="button-icon">🏠</span>
        返回選題
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 後端API實際返回的答題結果（根據測試結果修正）
interface BackendSubmissionResult {
  submissionResult: {
    isCorrect: boolean
    correctAnswer: string
    explanation: string
  }
  nextQuestion?: any | null
}

interface Props {
  result: BackendSubmissionResult
  userAnswer: string | string[]
  timeSpent?: number
  showAnswerComparison?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'next-question'): void
  (e: 'bookmark-question'): void
  (e: 'view-history'): void
  (e: 'back-to-selection'): void
}

const props = withDefaults(defineProps<Props>(), {
  showAnswerComparison: true,
  disabled: false
})

defineEmits<Emits>()

// 計算屬性：計算得分百分比
const scorePercentage = computed(() => {
  // 簡單的得分計算：正確100%，錯誤0%
  return props.result.submissionResult.isCorrect ? 100 : 0
})

// 方法：格式化答案顯示
const formatAnswer = (answer: string | string[]): string => {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  return answer || '未填寫'
}

// 方法：格式化時間顯示
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }
}

// 方法：格式化解釋內容
const formatExplanation = (explanation: string): string => {
  return explanation
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

console.log(`[DEBUG ResultDisplay.vue] 顯示結果: ${props.result.submissionResult.isCorrect ? '正確' : '錯誤'}`, props.result)
</script>

<style lang="scss" scoped>
.result-display {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.result-header {
  text-align: center;
  margin-bottom: 24px;
}

.result-title {
  color: rgba(255, 255, 255, 0.95);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.result-icon {
  font-size: 24px;
}

// 結果卡片
.result-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.result-card {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card-icon {
  font-size: 24px;
  margin-bottom: 8px;
  
  &.correct {
    filter: hue-rotate(120deg);
  }
  
  &.incorrect {
    filter: hue-rotate(0deg);
  }
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  font-family: 'SF Mono', Consolas, monospace;
  
  &.high-score {
    color: #30d158;
  }
  
  &.low-score {
    color: #ff453a;
  }
}

.card-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
}

// 答案對比
.answer-comparison {
  margin-bottom: 24px;
}

.comparison-section {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.comparison-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.comparison-icon {
  font-size: 16px;
}

.user-answer,
.correct-answer {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.user-answer {
  &.correct {
    background: rgba(48, 209, 88, 0.1);
    border-color: rgba(48, 209, 88, 0.3);
    color: #30d158;
  }
  
  &.incorrect {
    background: rgba(255, 69, 58, 0.1);
    border-color: rgba(255, 69, 58, 0.3);
    color: #ff453a;
  }
}

.correct-answer {
  background: rgba(48, 209, 88, 0.1);
  border-color: rgba(48, 209, 88, 0.3);
  color: #30d158;
}

// 解釋區域
.explanation-section {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border: 2px solid #10b981;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 24px;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
}

.explanation-header {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.explanation-icon {
  font-size: 18px;
}

.explanation-content {
  color: rgba(255, 255, 255, 0.95);
  font-size: 15px;
  line-height: 1.7;

  :deep(strong) {
    color: #ffffff;
    font-weight: 600;
  }

  :deep(em) {
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
  }

  :deep(code) {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 3px 8px;
    border-radius: 6px;
    font-family: 'SF Mono', Consolas, monospace;
    font-size: 14px;
  }

  :deep(br) {
    margin-bottom: 8px;
  }
}

// 操作按鈕
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.primary {
    background: #007aff;
    color: white;

    &:hover:not(:disabled) {
      background: #0056cc;
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.12);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
}

.button-icon {
  font-size: 16px;
}

@media (max-width: 640px) {
  .result-cards {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-button {
    min-width: auto;
  }
}
</style> 