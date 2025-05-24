import { defineStore } from 'pinia'
import type { HistoryRecord } from '@/types'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: [] as HistoryRecord[],
    loading: false,
  }),

  getters: {
    totalRecords: state => state.records.length,
    averageScore: state => {
      if (state.records.length === 0) return 0
      const total = state.records.reduce((sum, record) => sum + record.score, 0)
      return Math.round(total / state.records.length)
    },
    recentRecords: state => {
      return state.records
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 10)
    },
  },

  actions: {
    // 添加歷史記錄
    addRecord(record: HistoryRecord) {
      this.records.push(record)
      // [DEBUG history.ts] 添加歷史記錄: ${record.id}
      console.log(`[DEBUG history.ts] 添加歷史記錄: ${record.id}`)
    },

    // 載入歷史記錄
    async loadRecords() {
      this.loading = true
      try {
        // 這裡將來會從 API 載入數據
        // const response = await historyService.getRecords()
        // this.records = response.data

        // [DEBUG history.ts] 載入歷史記錄完成
        console.log(`[DEBUG history.ts] 載入歷史記錄完成`)
      } catch (error) {
        console.error('[DEBUG history.ts] 載入歷史記錄失敗:', error)
      } finally {
        this.loading = false
      }
    },

    // 清除歷史記錄
    clearRecords() {
      this.records = []
      // [DEBUG history.ts] 清除歷史記錄
      console.log(`[DEBUG history.ts] 清除歷史記錄`)
    },
  },
})
