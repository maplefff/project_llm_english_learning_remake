<template>
  <div>
    <!-- 測驗標題 -->
    <div class="flex items-center justify-between mb-4">
      <h2 style="color: rgba(255, 255, 255, 0.95); font-size: 20px; font-weight: 600; letter-spacing: -0.2px; margin: 0;">
        Quiz Session - {{ currentQuestionType }}
      </h2>
    </div>

    <!-- 測驗狀態：載入中 -->
    <div v-if="isLoading" class="macos-card">
      <div class="macos-card-title">載入中...</div>
      <div class="macos-chart-placeholder">
        ⏳ 正在準備題目
      </div>
    </div>

    <!-- 測驗狀態：進行中 -->
    <div v-else-if="currentQuestion" class="macos-quiz-question">
      <!-- 段落內容（如果有） -->
      <div v-if="currentQuestion.passage" class="mb-4 p-4 bg-gray-100 rounded-lg text-gray-800">
        <h4 class="font-semibold mb-2">Reading Passage:</h4>
        <p class="leading-relaxed">{{ currentQuestion.passage }}</p>
      </div>

      <!-- 問題文字 -->
      <div class="macos-quiz-question-text">
        {{ currentQuestion.question }}
      </div>
      
      <!-- 多選題選項 -->
      <div v-if="currentQuestion.options && currentQuestion.options.length > 0" class="macos-quiz-options">
        <div
          v-for="option in currentQuestion.options"
          :key="option.id"
          class="macos-quiz-option"
          :class="{ selected: selectedAnswer === option.id }"
          @click="selectOption(option.id)"
        >
          {{ option.id.toUpperCase() }}. {{ option.text }}
        </div>
      </div>

      <!-- 文字輸入題 -->
      <div v-else class="macos-form-group">
        <input
          v-model="textAnswer"
          type="text"
          class="macos-form-input"
          placeholder="請輸入您的答案..."
          @keyup.enter="submitAnswer"
        />
      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-between" style="margin-top: 20px;">
        <button
          class="macos-button secondary"
          @click="goBack"
        >
          ← 返回選題
        </button>
        <button
          class="macos-button"
          :disabled="!hasAnswer"
          @click="submitAnswer"
        >
          提交答案
        </button>
      </div>
    </div>

    <!-- 測驗狀態：已完成 -->
    <div v-else-if="lastResult" class="macos-card">
      <div class="macos-card-title">答題結果</div>
      <div class="macos-kpi-grid" style="margin-bottom: 20px;">
        <div class="macos-kpi-card">
          <div class="macos-kpi-value" :style="{ color: lastResult.isCorrect ? '#30d158' : '#ff453a' }">
            {{ lastResult.isCorrect ? '✅' : '❌' }}
          </div>
          <div class="macos-kpi-label">{{ lastResult.isCorrect ? '正確' : '錯誤' }}</div>
        </div>
        <div class="macos-kpi-card">
          <div class="macos-kpi-value">{{ lastResult.score }}%</div>
          <div class="macos-kpi-label">得分</div>
        </div>
      </div>

      <!-- 詳細說明 -->
      <div v-if="lastResult.explanation" class="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 class="text-blue-400 font-semibold mb-2">解題說明：</h4>
        <p class="text-blue-300 text-sm">{{ lastResult.explanation }}</p>
      </div>
      
      <div class="flex gap-4">
        <button class="macos-button" @click="loadNewQuestion">🔄 下一題</button>
        <button class="macos-button secondary" @click="viewHistory">📊 查看歷史</button>
        <button class="macos-button secondary" @click="goBack">🏠 返回選題</button>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="macos-card">
      <div class="macos-card-title">載入錯誤</div>
      <div class="text-red-400 mb-4">{{ error }}</div>
      <button class="macos-button" @click="loadNewQuestion">🔄 重新載入</button>
    </div>

    <!-- 初始狀態 -->
    <div v-else class="macos-card">
      <div class="macos-card-title">準備測驗</div>
      <div class="mb-4">題型：{{ currentQuestionType }}</div>
      <button class="macos-button" @click="loadNewQuestion">🚀 開始測驗</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@stores/quiz'

// 存儲
const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

// 響應式數據
const selectedAnswer = ref<string | null>(null)
const textAnswer = ref('')

// 計算屬性
const currentQuestion = computed(() => quizStore.currentQuestion)
const lastResult = computed(() => quizStore.lastResult)
const isLoading = computed(() => quizStore.isLoading)
const error = computed(() => quizStore.error)
const currentQuestionType = computed(() => {
  return route.params.questionType as string
})

const hasAnswer = computed(() => {
  if (currentQuestion.value?.options && currentQuestion.value.options.length > 0) {
    return !!selectedAnswer.value
  } else {
    return !!textAnswer.value.trim()
  }
})

// 方法
const selectOption = (optionId: string) => {
  selectedAnswer.value = optionId
  console.log(`[DEBUG Quiz.vue] 選擇答案: ${optionId}`)
}

const submitAnswer = async () => {
  if (!hasAnswer.value) return

  const answer = selectedAnswer.value || textAnswer.value.trim()
  console.log(`[DEBUG Quiz.vue] 提交答案: ${answer}`)

  try {
    await quizStore.submitAnswer(answer)
    // 清除當前答案
    selectedAnswer.value = null
    textAnswer.value = ''
  } catch (error) {
    console.error('[DEBUG Quiz.vue] 提交答案錯誤:', error)
  }
}

const loadNewQuestion = async () => {
  console.log('[DEBUG Quiz.vue] 加載新的問題')
  await quizStore.loadNewQuestion()
}

const viewHistory = () => {
  console.log('[DEBUG Quiz.vue] 查看歷史')
  router.push('/history')
}

const goBack = () => {
  console.log('[DEBUG Quiz.vue] 返回選題')
  router.push('/')
}

// 監聽路由變化，自動設置題型
watch(() => route.params.questionType, (newType) => {
  if (newType) {
    console.log(`[DEBUG Quiz.vue] 路由變化，設置題型: ${newType}`)
    quizStore.setCurrentQuestionType(newType as string)
  }
}, { immediate: true })

// 組件掛載
onMounted(() => {
  console.log('[DEBUG Quiz.vue] Quiz 頁面載入完成')
  const questionType = route.params.questionType as string
  if (questionType) {
    quizStore.setCurrentQuestionType(questionType)
  }
})
</script>

<style lang="scss">
@import '@styles/macos.scss';

.macos-quiz-question-text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 16px;
  font-weight: 400;
  letter-spacing: -0.1px;
}

.macos-quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.macos-quiz-option {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.macos-quiz-option:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.macos-quiz-option.selected {
  background: rgba(10, 132, 255, 0.15);
  border-color: rgba(10, 132, 255, 0.4);
  color: #0a84ff;
}

.macos-form-group {
  margin-bottom: 16px;
}

.macos-form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.15s ease;
}

.macos-form-input:focus {
  outline: none;
  border-color: rgba(10, 132, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.macos-form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
</style>
