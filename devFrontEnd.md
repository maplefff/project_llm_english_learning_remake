# LLM 英語學習系統 - 前端開發詳細計劃

## 📋 專案概述

### 🎯 專案目標
建立一個基於 **macOS 設計語言**的現代化英語學習系統前端，提供**24種不同題型**的互動式測驗體驗，具備完整的學習進度追蹤、歷史分析和個人化設定功能。

### 🏆 核心價值主張
1. **原生 macOS 體驗**: 完全遵循 Apple Human Interface Guidelines，提供熟悉的操作體驗
2. **全題型支援**: 支援從基礎選擇題到複雜寫作翻譯的24種題型
3. **智慧學習分析**: 提供詳細的學習進度分析和個人化建議
4. **無縫 API 整合**: 與 Gemini 2.5 Flash 後端系統深度整合

### 🎨 設計理念
- **簡潔優雅**: 減少認知負擔，突出學習內容
- **一致性**: 統一的視覺語言和互動模式
- **親和性**: 支援無障礙功能，適應不同用戶需求
- **響應性**: 流暢的動畫和即時反饋

## 🛠 技術架構分析

### 核心技術棧選擇

#### 前端框架選擇：原生 JavaScript (ES6+)
**選擇理由**:
- ✅ **零依賴**: 避免框架更新帶來的維護成本
- ✅ **效能優異**: 直接操作 DOM，無虛擬 DOM 開銷
- ✅ **靈活性高**: 完全控制渲染和狀態管理
- ✅ **學習成本低**: 純原生技術，易於維護和擴展
- ✅ **包體積小**: 無需打包大型框架，載入速度快

#### 樣式技術棧：CSS3 + PostCSS
**CSS3 核心特性**:
```css
/* 毛玻璃效果 */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);

/* CSS Grid 佈局 */
display: grid;
grid-template-columns: 220px 1fr;
grid-template-rows: 44px 48px 1fr;

/* CSS 變數系統 */
:root {
  --macos-blue: #0a84ff;
  --backdrop-blur: blur(20px);
}

/* CSS 動畫 */
@keyframes macosScale {
  0% { transform: scale(1); }
  50% { transform: scale(0.96); }
  100% { transform: scale(1); }
}
```

#### 狀態管理：自定義狀態管理器
```javascript
/**
 * 輕量級狀態管理器
 * 支援響應式更新和中間件
 */
class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Set();
    this.middleware = [];
  }

  // 狀態更新ㄘㄢ
  setState(updates) {
    const prevState = { ...this.state };
    const newState = { ...this.state, ...updates };
    
    // 執行中間件
    for (const middleware of this.middleware) {
      middleware(prevState, newState);
    }
    
    this.state = newState;
    this.notifySubscribers();
  }

  // 訂閱狀態變更
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}
```

#### HTTP 客戶端：增強型 Fetch API
```javascript
/**
 * 企業級 HTTP 客戶端
 * 支援攔截器、重試、快取
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.interceptors = { request: [], response: [] };
    this.cache = new Map();
  }

  async request(config) {
    // 請求攔截器
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // 快取檢查
    if (config.cache && this.cache.has(config.url)) {
      return this.cache.get(config.url);
    }

    // 發送請求
    const response = await fetch(this.baseURL + config.url, {
      method: config.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: config.data ? JSON.stringify(config.data) : undefined
    });

    // 響應攔截器
    for (const interceptor of this.interceptors.response) {
      response = await interceptor(response);
    }

    return response;
  }
}
```

### 🏗 文件結構設計

