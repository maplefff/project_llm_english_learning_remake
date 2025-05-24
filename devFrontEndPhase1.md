# 前端開發階段 1：專案基礎建設與開發環境

**對應 `devFrontEnd.md` Phase 1: 專案基礎建設 (第1週)**

## 目標

本階段的核心目標是建立完整的 Vue 3 + Vite + TypeScript 開發環境和基礎架構，包括專案初始化、開發工具配置、基礎路由系統、狀態管理框架、UI 組件庫整合以及測試環境設定。所有配置都必須能支援後續的組件開發和 API 整合，確保開發環境的穩定性和高效性。

## 主要產出物

*   一個可運行的 Vue 3 + Vite + TypeScript 前端專案架構
*   完整配置的開發環境（ESLint、Prettier、Vite 配置）
*   基礎路由系統（Vue Router 4）
*   狀態管理框架（Pinia）
*   UI 組件庫整合（Element Plus）
*   測試環境配置（Vitest + Vue Test Utils）
*   專案目錄結構與開發規範

## 詳細步驟

### Phase1.1 專案初始化與核心依賴安裝 (1-2天)

1.  **Vite + Vue 3 專案建立**:
    *   在 `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/frontend/` 目錄下建立 Vite + Vue 3 專案
    *   選擇 TypeScript 模板，確保完整的類型支援
    *   驗證專案能正常啟動並顯示預設頁面

2.  **核心依賴安裝**:
    *   **路由管理**: Vue Router 4 - 支援 Vue 3 的現代化路由系統
    *   **狀態管理**: Pinia - Vue 3 官方推薦的狀態管理庫
    *   **UI 組件庫**: Element Plus - 企業級 Vue 3 組件庫
    *   **HTTP 客戶端**: Axios - 用於與後端 API 通訊
    *   **工具函數庫**: @vueuse/core - Vue 3 的組合式工具函數集

3.  **開發工具依賴**:
    *   **自動導入**: unplugin-auto-import, unplugin-vue-components - 自動導入 Vue 和組件
    *   **類型檢查**: @types/node - Node.js 類型定義
    *   **樣式處理**: sass - SCSS 預處理器支援

### Phase1.2 開發環境配置 (2-3天)

1.  **Vite 配置（vite.config.ts）**:
    *   **路徑別名配置**: 設定 `@` 指向 `src`，`@components` 指向 `src/components` 等常用別名
    *   **開發服務器配置**: 設定 port 3005，配置 proxy 代理到後端 API (localhost:3001)
    *   **建構優化**: 配置程式碼分割，將 vendor（vue, vue-router, pinia）和 ui（element-plus）分離
    *   **插件整合**: Vue 插件、自動導入插件配置

2.  **TypeScript 配置（tsconfig.json）**:
    *   **編譯選項**: 設定嚴格模式、目標版本、模組系統
    *   **路徑映射**: 配置與 Vite 一致的路徑別名
    *   **類型檢查**: 啟用嚴格的類型檢查選項

3.  **程式碼品質工具配置**:
    *   **ESLint 配置（.eslintrc.cjs）**: 
        *   整合 TypeScript、Vue 3 規則
        *   配置 import 規則和 Vue 專用規則
        *   設定全局變數和環境
    *   **Prettier 配置（.prettierrc）**: 
        *   統一程式碼格式化規則
        *   整合 Vue SFC 格式化
    *   **Git hooks 配置**: 使用 husky + lint-staged 確保提交程式碼品質

4.  **環境變數配置**:
    *   **開發環境（.env.development）**: API base URL, debug 模式等
    *   **生產環境（.env.production）**: 生產環境特定配置
    *   **類型定義**: 為環境變數建立 TypeScript 類型定義

### Phase1.3 基礎架構搭建 (2-3天)

1.  **專案目錄結構建立**:
    *   **組件目錄**: `src/components/` 下建立 `common/`, `quiz/`, `history/` 子目錄
    *   **頁面目錄**: `src/views/` 用於放置頁面級組件
    *   **狀態管理**: `src/stores/` 用於 Pinia stores
    *   **服務層**: `src/services/` 用於 API 服務
    *   **工具函數**: `src/utils/`, `src/composables/`, `src/types/` 等
    *   **樣式系統**: `src/styles/` 包含 SCSS 變數、混入等

