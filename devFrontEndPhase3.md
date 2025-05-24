# 前端開發階段 3：API 整合與服務層

**對應 `devFrontEnd.md` Phase 3 API 整合與服務層**

## 目標

本階段的核心目標是建立完整的資料服務層，整合後端 API，實現前後端資料流通。實作所有必要的服務類別、API 客戶端、錯誤處理機制和快取系統，確保前端可以穩定地與後端 Gemini 2.5 Flash 系統進行資料交換。

## 主要產出物

* `ApiService.js` 基礎 API 服務類別及其單元測試
* `QuizService.js` 測驗相關 API 服務及其單元測試
* `HistoryService.js` 歷史記錄 API 服務及其單元測試
* `SettingsService.js` 設定管理 API 服務及其單元測試
* `CacheService.js` 前端快取服務及其單元測試
* `AnalyticsService.js` 學習分析 API 服務及其單元測試
* 完整的錯誤處理和重試機制
* API 端點配置和環境管理 (`api.js`, `environment.js`)
* 資料格式化和驗證工具 (`formatters.js`, `validation.js`)
* 本地存儲封裝和離線功能支援

## 詳細步驟

### Phase3.1 基礎 API 架構
1. **ApiService 基類 (`ApiService.js`)**:
   * 實現企業級 HTTP 客戶端，支援請求/響應攔截器
   * 實現自動重試機制和錯誤處理
   * 支援請求快取和去重
   * 實現請求超時和取消功能
   * 包含 API 狀態監控和日誌記錄

2. **API 配置管理 (`config/api.js`)**:
   * 定義所有 API 端點和版本資訊
   * 實現環境相關的 API 配置切換
   * 包含 API 金鑰管理和安全配置
   * 實現 API 速率限制和配額管理

3. **環境配置 (`config/environment.js`)**:
   * 實現開發、測試、生產環境配置
   * 包含 API 基礎 URL 和功能開關
   * 實現除錯模式和日誌等級配置
   * 包含效能監控和錯誤追蹤設定

### Phase3.2 測驗系統 API 整合
1. **QuizService 實作 (`QuizService.js`)**:
   * 實現測驗會話管理 (`startQuiz`, `submitAnswer`, `endQuiz`)
   * 支援24種題型的資料格式和驗證
   * 實現即時答案提交和結果獲取
   * 包含測驗進度追蹤和狀態同步
   * 實現離線模式和資料同步功能

2. **問題快取機制**:
   * 實現問題預載入和智慧快取策略
   * 支援按題型和難度進行快取分類
   * 實現快取失效和更新機制
   * 包含快取統計和效能監控

3. **答案驗證和格式化**:
   * 實現客戶端答案預驗證
   * 支援各種題型的答案格式標準化
   * 實現答案資料的加密和安全傳輸
   * 包含答案草稿自動保存功能

### Phase3.3 歷史與分析服務
1. **HistoryService 實作 (`HistoryService.js`)**:
   * 實現學習歷史資料獲取和分頁
   * 支援多維度篩選和排序功能
   * 實現統計資料計算和趨勢分析
   * 包含資料匯出和分享功能
   * 實現歷史資料的本地快取和同步

2. **AnalyticsService 實作 (`AnalyticsService.js`)**:
   * 實現學習分析資料的獲取和處理
   * 支援即時統計和趨勢預測
   * 實現個人化學習建議生成
   * 包含學習軌跡追蹤和模式分析
   * 實現效能指標監控和報告

3. **資料視覺化支援**:
   * 實現圖表資料格式轉換
   * 支援即時資料更新和動畫
   * 實現資料聚合和維度分析
   * 包含互動式圖表配置管理

### Phase3.4 設定與快取系統
1. **SettingsService 實作 (`SettingsService.js`)**:
   * 實現使用者設定的雲端同步
   * 支援設定項目的即時驗證和套用
   * 實現設定備份和復原功能
   * 包含設定變更歷史和版本管理
   * 實現設定匯入/匯出功能

2. **CacheService 實作 (`CacheService.js`)**:
   * 實現多層級快取策略 (記憶體、本地存儲、IndexedDB)
   * 支援快取過期和清理機制
   * 實現快取統計和效能監控
   * 包含快取同步和一致性保證
   * 實現離線優先的快取策略

3. **本地存儲管理 (`storage.js`)**:
   * 實現 localStorage、sessionStorage、IndexedDB 的統一封裝
   * 支援資料加密和安全存儲
   * 實現存儲配額管理和清理
   * 包含存儲同步和備份功能

### Phase3.5 錯誤處理與監控
1. **錯誤處理系統**:
   * 實現全域錯誤捕獲和處理機制
   * 支援網路錯誤、API 錯誤、應用程式錯誤的分類處理
   * 實現錯誤重試和降級策略
   * 包含使用者友好的錯誤訊息顯示

