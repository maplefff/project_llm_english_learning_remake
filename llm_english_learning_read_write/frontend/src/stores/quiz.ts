import { defineStore } from 'pinia'
import { apiService } from '@/services/api'
import { useRouter } from 'vue-router'

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

// 後端API返回的答題結果
interface BackendSubmissionResult {
  submissionResult: {
    isCorrect: boolean
    correctAnswer: string
    explanation: string
  }
  nextQuestion?: BackendQuestion | null
}

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuestion: null as BackendQuestion | null,
    lastResult: null as BackendSubmissionResult | null,
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
        
        console.log(`[DEBUG quiz.ts] API回應:`, response)
        
        if (response.success && response.question) {
          this.currentQuestion = response.question
          console.log(`[DEBUG quiz.ts] 成功加載題目:`, response.question)
        } else {
          this.error = '無法獲取題目'
          console.error(`[DEBUG quiz.ts] API回應格式錯誤:`, response)
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
        console.log(`[DEBUG quiz.ts] 題目數據:`, this.currentQuestion)
        
        const result = await apiService.submitAnswer(
          this.currentQuestion.id,
          userAnswer,
          this.currentQuestion
        )

        console.log(`[DEBUG quiz.ts] 答題結果:`, result)
        
        this.lastResult = result
        this.currentQuestion = null // 清除當前題目，顯示結果
        
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
