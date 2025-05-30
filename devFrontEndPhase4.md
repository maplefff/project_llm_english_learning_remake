# 前端開發階段 4：頁面開發與題型實現

**對應 `devFrontEnd.md` Phase 4: 頁面開發與題型實現 (第5-8週)**

## 目標

本階段的核心目標是實現所有主要頁面組件和24種英語測驗題型的完整支援。包括建立儀表板、測驗選擇、測驗進行、歷史記錄和設定等主要頁面，以及實現從簡單選擇題到複雜寫作翻譯題的所有題型組件。重點在於建立統一的題型渲染系統、完善的答案驗證機制以及良好的用戶體驗。所有頁面和組件都需要響應式設計、完整的錯誤處理和無障礙功能支援。

## 主要產出物

*   5個主要頁面組件（Dashboard, QuizSelection, QuizSession, History, Settings）
*   24種題型組件的完整實現
*   統一的題型渲染和路由系統
*   答案驗證和提交系統
*   頁面間的導航和狀態管理
*   響應式設計和移動端適配
*   完整的頁面單元測試和 E2E 測試

## 詳細步驟

### Phase4.1 主要頁面開發 (第5週)

1.  **Dashboard.vue 儀表板頁面**:
    *   **頁面佈局設計**:
        *   歡迎區域（用戶頭像、問候語、今日學習狀況）
        *   快速開始區域（常用題型快捷按鈕）
        *   學習統計圖表區域（進度環形圖、正確率趨勢線圖）
        *   最近記錄區域（最近5次測驗的簡要信息）
        *   學習建議區域（基於歷史表現的個性化建議）
    *   **數據源整合**:
        *   從 `userStore` 獲取用戶基本信息
        *   從 `historyStore` 獲取統計數據和最近記錄
        *   從 `quizStore` 獲取可用題型列表
    *   **交互功能**:
        *   快捷開始按鈕直接跳轉到對應題型測驗
        *   圖表區域支援時間範圍切換（週、月、年）
        *   最近記錄點擊查看詳情
        *   學習建議的展開和收起
    *   **響應式適配**: 移動端採用垂直堆疊佈局，圖表自適應螢幕寬度

2.  **QuizSelection.vue 測驗選擇頁面**:
    *   **題型分類顯示**:
        *   1.x 系列選擇題（詞彙、語法、填空、排序）
        *   2.x 系列寫作題（摘要、作文、書信、報告、提案、評論、翻譯）
        *   每個分類顯示題型數量和描述
    *   **測驗配置功能**:
        *   題型選擇（單選或混合模式）
        *   難度等級設定（初級、中級、高級）
        *   題目數量選擇（5、10、15、20題）
        *   時間限制設定（不限時、30分鐘、60分鐘）
    *   **歷史數據顯示**:
        *   每個題型的歷史表現（正確率、平均時間）
        *   推薦題型標識（基於學習需求）
        *   最近練習時間顯示
    *   **開始測驗邏輯**:
        *   配置參數驗證
        *   與後端 API 的整合（startTest）
        *   錯誤處理和重試機制

3.  **QuizSession.vue 測驗進行頁面**:
    *   **頁面佈局結構**:
        *   頂部進度條和導航區域
        *   主要內容區域（題目顯示）
        *   底部控制區域（上一題、下一題、提交）
        *   側邊欄題目導航（可隱藏）
    *   **狀態管理整合**:
        *   與 `quizStore` 的完整整合
        *   測驗狀態的即時同步
        *   答案變更的自動保存
        *   網路斷線時的本地狀態保持
    *   **題目渲染系統**:
        *   使用 `QuestionRenderer` 組件
        *   動態載入對應的題型組件
        *   答案狀態的視覺反饋
        *   錯誤處理和降級顯示
    *   **測驗控制功能**:
        *   暫停/恢復測驗
        *   保存並退出
        *   強制提交（時間到）
        *   答題確認對話框

4.  **History.vue 歷史記錄頁面**:
    *   **記錄列表顯示**:
        *   表格形式顯示歷史記錄
        *   分頁和虛擬滾動支援
        *   排序功能（時間、分數、題型）
        *   篩選功能（日期範圍、題型、分數範圍）
    *   **統計分析功能**:
        *   整體統計卡片（總測驗次數、平均分數、最佳表現）
        *   趨勢圖表（時間vs分數、題型表現對比）
        *   強弱項分析（錯誤率最高的題型和知識點）
    *   **記錄管理功能**:
        *   單個記錄的詳細查看
        *   批量刪除功能
        *   數據導出功能（CSV、PDF）
        *   收藏重要記錄
    *   **數據可視化**:
        *   使用 ECharts 或 Chart.js 實現圖表
        *   響應式圖表設計
        *   互動式數據探索

