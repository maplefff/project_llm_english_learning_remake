import { defineStore } from 'pinia'

export interface AppState {
  loading: boolean
  error: string | null
  notification: {
    show: boolean
    type: 'success' | 'warning' | 'info' | 'error'
    message: string
  }
  selectedQuestionType: string | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    error: null,
    notification: {
      show: false,
      type: 'info',
      message: ''
    },
    selectedQuestionType: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasNotification: (state) => state.notification.show
  },

  actions: {
    // 設定載入狀態
    setLoading(loading: boolean) {
      this.loading = loading
      // [DEBUG app.ts] 載入狀態: ${loading}
      console.log(`[DEBUG app.ts] 載入狀態: ${loading}`)
    },

    // 設定錯誤狀態
    setError(error: string | null) {
      this.error = error
      if (error) {
        // [DEBUG app.ts] 錯誤: ${error}
        console.error(`[DEBUG app.ts] 錯誤: ${error}`)
      }
    },

    // 顯示通知
    showNotification(type: 'success' | 'warning' | 'info' | 'error', message: string) {
      this.notification = {
        show: true,
        type,
        message
      }
      // [DEBUG app.ts] 通知: ${type} - ${message}
      console.log(`[DEBUG app.ts] 通知: ${type} - ${message}`)
    },

    // 隱藏通知
    hideNotification() {
      this.notification.show = false
    },

    // 清除錯誤
    clearError() {
      this.error = null
    },

    // 新增：設定選擇的問題類型
    setSelectedQuestionType(type: string | null) {
      console.log(`[DEBUG app.ts] 設定問題類型: ${type}`)
      this.selectedQuestionType = type
    },

    // 新增：清除選擇的問題類型
    clearSelectedQuestionType() {
      this.selectedQuestionType = null
    }
  },
})
