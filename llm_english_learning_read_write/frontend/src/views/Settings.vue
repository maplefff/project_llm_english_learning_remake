<template>
  <div>
    <!-- 頁面標題 -->
    <h2 style="color: rgba(255, 255, 255, 0.95); font-size: 20px; font-weight: 600; letter-spacing: -0.2px; margin: 0 0 20px 0;">
      Settings
    </h2>

    <!-- API 設定 -->
    <div class="macos-card">
      <div class="macos-settings-section">
        <div class="macos-settings-section-title">API Configuration</div>
        <div class="macos-form-group">
          <label class="macos-form-label">Gemini API Key</label>
          <input
            v-model="apiKey"
            type="password"
            class="macos-form-input"
            placeholder="Enter your Gemini API key..."
          />
          <div class="text-secondary text-sm" style="margin-top: 4px;">
            您的 API 金鑰將安全地儲存在本地端
          </div>
        </div>
        <div class="macos-form-group">
          <label class="macos-form-label">Model</label>
          <select v-model="selectedModel" class="macos-form-select">
            <option value="gemini-2.5-flash-preview-04-17">gemini-2.5-flash-preview-04-17</option>
            <option value="gemini-pro">gemini-pro</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 學習偏好設定 -->
    <div class="macos-card">
      <div class="macos-settings-section">
        <div class="macos-settings-section-title">Learning Preferences</div>
        <div class="macos-form-group">
          <label class="macos-form-label">Daily Goal</label>
          <input
            v-model.number="dailyGoal"
            type="number"
            class="macos-form-input"
            min="1"
            max="100"
            placeholder="每日目標題數"
          />
        </div>
        <div class="macos-form-group">
          <label class="macos-form-label">Difficulty Level</label>
          <select v-model="difficultyLevel" class="macos-form-select">
            <option value="beginner">Beginner (初級)</option>
            <option value="intermediate">Intermediate (中級)</option>
            <option value="advanced">Advanced (高級)</option>
          </select>
        </div>
        <div class="macos-form-group">
          <label class="macos-form-label">Language</label>
          <select v-model="language" class="macos-form-select">
            <option value="zh-TW">繁體中文</option>
            <option value="zh-CN">简体中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 應用程式設定 -->
    <div class="macos-card">
      <div class="macos-settings-section">
        <div class="macos-settings-section-title">Application Settings</div>
        
        <!-- 開關設定 -->
        <div class="macos-form-group">
          <div class="flex items-center justify-between">
            <div>
              <div class="macos-form-label" style="margin-bottom: 4px;">Auto Save</div>
              <div class="text-secondary text-sm">自動儲存答題進度</div>
            </div>
            <div class="macos-switch" :class="{ active: autoSave }" @click="autoSave = !autoSave">
              <div class="macos-switch-handle"></div>
            </div>
          </div>
        </div>

        <div class="macos-form-group">
          <div class="flex items-center justify-between">
            <div>
              <div class="macos-form-label" style="margin-bottom: 4px;">Sound Effects</div>
              <div class="text-secondary text-sm">啟用音效提示</div>
            </div>
            <div class="macos-switch" :class="{ active: soundEnabled }" @click="soundEnabled = !soundEnabled">
              <div class="macos-switch-handle"></div>
            </div>
          </div>
        </div>

        <div class="macos-form-group">
          <div class="flex items-center justify-between">
            <div>
              <div class="macos-form-label" style="margin-bottom: 4px;">Show Explanations</div>
              <div class="text-secondary text-sm">答題後顯示詳細解釋</div>
            </div>
            <div class="macos-switch" :class="{ active: showExplanations }" @click="showExplanations = !showExplanations">
              <div class="macos-switch-handle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 數據管理 -->
    <div class="macos-card">
      <div class="macos-settings-section">
        <div class="macos-settings-section-title">Data Management</div>
        <div class="flex gap-4 mb-4">
          <button class="macos-button secondary" @click="exportData">📤 匯出數據</button>
          <button class="macos-button secondary" @click="importData">📥 匯入數據</button>
          <button class="macos-button secondary" @click="clearData" style="color: #ff453a; border-color: #ff453a;">
            🗑️ 清除所有數據
          </button>
        </div>
        <div class="text-secondary text-sm">
          匯出功能可備份您的學習記錄，清除數據將永久刪除所有本地資料。
        </div>
      </div>
    </div>

    <!-- 保存按鈕 -->
    <div class="flex justify-between" style="margin-top: 20px;">
      <button class="macos-button secondary" @click="resetToDefaults">🔄 重置為預設值</button>
      <button class="macos-button" @click="saveSettings">💾 儲存設定</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@stores/user'