2.  **Vue Router 4 配置**:
    *   **路由定義（router/index.ts）**: 
        *   `/` - Dashboard 儀表板
        *   `/quiz/:questionType?` - 測驗選擇和進行
        *   `/history` - 歷史記錄
        *   `/settings` - 設定頁面
    *   **路由守衛（router/guards.ts）**: 
        *   導航前置守衛：檢查路由參數有效性
        *   導航後置守衛：頁面標題更新、載入狀態管理
    *   **懶載入配置**: 所有頁面組件使用動態導入實現懶載入

3.  **Pinia 狀態管理配置**:
    *   **Store 註冊（stores/index.ts）**: 統一註冊所有 stores
    *   **基礎 Store 結構設計**:
        *   `app.ts` - 全局應用狀態（載入狀態、錯誤狀態、通知等）
        *   `quiz.ts` - 測驗相關狀態（當前會話、題目、答案等）
        *   `history.ts` - 歷史記錄狀態
        *   `user.ts` - 用戶設定和偏好
    *   **Store 間通訊機制**: 定義 stores 之間的依賴和通訊方式

4.  **Element Plus 整合**:
    *   **自動導入配置**: 配置 unplugin-vue-components 自動導入 Element Plus 組件
    *   **主題配置**: 設定符合專案設計的主題色彩
    *   **全局樣式**: 建立覆蓋 Element Plus 預設樣式的 SCSS 文件
    *   **圖標系統**: 配置 Element Plus Icons 自動導入

### Phase1.4 開發與測試環境設定 (1天)

1.  **VS Code 工作區配置**:
    *   **推薦擴展列表（.vscode/extensions.json）**: 
        *   Vue、TypeScript、ESLint、Prettier 等必要擴展
    *   **工作區設定（.vscode/settings.json）**: 
        *   自動格式化、路徑智能提示、調試配置
    *   **調試配置（.vscode/launch.json）**: 
        *   瀏覽器調試、Node.js 調試設定

2.  **Vitest 測試環境配置**:
    *   **Vitest 配置（vitest.config.ts）**: 
        *   與 Vite 配置整合
        *   測試環境配置（jsdom）
        *   覆蓋率報告配置
    *   **Vue Test Utils 配置**: 
        *   全局插件註冊（Router、Pinia 等）
        *   測試工具函數設定
    *   **測試腳本**: 配置 package.json 中的測試相關腳本

3.  **Git 配置**:
    *   **`.gitignore` 設定**: 
        *   忽略 node_modules、dist、env 文件等
        *   包含編輯器和系統相關忽略項目
    *   **提交規範**: 
        *   Conventional Commits 格式
        *   提交訊息模板設定

4.  **Package.json 腳本配置**:
    *   **開發腳本**: `dev` - 啟動開發服務器
    *   **建構腳本**: `build` - 生產環境建構
    *   **測試腳本**: `test`, `test:coverage` - 測試執行
    *   **程式碼品質**: `lint`, `lint:fix`, `type-check` - 程式碼檢查

## 組件架構設計

### 應用程式入口（main.ts）
*   **初始化邏輯**: Vue 應用實例建立、插件註冊順序
*   **全局配置**: 錯誤處理、效能監控、全局屬性設定
*   **插件註冊**: Router、Pinia、Element Plus 的正確註冊方式

### 根組件（App.vue）
*   **佈局結構**: 提供整個應用的基礎佈局容器
*   **全局狀態**: 與 Pinia 連接，管理全局載入狀態
*   **路由容器**: RouterView 的配置和過渡動畫
*   **錯誤邊界**: 全局錯誤捕獲和友好的錯誤頁面顯示

### 基礎類型定義（types/index.ts）
*   **API 回應類型**: 統一的 API 回應格式定義
*   **路由參數類型**: 各路由的參數類型定義
*   **狀態類型**: Pinia stores 的狀態類型
*   **組件 Props 類型**: 可復用的組件屬性類型

## 驗收標準

*   前端專案可以成功啟動，瀏覽器能正常訪問 `http://localhost:3005`
*   所有依賴安裝成功，無安裝錯誤或版本衝突
*   ESLint 和 Prettier 能正常執行，無程式碼風格錯誤
*   TypeScript 類型檢查通過，無類型錯誤
*   Vitest 測試環境配置完成，能執行基礎測試
*   Vue Router 路由系統正常工作，能在不同頁面間導航
*   Pinia 狀態管理正常運作，能在組件間共享狀態
*   Element Plus 組件能正常顯示和使用
*   熱重載功能正常，修改程式碼時能即時更新
*   所有配置文件已建立並提交到版本控制系統 