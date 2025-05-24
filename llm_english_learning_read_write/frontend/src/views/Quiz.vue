<template>
  <div>
    <!-- 測驗標題 -->
    <div class="flex items-center justify-between mb-4">
      <h2 style="color: rgba(255, 255, 255, 0.95); font-size: 20px; font-weight: 600; letter-spacing: -0.2px; margin: 0;">
        Quiz Session - {{ getFullQuestionTypeName(currentQuestionType) }}
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
      <!-- 使用 QuestionRenderer 組件，不顯示重複的題型標題 -->
      <QuestionRenderer 
        :question="currentQuestion" 
        :show-type-header="false"
      />
      
      <!-- 使用 AnswerInput 組件 -->
      <AnswerInput
        :question="currentQuestion"
        v-model="userAnswer"
        :disabled="false"
        :show-char-count="true"
        @submit="submitAnswer"
      />

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
    <div v-else-if="lastResult" class="quiz-result">
      <!-- 使用 ResultDisplay 組件 -->
      <ResultDisplay
        :result="lastResult"
        :user-answer="lastUserAnswer"
        :show-answer-comparison="true"
        @next-question="loadNewQuestion"
        @bookmark-question="bookmarkQuestion"
        @view-history="viewHistory"
        @back-to-selection="goBack"
      />
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
      <div class="mb-4">題型：{{ getFullQuestionTypeName(currentQuestionType) }}</div>
      <button class="macos-button" @click="loadNewQuestion">🚀 開始測驗</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@stores/quiz'
import QuestionRenderer from '@/components/quiz/QuestionRenderer.vue'
import AnswerInput from '@/components/quiz/AnswerInput.vue'
import ResultDisplay from '@/components/quiz/ResultDisplay.vue'

// 存儲
const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

// 響應式數據
const userAnswer = ref<string | string[]>('')
const lastUserAnswer = ref<string | string[]>('')

// 計算屬性
const currentQuestion = computed(() => quizStore.currentQuestion)
const lastResult = computed(() => quizStore.lastResult)
const isLoading = computed(() => quizStore.isLoading)
const error = computed(() => quizStore.error)
const currentQuestionType = computed(() => {
  return route.params.questionType as string
})

const hasAnswer = computed(() => {
  if (Array.isArray(userAnswer.value)) {
    return userAnswer.value.length > 0
  }
  return !!userAnswer.value?.toString().trim()
})

// 方法：獲取完整題型名稱
const getFullQuestionTypeName = (typeCode: string): string => {
  const typeNames: Record<string, string> = {
    // 1.x.x 閱讀理解系列
    '1.1.1': '1.1.1 詞義選擇',
    '1.1.2': '1.1.2 詞彙填空',
    '1.2.1': '1.2.1 句子改錯',
    '1.2.2': '1.2.2 語法結構選擇',
    '1.2.3': '1.2.3 轉承詞選擇',
    '1.3.1': '1.3.1 段落主旨',
    '1.4.1': '1.4.1 細節查找',
    '1.5.1': '1.5.1 推論能力',
    '1.5.2': '1.5.2 作者目的與語氣',
    '1.5.3': '1.5.3 文本結構與組織',
    
    // 2.x.x 寫作與應用系列
    '2.1.1': '2.1.1 看圖/主題寫作',
    '2.1.2': '2.1.2 改錯題',
    '2.2.1': '2.2.1 句子合併',
    '2.2.2': '2.2.2 句子重組',
    '2.3.1': '2.3.1 段落寫作',
    '2.4.1': '2.4.1 段落排序',
    '2.4.2': '2.4.2 短文寫作',
    '2.5.1': '2.5.1 簡答題',
    '2.5.2': '2.5.2 郵件/信函寫作',
    '2.6.1': '2.6.1 改寫句子',
    '2.7.1': '2.7.1 中翻英句子',
    '2.7.2': '2.7.2 中翻英短文',
    '2.8.1': '2.8.1 英翻中句子',
    '2.8.2': '2.8.2 英翻中短文'
  }
  
  return typeNames[typeCode] || typeCode
}

// 方法
const submitAnswer = async () => {
  if (!hasAnswer.value) return

  // 儲存用戶答案供結果顯示使用
  lastUserAnswer.value = userAnswer.value
  
  // 轉換答案格式
  const answer = Array.isArray(userAnswer.value) 
    ? userAnswer.value.join(',') 
    : userAnswer.value.toString().trim()
  
  console.log(`[DEBUG Quiz.vue] 提交答案: ${answer}`)

  try {
    await quizStore.submitAnswer(answer)
    // 清除當前答案
    userAnswer.value = ''
  } catch (error) {
    console.error('[DEBUG Quiz.vue] 提交答案錯誤:', error)
  }
}

const loadNewQuestion = async () => {
  console.log('[DEBUG Quiz.vue] 加載新的問題')
  userAnswer.value = ''
  lastUserAnswer.value = ''
  await quizStore.loadNewQuestion()
}

const bookmarkQuestion = () => {
  console.log('[DEBUG Quiz.vue] 收藏錯題')
  // TODO: 實現收藏功能
  alert('收藏功能待實現')
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
    userAnswer.value = ''
    lastUserAnswer.value = ''
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

.quiz-result {
  margin-bottom: 20px;
}

// 保留原有的其他樣式但移除重複的組件樣式
.macos-quiz-question {
  // 移除原有的 .macos-quiz-question-text 等樣式，因為已經在組件中定義
}
</style>
