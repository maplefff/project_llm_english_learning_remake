# 前端開發階段 3：API 整合與資料流架構

**對應 `devFrontEnd.md` Phase 3: API 整合與資料流 (第4週)**

## 目標

本階段的核心目標是建立完整的前後端數據通訊架構，包括 HTTP 客戶端封裝、API 服務層設計、Pinia 狀態管理整合以及組合式函數的業務邏輯封裝。重點在於建立穩健的錯誤處理機制、數據快取策略以及響應式的狀態管理系統。所有 API 整合都需要完整的 TypeScript 類型定義和單元測試，確保前端與後端的無縫對接。

## 主要產出物

*   企業級 HTTP 客戶端封裝（API 基礎架構）
*   測驗系統 API 服務層（QuizService, HistoryService）
*   完整的 Pinia 狀態管理系統（所有 stores）
*   組合式函數庫（useQuiz, useHistory, useNotification）
*   API 錯誤處理和重試機制
*   數據快取和同步策略
*   完整的 TypeScript 類型定義系統

## 詳細步驟

### Phase3.1 API 基礎服務層開發 (2-3天)

1.  **HTTP 客戶端封裝（services/api.ts）**:
    *   **Axios 實例配置**:
        *   基礎 URL 設定（開發/生產環境自動切換）
        *   請求超時設定（30秒）
        *   預設 headers 配置（Content-Type, Accept 等）
        *   認證 token 自動注入機制
    *   **請求攔截器設計**:
        *   自動添加認證 headers（Bearer token）
        *   請求 ID 生成和追蹤
        *   請求載入狀態管理（全局 loading）
        *   請求日誌記錄（開發模式）
    *   **響應攔截器設計**:
        *   統一的響應格式處理（success/data/message/code）
        *   HTTP 狀態碼處理（401認證失敗、403權限不足等）
        *   網路錯誤的友好提示
        *   響應時間記錄和性能監控
    *   **錯誤處理機制**:
        *   分層錯誤處理（網路錯誤、業務錯誤、系統錯誤）
        *   錯誤重試邏輯（指數退避算法）
        *   離線狀態檢測和處理
        *   錯誤上報和日誌記錄

2.  **API 回應類型定義（types/api.ts）**:
    *   **統一回應格式**:
        *   `ApiResponse<T>` 泛型介面定義
        *   `success`, `data`, `message`, `code` 欄位規範
        *   分頁數據的 `PaginatedResponse<T>` 類型
    *   **錯誤類型定義**:
        *   `ApiError` 介面定義
        *   錯誤碼枚舉（ERROR_CODES）
        *   網路錯誤類型（NetworkError, TimeoutError）
    *   **請求參數類型**:
        *   各 API 端點的請求參數類型
        *   查詢參數的標準化介面
        *   文件上傳的參數類型

3.  **API 基礎類設計**:
    *   **BaseApiService 抽象類**:
        *   通用的 CRUD 操作方法
        *   標準化的錯誤處理
        *   請求快取和去重機制
        *   批量請求的處理邏輯
    *   **服務工廠模式**:
        *   服務實例的單例管理
        *   依賴注入和服務註冊
        *   Mock 服務的切換機制（測試環境）

### Phase3.2 業務 API 服務開發 (2-3天)

1.  **測驗系統 API 服務（services/quiz.ts）**:
    *   **QuizService 類設計**:
        *   `getQuestionTypes()` - 獲取所有可用題型列表
        *   `startTest(params)` - 開始新的測驗會話
        *   `getNextQuestion(sessionId)` - 獲取下一題
        *   `submitAnswer(request)` - 提交答案並獲取反饋
        *   `pauseTest(sessionId)` - 暫停測驗
        *   `resumeTest(sessionId)` - 恢復測驗
        *   `endTest(sessionId)` - 結束測驗並獲取總結
    *   **請求參數類型定義**:
        *   `StartTestParams` - 開始測驗的參數
        *   `SubmitAnswerRequest` - 提交答案的請求格式
        *   `TestSessionConfig` - 測驗配置參數
    *   **回應數據類型**:
        *   `QuestionData` - 題目數據結構
        *   `TestSession` - 測驗會話信息
        *   `AnswerResult` - 答案評判結果
        *   `TestSummary` - 測驗總結報告
    *   **錯誤處理邏輯**:
        *   會話過期的處理
        *   題目載入失敗的重試
        *   答案提交失敗的恢復機制