2. **效能監控**:
   * 實現 API 響應時間監控
   * 支援網路狀態和連線品質檢測
   * 實現記憶體使用和效能指標追蹤
   * 包含使用者行為和互動分析

3. **日誌系統**:
   * 實現結構化日誌記錄和上傳
   * 支援不同等級的日誌過濾和輸出
   * 實現日誌的本地存儲和清理
   * 包含除錯模式和開發工具整合

## 核心代碼實作規格

### ApiService 基類設計
```javascript
class ApiService {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 10000;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.interceptors = { request: [], response: [] };
    this.cache = new Map();
    this.requestQueue = new Map();
  }

  async request(config) {
    // 實現請求攔截器
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // 實現請求去重
    const requestKey = this.generateRequestKey(config);
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    // 實現快取檢查
    if (config.cache && this.cache.has(requestKey)) {
      const cached = this.cache.get(requestKey);
      if (!this.isCacheExpired(cached)) {
        return cached.data;
      }
    }

    // 建立請求 Promise
    const requestPromise = this.executeRequest(config);
    this.requestQueue.set(requestKey, requestPromise);

    try {
      const response = await requestPromise;
      
      // 實現響應攝截器
      for (const interceptor of this.interceptors.response) {
        response = await interceptor(response);
      }

      // 快取響應
      if (config.cache) {
        this.cache.set(requestKey, {
          data: response,
          timestamp: Date.now(),
          ttl: config.cacheTTL || 300000
        });
      }

      return response;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  async executeRequest(config) {
    let attempt = 0;
    let lastError;

    while (attempt < this.retryCount) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.baseURL + config.url, {
          method: config.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers
          },
          body: config.data ? JSON.stringify(config.data) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new APIError(response.status, response.statusText);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt < this.retryCount && this.shouldRetry(error)) {
          await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
          continue;
        }
        
        throw error;
      }
    }
  }
}
```

### QuizService 實作範例
```javascript
class QuizService extends ApiService {
  constructor() {
    super(process.env.API_BASE_URL);
    this.currentSession = null;
    this.questionCache = new Map();
  }

  async startQuiz(config) {
    try {
      const response = await this.request({
        url: '/api/start-test',
        method: 'POST',
        data: {
          questionTypes: config.questionTypes,
          difficulty: config.difficulty,
          questionCount: config.questionCount,
          userPreferences: config.userPreferences
        }
      });

      this.currentSession = {
        sessionId: response.sessionId,
        questions: response.questions,
        currentIndex: 0,
        startTime: Date.now(),
        answers: [],
        config: config
      };

      // 預載入下一題
      this.preloadNextQuestions();

      return this.currentSession;
    } catch (error) {
      throw new QuizError('開始測驗失敗', error);
    }
  }

  async submitAnswer(answer) {
    if (!this.currentSession) {
      throw new QuizError('沒有進行中的測驗會話');
    }

    // 客戶端驗證
    const validationResult = this.validateAnswer(answer);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.errors);
    }

    const answerData = {
      sessionId: this.currentSession.sessionId,
      questionId: this.getCurrentQuestion().id,
      answer: this.formatAnswer(answer),
      responseTime: Date.now() - this.answerStartTime,
      clientTimestamp: Date.now()
    };

    try {
      const response = await this.request({
        url: '/api/submit-answer',
        method: 'POST',
        data: answerData,
        timeout: 15000
      });

      // 更新本地狀態
      this.currentSession.answers.push({
        ...answerData,
        isCorrect: response.isCorrect,
        feedback: response.feedback,
        score: response.score
      });

      return response;
    } catch (error) {
      // 實現離線模式答案保存
      this.saveAnswerOffline(answerData);
      throw new QuizError('提交答案失敗，已保存至離線佇列', error);
    }
  }

  async preloadNextQuestions() {
    if (!this.currentSession) return;

    const { questions, currentIndex } = this.currentSession;
    const preloadCount = Math.min(3, questions.length - currentIndex - 1);

    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < questions.length) {
        const question = questions[nextIndex];
        if (!this.questionCache.has(question.id)) {
          this.loadQuestionResources(question);
        }
      }
    }
  }
}
```

## 驗收標準

* 所有服務類別可以正常與後端 API 通信
* API 錯誤處理和重試機制運作正常
* 快取系統有效提升載入效能
* 離線功能可以在網路中斷時正常運作
* 所有服務的單元測試和整合測試全部通過
* API 響應時間在合理範圍內 (< 2秒)
* 錯誤訊息對使用者友好且具有指導性
* 資料驗證和格式化功能正確運作
* 本地存儲和快取管理功能穩定
* 效能監控和日誌系統正常運作
* 所有程式碼已提交到版本控制系統 (Git) 