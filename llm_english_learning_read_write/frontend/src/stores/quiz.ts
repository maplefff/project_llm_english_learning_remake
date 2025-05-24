import { defineStore } from 'pinia'
import { apiService } from '@/services/api'
import { useRouter } from 'vue-router'

// 後端API返回的題目結構
interface BackendQuestion {
  id: string
  questionType: string
  passage?: string
  question: string
  options: Array<{ id: string; text: string }>
  standard_answer: string
}

// 後端API返回的答題結果
interface BackendResult {
  isCorrect: boolean
  score: number
  explanation?: string
  correctAnswer: string
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuestion: null as BackendQuestion | null,
    lastResult: null as BackendResult | null,
    isLoading: false,
    error: null as string | null,
    currentQuestionType: '' as string
  }),

  getters: {
    hasActiveQuestion: state => !!state.currentQuestion,
  },

  actions: {
    // 加載新題目
    async loadNewQuestion() {
      if (!this.currentQuestionType) {
        this.error = '請先選擇題型'
        return
      }

      this.isLoading = true
      this.error = null
      this.lastResult = null

      try {
        console.log(`[DEBUG quiz.ts] 正在加載題型 ${this.currentQuestionType} 的題目`)
        const response = await apiService.startTest(this.currentQuestionType)
        
        if (response.success && response.question) {
          this.currentQuestion = response.question
          console.log(`[DEBUG quiz.ts] 成功加載題目:`, response.question)
        } else {
          this.error = '無法獲取題目'
        }
      } catch (error: any) {
        console.error('[DEBUG quiz.ts] 加載題目失敗:', error)
        this.error = error.response?.data?.message || '載入題目時發生錯誤'
      } finally {
        this.isLoading = false
      }
    },

    // 提交答案
    async submitAnswer(userAnswer: string) {
      if (!this.currentQuestion) {
        this.error = '沒有活動題目'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        console.log(`[DEBUG quiz.ts] 提交答案: ${userAnswer}`)
        
        const result = await apiService.submitAnswer(
          this.currentQuestion.id,
          userAnswer,
          this.currentQuestion
        )

        this.lastResult = result
        this.currentQuestion = null // 清除當前題目，顯示結果
        
        console.log(`[DEBUG quiz.ts] 答題結果:`, result)
        
      } catch (error: any) {
        console.error('[DEBUG quiz.ts] 提交答案失敗:', error)
        this.error = error.response?.data?.message || '提交答案時發生錯誤'
      } finally {
        this.isLoading = false
      }
    },

    // 設置當前題型
    setCurrentQuestionType(questionType: string) {
      console.log(`[DEBUG quiz.ts] 設置題型: ${questionType}`)
      this.currentQuestionType = questionType
      this.currentQuestion = null
      this.lastResult = null
      this.error = null
    },

    // 返回選題
    goBack() {
      const router = useRouter()
      this.currentQuestion = null
      this.lastResult = null
      this.error = null
      this.currentQuestionType = ''
      router.push('/')
    },

    // 清除狀態
    clearState() {
      this.currentQuestion = null
      this.lastResult = null
      this.error = null
      this.isLoading = false
      this.currentQuestionType = ''
    }
  }
})
