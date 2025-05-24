<template>
  <div>
    <!-- 頁面標題和操作 -->
    <div class="flex items-center justify-between mb-4">
      <h2 style="color: rgba(255, 255, 255, 0.95); font-size: 20px; font-weight: 600; letter-spacing: -0.2px; margin: 0;">
        Answer History
      </h2>
      <button class="macos-button">📥 Export CSV</button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="historyStore.loading" class="macos-card">
      <div class="macos-card-title">載入中...</div>
      <div class="macos-chart-placeholder">
        ⏳ 正在載入歷史記錄
      </div>
    </div>

    <!-- 無數據狀態 -->
    <div v-else-if="historyStore.totalRecords === 0" class="macos-card">
      <div class="macos-card-title">尚無歷史記錄</div>
      <div class="text-secondary text-sm" style="margin-bottom: 16px;">
        您還沒有完成任何測驗。開始您的第一次測驗吧！
      </div>
      <button class="macos-button" @click="startQuiz">🚀 開始測驗</button>
    </div>

    <!-- 歷史記錄表格 -->
    <div v-else class="macos-card">
      <div class="macos-card-title">Recent Results</div>
      <table class="macos-table">
        <thead>
          <tr>
            <th>時間</th>
            <th>類型</th>
            <th>分數</th>
            <th>正確/總數</th>
            <th>耗時</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in historyStore.recentRecords" :key="record.id">
            <td>{{ formatDateTime(record.completedAt) }}</td>
            <td>{{ record.questionType }}</td>
            <td :style="{ color: getScoreColor(record.score) }">
              {{ record.score }}%
            </td>
            <td>{{ record.correctAnswers }}/{{ record.totalQuestions }}</td>
            <td>{{ formatDuration(record.timeSpent) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 統計卡片 -->
    <div class="macos-card">
      <div class="macos-card-title">Statistics</div>
      <div class="macos-kpi-grid">
        <div class="macos-kpi-card">
          <div class="macos-kpi-value">{{ historyStore.totalRecords }}</div>
          <div class="macos-kpi-label">總測驗次數</div>
        </div>
        <div class="macos-kpi-card">
          <div class="macos-kpi-value">{{ historyStore.averageScore }}%</div>
          <div class="macos-kpi-label">平均分數</div>
        </div>
        <div class="macos-kpi-card">
          <div class="macos-kpi-value">{{ totalQuestionsAnswered }}</div>
          <div class="macos-kpi-label">已答題數</div>
        </div>
        <div class="macos-kpi-card">
          <div class="macos-kpi-value">{{ averageAccuracy }}%</div>
          <div class="macos-kpi-label">平均正確率</div>
        </div>
      </div>
    </div>

    <!-- 圖表區域（佔位符） -->
    <div class="macos-card">
      <div class="macos-card-title">Performance Trend</div>
      <div class="macos-chart-placeholder">
        📊 Performance Chart
        <br>
        <span class="text-sm text-secondary">圖表功能將在後續版本中實現</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@stores/history'

// 存儲
const router = useRouter()
const historyStore = useHistoryStore()

// 計算屬性
const totalQuestionsAnswered = computed(() => {
  return historyStore.records.reduce((total, record) => total + record.totalQuestions, 0)
})

const averageAccuracy = computed(() => {
  if (historyStore.records.length === 0) return 0
  const totalCorrect = historyStore.records.reduce((total, record) => total + record.correctAnswers, 0)
  const totalQuestions = totalQuestionsAnswered.value
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
})

// 方法
const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${remainingSeconds}s`
  }
}

const getScoreColor = (score: number) => {
  if (score >= 80) return '#30d158'  // 綠色
  if (score >= 60) return '#ffbd2e'  // 黃色
  return '#ff453a'  // 紅色
}

const startQuiz = () => {
  console.log('[DEBUG History.vue] 開始測驗')
  router.push('/quiz')
}

// 組件掛載
onMounted(() => {
  console.log('[DEBUG History.vue] History 頁面載入完成')
  historyStore.loadRecords()
})
</script>

<style scoped>
  .history {
    padding: 20px;
  }

  .loading {
    text-align: center;
    padding: 40px;
  }

  .loading-container {
    min-height: 100px;
  }

  .empty {
    text-align: center;
    padding: 40px;
  }

  .history-content {
    margin-top: 20px;
  }
</style>
