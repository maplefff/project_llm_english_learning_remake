// API 回應類型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// 路由參數類型
export interface QuizRouteParams {
  questionType?: string
}

// 題型相關類型
export interface QuestionType {
  id: string
  name: string
  description: string
  category: string
}

// 測驗會話類型
export interface QuizSession {
  id: string
  questionType: string
  questions: Question[]
  currentIndex: number
  answers: Answer[]
  startTime: Date
  endTime?: Date
  score?: number
}

// 題目類型
export interface Question {
  id: string
  type: string
  content: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

// 答案類型
export interface Answer {
  questionId: string
  userAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
}

// 歷史記錄類型
export interface HistoryRecord {
  id: string
  questionType: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  completedAt: Date
}

// 用戶設定類型
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-TW' | 'en'
  autoSave: boolean
  soundEnabled: boolean
}

// 應用狀態類型
export interface AppState {
  loading: boolean
  error: string | null
  notification: {
    show: boolean
    type: 'success' | 'warning' | 'error' | 'info'
    message: string
  }
}

// 組件 Props 類型
export interface BaseComponentProps {
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'default' | 'large'
}