2.  **歷史記錄 API 服務（services/history.ts）**:
    *   **HistoryService 類設計**:
        *   `getHistoryList(params)` - 獲取歷史記錄列表（分頁）
        *   `getHistoryDetail(id)` - 獲取單次測驗詳細記錄
        *   `getStatistics(params)` - 獲取統計數據
        *   `deleteHistory(id)` - 刪除歷史記錄
        *   `exportHistory(params)` - 導出歷史數據
    *   **查詢參數類型**:
        *   `HistoryQueryParams` - 歷史記錄查詢參數
        *   `StatisticsParams` - 統計數據查詢參數
        *   `ExportParams` - 數據導出參數
    *   **數據類型定義**:
        *   `HistoryRecord` - 歷史記錄項目
        *   `HistoryDetail` - 詳細記錄信息
        *   `StatisticsData` - 統計數據結構

3.  **用戶設定 API 服務（services/user.ts）**:
    *   **UserService 類設計**:
        *   `getUserProfile()` - 獲取用戶檔案
        *   `updateProfile(data)` - 更新用戶資料
        *   `getSettings()` - 獲取用戶設定
        *   `updateSettings(settings)` - 更新設定
        *   `changePassword(data)` - 修改密碼
    *   **用戶數據類型**:
        *   `UserProfile` - 用戶檔案信息
        *   `UserSettings` - 用戶設定結構
        *   `PasswordChangeData` - 密碼修改數據

### Phase3.3 Pinia 狀態管理系統實現 (2-3天)

1.  **Quiz Store（stores/quiz.ts）**:
    *   **狀態定義**:
        *   `currentSession` - 當前測驗會話
        *   `currentQuestion` - 當前題目
        *   `currentAnswer` - 當前選擇的答案
        *   `answers` - 已提交的答案記錄
        *   `isLoading` - 載入狀態
        *   `error` - 錯誤狀態
    *   **計算屬性（Getters）**:
        *   `progress` - 測驗進度百分比
        *   `canSubmit` - 是否可以提交答案
        *   `isLastQuestion` - 是否為最後一題
        *   `timeRemaining` - 剩餘時間
    *   **動作（Actions）**:
        *   `startTest(questionType)` - 開始測驗
        *   `setCurrentAnswer(answer)` - 設定當前答案
        *   `submitAnswer()` - 提交答案
        *   `nextQuestion()` - 下一題
        *   `previousQuestion()` - 上一題
        *   `endTest()` - 結束測驗
        *   `pauseTest()` - 暫停測驗
        *   `resumeTest()` - 恢復測驗
    *   **狀態持久化**: 重要狀態的本地存儲和恢復機制

2.  **History Store（stores/history.ts）**:
    *   **狀態定義**:
        *   `historyList` - 歷史記錄列表
        *   `currentRecord` - 當前查看的記錄詳情
        *   `statistics` - 統計數據
        *   `pagination` - 分頁信息
        *   `filters` - 篩選條件
    *   **計算屬性**:
        *   `filteredHistory` - 篩選後的歷史記錄
        *   `overallAccuracy` - 整體正確率
        *   `recentTrend` - 最近趨勢
    *   **動作方法**:
        *   `fetchHistory(params)` - 載入歷史記錄
        *   `fetchHistoryDetail(id)` - 載入記錄詳情
        *   `fetchStatistics(params)` - 載入統計數據
        *   `setFilters(filters)` - 設定篩選條件
        *   `deleteRecord(id)` - 刪除記錄

3.  **User Store（stores/user.ts）**:
    *   **狀態定義**:
        *   `profile` - 用戶檔案
        *   `settings` - 用戶設定
        *   `isAuthenticated` - 認證狀態
        *   `token` - 認證 token
    *   **計算屬性**:
        *   `displayName` - 顯示名稱
        *   `hasProfile` - 是否有完整檔案
    *   **動作方法**:
        *   `login(credentials)` - 用戶登入
        *   `logout()` - 用戶登出
        *   `fetchProfile()` - 載入用戶檔案
        *   `updateProfile(data)` - 更新檔案
        *   `updateSettings(settings)` - 更新設定

