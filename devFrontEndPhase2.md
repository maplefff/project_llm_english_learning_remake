# 前端開發階段 2：測驗組件開發與交互系統

**對應 `devFrontEnd.md` Phase 2: 核心組件開發 (第2-3週)**

## 🎯 目標

本階段的核心目標是開發測驗系統的專用組件和完善用戶交互體驗。**注意：Phase1 重構已完成應用程式主佈局（App.vue 側邊欄導航、24種題型集成、API整合），因此 Phase2 將專注於測驗組件的細化開發和通用 UI 組件的補全。**

## 📊 Phase1 完成狀況回顧

### ✅ 已完成的核心架構
- **主佈局系統**：App.vue 完整側邊欄導航（無需額外 AppHeader/AppSidebar）
- **24種題型支援**：閱讀理解系列(1.x.x) + 寫作應用系列(2.x.x)
- **API整合**：4個核心後端API已連接（GET /api/question-types, POST /api/start-test, POST /api/submit-answer, GET /api/history）
- **基礎頁面**：Dashboard.vue、Quiz.vue、History.vue、Settings.vue
- **UI系統**：自定義 macOS 風格設計（已移除 Element Plus）

### ❌ 待開發的組件
- **測驗組件**：`components/quiz/` 目錄空白，需要細化測驗交互
- **通用組件**：`components/common/` 目錄空白，需要基礎 UI 組件
- **歷史組件**：`components/history/` 目錄空白，需要數據展示組件

## 🎯 Phase2 主要產出物

*   測驗系統專用組件（QuestionRenderer、AnswerInput、ResultDisplay 等）
*   通用 UI 組件庫（LoadingSpinner、ErrorMessage、Modal 等）
*   歷史記錄展示組件（HistoryChart、HistoryTable、StatisticsCard 等）
*   表單驗證和通知系統組件
*   完整的組件單元測試套件
*   組件使用文檔

## 📋 詳細步驟

### Phase2.1 測驗系統專用組件開發 (4-5天)

#### 目標：解決當前 Quiz.vue 的單體問題，拆分為可復用組件

1.  **QuestionRenderer.vue 題目渲染器**:
    *   **目的**：從 Quiz.vue 中提取題目顯示邏輯
    *   **功能需求**: 
        *   統一的題目文字顯示格式
        *   支援富文本內容（HTML 標籤、數學公式等）
        *   閱讀材料（passage）的展示和高亮功能
        *   題型標籤和代碼顯示（如 "1.1.1 - 詞義選擇"）
    *   **Props 設計**:
        ```typescript
        interface QuestionRendererProps {
          question: Question
          readonly?: boolean
        }
        ```
    *   **發射事件**: 無（純展示組件）

2.  **AnswerInput.vue 答案輸入組件**:
    *   **目的**：統一化不同題型的答案輸入方式
    *   **輸入類型支援**:
        *   單選/多選選項（Radio、Checkbox）- 用於選擇題
        *   文字輸入（短文字、長文字）- 用於翻譯、寫作題
        *   富文本編輯器 - 用於長篇寫作
        *   填空題的多個輸入框
    *   **Props 設計**:
        ```typescript
        interface AnswerInputProps {
          question: Question
          modelValue: string | string[]
          disabled?: boolean
        }
        ```
    *   **發射事件**: `update:modelValue`、`change`
    *   **驗證功能**:
        *   即時格式驗證（字數限制、必填檢查等）
        *   答案完整性檢查
        *   自定義驗證規則支援

3.  **ResultDisplay.vue 答案結果顯示組件**:
    *   **目的**：統一化答題結果的展示格式
    *   **結果展示**:
        *   正確/錯誤的視覺化指示
        *   正確答案和用戶答案的對比顯示
        *   詳細的解釋說明（支援 HTML 格式）
        *   得分和統計資訊
    *   **Props 設計**:
        ```typescript
        interface ResultDisplayProps {
          result: QuizResult
          question: Question
        }
        ```
    *   **交互功能**:
        *   收藏錯題功能
        *   復習標記和筆記添加
        *   分享結果功能

4.  **QuizTimer.vue 測驗計時器組件**:
    *   **計時功能**:
        *   單題作答時間記錄
        *   總計時顯示
        *   時間不足時的警告提示（橙色/紅色預警）
    *   **Props 設計**:
        ```typescript
        interface QuizTimerProps {
          startTime?: Date
          warningTime?: number  // 警告剩餘時間（秒）
          autoSubmit?: boolean  // 時間到自動提交
        }
        ```

