<template>
  <div>
    <!-- KPI 卡片網格 -->
    <div class="macos-kpi-grid">
      <div class="macos-kpi-card">
        <div class="macos-kpi-value">{{ todayQuestions }}</div>
        <div class="macos-kpi-label">今日題目</div>
      </div>
      <div class="macos-kpi-card">
        <div class="macos-kpi-value">{{ accuracy }}%</div>
        <div class="macos-kpi-label">正確率</div>
      </div>
      <div class="macos-kpi-card">
        <div class="macos-kpi-value">{{ totalQuestions }}</div>
        <div class="macos-kpi-label">總題目數</div>
      </div>
      <div class="macos-kpi-card">
        <div class="macos-kpi-value">{{ consecutiveDays }}</div>
        <div class="macos-kpi-label">連續天數</div>
      </div>
    </div>

    <!-- 最近活動 -->
    <div class="macos-card">
      <div class="macos-card-title">Recent Activity</div>
      <div class="macos-chart-placeholder">
        📈 Activity Chart
      </div>
    </div>

    <!-- 快速開始測驗 -->
    <div class="macos-card">
      <div class="macos-card-title">Quick Start</div>
      <div class="flex gap-4 mb-4">
        <button class="macos-button" @click="startQuiz">🚀 開始測驗</button>
        <button class="macos-button secondary" @click="viewHistory">📊 查看歷史</button>
      </div>
      <div class="text-secondary text-sm">
        請先從左側邊欄選擇要測驗的題型，然後點擊「開始測驗」按鈕。
      </div>
      
      <!-- 系統狀態提示 -->
      <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div class="text-xs text-blue-400">
          💡 <strong>開發狀態：</strong>目前 KPI 統計數據為示範數據。
          需要後端實現跨題型統計 API：<code>/api/statistics/dashboard</code>
        </div>
      </div>
    </div>

    <!-- 最近答題記錄 -->
    <div class="macos-card">
      <div class="macos-card-title">Recent Answers</div>
      <table class="macos-table">
        <thead>
          <tr>
            <th>時間</th>
            <th>類型</th>
            <th>結果</th>
            <th>耗時</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in recentAnswers" :key="record.id">
            <td>{{ formatTime(record.timestamp) }}</td>
            <td>{{ record.questionType }}</td>
            <td :style="{ color: record.isCorrect ? '#30d158' : '#ff453a' }">
              {{ record.isCorrect ? '✅ 正確' : '❌ 錯誤' }}
            </td>
            <td>{{ record.duration }}s</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@stores/app'
import { useHistoryStore } from '@stores/history'

// 存儲
const router = useRouter()
const appStore = useAppStore()
const historyStore = useHistoryStore()

// 響應式數據
const todayQuestions = ref(23)
const accuracy = ref(87)
const totalQuestions = ref(1247)
const consecutiveDays = ref(5)

// 最近答題記錄
const recentAnswers = computed(() => 
  historyStore.recentRecords.map(record => ({
    id: record.id,
    timestamp: new Date(record.completedAt).getTime(),
    questionType: record.questionType,
    isCorrect: record.correctAnswers > 0,
    duration: Math.round(record.timeSpent / 1000)
  }))
)

// 格式化時間
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 開始測驗
const startQuiz = () => {
  console.log('[DEBUG Dashboard.vue] 開始測驗')
  if (appStore.selectedQuestionType) {
    router.push(`/quiz/${appStore.selectedQuestionType}`)
  } else {
    // 如果沒有選擇題型，提示用戶從側邊欄選擇
    appStore.showNotification('info', '請從左側邊欄選擇要測驗的題型')
  }
}

// 查看歷史
const viewHistory = () => {
  console.log('[DEBUG Dashboard.vue] 查看歷史')
  router.push('/history')
}

// 組件掛載
onMounted(() => {
  console.log('[DEBUG Dashboard.vue] Dashboard 頁面載入完成')
  // 載入歷史數據
  historyStore.loadRecords()
})
</script>

<style scoped>
  .macos-kpi-grid {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .macos-kpi-card {
    text-align: center;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    flex: 1;
  }

  .macos-kpi-value {
    font-size: 2em;
    font-weight: bold;
    color: #409eff;
  }

  .macos-kpi-label {
    font-size: 1.2em;
    color: #606266;
  }

  .macos-card {
    margin-bottom: 20px;
  }

  .macos-card-title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .macos-chart-placeholder {
    height: 200px;
    background-color: #f0f0f0;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .macos-button {
    background-color: #409eff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .macos-button:hover {
    background-color: #66b1ff;
  }

  .macos-button.secondary {
    background-color: #f0f0f0;
    color: #606266;
  }

  .macos-button.secondary:hover {
    background-color: #e0e0e0;
  }

  .macos-table {
    width: 100%;
    border-collapse: collapse;
  }

  .macos-table th,
  .macos-table td {
    padding: 10px;
    text-align: left;
  }

  .macos-table th {
    background-color: #f0f0f0;
  }

  .macos-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .macos-table tbody tr:hover {
    background-color: #e0e0e0;
  }
</style>
