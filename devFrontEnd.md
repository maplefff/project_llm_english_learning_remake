# LLM 英語學習系統 - 前端開發計劃 (Vite + Vue 3)

## 📋 專案概述

### 🎯 專案目標
基於 **Vite + Vue 3 + TypeScript** 技術棧，建立一個現代化的英語學習系統前端，支援**24種英語題型**的互動式測驗體驗，具備完整的學習進度追蹤、歷史分析和個人化設定功能。

### 🏆 核心價值主張
1. **現代化開發體驗**: 使用 Vite 快速開發，Vue 3 Composition API 提升開發效率
2. **全題型支援**: 支援從基礎選擇題到複雜寫作翻譯的24種題型
3. **智慧學習分析**: 提供詳細的學習進度分析和個人化建議
4. **無縫 API 整合**: 與 Gemini 2.5 Flash 後端系統深度整合

### 🎨 設計理念
- **組件化開發**: 高度可復用的組件架構
- **響應式設計**: 適配桌面和移動端
- **用戶體驗優先**: 流暢的互動和即時反饋
- **可維護性**: 清晰的代碼結構和完善的類型定義

## 🛠 技術架構

### 核心技術棧選擇

#### 前端框架: Vue 3 + Composition API
**選擇理由**:
- ✅ **現代化開發**: Composition API 提供更好的邏輯復用和組織
- ✅ **TypeScript 支援**: 原生 TypeScript 支援，更好的開發體驗
- ✅ **生態豐富**: 完善的生態系統和社區支援
- ✅ **效能優異**: Vue 3 重寫的響應式系統，更好的性能
- ✅ **學習曲線平緩**: 易於上手和維護

#### 建構工具: Vite
**核心優勢**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['element-plus']
        }
      }
    }
  }
})
```

#### 狀態管理: Pinia
```typescript
// stores/quiz.ts
import { defineStore } from 'pinia'
import type { QuestionData, TestSession, AnswerRecord } from '@/types'