```
frontend/
├── 📄 index.html                     # 主入口，SPA 單頁面
├── 📂 src/                           # 源代碼目錄
│   ├── 📂 styles/                    # 樣式系統
│   │   ├── 📄 reset.css             # CSS Reset (基於 Normalize.css)
│   │   ├── 📄 variables.css         # CSS 變數定義
│   │   ├── 📄 typography.css        # 字體系統 (SF Pro)
│   │   ├── 📄 animations.css        # 動畫效果庫
│   │   ├── 📂 components/           # 組件樣式
│   │   │   ├── 📄 window.css        # macOS 窗口樣式
│   │   │   ├── 📄 sidebar.css       # 側邊欄樣式
│   │   │   ├── 📄 toolbar.css       # 工具欄樣式
│   │   │   ├── 📄 cards.css         # 卡片組件樣式
│   │   │   ├── 📄 forms.css         # 表單組件樣式
│   │   │   ├── 📄 tables.css        # 表格組件樣式
│   │   │   ├── 📄 buttons.css       # 按鈕組件樣式
│   │   │   ├── 📄 progress.css      # 進度條樣式
│   │   │   └── 📂 quiz/             # 測驗相關樣式
│   │   │       ├── 📄 question.css   # 問題樣式
│   │   │       ├── 📄 options.css    # 選項樣式
│   │   │       ├── 📄 writing.css    # 寫作題樣式
│   │   │       └── 📄 translation.css # 翻譯題樣式
│   │   ├── 📂 layout/               # 佈局樣式
│   │   │   ├── 📄 grid.css          # CSS Grid 系統
│   │   │   ├── 📄 flexbox.css       # Flexbox 工具類
│   │   │   └── 📄 responsive.css    # 響應式設計
│   │   └── 📂 utilities/            # 工具類樣式
│   │       ├── 📄 colors.css        # 色彩工具類
│   │       ├── 📄 spacing.css       # 間距工具類
│   │       └── 📄 visibility.css    # 可見性工具類
│   ├── 📂 scripts/                  # JavaScript 源代碼
│   │   ├── 📄 main.js              # 應用程式入口點
│   │   ├── 📂 core/                # 核心系統
│   │   │   ├── 📄 StateManager.js   # 狀態管理器
│   │   │   ├── 📄 Router.js         # SPA 路由器
│   │   │   ├── 📄 Component.js      # 組件基類
│   │   │   ├── 📄 EventBus.js       # 事件總線
│   │   │   └── 📄 DOMUtils.js       # DOM 操作工具
│   │   ├── 📂 services/            # 服務層
│   │   │   ├── 📄 ApiService.js     # API 服務基類
│   │   │   ├── 📄 QuizService.js    # 測驗服務
│   │   │   ├── 📄 HistoryService.js # 歷史記錄服務
│   │   │   ├── 📄 SettingsService.js # 設定服務
│   │   │   ├── 📄 CacheService.js   # 快取服務
│   │   │   └── 📄 AnalyticsService.js # 分析服務
│   │   ├── 📂 components/          # UI 組件
│   │   │   ├── 📂 layout/          # 佈局組件
│   │   │   │   ├── 📄 AppWindow.js   # 主應用程式窗口
│   │   │   │   ├── 📄 Titlebar.js    # 標題欄組件
│   │   │   │   ├── 📄 Toolbar.js     # 工具欄組件
│   │   │   │   ├── 📄 Sidebar.js     # 側邊欄組件
│   │   │   │   └── 📄 MainContent.js # 主內容區
│   │   │   ├── 📂 ui/              # 基礎 UI 組件
│   │   │   │   ├── 📄 Button.js      # 按鈕組件
│   │   │   │   ├── 📄 Input.js       # 輸入框組件
│   │   │   │   ├── 📄 Select.js      # 選擇器組件
│   │   │   │   ├── 📄 Card.js        # 卡片組件
│   │   │   │   ├── 📄 Table.js       # 表格組件
│   │   │   │   ├── 📄 Progress.js    # 進度條組件
│   │   │   │   ├── 📄 Modal.js       # 彈窗組件
│   │   │   │   └── 📄 Toast.js       # 通知組件
│   │   │   ├── 📂 pages/           # 頁面組件
│   │   │   │   ├── 📄 Dashboard.js   # 儀表板頁面
│   │   │   │   ├── 📄 Quiz.js        # 測驗頁面
│   │   │   │   ├── 📄 History.js     # 歷史頁面
│   │   │   │   └── 📄 Settings.js    # 設定頁面
│   │   │   └── 📂 quiz/            # 測驗相關組件
│   │   │       ├── 📄 QuestionRenderer.js # 問題渲染器
│   │   │       ├── 📄 AnswerCollector.js  # 答案收集器
│   │   │       ├── 📄 QuizTimer.js        # 測驗計時器
│   │   │       ├── 📄 ResultDisplay.js    # 結果顯示
│   │   │       └── 📂 question-types/     # 各種題型組件
│   │   │           ├── 📄 MultipleChoice.js    # 多選題
│   │   │           ├── 📄 SingleChoice.js      # 單選題
│   │   │           ├── 📄 FillInBlanks.js      # 填空題
│   │   │           ├── 📄 WritingTask.js       # 寫作題
│   │   │           ├── 📄 TranslationTask.js   # 翻譯題
│   │   │           ├── 📄 SentenceCorrection.js # 改錯題
│   │   │           ├── 📄 DragAndDrop.js       # 拖拽排序
│   │   │           └── 📄 ReadingComprehension.js # 閱讀理解
│   │   ├── 📂 utils/               # 工具函數
│   │   │   ├── 📄 constants.js      # 常數定義
│   │   │   ├── 📄 helpers.js        # 通用輔助函數
│   │   │   ├── 📄 validation.js     # 表單驗證工具
│   │   │   ├── 📄 storage.js        # 本地存儲封裝
│   │   │   ├── 📄 animation.js      # 動畫工具
│   │   │   ├── 📄 debounce.js       # 防抖節流工具
│   │   │   └── 📄 formatters.js     # 數據格式化工具
│   │   └── 📂 config/              # 配置文件
│   │       ├── 📄 api.js           # API 端點配置
│   │       ├── 📄 routes.js        # 路由配置
│   │       └── 📄 environment.js   # 環境變數
│   ├── 📂 assets/                  # 靜態資源
│   │   ├── 📂 icons/               # 圖標資源
│   │   │   ├── 📂 sf-symbols/      # SF Symbols 風格圖標
│   │   │   └── 📂 custom/          # 自定義圖標
│   │   ├── 📂 fonts/               # 字體文件
│   │   │   └── 📄 sf-pro.woff2     # SF Pro 字體
│   │   └── 📂 images/              # 圖片資源
│   └── 📂 tests/                   # 測試文件
│       ├── 📂 unit/                # 單元測試
│       ├── 📂 integration/         # 整合測試
│       └── 📂 e2e/                 # 端到端測試
├── 📂 docs/                        # 項目文檔
│   ├── 📄 api.md                   # API 文檔
│   ├── 📄 components.md            # 組件使用文檔
│   ├── 📄 deployment.md            # 部署指南
│   └── 📄 contributing.md          # 貢獻指南
├── 📂 tools/                       # 開發工具
│   ├── 📄 build.js                 # 建構腳本
│   ├── 📄 dev-server.js            # 開發服務器
│   └── 📄 deploy.js                # 部署腳本
├── 📄 package.json                 # 依賴管理
├── 📄 .gitignore                   # Git 忽略文件
├── 📄 .eslintrc.js                 # ESLint 配置
├── 📄 .prettierrc                  # Prettier 配置
└── 📄 README.md                    # 項目說明
```

