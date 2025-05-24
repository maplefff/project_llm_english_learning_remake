<template>
  <div class="macos-window">
    <!-- 主要內容區域 -->
    <div class="flex" style="flex: 1; height: 100vh;">
      <!-- 側邊欄 -->
      <div class="macos-sidebar">
        <div class="macos-sidebar-section">
          <div class="macos-sidebar-title">Navigation</div>
          <div
            v-for="item in navigationItems"
            :key="item.path"
            class="macos-sidebar-item"
            :class="{ active: $route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/') }"
            @click="$router.push(item.path)"
          >
            {{ item.icon }} {{ item.label }}
          </div>
        </div>

        <div class="macos-sidebar-section">
          <div class="macos-sidebar-title">📚 閱讀理解系列</div>
          <div class="macos-question-types-list">
            <div
              v-for="type in readingTypes"
              :key="type.code"
              class="macos-question-type-item"
              :class="{ active: selectedQuestionType === type.code }"
              @click="startQuizWithType(type.code)"
            >
              <div class="question-type-code">{{ type.code }}</div>
              <div class="question-type-desc">{{ type.description }}</div>
            </div>
          </div>
        </div>

        <div class="macos-sidebar-section">
          <div class="macos-sidebar-title">✍️ 寫作與應用系列</div>
          <div class="macos-question-types-list">
            <div
              v-for="type in writingTypes"
              :key="type.code"
              class="macos-question-type-item"
              :class="{ active: selectedQuestionType === type.code }"
              @click="startQuizWithType(type.code)"
            >
              <div class="question-type-code">{{ type.code }}</div>
              <div class="question-type-desc">{{ type.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主內容區 -->
      <div class="macos-main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@stores/app'

// 存儲
const appStore = useAppStore()
const router = useRouter()

// 導航項目（移除Quiz）
const navigationItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/history', label: 'History', icon: '📈' },
  { path: '/settings', label: 'Settings', icon: '⚙️' }
]

// 問題類型（根據實際後端支援的24種題型）
// 1.x.x 閱讀理解系列 (10種)
const readingTypes = [
  { code: '1.1.1', description: '詞義選擇 - 從語境判斷詞彙意思' },
  { code: '1.1.2', description: '詞彙填空 - 選擇適當詞彙填入空格' },
  { code: '1.2.1', description: '句子改錯 - 識別並修正語法錯誤' },
  { code: '1.2.2', description: '語法結構選擇 - 選擇正確語法結構' },
  { code: '1.2.3', description: '轉承詞選擇 - 選擇適當的邏輯連接詞' },
  { code: '1.3.1', description: '段落主旨 - 找出段落的中心思想' },
  { code: '1.4.1', description: '細節查找 - 從文章中找出特定資訊' },
  { code: '1.5.1', description: '推論能力 - 根據文章進行邏輯推論' },
  { code: '1.5.2', description: '作者目的與語氣 - 分析作者意圖和語調' },
  { code: '1.5.3', description: '文本結構與組織 - 分析文章結構和組織方式' }
]

// 2.x.x 寫作與應用系列 (14種)
const writingTypes = [
  { code: '2.1.1', description: '看圖/主題寫作 - 根據提示進行寫作' },
  { code: '2.1.2', description: '改錯題 - 修正文章中的錯誤' },
  { code: '2.2.1', description: '句子合併 - 將簡單句合併為複雜句' },
  { code: '2.2.2', description: '句子重組 - 重新排列詞語成完整句子' },
  { code: '2.3.1', description: '段落寫作 - 撰寫結構完整的段落' },
  { code: '2.4.1', description: '段落排序 - 將句子排列成邏輯段落' },
  { code: '2.4.2', description: '短文寫作 - 撰寫完整的短篇文章' },
  { code: '2.5.1', description: '簡答題 - 回答開放式問題' },
  { code: '2.5.2', description: '郵件/信函寫作 - 撰寫正式或非正式信件' },
  { code: '2.6.1', description: '改寫句子 - 用不同方式表達相同意思' },
  { code: '2.7.1', description: '中翻英句子 - 翻譯中文句子為英文' },
  { code: '2.7.2', description: '中翻英短文 - 翻譯中文段落為英文' },
  { code: '2.8.1', description: '英翻中句子 - 翻譯英文句子為中文' },
  { code: '2.8.2', description: '英翻中短文 - 翻譯英文段落為中文' }
]

// 當前選擇的問題類型
const selectedQuestionType = computed(() => appStore.selectedQuestionType)

// 開始特定類型的測驗
const startQuizWithType = (questionType: string) => {
  console.log(`[DEBUG App.vue] 開始測驗類型: ${questionType}`)
  appStore.setSelectedQuestionType(questionType)
  router.push(`/quiz/${questionType}`)
}

// 組件掛載
onMounted(() => {
  console.log('[DEBUG App.vue] 應用程式啟動完成')
})
</script>

<style lang="scss">
@import '@styles/macos.scss';

// 修正應用程式佈局，移除不必要的標題欄高度
#app {
  height: 100vh;
  overflow: hidden;
}

html, body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

// 調整窗口樣式，移除標題欄相關
.macos-window {
  background: rgba(40, 40, 42, 0.9);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 0; // 網頁應用不需要圓角
  border: none;     // 網頁應用不需要邊框
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