4.  **App Store（stores/app.ts）**:
    *   **全局狀態管理**:
        *   `isLoading` - 全局載入狀態
        *   `notifications` - 通知訊息隊列
        *   `theme` - 主題設定
        *   `language` - 語言設定
        *   `isOnline` - 網路狀態
    *   **系統功能**:
        *   `showNotification(notification)` - 顯示通知
        *   `clearNotifications()` - 清除通知
        *   `toggleTheme()` - 切換主題
        *   `setLanguage(lang)` - 設定語言

### Phase3.4 組合式函數開發 (1-2天)

1.  **useQuiz 組合式函數（composables/useQuiz.ts）**:
    *   **功能封裝**:
        *   測驗流程的完整邏輯封裝
        *   與 QuizStore 的響應式連接
        *   錯誤處理和狀態管理
        *   載入狀態的統一管理
    *   **返回值設計**:
        *   響應式狀態（currentQuestion, progress, isLoading）
        *   計算屬性（canSubmit, timeRemaining）
        *   方法函數（startTest, submitAnswer, endTest）
        *   事件處理器（onQuestionChange, onTestComplete）
    *   **副作用管理**:
        *   自動清理定時器和監聽器
        *   組件卸載時的狀態清理
        *   記憶體洩漏的預防機制

2.  **useHistory 組合式函數（composables/useHistory.ts）**:
    *   **功能特性**:
        *   歷史記錄的查詢和管理
        *   分頁和篩選邏輯
        *   統計數據的計算和展示
        *   數據快取和同步策略
    *   **響應式特性**:
        *   自動響應篩選條件變化
        *   分頁數據的自動載入
        *   統計數據的即時更新

3.  **useNotification 組合式函數（composables/useNotification.ts）**:
    *   **通知管理**:
        *   統一的通知顯示介面
        *   不同類型通知的處理
        *   通知隊列的管理和限制
        *   自動消失和手動關閉
    *   **API 設計**:
        *   `showSuccess(message, options)` - 成功通知
        *   `showError(message, options)` - 錯誤通知
        *   `showWarning(message, options)` - 警告通知
        *   `showInfo(message, options)` - 資訊通知
        *   `confirm(message, options)` - 確認對話框

4.  **useValidation 組合式函數（composables/useValidation.ts）**:
    *   **驗證邏輯**:
        *   表單欄位的統一驗證
        *   異步驗證的處理
        *   驗證規則的組合和擴展
        *   錯誤訊息的多語言支援
    *   **使用模式**:
        *   聲明式的驗證規則定義
        *   響應式的驗證狀態
        *   自動的錯誤訊息管理

## 數據流架構設計

### 請求生命週期
*   **請求發起**: 組件調用組合式函數
*   **參數處理**: 組合式函數調用 Store 方法
*   **API 調用**: Store 調用 Service 層
*   **響應處理**: Service 層返回數據到 Store
*   **狀態更新**: Store 更新響應式狀態
*   **UI 更新**: 組件自動響應狀態變化

### 錯誤處理流程
*   **錯誤捕獲**: 各層級的錯誤捕獲機制
*   **錯誤分類**: 網路錯誤、業務錯誤、系統錯誤
*   **錯誤恢復**: 自動重試、用戶重試、降級處理
*   **錯誤通知**: 友好的錯誤訊息顯示

### 快取策略
*   **記憶體快取**: Store 狀態的記憶體快取
*   **本地快取**: 重要數據的 localStorage 持久化
*   **請求快取**: 相同請求的去重和快取
*   **快取更新**: 數據變更時的快取失效策略

### 狀態同步
*   **響應式更新**: Vue 響應式系統的自動更新
*   **跨組件同步**: Pinia 的全局狀態同步
*   **持久化同步**: 本地存儲與記憶體狀態的同步
*   **離線同步**: 網路恢復時的數據同步

## 驗收標準

*   HTTP 客戶端能正確處理各種請求和響應，錯誤處理機制完善
*   所有 API 服務層功能完整，能正確與後端 API 通訊
*   Pinia stores 狀態管理正確，響應式更新正常工作
*   組合式函數封裝合理，提供清晰的 API 介面
*   錯誤處理和重試機制運作正常，用戶體驗友好
*   數據快取和同步策略有效，提升應用性能
*   所有 TypeScript 類型定義完整，編譯無錯誤
*   API 整合的單元測試通過率達到 80% 以上
*   前後端數據流通順暢，無數據丟失或不一致
*   網路異常和離線狀態處理正確
*   開發者工具中狀態變化清晰可追蹤
*   程式碼符合 ESLint 規範，文檔完整 