## 🧩 詳細組件拆解

### 1. 核心佈局組件

#### 1.1 AppWindow 組件
**功能描述**: 主應用程式窗口，提供 macOS 原生窗口體驗
**技術規格**:
```javascript
class AppWindow extends Component {
  constructor() {
    super();
    this.state = {
      isFullscreen: false,
      isMinimized: false,
      windowTitle: 'LLM English Learning'
    };
  }

  render() {
    return `
      <div class="macos-window">
        <div class="macos-titlebar">
          <div class="traffic-lights">
            <button class="traffic-light close" data-action="close"></button>
            <button class="traffic-light minimize" data-action="minimize"></button>
            <button class="traffic-light maximize" data-action="maximize"></button>
          </div>
          <div class="window-title">${this.state.windowTitle}</div>
        </div>
        <div class="window-content">
          <!-- 內容區域 -->
        </div>
      </div>
    `;
  }
}
```

**CSS 規格**:
```css
.macos-window {
  background: rgba(40, 40, 42, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.macos-titlebar {
  height: 44px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 0 16px;
  -webkit-app-region: drag; /* 支援窗口拖拽 */
}

.traffic-lights {
  display: flex;
  gap: 8px;
}

.traffic-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.traffic-light.close { background: #ff5f57; }
.traffic-light.minimize { background: #ffbd2e; }
.traffic-light.maximize { background: #28ca42; }

.traffic-light:hover {
  opacity: 0.8;
}
```

