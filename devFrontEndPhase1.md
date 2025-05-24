# 前端開發階段 1：核心基礎建設

**對應 `devFrontEnd.md` Phase 1 核心基礎建設**

## 目標

本階段的核心目標是建立完整的前端開發基礎架構，實作 macOS 風格設計系統，以及核心的狀態管理、路由和組件系統。所有核心功能模組都必須包含對應的單元測試，確保系統穩定性和可維護性。

## 主要產出物

* 一個可運行的原生 JavaScript + HTML5 + CSS3 前端專案骨架
* 完整的 macOS 風格設計系統 (CSS 變數、字體、動畫系統)
* `StateManager.js` 狀態管理器及其單元測試
* `Router.js` SPA 路由器及其單元測試  
* `Component.js` 組件基類及其單元測試
* 配置好的開發與測試環境 (ESLint, Prettier, Jest 等)
* 建構工具鏈 (build.js, dev server)
* 更新後的 `package.json`，包含必要的依賴和腳本

## 詳細步驟

### Phase1.1 專案初始化與環境配置
1. **專案目錄結構建立**:
   * 在 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/frontend/` 目錄下建立標準化目錄結構
   * 建立 `src/{styles,scripts,assets,tests}` 等主要目錄
   * 在 `src/styles/` 下建立 `components/`, `layout/`, `utilities/` 子目錄
   * 在 `src/scripts/` 下建立 `core/`, `services/`, `components/`, `utils/`, `config/` 子目錄

2. **依賴管理與工具配置**:
   * 初始化 `package.json` 並安裝開發依賴 (live-server, eslint, prettier, jest, clean-css, terser)
   * 配置 ESLint (Airbnb JavaScript Style Guide) 和 Prettier 代碼格式化
   * 設定 VS Code 工作區配置和推薦擴展
   * 建立 `.gitignore` 檔案

3. **開發服務器設定**:
   * 配置 live-server 用於開發時熱重載
   * 在 `package.json` 的 `scripts` 中加入開發、建構、測試、lint 命令

### Phase1.2 macOS 設計系統實作
1. **CSS 變數系統 (`variables.css`)**:
   * 定義 macOS 系統色彩 (--system-blue, --system-green 等)
   * 定義深色模式背景層次 (--bg-primary 到 --bg-quaternary)
   * 定義文字色彩層次和透明度系統
   * 定義間距系統 (8pt grid)、字體大小、動畫時間等

2. **基礎樣式系統**:
   * `reset.css`: Modern CSS Reset，統一瀏覽器預設樣式
   * `typography.css`: SF Pro 字體系統和文字樣式類別
   * `animations.css`: macOS 風格動畫效果庫 (macosScale, fadeIn 等)

3. **工具類和佈局系統**:
   * `utilities/`: 色彩、間距、可見性工具類
   * `layout/`: CSS Grid 和 Flexbox 佈局系統

### Phase1.3 核心系統架構實作
1. **狀態管理器 (`StateManager.js`)**:
   * 實現輕量級響應式狀態管理
   * 支援函數式狀態更新和中間件
   * 包含訂閱/取消訂閱機制
   * 開發模式下支援時間旅行除錯
   * 實現狀態變更日誌記錄

2. **SPA 路由器 (`Router.js`)**:
   * 支援動態路由參數 (:id) 和查詢字符串解析
   * 實現路由守衛 (beforeEach, afterEach, beforeEnter)
   * 支援瀏覽器前進後退歷史管理
   * 包含錯誤處理和路由匹配邏輯

3. **組件基類 (`Component.js`)**:
   * 提供完整的組件生命週期管理 (mount, unmount, update, destroy)
   * 實現事件綁定和狀態訂閱機制
   * 支援子組件管理和 DOM 操作工具
   * 包含記憶體清理和錯誤處理

### Phase1.4 建構工具和測試環境
1. **建構腳本 (`build.js`)**:
   * 實現 CSS 和 JavaScript 檔案合併和壓縮
   * 支援依賴順序載入和資源複製
   * 生成建構清單 (manifest.json) 和檔案雜湊
   * 實現開發和生產環境的資源處理

2. **Jest 測試環境**:
   * 配置 `jest.config.js` 支援 ES6+ 和 jsdom 環境
   * 設定測試輔助函數和模擬 API (localStorage, fetch, matchMedia)
   * 建立測試設定檔案 (`tests/setup.js`)

3. **單元測試實作**:
   * `StateManager.test.js`: 狀態管理的所有核心功能測試
   * `Router.test.js`: 路由匹配、導覽、守衛功能測試
   * `Component.test.js`: 組件生命週期和事件處理測試

## 驗收標準

* 前端專案可以在開發環境中正常運行 (`npm run dev`)
* 所有核心模組 (StateManager, Router, Component) 的單元測試全部通過
* 設計系統的 CSS 變數和樣式類別可正常使用
* ESLint 和 Prettier 可以成功對程式碼進行檢查和格式化
* 建構腳本可以成功生成生產版本 (`npm run build`)
* 代碼覆蓋率達到 80% 以上
* 在 Chrome、Safari、Firefox 最新版本中正常運行
* 所有程式碼已提交到版本控制系統 (Git) 