5.  **Settings.vue 設定頁面**:
    *   **個人資料設定**:
        *   基本信息編輯（姓名、頭像、簡介）
        *   學習目標設定
        *   通知偏好設定
    *   **應用程式設定**:
        *   主題切換（淺色/深色模式）
        *   語言選擇（繁體中文、簡體中文、英文）
        *   字體大小調整
        *   動畫效果開關
    *   **測驗設定**:
        *   預設測驗配置
        *   自動保存頻率
        *   提醒設定
    *   **數據管理**:
        *   數據備份和恢復
        *   清除緩存
        *   重置所有設定
        *   帳號註銷

### Phase4.2 選擇題系列題型組件 (第5週後半+第6週前半)

1.  **1.1.x 詞彙類題型組件**:
    *   **MultipleChoice.vue (1.1.1 詞義選擇)**:
        *   題目結構：包含上下文句子、目標詞彙高亮、四個選項
        *   交互邏輯：單選模式、選中狀態視覺反饋、答案確認
        *   答案驗證：即時反饋、正確答案顯示、解釋說明
    *   **SynonymChoice.vue (1.1.2 近義詞選擇)**:
        *   功能擴展：支援多個近義詞選項、語境適用性說明
        *   視覺設計：詞彙關係的視覺化表示
        *   學習輔助：相關詞彙的擴展顯示

2.  **1.2.x 語法類題型組件**:
    *   **GrammarCorrection.vue (1.2.1 語法改錯)**:
        *   錯誤標示：句子中錯誤部分的高亮標記
        *   選項顯示：修正選項的對比顯示
        *   語法解釋：錯誤類型和修正原因的詳細說明
    *   **GrammarChoice.vue (1.2.2 語法選擇)**:
        *   空格填入：句子中空格的明顯標示
        *   語法規則：相關語法點的提示和連結

3.  **1.3.x 填空類題型組件**:
    *   **FillInBlanks.vue (1.3.1 克漏字填空)**:
        *   多空格支援：一個段落中多個空格的管理
        *   上下文提示：周圍文字的語境提示
        *   答案格式：大小寫不敏感、拼寫檢查
    *   **VocabularyFill.vue (1.3.2 詞彙填空)**:
        *   詞彙提示：詞性提示、首字母提示
        *   詞形變化：動詞時態、名詞複數等變化的處理

4.  **1.4.x 排序類題型組件**:
    *   **SentenceOrdering.vue (1.4.1 句子排序)**:
        *   拖拽功能：使用 Vue Draggable 實現排序
        *   視覺反饋：拖拽過程中的視覺指示
        *   答案檢查：序列正確性的即時驗證
    *   **ParagraphOrdering.vue (1.4.2 段落排序)**:
        *   複雜排序：多個段落的邏輯排序
        *   內容預覽：段落內容的摘要顯示
        *   邏輯提示：段落間邏輯關係的提示

### Phase4.3 寫作題系列題型組件 (第6週後半+第7週)

1.  **2.1.x 摘要寫作組件**:
    *   **SummaryWriting.vue (2.1.1, 2.1.2)**:
        *   原文顯示：可滾動的原文區域、重點段落標記
        *   寫作區域：富文本編輯器、字數統計、格式工具
        *   寫作輔助：大綱模板、關鍵詞提示、結構指導
        *   實時保存：自動草稿保存、版本歷史
        *   字數控制：最少/最多字數限制、超出警告

2.  **2.2.x 作文寫作組件**:
    *   **EssayWriting.vue (2.2.1, 2.2.2)**:
        *   題目顯示：作文題目和要求的清晰展示
        *   結構輔助：論文結構指導、段落模板
        *   寫作工具：格式化選項、插入圖表、參考資料
        *   進度追蹤：寫作進度條、預估完成時間
        *   品質提示：語法檢查、拼寫檢查、可讀性分析

3.  **2.3.x-2.6.x 應用寫作組件**:
    *   **LetterWriting.vue (2.3.1, 2.3.2 書信寫作)**:
        *   書信格式：標準書信格式模板、收件人/寄件人信息
        *   語調選擇：正式/非正式語調的切換
        *   常用短語：書信常用開頭/結尾短語庫
    *   **ReportWriting.vue (2.4.1, 2.4.2 報告寫作)**:
        *   報告結構：標題、摘要、正文、結論的分段編輯
        *   數據支援：圖表插入、數據表格、統計分析
        *   格式規範：報告格式的自動檢查和調整
    *   **ProposalWriting.vue (2.5.1, 2.5.2 提案寫作)**:
        *   提案框架：問題陳述、解決方案、實施計劃
        *   邏輯檢查：提案邏輯性和完整性檢查
        *   成本分析：預算表格和成本效益分析工具
    *   **ReviewWriting.vue (2.6.1, 2.6.2 評論寫作)**:
        *   評論對象：書籍、電影、產品等不同評論類型
        *   評分系統：星級評分、多維度評價
        *   觀點平衡：正面/負面觀點的平衡檢查