5.  **QuizProgress.vue 測驗進度指示器**:
    *   **功能需求**:
        *   當前題型的完成統計
        *   最近答題的準確率趨勢
        *   連續答對計數
    *   **視覺設計**: macOS 風格的進度條和統計卡片

### Phase2.2 通用 UI 組件開發 (3-4天)

#### 目標：建立可復用的基礎組件庫，支援整個應用程式

1.  **LoadingSpinner.vue 載入指示器**:
    *   **需求分析**：當前 Quiz.vue 中的載入狀態需要統一化
    *   **功能特性**:
        *   支援不同大小（small、medium、large）
        *   可自定義載入文字和顏色主題
        *   支援全屏遮罩和區域載入兩種模式
        *   macOS 風格的旋轉動畫
    *   **Props 設計**:
        ```typescript
        interface LoadingSpinnerProps {
          size?: 'small' | 'medium' | 'large'
          text?: string
          overlay?: boolean
          theme?: 'light' | 'dark'
        }
        ```

2.  **ErrorMessage.vue 錯誤訊息組件**:
    *   **需求分析**：統一應用程式的錯誤展示格式
    *   **功能特性**:
        *   統一的錯誤訊息顯示格式
        *   支援可重試操作的錯誤類型
        *   可配置的錯誤等級（warning、error、critical）
        *   自動消失和手動關閉功能
    *   **Props 設計**:
        ```typescript
        interface ErrorMessageProps {
          message: string
          type?: 'warning' | 'error' | 'critical'
          retryable?: boolean
          autoClose?: number
        }
        ```

3.  **Modal.vue 模態對話框組件**:
    *   **功能需求**:
        *   可復用的模態對話框基礎組件
        *   支援自定義頭部、內容、底部
        *   鍵盤事件支援（ESC 關閉）
        *   背景點擊關閉（可配置）
        *   macOS 風格的毛玻璃效果
    *   **Slots 設計**: `header`、`default`、`footer`

4.  **ConfirmDialog.vue 確認對話框**:
    *   **功能需求**:
        *   基於 Modal.vue 的確認對話框
        *   支援自定義按鈕文字和樣式
        *   Promise 風格的 API 設計
        *   危險操作的紅色警告樣式
    *   **Composable 設計**:
        ```typescript
        // useConfirm.ts
        export function useConfirm() {
          const confirm = (options: ConfirmOptions): Promise<boolean> => { }
          return { confirm }
        }
        ```

5.  **Toast.vue 通知提示組件**:
    *   **功能需求**:
        *   成功、警告、錯誤、資訊四種類型
        *   可配置的顯示位置（右上、右下等）
        *   支援圖標、標題、內容和操作按鈕
        *   動畫進入和退出效果
        *   通知隊列管理
    *   **Composable 設計**:
        ```typescript
        // useToast.ts
        export function useToast() {
          const success = (message: string) => { }
          const error = (message: string) => { }
          const warning = (message: string) => { }
          const info = (message: string) => { }
          return { success, error, warning, info }
        }
        ```

### Phase2.3 歷史記錄展示組件開發 (2-3天)

#### 目標：完善 History.vue 頁面的數據展示功能

1.  **HistoryChart.vue 歷史趨勢圖表**:
    *   **功能需求**:
        *   答題準確率趨勢線圖
        *   不同題型的表現對比圖
        *   時間段篩選功能（今日、本週、本月、全部）
    *   **技術實現**: 使用 Chart.js 或 ApexCharts
    *   **Props 設計**:
        ```typescript
        interface HistoryChartProps {
          data: HistoryData[]
          chartType: 'line' | 'bar' | 'pie'
          timeRange: TimeRange
        }
        ```

2.  **HistoryTable.vue 歷史記錄表格**:
    *   **功能需求**:
        *   分頁的歷史記錄表格
        *   可排序（時間、題型、準確率）
        *   可篩選（題型、正確性、時間範圍）
        *   支援批量操作（刪除、標記複習）
    *   **響應式設計**: 移動端卡片模式，桌面端表格模式

3.  **StatisticsCard.vue 統計卡片**:
    *   **展示內容**:
        *   總答題數、正確率、連續答對記錄
        *   最弱題型和最強題型分析
        *   本週進度和目標達成情況
    *   **視覺設計**: macOS 風格的磨砂玻璃卡片

### Phase2.4 表單驗證和工具組件 (1-2天)

1.  **表單驗證系統**:
    *   **useValidation 組合式函數**:
        ```typescript
        // composables/useValidation.ts
        export function useValidation(rules: ValidationRules) {
          const errors = ref<Record<string, string>>({})
          const validate = (field: string, value: any): boolean => { }
          const validateAll = (): boolean => { }
          return { errors, validate, validateAll }
        }
        ```
    *   **內建驗證規則**:
        *   必填欄位驗證
        *   字數限制驗證（最少/最多字數）
        *   格式驗證（電子郵件、網址等）
        *   自定義正則表達式驗證