export const useQuizStore = defineStore('quiz', () => {
  // 狀態
  const currentSession = ref<TestSession | null>(null)
  const currentQuestion = ref<QuestionData | null>(null)
  const isLoading = ref(false)
  const answers = ref<AnswerRecord[]>([])

  // 計算屬性
  const progress = computed(() => {
    if (!currentSession.value) return 0
    return Math.round((answers.value.length / currentSession.value.totalQuestions) * 100)
  })

  const canSubmit = computed(() => {
    return currentQuestion.value && !isLoading.value
  })

  // 動作
  const startTest = async (questionType: string) => {
    isLoading.value = true
    try {
      const response = await quizService.startTest({ questionType })
      currentSession.value = response.session
      currentQuestion.value = response.firstQuestion
      answers.value = []
    } catch (error) {
      console.error('Failed to start test:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const submitAnswer = async (answer: string | string[]) => {
    if (!currentSession.value || !currentQuestion.value) return
    
    isLoading.value = true
    try {
      const response = await quizService.submitAnswer({
        sessionId: currentSession.value.id,
        questionId: currentQuestion.value.id,
        answer
      })
      
      answers.value.push(response.result)
      currentQuestion.value = response.nextQuestion
      
      return response
    } catch (error) {
      console.error('Failed to submit answer:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 狀態
    currentSession,
    currentQuestion,
    isLoading,
    answers,
    // 計算屬性
    progress,
    canSubmit,
    // 動作
    startTest,
    submitAnswer
  }
})
```

#### UI 組件庫: Element Plus
**選擇理由**: 企業級 Vue 3 組件庫，組件豐富，文檔完善
```vue
<!-- 範例使用 -->
<template>
  <el-card class="question-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="question-type">{{ questionTypeName }}</span>
        <el-progress :percentage="progress" :stroke-width="6" />
      </div>
    </template>
    
    <QuestionRenderer :question="currentQuestion" @answer="handleAnswer" />
    
    <template #footer>
      <div class="card-footer">
        <el-button @click="previousQuestion" :disabled="!canGoPrevious">
          上一題
        </el-button>
        <el-button 
          type="primary" 
          @click="submitAnswer" 
          :loading="isSubmitting"
          :disabled="!selectedAnswer"
        >
          提交答案
        </el-button>
      </div>
    </template>
  </el-card>
</template>
```

#### 樣式方案: SCSS + CSS Modules
```scss
// styles/variables.scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

$border-radius: 4px;
$box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
$transition-duration: 0.3s;

// 響應式斷點
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1200px;
```

### 🏗 專案結構設計

```
frontend/
├── 📄 index.html                     # 主入口檔案
├── 📄 vite.config.ts                 # Vite 配置
├── 📄 package.json                   # 依賴管理
├── 📄 tsconfig.json                  # TypeScript 配置
├── 📄 .env.development               # 開發環境變數
├── 📄 .env.production                # 生產環境變數
├── 📄 .eslintrc.cjs                  # ESLint 配置
├── 📄 .prettierrc                    # Prettier 配置
├── 📂 public/                        # 靜態資源
│   ├── 📄 favicon.ico
│   └── 📂 icons/
├── 📂 src/                           # 源代碼
│   ├── 📄 main.ts                    # 應用入口
│   ├── 📄 App.vue                    # 根組件
│   ├── 📂 components/                # 可復用組件
│   │   ├── 📂 common/                # 通用組件
│   │   │   ├── 📄 AppHeader.vue
│   │   │   ├── 📄 AppSidebar.vue
│   │   │   ├── 📄 LoadingSpinner.vue
│   │   │   └── 📄 ErrorMessage.vue
│   │   ├── 📂 quiz/                  # 測驗相關組件
│   │   │   ├── 📄 QuestionRenderer.vue
│   │   │   ├── 📄 AnswerInput.vue
│   │   │   ├── 📄 QuizProgress.vue
│   │   │   ├── 📄 ResultDisplay.vue
│   │   │   ├── 📄 QuizTimer.vue
│   │   │   └── 📂 question-types/    # 各題型組件
│   │   │       ├── 📄 MultipleChoice.vue
│   │   │       ├── 📄 SingleChoice.vue
│   │   │       ├── 📄 FillInBlanks.vue
│   │   │       ├── 📄 WritingTask.vue
│   │   │       ├── 📄 TranslationTask.vue
│   │   │       ├── 📄 SentenceOrdering.vue
│   │   │       └── 📄 ReadingComprehension.vue
│   │   └── 📂 history/               # 歷史記錄組件
│   │       ├── 📄 HistoryChart.vue
│   │       ├── 📄 HistoryTable.vue
│   │       └── 📄 StatisticsCard.vue
│   ├── 📂 views/                     # 頁面組件
│   │   ├── 📄 Dashboard.vue          # 儀表板
│   │   ├── 📄 QuizSelection.vue      # 測驗選擇
│   │   ├── 📄 QuizSession.vue        # 測驗進行
│   │   ├── 📄 History.vue            # 歷史記錄
│   │   └── 📄 Settings.vue           # 設定頁面
│   ├── 📂 stores/                    # Pinia 狀態管理
│   │   ├── 📄 index.ts               # Store 註冊
│   │   ├── 📄 quiz.ts                # 測驗狀態
│   │   ├── 📄 history.ts             # 歷史記錄狀態
│   │   ├── 📄 user.ts                # 用戶狀態
│   │   └── 📄 app.ts                 # 應用全局狀態
│   ├── 📂 router/                    # Vue Router
│   │   ├── 📄 index.ts               # 路由配置
│   │   └── 📄 guards.ts              # 路由守衛
│   ├── 📂 services/                  # API 服務
│   │   ├── 📄 api.ts                 # API 基礎配置
│   │   ├── 📄 quiz.ts                # 測驗 API
│   │   └── 📄 history.ts             # 歷史 API
│   ├── 📂 composables/               # 組合式函數
│   │   ├── 📄 useQuiz.ts             # 測驗邏輯
│   │   ├── 📄 useHistory.ts          # 歷史邏輯
│   │   ├── 📄 useNotification.ts     # 通知邏輯
│   │   └── 📄 useValidation.ts       # 表單驗證
│   ├── 📂 utils/                     # 工具函數
│   │   ├── 📄 constants.ts           # 常數定義
│   │   ├── 📄 helpers.ts             # 輔助函數
│   │   ├── 📄 formatters.ts          # 格式化函數
│   │   └── 📄 validators.ts          # 驗證函數
│   ├── 📂 types/                     # TypeScript 類型
│   │   ├── 📄 index.ts               # 統一導出
│   │   ├── 📄 quiz.ts                # 測驗類型
│   │   ├── 📄 history.ts             # 歷史類型
│   │   └── 📄 api.ts                 # API 類型
│   └── 📂 styles/                    # 樣式文件
│       ├── 📄 main.scss              # 主樣式文件
│       ├── 📄 variables.scss         # SCSS 變數
│       ├── 📄 mixins.scss            # SCSS 混入
│       └── 📂 components/            # 組件樣式
├── 📂 tests/                         # 測試文件
│   ├── 📂 unit/                      # 單元測試
│   ├── 📂 integration/               # 整合測試
│   └── 📂 e2e/                       # 端到端測試
└── 📂 docs/                          # 文檔
    ├── 📄 components.md              # 組件文檔
    └── 📄 development.md             # 開發指南
```

## 🧩 核心組件設計

### 1. 測驗系統組件

#### 1.1 QuestionRenderer 組件
```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionData } from '@/types'
import MultipleChoice from './question-types/MultipleChoice.vue'
import WritingTask from './question-types/WritingTask.vue'
import TranslationTask from './question-types/TranslationTask.vue'

interface Props {
  question: QuestionData
  readonly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answer: [value: string | string[]]
}>()

// 題型組件映射
const questionComponent = computed(() => {
  const typeMap = {
    '1.1.1': MultipleChoice,   // 詞義選擇
    '1.1.2': MultipleChoice,   // 近義詞選擇
    '1.2.1': MultipleChoice,   // 語法改錯
    '2.1.1': WritingTask,      // 摘要寫作
    '2.7.1': TranslationTask,  // 中翻英
    // ... 其他題型映射
  }
  return typeMap[props.question.type] || MultipleChoice
})

const handleAnswer = (value: string | string[]) => {
  emit('answer', value)
}

const getQuestionTypeName = (type: string) => {
  const typeNames = {
    '1.1.1': '詞義選擇',
    '1.1.2': '近義詞選擇',
    '1.2.1': '語法改錯',
    '2.1.1': '摘要寫作',
    '2.7.1': '中翻英',
    // ... 其他題型名稱
  }
  return typeNames[type] || '未知題型'
}
</script>

<template>
  <div class="question-renderer">
    <div class="question-header">
      <h3 class="question-title">{{ question.title }}</h3>
      <el-tag :type="getQuestionTypeColor(question.type)" size="large">
        {{ getQuestionTypeName(question.type) }}
      </el-tag>
    </div>
    
    <div class="question-content">
      <div v-if="question.passage" class="passage">
        <h4>閱讀材料</h4>
        <div class="passage-text" v-html="question.passage"></div>
      </div>
      <div class="question-text">
        <h4>題目</h4>
        <p>{{ question.question }}</p>
      </div>
    </div>
    
    <component 
      :is="questionComponent"
      :question="question"
      :readonly="readonly"
      @answer="handleAnswer"
    />
  </div>
</template>

<style scoped lang="scss">
.question-renderer {
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .question-title {
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }
  
  .question-content {
    margin-bottom: 24px;
    
    .passage {
      background: var(--el-bg-color-page);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      
      .passage-text {
        line-height: 1.6;
        color: var(--el-text-color-regular);
      }
    }
    
    .question-text {
      h4 {
        color: var(--el-text-color-primary);
        margin-bottom: 8px;
      }
      
      p {
        color: var(--el-text-color-regular);
        line-height: 1.6;
      }
    }
  }
}
</style>
```

#### 1.2 各題型具體組件

##### 多選題組件
```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MultipleChoiceQuestion } from '@/types'

interface Props {
  question: MultipleChoiceQuestion
  readonly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answer: [value: string[]]
}>()

const selectedOptions = ref<string[]>([])

watch(selectedOptions, (newValue) => {
  emit('answer', newValue)
}, { deep: true })

const handleChange = (value: string[]) => {
  selectedOptions.value = value
}
</script>

<template>
  <div class="multiple-choice">
    <el-checkbox-group 
      v-model="selectedOptions"
      @change="handleChange"
      :disabled="readonly"
      class="options-group"
    >
      <el-checkbox 
        v-for="option in question.options"
        :key="option.id"
        :label="option.id"
        class="option-item"
      >
        <span class="option-label">{{ option.id }}.</span>
        <span class="option-text">{{ option.text }}</span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped lang="scss">
.multiple-choice {
  .options-group {
    width: 100%;
    
    .option-item {
      display: flex;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 12px;
      padding: 16px;
      border: 1px solid var(--el-border-color-light);
      border-radius: 8px;
      transition: all 0.3s;
      
      &:hover {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }
      
      &.is-checked {
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-8);
      }
      
      .option-label {
        font-weight: 600;
        color: var(--el-color-primary);
        margin-right: 8px;
        min-width: 24px;
      }
      
      .option-text {
        flex: 1;
        line-height: 1.5;
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>
```

##### 寫作題組件
```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import type { WritingQuestion } from '@/types'

interface Props {
  question: WritingQuestion
  readonly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answer: [value: string]
}>()

const content = ref('')
const wordCount = computed(() => {
  return content.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const isValidLength = computed(() => {
  const min = props.question.minWords || 0
  const max = props.question.maxWords || Infinity
  return wordCount.value >= min && wordCount.value <= max
})

// 自動保存草稿
const draftKey = computed(() => `draft_${props.question.id}`)
const draft = useStorage(draftKey.value, '')

watch(content, (newValue) => {
  if (!props.readonly) {
    draft.value = newValue
  }
  emit('answer', newValue)
}, { debounce: 1000 })

onMounted(() => {
  if (draft.value && !props.readonly) {
    content.value = draft.value
  }
})

const saveDraft = () => {
  draft.value = content.value
  ElMessage.success('草稿已保存')
}

const clearContent = () => {
  ElMessageBox.confirm('確定要清空所有內容嗎？', '確認', {
    type: 'warning'
  }).then(() => {
    content.value = ''
    draft.value = ''
    ElMessage.success('內容已清空')
  })
}
</script>

<template>
  <div class="writing-task">
    <div v-if="question.prompt" class="writing-prompt">
      <h4>寫作提示</h4>
      <div class="prompt-content" v-html="question.prompt"></div>
    </div>
    
    <div class="writing-area">
      <el-input
        v-model="content"
        type="textarea"
        :placeholder="question.placeholder || '請在此輸入您的答案...'"
        :rows="12"
        :readonly="readonly"
        resize="vertical"
        class="writing-input"
      />
      
      <div class="writing-stats">
        <div class="stats-left">
          <span class="word-count" :class="{ 'valid': isValidLength, 'invalid': !isValidLength }">
            字數: {{ wordCount }}
          </span>
          <span v-if="question.minWords" class="min-words">
            (最少 {{ question.minWords }} 字)
          </span>
          <span v-if="question.maxWords" class="max-words">
            (最多 {{ question.maxWords }} 字)
          </span>
        </div>
        
        <div v-if="!readonly" class="stats-right">
          <el-button @click="saveDraft" size="small" type="info">
            <el-icon><Document /></el-icon>
            保存草稿
          </el-button>
          <el-button @click="clearContent" size="small" type="danger">
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.writing-task {
  .writing-prompt {
    background: var(--el-bg-color-page);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    
    h4 {
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }
    
    .prompt-content {
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }
  
  .writing-area {
    .writing-input {
      margin-bottom: 12px;
      
      :deep(.el-textarea__inner) {
        line-height: 1.6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    }
    
    .writing-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      
      .stats-left {
        .word-count {
          font-weight: 600;
          
          &.valid {
            color: var(--el-color-success);
          }
          
          &.invalid {
            color: var(--el-color-danger);
          }
        }
        
        .min-words,
        .max-words {
          color: var(--el-text-color-secondary);
          font-size: 12px;
          margin-left: 8px;
        }
      }
      
      .stats-right {
        .el-button + .el-button {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
```

### 2. 服務層設計

#### 2.1 API 服務基礎
```typescript
// services/api.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  code: number
}

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 請求攔截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加 loading 狀態
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
        return config
      },
      (error) => {
        console.error('[API Request Error]', error)
        return Promise.reject(error)
      }
    )

    // 響應攔截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`[API Response] ${response.config.url}`, response.data)
        
        // 統一處理後端返回的格式
        if (response.data.success) {
          return response.data.data
        } else {
          ElMessage.error(response.data.message || '請求失敗')
          return Promise.reject(new Error(response.data.message))
        }
      },
      (error) => {
        console.error('[API Response Error]', error)
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          ElMessage.error('認證失敗，請重新登入')
          localStorage.removeItem('auth_token')
          // 跳轉到登入頁面
          break
        case 403:
          ElMessage.error('權限不足')
          break
        case 404:
          ElMessage.error('請求的資源不存在')
          break
        case 500:
          ElMessage.error('伺服器內部錯誤')
          break
        default:
          ElMessage.error(data?.message || '網路錯誤，請稍後重試')
      }
    } else if (error.request) {
      ElMessage.error('網路連接失敗，請檢查網路設定')
    } else {
      ElMessage.error('請求配置錯誤')
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

export const apiService = new ApiService()
```

#### 2.2 測驗服務
```typescript
// services/quiz.ts
import { apiService } from './api'
import type { 
  QuestionType, 
  TestSession, 
  QuestionData, 
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  TestSummary
} from '@/types'

export class QuizService {
  // 獲取可用題型
  async getQuestionTypes(): Promise<QuestionType[]> {
    return apiService.get<QuestionType[]>('/question-types')
  }

  // 開始測驗
  async startTest(params: {
    questionType: string
    difficulty?: string
    questionCount?: number
  }): Promise<{
    session: TestSession
    firstQuestion: QuestionData
  }> {
    return apiService.post('/start-test', params)
  }

  // 提交答案
  async submitAnswer(request: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
    return apiService.post('/submit-answer', request)
  }

  // 結束測驗
  async endTest(sessionId: string): Promise<{
    summary: TestSummary
  }> {
    return apiService.post(`/end-test/${sessionId}`)
  }

  // 獲取下一題
  async getNextQuestion(sessionId: string): Promise<QuestionData | null> {
    return apiService.get(`/next-question/${sessionId}`)
  }

  // 暫停測驗
  async pauseTest(sessionId: string): Promise<void> {
    return apiService.post(`/pause-test/${sessionId}`)
  }

  // 恢復測驗
  async resumeTest(sessionId: string): Promise<QuestionData> {
    return apiService.post(`/resume-test/${sessionId}`)
  }
}

export const quizService = new QuizService()
```

### 3. 組合式函數設計

#### 3.1 測驗邏輯組合式函數
```typescript
// composables/useQuiz.ts
import { ref, computed } from 'vue'
import { quizService } from '@/services/quiz'
import { useNotification } from './useNotification'
import type { QuestionData, TestSession, AnswerRecord } from '@/types'

export function useQuiz() {
  const { showNotification } = useNotification()
  
  // 響應式狀態
  const isLoading = ref(false)
  const currentSession = ref<TestSession | null>(null)
  const currentQuestion = ref<QuestionData | null>(null)
  const answers = ref<AnswerRecord[]>([])
  const currentAnswer = ref<string | string[]>('')
  
  // 計算屬性
  const progress = computed(() => {
    if (!currentSession.value) return 0
    return Math.round((answers.value.length / currentSession.value.totalQuestions) * 100)
  })
  
  const canSubmit = computed(() => {
    return currentQuestion.value && !isLoading.value && currentAnswer.value
  })

  const isLastQuestion = computed(() => {
    if (!currentSession.value) return false
    return answers.value.length === currentSession.value.totalQuestions - 1
  })

  // 開始測驗
  const startTest = async (questionType: string) => {
    isLoading.value = true
    try {
      const response = await quizService.startTest({ questionType })
      currentSession.value = response.session
      currentQuestion.value = response.firstQuestion
      answers.value = []
      currentAnswer.value = ''
      
      showNotification({
        type: 'success',
        title: '測驗開始',
        message: '祝您測驗順利！'
      })
      
      return response
    } catch (error) {
      showNotification({
        type: 'error',
        title: '開始測驗失敗',
        message: error instanceof Error ? error.message : '未知錯誤'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 提交答案
  const submitAnswer = async () => {
    if (!currentSession.value || !currentQuestion.value || !currentAnswer.value) {
      return
    }

    isLoading.value = true
    try {
      const response = await quizService.submitAnswer({
        sessionId: currentSession.value.id,
        questionId: currentQuestion.value.id,
        answer: currentAnswer.value
      })

      // 記錄答案
      answers.value.push(response.result)
      
      // 顯示結果通知
      showNotification({
        type: response.result.isCorrect ? 'success' : 'warning',
        title: response.result.isCorrect ? '回答正確！' : '回答錯誤',
        message: response.result.explanation || ''
      })

      // 更新下一題
      currentQuestion.value = response.nextQuestion
      currentAnswer.value = ''
      
      return response
    } catch (error) {
      showNotification({
        type: 'error',
        title: '提交答案失敗',
        message: error instanceof Error ? error.message : '未知錯誤'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 結束測驗
  const endTest = async () => {
    if (!currentSession.value) return

    isLoading.value = true
    try {
      const response = await quizService.endTest(currentSession.value.id)
      
      // 清理狀態
      currentSession.value = null
      currentQuestion.value = null
      currentAnswer.value = ''
      
      showNotification({
        type: 'info',
        title: '測驗結束',
        message: '感謝您的參與！'
      })
      
      return response.summary
    } catch (error) {
      showNotification({
        type: 'error',
        title: '結束測驗失敗',
        message: error instanceof Error ? error.message : '未知錯誤'
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 設置當前答案
  const setCurrentAnswer = (answer: string | string[]) => {
    currentAnswer.value = answer
  }

  // 重置測驗狀態
  const resetQuiz = () => {
    currentSession.value = null
    currentQuestion.value = null
    answers.value = []
    currentAnswer.value = ''
    isLoading.value = false
  }

  return {
    // 狀態
    isLoading,
    currentSession,
    currentQuestion,
    answers,
    currentAnswer,
    // 計算屬性
    progress,
    canSubmit,
    isLastQuestion,
    // 方法
    startTest,
    submitAnswer,
    endTest,
    setCurrentAnswer,
    resetQuiz
  }
}
```

## 📅 開發階段規劃

### Phase 1: 專案基礎建設 (第1週)

#### 🎯 階段目標
建立完整的 Vue 3 + Vite 開發環境和基礎架構

#### 📋 具體任務

**1.1 專案初始化 (1-2天)**
- [ ] **建立 Vite + Vue 3 專案**
  ```bash
  npm create vue@latest frontend
  cd frontend
  npm install
  ```
- [ ] **安裝核心依賴**
  ```bash
  npm install vue-router@4 pinia element-plus
  npm install -D @types/node unplugin-vue-components unplugin-auto-import
  ```
- [ ] **配置開發工具**
  - TypeScript 配置 (`tsconfig.json`)
  - ESLint + Prettier 配置
  - Vite 配置 (別名、代理)

**1.2 基礎架構搭建 (2-3天)**
- [ ] **建立專案目錄結構**
  - 按照設計的目錄結構創建文件夾
  - 建立基本的 `.vue` 文件模板
- [ ] **配置路由系統**
  - 設定 Vue Router 4
  - 定義主要路由 (Dashboard, Quiz, History, Settings)
  - 建立路由守衛
- [ ] **設定狀態管理**
  - 配置 Pinia
  - 建立基本的 stores 結構
- [ ] **整合 Element Plus**
  - 配置自動導入
  - 設定主題色彩
  - 建立全局樣式

**1.3 開發環境配置 (1天)**
- [ ] **VS Code 工作區配置**
  - 推薦擴展列表
  - 調試配置
- [ ] **Git 配置**
  - `.gitignore` 設定
  - Git hooks (husky + lint-staged)
- [ ] **測試環境設定**
  - Vitest 配置
  - Vue Test Utils 設定

#### 🎯 交付成果
- 可運行的 Vue 3 專案基礎架構
- 完整的開發環境配置
- 基本的路由和狀態管理結構

### Phase 2: 核心組件開發 (第2-3週)

#### 🎯 階段目標
開發可復用的核心 UI 組件和佈局

#### 📋 具體任務

**2.1 佈局組件開發 (3-4天)**
- [ ] **AppHeader.vue**
  - 應用程式標題
  - 用戶信息顯示
  - 主要導航菜單
- [ ] **AppSidebar.vue**
  - 側邊欄導航
  - 題型分類顯示
  - 摺疊/展開功能
- [ ] **AppLayout.vue**
  - 主佈局容器
  - 響應式佈局
  - 頁面切換動畫
- [ ] **通用組件**
  - LoadingSpinner.vue
  - ErrorMessage.vue
  - ConfirmDialog.vue

**2.2 測驗基礎組件 (4-5天)**
- [ ] **QuestionRenderer.vue**
  - 題目統一渲染器
  - 動態組件加載
  - 題型路由邏輯
- [ ] **AnswerInput.vue**
  - 通用答案輸入組件
  - 支援多種輸入類型
  - 驗證和格式化
- [ ] **QuizProgress.vue**
  - 進度條顯示
  - 題目計數
  - 時間顯示
- [ ] **ResultDisplay.vue**
  - 答案結果顯示
  - 解釋說明
  - 正確答案對比
- [ ] **QuizTimer.vue**
  - 計時器功能
  - 時間警告
  - 自動提交

**2.3 表單和互動組件 (2-3天)**
- [ ] **表單驗證**
  - 自定義驗證規則
  - 即時驗證反饋
  - 錯誤訊息顯示
- [ ] **通知系統**
  - Toast 通知
  - 消息彈窗
  - 確認對話框
- [ ] **檔案處理** (如需要)
  - 檔案上傳組件
  - 圖片預覽
  - 進度顯示

#### 🎯 交付成果
- 完整的組件庫
- 組件單元測試
- 組件使用文檔

### Phase 3: API 整合與資料流 (第4週)

#### 🎯 階段目標
整合後端 API，建立完整的資料流

#### 📋 具體任務

**3.1 API 服務層開發 (2-3天)**
- [ ] **基礎 API 服務**
  - HTTP 客戶端封裝
  - 請求/響應攔截器
  - 錯誤處理機制
  - 重試邏輯
- [ ] **測驗 API 服務**
  - 題型查詢
  - 測驗開始/結束
  - 答案提交
  - 進度查詢
- [ ] **歷史記錄 API**
  - 歷史查詢
  - 統計數據
  - 報告生成

**3.2 狀態管理整合 (2-3天)**
- [ ] **Quiz Store**
  - 測驗狀態管理
  - 答案記錄
  - 進度追蹤
- [ ] **History Store**
  - 歷史記錄管理
  - 統計數據
  - 篩選排序
- [ ] **User Store**
  - 用戶設定
  - 偏好設定
  - 認證狀態
- [ ] **App Store**
  - 全局狀態
  - 載入狀態
  - 錯誤狀態

**3.3 組合式函數開發 (1-2天)**
- [ ] **useQuiz**
  - 測驗邏輯封裝
  - 狀態管理
  - 事件處理
- [ ] **useHistory**
  - 歷史記錄邏輯
  - 數據處理
  - 查詢功能
- [ ] **useNotification**
  - 通知邏輯
  - 消息管理
  - 自動清理
- [ ] **useValidation**
  - 表單驗證
  - 規則定義
  - 錯誤處理

#### 🎯 交付成果
- 完整的 API 服務層
- 響應式狀態管理
- 可復用的業務邏輯組合式函數

### Phase 4: 頁面開發與題型實現 (第5-8週)

#### 🎯 階段目標
實現所有主要頁面和24種題型支援

#### 📋 具體任務

**4.1 主要頁面開發 (1週)**
- [ ] **Dashboard.vue**
  - 學習概覽
  - 快速開始
  - 統計圖表
  - 最近記錄
- [ ] **QuizSelection.vue**
  - 題型選擇
  - 難度設定
  - 題目數量
  - 開始測驗
- [ ] **QuizSession.vue**
  - 測驗進行
  - 題目顯示
  - 答案提交
  - 結果反饋
- [ ] **History.vue**
  - 歷史記錄
  - 統計分析
  - 篩選排序
  - 導出功能
- [ ] **Settings.vue**
  - 個人設定
  - 系統配置
  - 數據管理
  - 關於信息

**4.2 題型組件實現 - 選擇題系列 (1週)**
- [ ] **1.1.x 詞彙題型**
  - `MultipleChoice.vue` - 詞義選擇 (1.1.1)
  - `SynonymChoice.vue` - 近義詞選擇 (1.1.2)
- [ ] **1.2.x 語法題型**
  - `GrammarCorrection.vue` - 語法改錯 (1.2.1)
  - `GrammarChoice.vue` - 語法選擇 (1.2.2)
- [ ] **1.3.x 填空題型**
  - `FillInBlanks.vue` - 克漏字填空 (1.3.1)
  - `VocabularyFill.vue` - 詞彙填空 (1.3.2)

**4.3 題型組件實現 - 排序題系列 (3-4天)**
- [ ] **1.4.x 排序題型**
  - `SentenceOrdering.vue` - 句子排序 (1.4.1)
  - `ParagraphOrdering.vue` - 段落排序 (1.4.2)
  - 拖拽排序功能
  - 視覺反饋系統

**4.4 題型組件實現 - 寫作題系列 (1.5週)**
- [ ] **2.1.x 摘要寫作**
  - `SummaryWriting.vue` - 摘要寫作 (2.1.1, 2.1.2)
  - 字數統計
  - 實時保存
- [ ] **2.2.x 作文寫作**
  - `EssayWriting.vue` - 議論文 (2.2.1, 2.2.2)
  - 大綱輔助
  - 格式檢查
- [ ] **2.3.x-2.6.x 其他寫作**
  - `LetterWriting.vue` - 書信寫作 (2.3.1, 2.3.2)
  - `ReportWriting.vue` - 報告寫作 (2.4.1, 2.4.2)
  - `ProposalWriting.vue` - 提案寫作 (2.5.1, 2.5.2)
  - `ReviewWriting.vue` - 評論寫作 (2.6.1, 2.6.2)

**4.5 題型組件實現 - 翻譯題系列 (3-4天)**
- [ ] **2.7.x-2.8.x 翻譯題型**
  - `TranslationCE.vue` - 中翻英 (2.7.1, 2.7.2)
  - `TranslationEC.vue` - 英翻中 (2.8.1, 2.8.2)
  - 雙語對照
  - 翻譯輔助

**4.6 題型渲染系統 (2-3天)**
- [ ] **題型工廠模式**
  - 動態組件加載
  - 題型註冊系統
  - 配置管理
- [ ] **答案驗證系統**
  - 統一驗證接口
  - 多種驗證規則
  - 結果反饋

#### 🎯 交付成果
- 24種題型的完整支援
- 所有主要頁面功能
- 完整的測驗流程

### Phase 5: UX 優化與進階功能 (第9-10週)

#### 🎯 階段目標
優化使用者體驗，添加進階功能

#### 📋 具體任務

**5.1 互動體驗優化 (3-4天)**
- [ ] **動畫系統**
  - 頁面切換動畫
  - 組件過渡效果
  - 載入動畫
  - 反饋動畫
- [ ] **載入狀態優化**
  - 骨架屏
  - 進度指示
  - 懶載入
  - 預載入
- [ ] **錯誤處理**
  - 友好錯誤頁面
  - 錯誤邊界
  - 重試機制
  - 降級方案
- [ ] **響應式設計**
  - 移動端適配
  - 平板端優化
  - 觸控支援
  - 手勢操作

**5.2 學習分析功能 (3-4天)**
- [ ] **數據視覺化**
  - 學習進度圖表
  - 正確率趨勢
  - 題型分析
  - 時間分析
- [ ] **智能分析**
  - 錯誤分析
  - 學習建議
  - 難點識別
  - 復習提醒
- [ ] **報告系統**
  - 學習報告生成
  - PDF 導出
  - 分享功能
  - 打印優化

**5.3 輔助功能與優化 (2-3天)**
- [ ] **無障礙功能**
  - 鍵盤導航
  - 螢幕閱讀器支援
  - 高對比度模式
  - 字體大小調整
- [ ] **國際化準備**
  - i18n 框架搭建
  - 多語言文本提取
  - 語言切換
  - 日期時間格式化
- [ ] **離線功能**
  - Service Worker
  - 離線提示
  - 數據同步
  - PWA 配置

#### 🎯 交付成果
- 優秀的使用者體驗
- 豐富的學習分析功能
- 良好的無障礙支援
- PWA 功能

### Phase 6: 測試、優化與部署 (第11-12週)

#### 🎯 階段目標
全面測試、效能優化和部署準備

#### 📋 具體任務

**6.1 測試完善 (4-5天)**
- [ ] **單元測試**
  - 組件測試 (目標覆蓋率 > 80%)
  - 組合式函數測試
  - 工具函數測試
  - Store 測試
- [ ] **整合測試**
  - API 整合測試
  - 頁面流程測試
  - 數據流測試
- [ ] **E2E 測試**
  - 關鍵用戶流程
  - 跨瀏覽器測試
  - 響應式測試
- [ ] **效能測試**
  - 載入速度測試
  - 記憶體使用測試
  - 網路條件測試

**6.2 效能優化 (3-4天)**
- [ ] **程式碼優化**
  - 程式碼分割
  - 懶載入實現
  - Tree shaking
  - Dead code elimination
- [ ] **資源優化**
  - 圖片壓縮
  - 字體優化
  - CSS 優化
  - JavaScript 壓縮
- [ ] **快取策略**
  - HTTP 快取
  - 瀏覽器快取
  - Service Worker 快取
  - API 快取
- [ ] **打包優化**
  - Bundle 分析
  - 依賴優化
  - 構建速度優化
  - 輸出優化

**6.3 部署準備 (2-3天)**
- [ ] **生產環境配置**
  - 環境變數設定
  - 生產建構配置
  - 安全性配置
  - 效能配置
- [ ] **容器化**
  - Dockerfile 編寫
  - 多階段建構
  - 映像優化
  - 容器測試
- [ ] **CI/CD 設定**
  - GitHub Actions 配置
  - 自動測試
  - 自動部署
  - 品質檢查
- [ ] **監控和日誌**
  - 錯誤追蹤
  - 效能監控
  - 用戶行為分析
  - 日誌收集

#### 🎯 交付成果
- 高品質的生產就緒應用
- 完整的測試覆蓋
- 自動化部署流程
- 監控和維護體系

## 🧪 測試策略

### 單元測試範例
```typescript
// tests/unit/components/QuestionRenderer.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import QuestionRenderer from '@/components/quiz/QuestionRenderer.vue'
import type { QuestionData } from '@/types'

describe('QuestionRenderer', () => {
  const mockQuestion: QuestionData = {
    id: '1',
    type: '1.1.1',
    title: 'Test Question',
    question: 'What is the meaning of "happy"?',
    options: [
      { id: 'A', text: 'Sad' },
      { id: 'B', text: 'Joyful' },
      { id: 'C', text: 'Angry' },
      { id: 'D', text: 'Confused' }
    ]
  }

  it('renders question correctly', () => {
    const wrapper = mount(QuestionRenderer, {
      props: { question: mockQuestion },
      global: {
        plugins: [createTestingPinia()]
      }
    })

    expect(wrapper.text()).toContain('Test Question')
    expect(wrapper.text()).toContain('What is the meaning of "happy"?')
    expect(wrapper.findAll('.option-item')).toHaveLength(4)
  })

  it('emits answer when option selected', async () => {
    const wrapper = mount(QuestionRenderer, {
      props: { question: mockQuestion },
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await wrapper.find('input[value="B"]').setValue(true)
    expect(wrapper.emitted('answer')).toBeTruthy()
    expect(wrapper.emitted('answer')?.[0]).toEqual([['B']])
  })
})
```

### 整合測試範例
```typescript
// tests/integration/quiz-flow.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '@/stores/quiz'
import { quizService } from '@/services/quiz'

// Mock API service
vi.mock('@/services/quiz')

describe('Quiz Flow Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('completes full quiz workflow', async () => {
    const quizStore = useQuizStore()
    
    // Mock API responses
    const mockSession = { id: '1', totalQuestions: 5 }
    const mockQuestion = { id: '1', type: '1.1.1', question: 'Test?' }
    
    vi.mocked(quizService.startTest).mockResolvedValue({
      session: mockSession,
      firstQuestion: mockQuestion
    })
    
    // 測試開始測驗
    await quizStore.startTest('1.1.1')
    expect(quizStore.currentSession).toEqual(mockSession)
    expect(quizStore.currentQuestion).toEqual(mockQuestion)
    
    // 測試提交答案
    vi.mocked(quizService.submitAnswer).mockResolvedValue({
      result: { isCorrect: true, explanation: 'Correct!' },
      nextQuestion: null
    })
    
    quizStore.setCurrentAnswer('A')
    await quizStore.submitAnswer()
    expect(quizStore.answers).toHaveLength(1)
    expect(quizStore.answers[0].isCorrect).toBe(true)
  })
})
```

## 📈 效能指標與目標

### 技術指標
- **建置時間**: < 30秒
- **熱重載**: < 500ms
- **初始載入**: < 3秒
- **路由切換**: < 200ms
- **打包體積**: < 2MB (gzipped)
- **記憶體使用**: < 150MB

### Web Vitals 指標
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

### 程式碼品質指標
- **TypeScript 覆蓋率**: > 95%
- **單元測試覆蓋率**: > 80%
- **E2E 測試覆蓋率**: > 70%
- **ESLint 錯誤數**: 0
- **Lighthouse 分數**: > 90

## 🚀 部署策略

### 開發環境
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 執行測試
npm run test

# 程式碼檢查
npm run lint

# 類型檢查
npm run type-check
```

### 生產環境建構
```bash
# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 執行所有測試
npm run test:unit
npm run test:e2e

# 生成測試覆蓋率報告
npm run test:coverage
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to production
        run: |
          # 部署腳本
          echo "Deploying to production..."
```

## 📝 專案配置文件

### package.json
```json
{
  "name": "llm-english-learning-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "cypress run",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "type-check": "vue-tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.3.4",
    "vue-router": "^4.2.4",
    "pinia": "^2.1.6",
    "element-plus": "^2.3.8",
    "axios": "^1.4.0",
    "@vueuse/core": "^10.2.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "vite": "^4.4.5",
    "typescript": "^5.0.2",
    "vue-tsc": "^1.8.5",
    "@vue/test-utils": "^2.4.1",
    "vitest": "^0.34.1",
    "@vitest/coverage-c8": "^0.34.1",
    "cypress": "^12.17.4",
    "eslint": "^8.45.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint-plugin-vue": "^9.15.1",
    "prettier": "^3.0.0",
    "sass": "^1.64.1",
    "unplugin-auto-import": "^0.16.6",
    "unplugin-vue-components": "^0.25.1"
  }
}
```

---

這個重新規劃的前端開發計劃採用了現代化的 **Vue 3 + Vite** 技術棧，相比原生 JavaScript 方案具有以下優勢：

1. **更好的開發體驗**: Vite 的快速熱重載，TypeScript 的類型檢查
2. **更高的可維護性**: 組件化架構，清晰的代碼組織
3. **更豐富的生態**: Vue 3 生態系統的成熟組件和工具
4. **更好的效能**: 現代化的建構工具和優化策略
5. **更強的擴展性**: 模組化設計，易於添加新功能

整個計劃預估需要 **12週** 完成，可根據實際情況調整時程。每個階段都有明確的目標和具體的交付成果，確保專案按計劃推進。 