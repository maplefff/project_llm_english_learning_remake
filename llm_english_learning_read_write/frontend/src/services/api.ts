import axios from 'axios'
import type { AxiosResponse } from 'axios'

// API 基礎配置
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 響應攔截器
api.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // 直接返回response.data，因為後端可能返回不同格式
    return response.data
  },
  (error) => {
    console.error('[API Error]', error)
    throw error
  }
)

// API 方法
export const apiService = {
  // 獲取支援的題型列表
  async getQuestionTypes(): Promise<any[]> {
    return api.get('/question-types')
  },

  // 開始測驗
  async startTest(questionType: string): Promise<any> {
    return api.post('/start-test', { questionType })
  },

  // 提交答案
  async submitAnswer(questionId: string, userAnswer: string, questionDataSnapshot: any): Promise<any> {
    return api.post('/submit-answer', {
      questionId,
      userAnswer,
      questionDataSnapshot
    })
  },

  // 獲取歷史記錄
  async getHistory(questionType: string, limit?: number, offset?: number): Promise<any[]> {
    const params: any = { questionType }
    if (limit !== undefined) params.limit = limit
    if (offset !== undefined) params.offset = offset
    return api.get('/history', { params })
  }
}

export default apiService 