import { useAppStore } from '@stores/app'

// 存儲
const userStore = useUserStore()
const appStore = useAppStore()

// 表單數據
const apiKey = ref('')
const selectedModel = ref('gemini-2.5-flash-preview-04-17')
const dailyGoal = ref(20)
const difficultyLevel = ref('intermediate')
const language = ref('zh-TW')
const autoSave = ref(true)
const soundEnabled = ref(true)
const showExplanations = ref(true)

// 方法
const saveSettings = () => {
  console.log('[DEBUG Settings.vue] 儲存設定')
  
  // 更新用戶設定
  userStore.updateSettings({
    theme: userStore.settings.theme,
    language: language.value as 'zh-TW' | 'en',
    autoSave: autoSave.value,
    soundEnabled: soundEnabled.value
  })

  // 儲存其他設定到 localStorage
  const settings = {
    apiKey: apiKey.value,
    selectedModel: selectedModel.value,
    dailyGoal: dailyGoal.value,
    difficultyLevel: difficultyLevel.value,
    showExplanations: showExplanations.value
  }
  
  localStorage.setItem('appSettings', JSON.stringify(settings))
  
  appStore.showNotification('success', '設定已儲存')
}

const loadSettings = () => {
  console.log('[DEBUG Settings.vue] 載入設定')
  
  // 載入用戶設定
  language.value = userStore.settings.language
  autoSave.value = userStore.settings.autoSave
  soundEnabled.value = userStore.settings.soundEnabled

  // 載入其他設定
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      apiKey.value = settings.apiKey || ''
      selectedModel.value = settings.selectedModel || 'gemini-2.5-flash-preview-04-17'
      dailyGoal.value = settings.dailyGoal || 20
      difficultyLevel.value = settings.difficultyLevel || 'intermediate'
      showExplanations.value = settings.showExplanations !== undefined ? settings.showExplanations : true
    } catch (error) {
      console.error('[DEBUG Settings.vue] 載入設定錯誤:', error)
    }
  }
}

const resetToDefaults = () => {
  console.log('[DEBUG Settings.vue] 重置為預設值')
  
  apiKey.value = ''
  selectedModel.value = 'gemini-2.5-flash-preview-04-17'
  dailyGoal.value = 20
  difficultyLevel.value = 'intermediate'
  language.value = 'zh-TW'
  autoSave.value = true
  soundEnabled.value = true
  showExplanations.value = true
  
  appStore.showNotification('info', '已重置為預設值')
}

const exportData = () => {
  console.log('[DEBUG Settings.vue] 匯出數據')
  appStore.showNotification('info', '匯出功能將在後續版本中實現')
}

const importData = () => {
  console.log('[DEBUG Settings.vue] 匯入數據')
  appStore.showNotification('info', '匯入功能將在後續版本中實現')
}

const clearData = () => {
  console.log('[DEBUG Settings.vue] 清除數據')
  if (confirm('確定要清除所有數據嗎？此操作無法撤銷。')) {
    localStorage.clear()
    userStore.updateSettings({
      theme: 'light',
      language: 'zh-TW',
      autoSave: true,
      soundEnabled: true
    })
    appStore.showNotification('warning', '所有數據已清除')
    loadSettings() // 重新載入預設設定
  }
}

// 組件掛載
onMounted(() => {
  console.log('[DEBUG Settings.vue] Settings 頁面載入完成')
  loadSettings()
})
</script>

<style scoped>
/* macOS 風格開關 */
.macos-switch {
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.macos-switch.active {
  background: #0a84ff;
}

.macos-switch-handle {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 10px;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.macos-switch.active .macos-switch-handle {
  transform: translateX(20px);
}
</style>