2.  **FileUpload.vue 文件上傳組件**（如需要）:
    *   **功能需求**:
        *   拖拽上傳和點擊上傳支援
        *   文件類型和大小限制
        *   上傳進度顯示
        *   預覽功能（圖片、PDF 等）

### Phase2.5 組件測試與文檔 (1-2天)

1.  **單元測試開發**:
    *   **測試策略**:
        *   Props 傳遞和預設值測試
        *   事件發射和處理測試
        *   條件渲染和狀態變化測試
        *   用戶交互模擬測試
    *   **測試工具**: Vue Test Utils + Vitest
    *   **覆蓋率目標**: 80% 以上

2.  **組件文檔建立**:
    *   **API 文檔**:
        *   組件的 Props、Events、Slots 文檔
        *   使用範例和最佳實踐
        *   TypeScript 類型定義
    *   **組件故事書**（選擇性）:
        *   組件的互動式展示
        *   不同狀態的演示

## 🔧 組件架構設計

### 組件分層結構
```
src/components/
├── common/           # 通用基礎組件
│   ├── LoadingSpinner.vue
│   ├── ErrorMessage.vue
│   ├── Modal.vue
│   ├── ConfirmDialog.vue
│   └── Toast.vue
├── quiz/            # 測驗專用組件
│   ├── QuestionRenderer.vue
│   ├── AnswerInput.vue
│   ├── ResultDisplay.vue
│   ├── QuizTimer.vue
│   └── QuizProgress.vue
└── history/         # 歷史記錄組件
    ├── HistoryChart.vue
    ├── HistoryTable.vue
    └── StatisticsCard.vue
```

### 組件間通訊模式
*   **父子組件**: Props Down, Events Up 的單向數據流
*   **兄弟組件**: 通過 Pinia Store 進行狀態共享
*   **跨層級組件**: 使用 provide/inject 或 Composables
*   **全局狀態**: 繼續使用現有的 Pinia stores (app、quiz、history)

### 事件系統設計
*   **組件事件**: 使用 TypeScript 定義清晰的事件類型
*   **自定義事件**: 統一的事件命名規範（動詞+名詞）
*   **事件載荷**: 標準化的事件數據結構
*   **錯誤處理**: 組件級錯誤邊界和全局錯誤處理

### 狀態管理集成
*   **響應式更新**: 組件與 Store 的自動同步
*   **性能優化**: 計算屬性和 Watch 的合理使用
*   **持久化**: 重要狀態的本地存儲策略（已有基礎）

## ✅ 驗收標準

### 功能驗收
*   所有測驗組件能正確顯示，支援 24 種題型的差異化渲染
*   通用 UI 組件功能完整，能在各頁面正常復用
*   歷史記錄組件能正確展示數據和圖表
*   表單驗證系統運作正常，能提供即時和準確的驗證反饋
*   通知系統能正確顯示和管理各種類型的通知訊息

### 技術驗收
*   所有組件的單元測試通過率達到 80% 以上
*   組件 API 設計清晰，TypeScript 類型定義完整
*   組件間的數據流和事件處理邏輯正確
*   所有組件已整合到主應用中，無集成錯誤
*   程式碼通過 ESLint 檢查，符合專案編碼規範

### 效能驗收
*   組件渲染效能良好，無明顯卡頓
*   記憶體使用合理，無記憶體洩漏
*   建構後總大小控制在合理範圍

### 文檔驗收
*   組件文檔完整，包含使用範例和 API 說明
*   README 文件更新，包含組件庫的使用指南
*   TypeScript 聲明文件完整

## 📝 開發注意事項

### 與 Phase1 的銜接
*   **保持現有架構**：不要修改 App.vue 的佈局，專注於組件細化
*   **API 整合延續**：利用現有的 4 個 API，等待後端補齊剩餘 4 個
*   **macOS 風格一致性**：新組件需要與現有的 `@styles/macos.scss` 保持一致

### 開發優先級
1. **高優先級**：測驗組件（直接影響核心功能）
2. **中優先級**：通用 UI 組件（提升用戶體驗）  
3. **低優先級**：歷史記錄組件（依賴後端 API 完善）

### 技術約束
*   **繼續使用**：Vue 3 + TypeScript + Pinia + Vue Router
*   **不要引入**：新的 UI 庫（保持自定義 macOS 風格）
*   **效能考量**：組件懶加載、計算屬性快取、避免不必要的重渲染 