### Phase4.4 翻譯題系列組件 (第7週後半)

1.  **2.7.x-2.8.x 翻譯題型組件**:
    *   **TranslationCE.vue (2.7.1, 2.7.2 中翻英)**:
        *   雙語對照：中文原文和英文翻譯的並排顯示
        *   分句翻譯：長句子的分句處理和逐句翻譯
        *   詞彙提示：重點詞彙的翻譯建議和詞典查詢
        *   語法檢查：英文語法的自動檢查和修正建議
    *   **TranslationEC.vue (2.8.1, 2.8.2 英翻中)**:
        *   語境理解：英文語境的分析和解釋
        *   中文表達：地道中文表達的建議和範例
        *   文化轉換：文化差異的說明和轉換建議
        *   風格統一：翻譯風格的一致性檢查

### Phase4.5 題型渲染系統和答案驗證 (第8週)

1.  **題型註冊和路由系統**:
    *   **題型工廠模式**:
        *   題型組件的動態註冊機制
        *   題型ID與組件的映射表
        *   組件的懶載入和錯誤處理
        *   未知題型的降級顯示
    *   **動態組件載入**:
        *   基於題型ID的組件解析
        *   組件載入失敗的重試機制
        *   載入狀態的視覺指示
        *   組件快取和性能優化

2.  **統一答案驗證系統**:
    *   **驗證介面設計**:
        *   所有題型的統一驗證介面
        *   同步和異步驗證的支援
        *   驗證結果的標準化格式
        *   錯誤訊息的國際化
    *   **答案格式處理**:
        *   不同題型答案格式的標準化
        *   答案序列化和反序列化
        *   答案完整性檢查
        *   特殊字符和格式的處理
    *   **即時反饋系統**:
        *   答案變更的即時驗證
        *   視覺反饋的統一樣式
        *   錯誤提示的友好顯示
        *   正確答案的適時揭示

3.  **答案提交和結果處理**:
    *   **提交邏輯**:
        *   答案的批量提交處理
        *   網路異常時的重試機制
        *   提交狀態的追蹤和顯示
        *   離線答案的本地存儲
    *   **結果展示**:
        *   即時結果的顯示邏輯
        *   詳細解釋的展開和收起
        *   相關知識點的鏈接
        *   學習建議的個性化生成

## 頁面交互設計

### 頁面導航流程
*   **Dashboard → QuizSelection**: 題型選擇的快捷路徑和詳細配置
*   **QuizSelection → QuizSession**: 測驗配置確認和會話初始化
*   **QuizSession → History**: 測驗完成後的自動跳轉和結果保存
*   **任意頁面 → Settings**: 全局設定的訪問和即時生效

### 狀態保持機制
*   **跨頁面狀態**: 使用 Pinia 維護全局狀態
*   **本地存儲**: 重要數據的本地持久化
*   **會話恢復**: 頁面刷新後的狀態恢復
*   **錯誤恢復**: 異常中斷後的數據恢復

### 響應式設計原則
*   **移動優先**: 從移動端開始設計，逐步增強
*   **觸控友好**: 按鈕大小和間距的觸控優化
*   **內容優先**: 確保核心內容在小螢幕上的可讀性
*   **性能考量**: 移動端的載入速度和流量優化

## 驗收標準

*   所有5個主要頁面功能完整，用戶流程順暢
*   24種題型組件全部實現，支援對應的交互邏輯
*   題型渲染系統運作正常，能正確載入和顯示各種題型
*   答案驗證和提交機制穩定可靠，錯誤處理完善
*   頁面間導航流暢，狀態管理正確
*   響應式設計在不同設備上表現良好
*   所有組件和頁面的單元測試通過率達到 80% 以上
*   關鍵用戶流程的 E2E 測試全部通過
*   無障礙功能支援完整，符合 WCAG 標準
*   性能指標符合要求，載入速度和響應時間在可接受範圍
*   程式碼品質良好，符合 ESLint 規範和專案標準
*   用戶體驗測試反饋良好，界面友好易用 