#### 1.2 Toolbar 組件
**功能描述**: 頂部導覽工具欄，支援標籤頁切換
**互動規格**:
- 點擊標籤頁切換視圖
- Hover 效果突顯可點擊區域
- 支援鍵盤導覽 (Tab/Enter)

```javascript
class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'dashboard',
      tabs: [
        { id: 'dashboard', label: '儀表板', icon: '📊' },
        { id: 'quiz', label: '測驗', icon: '📝' },
        { id: 'history', label: '歷史', icon: '📈' },
        { id: 'settings', label: '設定', icon: '⚙️' }
      ]
    };
  }

  handleTabClick(tabId) {
    this.setState({ activeTab: tabId });
    this.emit('tab-change', { tabId });
  }

  render() {
    return `
      <div class="macos-toolbar">
        ${this.state.tabs.map(tab => `
          <button 
            class="toolbar-tab ${tab.id === this.state.activeTab ? 'active' : ''}"
            data-tab="${tab.id}"
            aria-selected="${tab.id === this.state.activeTab}"
          >
            <span class="tab-icon">${tab.icon}</span>
            <span class="tab-label">${tab.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }
}
```

#### 1.3 Sidebar 組件
**功能描述**: 左側導覽欄，包含導覽和問題類型選擇
**特殊功能**:
- 可摺疊/展開
- 問題類型過濾
- 搜尋功能

```javascript
class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      isCollapsed: false,
      activeSection: 'navigation',
      questionTypes: [
        { id: '1.1.1', name: '詞彙選擇', category: 'vocabulary' },
        { id: '1.1.2', name: '近義詞選擇', category: 'vocabulary' },
        { id: '1.2.1', name: '語法改錯', category: 'grammar' },
        // ... 其他21種題型
      ],
      filteredTypes: []
    };
  }

  filterQuestionTypes(searchTerm) {
    const filtered = this.state.questionTypes.filter(type => 
      type.name.includes(searchTerm) || type.id.includes(searchTerm)
    );
    this.setState({ filteredTypes: filtered });
  }
}
```

### 2. 測驗系統組件

#### 2.1 QuestionRenderer 組件
**功能描述**: 統一的問題渲染器，支援24種題型
**設計模式**: 策略模式 + 工廠模式

```javascript
class QuestionRenderer extends Component {
  constructor() {
    super();
    this.renderers = new Map([
      ['1.1.1', MultipleChoiceRenderer],
      ['1.1.2', SingleChoiceRenderer],
      ['2.1.1', WritingTaskRenderer],
      ['2.7.1', TranslationRenderer],
      // ... 其他題型渲染器
    ]);
  }

  render(question) {
    const RendererClass = this.renderers.get(question.type);
    if (!RendererClass) {
      throw new Error(`不支援的題型: ${question.type}`);
    }
    
    const renderer = new RendererClass(question);
    return renderer.render();
  }
}
```

#### 2.2 各題型詳細組件

##### 2.2.1 多選題組件 (1.1.1, 1.1.2, 1.2.2 等)
```javascript
class MultipleChoiceRenderer extends Component {
  constructor(question) {
    super();
    this.question = question;
    this.state = {
      selectedOptions: [],
      isAnswered: false
    };
  }

  handleOptionSelect(optionId) {
    const { selectedOptions } = this.state;
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    this.setState({ selectedOptions: newSelection });
  }

  render() {
    return `
      <div class="question-container multiple-choice">
        <div class="question-text">
          ${this.question.text}
        </div>
        <div class="options-container">
          ${this.question.options.map(option => `
            <label class="option-item ${this.state.selectedOptions.includes(option.id) ? 'selected' : ''}">
              <input type="checkbox" value="${option.id}" />
              <span class="option-text">${option.text}</span>
              <span class="checkmark"></span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
}
```

##### 2.2.2 寫作題組件 (2.1.1, 2.1.2, 2.3.1 等)
```javascript
class WritingTaskRenderer extends Component {
  constructor(question) {
    super();
    this.question = question;
    this.state = {
      content: '',
      wordCount: 0,
      autoSaveTimer: null
    };
  }

  handleContentChange(content) {
    this.setState({ 
      content,
      wordCount: this.countWords(content)
    });
    
    // 自動保存草稿
    this.scheduleAutoSave();
  }

  scheduleAutoSave() {
    if (this.state.autoSaveTimer) {
      clearTimeout(this.state.autoSaveTimer);
    }
    
    this.state.autoSaveTimer = setTimeout(() => {
      this.saveDraft();
    }, 2000);
  }

  render() {
    return `
      <div class="question-container writing-task">
        <div class="question-text">
          ${this.question.text}
        </div>
        <div class="writing-area">
          <textarea 
            class="writing-input"
            placeholder="請在此輸入您的答案..."
            maxlength="${this.question.maxLength || 1000}"
          ></textarea>
          <div class="writing-stats">
            <span class="word-count">${this.state.wordCount} 字</span>
            <span class="char-limit">最多 ${this.question.maxLength || 1000} 字</span>
          </div>
        </div>
        <div class="writing-tools">
          <button class="tool-btn" data-action="bold">粗體</button>
          <button class="tool-btn" data-action="italic">斜體</button>
          <button class="tool-btn" data-action="save-draft">保存草稿</button>
        </div>
      </div>
    `;
  }
}
```

##### 2.2.3 翻譯題組件 (2.7.1, 2.7.2, 2.8.1, 2.8.2)
```javascript
class TranslationRenderer extends Component {
  constructor(question) {
    super();
    this.question = question;
    this.state = {
      translation: '',
      showReference: false,
      suggestions: []
    };
  }

  async getSuggestions(text) {
    // 呼叫 API 獲取翻譯建議
    const response = await this.apiService.getTranslationSuggestions(text);
    this.setState({ suggestions: response.suggestions });
  }

  render() {
    return `
      <div class="question-container translation-task">
        <div class="translation-layout">
          <div class="source-text">
            <h3>原文</h3>
            <div class="text-content">
              ${this.question.sourceText}
            </div>
            <button class="toggle-reference" ${this.state.showReference ? 'active' : ''}>
              ${this.state.showReference ? '隱藏' : '顯示'}參考
            </button>
          </div>
          <div class="translation-input">
            <h3>翻譯</h3>
            <textarea 
              class="translation-textarea"
              placeholder="請輸入翻譯..."
            ></textarea>
            ${this.state.suggestions.length > 0 ? `
              <div class="suggestions">
                <h4>建議詞彙</h4>
                ${this.state.suggestions.map(s => `
                  <span class="suggestion-item">${s}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
```

### 3. 資料服務層

#### 3.1 QuizService 詳細設計
```javascript
class QuizService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.currentQuiz = null;
    this.questionHistory = [];
  }

  /**
   * 開始新的測驗會話
   * @param {Object} config - 測驗配置
   * @returns {Promise<Object>} 測驗會話信息
   */
  async startQuiz(config) {
    try {
      const response = await this.apiClient.post('/api/start-test', {
        questionTypes: config.questionTypes,
        difficulty: config.difficulty,
        questionCount: config.questionCount
      });

      this.currentQuiz = {
        sessionId: response.sessionId,
        questions: response.questions,
        currentIndex: 0,
        startTime: Date.now(),
        answers: []
      };

      return this.currentQuiz;
    } catch (error) {
      throw new Error(`開始測驗失敗: ${error.message}`);
    }
  }

  /**
   * 提交答案
   * @param {Object} answer - 用戶答案
   * @returns {Promise<Object>} 答案提交結果
   */
  async submitAnswer(answer) {
    if (!this.currentQuiz) {
      throw new Error('沒有進行中的測驗');
    }

    const answerData = {
      sessionId: this.currentQuiz.sessionId,
      questionId: this.getCurrentQuestion().id,
      answer: answer,
      responseTime: Date.now() - this.answerStartTime
    };

    try {
      const response = await this.apiClient.post('/api/submit-answer', answerData);
      
      // 更新本地狀態
      this.currentQuiz.answers.push({
        ...answerData,
        isCorrect: response.isCorrect,
        feedback: response.feedback
      });

      return response;
    } catch (error) {
      throw new Error(`提交答案失敗: ${error.message}`);
    }
  }

  /**
   * 獲取當前問題
   * @returns {Object} 當前問題對象
   */
  getCurrentQuestion() {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuiz.currentIndex];
  }

  /**
   * 移動到下一題
   * @returns {Object|null} 下一題或 null (如果已結束)
   */
  nextQuestion() {
    if (!this.currentQuiz) return null;
    
    this.currentQuiz.currentIndex++;
    this.answerStartTime = Date.now();
    
    if (this.currentQuiz.currentIndex >= this.currentQuiz.questions.length) {
      return null; // 測驗結束
    }
    
    return this.getCurrentQuestion();
  }

  /**
   * 獲取測驗進度
   * @returns {Object} 進度信息
   */
  getProgress() {
    if (!this.currentQuiz) return { current: 0, total: 0, percentage: 0 };
    
    return {
      current: this.currentQuiz.currentIndex + 1,
      total: this.currentQuiz.questions.length,
      percentage: Math.round(((this.currentQuiz.currentIndex + 1) / this.currentQuiz.questions.length) * 100)
    };
  }
}
```

## 📊 詳細開發階段

### Phase 1: 核心基礎建設 (第1-2週)

#### 🎯 階段目標
建立完整的開發基礎設施，包括專案結構、設計系統、核心組件和開發工具鏈。

#### 📋 具體任務清單

**1.1 專案初始化 (2-3天)**
- [ ] **建立專案目錄結構**
  - 建立完整的文件夾層次結構
  - 設定 `.gitignore` 和基本 Git 配置
  - 建立 `package.json` 和依賴管理

- [ ] **開發環境配置**
  - 設定 Live Server 用於開發時熱重載
  - 配置 ESLint (Airbnb 標準) 和 Prettier
  - 設定 VS Code 工作區配置和推薦擴展

- [ ] **建立建構工具鏈**
  ```javascript
  // build.js - 簡單的建構腳本
  const fs = require('fs');
  const path = require('path');
  const CleanCSS = require('clean-css');
  
  class Builder {
    constructor() {
      this.srcDir = path.join(__dirname, 'src');
      this.distDir = path.join(__dirname, 'dist');
    }
    
    async build() {
      await this.createDistDir();
      await this.processHTML();
      await this.processCSS();
      await this.processJS();
      await this.copyAssets();
    }
  }
  ```

**1.2 設計系統實作 (3-4天)**
- [ ] **CSS 變數系統定義**
  ```css
  /* variables.css */
  :root {
    /* macOS 系統色彩 */
    --system-blue: #0a84ff;
    --system-green: #30d158;
    --system-red: #ff453a;
    --system-orange: #ff9f0a;
    --system-yellow: #ffd60a;
    --system-purple: #bf5af2;
    --system-pink: #ff375f;
    --system-indigo: #5856d6;
    --system-teal: #40e0d0;
    
    /* 深色模式背景層次 */
    --bg-primary: #1e1e1e;
    --bg-secondary: rgba(28, 28, 30, 0.8);
    --bg-tertiary: rgba(40, 40, 42, 0.9);
    --bg-quaternary: rgba(58, 58, 60, 0.8);
    
    /* 文字色彩層次 */
    --text-primary: rgba(255, 255, 255, 0.95);
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-tertiary: rgba(255, 255, 255, 0.5);
    --text-quaternary: rgba(255, 255, 255, 0.3);
    
    /* 邊框和分隔線 */
    --border-primary: rgba(255, 255, 255, 0.1);
    --border-secondary: rgba(255, 255, 255, 0.05);
    
    /* 毛玻璃效果 */
    --backdrop-blur: blur(20px);
    --backdrop-blur-strong: blur(30px);
    
    /* 陰影系統 */
    --shadow-small: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.15);
    --shadow-large: 0 16px 48px rgba(0, 0, 0, 0.2);
    --shadow-focus: 0 0 0 3px rgba(10, 132, 255, 0.3);
    
    /* 間距系統 */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    
    /* 字體大小 */
    --font-size-xs: 10px;
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-lg: 16px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;
    
    /* 動畫時間 */
    --duration-fast: 0.15s;
    --duration-normal: 0.3s;
    --duration-slow: 0.6s;
    
    /* 緩動函數 */
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
    --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  }
  ```

- [ ] **基礎重置樣式**
  ```css
  /* reset.css */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 14px;
    line-height: 1.47;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
  }
  ```

#### 🎯 交付成果
- 完整的專案基礎架構
- 可運行的開發環境
- 基礎組件樣式庫
- 核心系統架構 (狀態管理、路由、組件基類)

### Phase 2: 頁面架構與導覽 (第3-5週)

#### 🎯 階段目標
實作完整的頁面架構，包括四個主要頁面和導覽系統，建立用戶界面的基本框架。

### Phase 3: API 整合與服務層 (第6-8週)

#### 🎯 階段目標
建立完整的資料服務層，整合後端 API，實現前後端資料流通。

### Phase 4: 測驗功能完整實作 (第9-12週)

#### 🎯 階段目標
完整實作所有24種題型的渲染器和互動邏輯，確保每種題型都有優秀的用戶體驗。

### Phase 5: 使用者體驗優化 (第13-15週)

#### 🎯 階段目標
優化使用者體驗，增加進階功能和視覺效果。

### Phase 6: 效能優化與部署 (第16週)

#### 🎯 階段目標
最終的效能優化和部署準備。

## 🧪 測試策略

### 單元測試
```javascript
// 範例：StateManager 測試
describe('StateManager', () => {
  let stateManager;
  
  beforeEach(() => {
    stateManager = new StateManager({ count: 0 });
  });
  
  test('應該正確設定初始狀態', () => {
    expect(stateManager.getState()).toEqual({ count: 0 });
  });
  
  test('應該正確更新狀態', () => {
    stateManager.setState({ count: 1 });
    expect(stateManager.getState()).toEqual({ count: 1 });
  });
  
  test('應該通知訂閱者', () => {
    const callback = jest.fn();
    stateManager.subscribe(callback);
    stateManager.setState({ count: 1 });
    expect(callback).toHaveBeenCalledWith({ count: 1 });
  });
});
```

## 📈 預期成果

### 技術指標
- **載入速度**: 首次載入 < 2秒
- **互動響應**: < 100ms
- **記憶體使用**: < 100MB
- **包體積**: < 2MB (壓縮後)

### 功能指標
- **題型支援**: 100% (24種題型)
- **瀏覽器相容性**: Chrome 80+, Safari 13+, Firefox 75+
- **無障礙評分**: WCAG 2.1 AA
- **行動端適配**: 100%

### 用戶體驗指標
- **Core Web Vitals**: 全綠
- **使用者滿意度**: > 4.5/5
- **任務完成率**: > 95%

---

這個詳細的開發計劃涵蓋了從基礎架構到最終部署的完整流程，每個階段都有明確的目標、具體的任務和預期的交付成果。整個計劃預估需要16週完成，可根據實際情況調整時程。 