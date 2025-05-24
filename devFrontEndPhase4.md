# 前端開發階段 4：測驗功能完整實作

**對應 `devFrontEnd.md` Phase 4 測驗功能完整實作**

## 目標

本階段的核心目標是完整實作所有24種題型的渲染器和互動邏輯，確保每種題型都有優秀的用戶體驗。建立統一的問題渲染器系統、答案收集器、結果顯示組件，以及完整的測驗流程管理，實現從開始測驗到查看結果的完整用戶體驗。

## 主要產出物

* `QuestionRenderer.js` 統一問題渲染器及其單元測試
* `AnswerCollector.js` 答案收集器及其單元測試
* `QuizTimer.js` 測驗計時器及其單元測試
* `ResultDisplay.js` 結果顯示組件及其單元測試
* 24種題型渲染器組件 (question-types/ 目錄下)
* 完整的測驗流程控制邏輯
* 題型相關樣式系統 (quiz/ 目錄下的 CSS 檔案)
* 測驗資料驗證和格式化工具
* 無障礙功能和鍵盤操作支援
* 響應式設計和行動裝置適配

## 詳細步驟

### Phase4.1 統一渲染系統
1. **QuestionRenderer 核心架構 (`QuestionRenderer.js`)**:
   * 實現策略模式和工廠模式的問題渲染器
   * 支援24種題型的動態載入和渲染
   * 實現題型渲染器的註冊和管理機制
   * 包含題型驗證和錯誤處理功能
   * 實現渲染快取和效能優化

2. **AnswerCollector 系統 (`AnswerCollector.js`)**:
   * 實現統一的答案收集和驗證機制
   * 支援不同題型的答案格式標準化
   * 實現答案實時驗證和錯誤提示
   * 包含答案草稿自動保存功能
   * 實現答案提交前的最終檢查

3. **測驗狀態管理**:
   * 實現測驗進度追蹤和狀態同步
   * 支援題目間的導覽和跳轉
   * 實現測驗暫停和恢復功能
   * 包含測驗資料的本地備份機制

### Phase4.2 基礎題型組件 (選擇題系列)
1. **MultipleChoice 組件 (`MultipleChoice.js`)**:
   * 實現多選題渲染和互動邏輯 (題型 1.1.1, 1.1.2, 1.2.2, 1.3.2)
   * 支援選項的多選和取消選擇
   * 實現選項排序和隨機化功能
   * 包含選項 hover 效果和點擊動畫
   * 實現鍵盤操作和無障礙支援

2. **SingleChoice 組件 (`SingleChoice.js`)**:
   * 實現單選題渲染和互動邏輯 (題型 1.1.3, 1.2.1, 1.3.1)
   * 支援單選按鈕和點擊切換
   * 實現選項狀態管理和視覺反饋
   * 包含選項描述和提示功能
   * 實現答案確認和變更提醒

3. **TrueFalse 組件 (`TrueFalse.js`)**:
   * 實現是非題渲染和互動邏輯 (題型 1.2.3, 1.3.3)
   * 支援 True/False 切換和狀態顯示
   * 實現選項的視覺強化和反饋
   * 包含解釋文字和詳細說明功能

### Phase4.3 填空和排序題型
1. **FillInBlanks 組件 (`FillInBlanks.js`)**:
   * 實現填空題渲染和輸入管理 (題型 1.4.1, 1.4.2, 1.4.3)
   * 支援單個和多個填空欄位
   * 實現輸入驗證和格式檢查
   * 包含自動完成和輸入建議功能
   * 實現填空欄位的動態調整

2. **DragAndDrop 組件 (`DragAndDrop.js`)**:
   * 實現拖拽排序題渲染和互動 (題型 1.5.1, 1.5.2, 1.5.3)
   * 支援拖拽元素的視覺反饋和動畫
   * 實現拖拽區域的高亮和提示
   * 包含觸控裝置的拖拽支援
   * 實現拖拽操作的撤銷和重做

3. **MatchingPairs 組件 (`MatchingPairs.js`)**:
   * 實現配對題渲染和連線邏輯 (題型 1.6.1, 1.6.2, 1.6.3)
   * 支援元素配對和連線動畫
   * 實現配對狀態的視覺化顯示
   * 包含配對錯誤的提示和修正功能

### Phase4.4 寫作和翻譯題型
1. **WritingTask 組件 (`WritingTask.js`)**:
   * 實現寫作題渲染和編輯器 (題型 2.1.1, 2.1.2, 2.3.1, 2.3.2)
   * 支援富文本編輯和格式化功能
   * 實現字數統計和限制提醒
   * 包含寫作輔助工具 (拼字檢查、語法建議)
   * 實現自動保存和版本控制

2. **TranslationTask 組件 (`TranslationTask.js`)**:
   * 實現翻譯題渲染和雙語對照 (題型 2.7.1, 2.7.2, 2.8.1, 2.8.2)
   * 支援原文和譯文的並排顯示
   * 實現翻譯輔助工具和字典查詢
   * 包含翻譯建議和參考資料顯示
   * 實現翻譯品質即時評估

3. **SentenceCorrection 組件 (`SentenceCorrection.js`)**:
   * 實現句子改錯題渲染和編輯 (題型 2.2.1, 2.2.2, 2.4.1, 2.4.2)
   * 支援錯誤標註和修正建議
   * 實現語法錯誤的高亮顯示
   * 包含修正歷史和比較功能

### Phase4.5 閱讀理解和高級題型
1. **ReadingComprehension 組件 (`ReadingComprehension.js`)**:
   * 實現閱讀理解題渲染和管理 (題型 2.5.1, 2.5.2, 2.6.1, 2.6.2)
   * 支援文章和問題的分區顯示
   * 實現文章標註和重點標記功能
   * 包含閱讀進度追蹤和時間管理
   * 實現多題組合和子題目管理

2. **ListeningComprehension 組件 (`ListeningComprehension.js`)**:
   * 實現聽力理解題渲染和播放控制 (題型 2.9.1, 2.9.2)
   * 支援音頻播放和進度控制
   * 實現播放次數限制和時間管理
   * 包含音頻可視化和字幕顯示
   * 實現音量控制和播放速度調整

3. **SpeakingTask 組件 (`SpeakingTask.js`)**:
   * 實現口說題渲染和錄音功能 (題型 2.10.1, 2.10.2)
   * 支援語音錄製和播放功能
   * 實現錄音品質檢測和噪音過濾
   * 包含錄音時間限制和視覺提示
   * 實現語音檔案的壓縮和上傳

### Phase4.6 測驗計時和結果顯示
1. **QuizTimer 組件 (`QuizTimer.js`)**:
   * 實現測驗計時器和時間管理
   * 支援整體計時和單題計時
   * 實現時間警告和自動提交功能
   * 包含暫停和恢復計時功能
   * 實現計時器的視覺化顯示

2. **ResultDisplay 組件 (`ResultDisplay.js`)**:
   * 實現測驗結果的綜合顯示
   * 支援分數統計和正確率計算
   * 實現錯題回顧和解析功能
   * 包含結果匯出和分享功能
   * 實現學習建議和改進方向提示

3. **ProgressIndicator 組件 (`ProgressIndicator.js`)**:
   * 實現測驗進度的即時顯示
   * 支援題目完成狀態的視覺化
   * 實現進度動畫和過渡效果
   * 包含剩餘題目和時間估算

## 核心代碼實作規格

### QuestionRenderer 系統設計
```javascript
class QuestionRenderer extends Component {
  constructor() {
    super();
    this.renderers = new Map();
    this.cache = new Map();
    this.registerDefaultRenderers();
  }

  registerDefaultRenderers() {
    // 選擇題系列
    this.renderers.set('1.1.1', MultipleChoiceRenderer);
    this.renderers.set('1.1.2', MultipleChoiceRenderer);
    this.renderers.set('1.1.3', SingleChoiceRenderer);
    this.renderers.set('1.2.1', SingleChoiceRenderer);
    this.renderers.set('1.2.2', MultipleChoiceRenderer);
    this.renderers.set('1.2.3', TrueFalseRenderer);
    
    // 填空和排序題
    this.renderers.set('1.4.1', FillInBlanksRenderer);
    this.renderers.set('1.4.2', FillInBlanksRenderer);
    this.renderers.set('1.4.3', FillInBlanksRenderer);
    this.renderers.set('1.5.1', DragAndDropRenderer);
    this.renderers.set('1.5.2', DragAndDropRenderer);
    this.renderers.set('1.5.3', DragAndDropRenderer);
    
    // 寫作和翻譯題
    this.renderers.set('2.1.1', WritingTaskRenderer);
    this.renderers.set('2.1.2', WritingTaskRenderer);
    this.renderers.set('2.7.1', TranslationTaskRenderer);
    this.renderers.set('2.7.2', TranslationTaskRenderer);
    this.renderers.set('2.8.1', TranslationTaskRenderer);
    this.renderers.set('2.8.2', TranslationTaskRenderer);
    
    // 閱讀理解題
    this.renderers.set('2.5.1', ReadingComprehensionRenderer);
    this.renderers.set('2.5.2', ReadingComprehensionRenderer);
    this.renderers.set('2.6.1', ReadingComprehensionRenderer);
    this.renderers.set('2.6.2', ReadingComprehensionRenderer);
    
    // 聽力和口說題
    this.renderers.set('2.9.1', ListeningComprehensionRenderer);
    this.renderers.set('2.9.2', ListeningComprehensionRenderer);
    this.renderers.set('2.10.1', SpeakingTaskRenderer);
    this.renderers.set('2.10.2', SpeakingTaskRenderer);
  }

  async renderQuestion(question) {
    // 檢查快取
    const cacheKey = `${question.type}-${question.id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 獲取渲染器類別
    const RendererClass = this.renderers.get(question.type);
    if (!RendererClass) {
      throw new Error(`不支援的題型: ${question.type}`);
    }

    try {
      // 創建渲染器實例
      const renderer = new RendererClass(question);
      
      // 渲染問題
      const renderedHTML = await renderer.render();
      
      // 快取結果
      this.cache.set(cacheKey, renderedHTML);
      
      return renderedHTML;
    } catch (error) {
      console.error(`[DEBUG QuestionRenderer.js] 渲染題型 ${question.type} 失敗:`, error);
      throw new QuestionRenderError(`渲染失敗: ${error.message}`, question.type);
    }
  }

  registerRenderer(questionType, rendererClass) {
    this.renderers.set(questionType, rendererClass);
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### 多選題渲染器實作
```javascript
class MultipleChoiceRenderer extends Component {
  constructor(question) {
    super();
    this.question = question;
    this.state = {
      selectedOptions: [],
      isSubmitted: false,
      showFeedback: false
    };
    this.setupEventListeners();
  }

  handleOptionSelect(optionId) {
    const { selectedOptions } = this.state;
    const isSelected = selectedOptions.includes(optionId);
    
    let newSelection;
    if (this.question.maxSelections === 1) {
      // 單選模式
      newSelection = [optionId];
    } else {
      // 多選模式
      if (isSelected) {
        newSelection = selectedOptions.filter(id => id !== optionId);
      } else {
        if (selectedOptions.length < this.question.maxSelections) {
          newSelection = [...selectedOptions, optionId];
        } else {
          // 達到最大選擇數量，顯示提示
          this.showMaxSelectionWarning();
          return;
        }
      }
    }
    
    this.setState({ selectedOptions: newSelection });
    this.emit('answer-changed', { 
      questionId: this.question.id,
      answer: newSelection 
    });
  }

  validateAnswer() {
    const { selectedOptions } = this.state;
    const { minSelections = 1, maxSelections } = this.question;
    
    if (selectedOptions.length < minSelections) {
      return {
        isValid: false,
        message: `請至少選擇 ${minSelections} 個選項`
      };
    }
    
    if (selectedOptions.length > maxSelections) {
      return {
        isValid: false,
        message: `最多只能選擇 ${maxSelections} 個選項`
      };
    }
    
    return { isValid: true };
  }

  render() {
    const { question, state } = this;
    
    return `
      <div class="question-container multiple-choice" data-question-id="${question.id}">
        <div class="question-header">
          <h3 class="question-title">${question.title || '選擇題'}</h3>
          <div class="question-meta">
            <span class="question-type">題型: ${question.type}</span>
            <span class="selection-info">
              ${question.maxSelections === 1 ? '單選' : `多選 (最多${question.maxSelections}個)`}
            </span>
          </div>
        </div>
        
        <div class="question-text">
          ${question.text}
        </div>
        
        ${question.context ? `
          <div class="question-context">
            <h4>上下文:</h4>
            <div class="context-content">${question.context}</div>
          </div>
        ` : ''}
        
        <div class="options-container" role="group" aria-labelledby="question-title">
          ${question.options.map((option, index) => `
            <label class="option-item ${state.selectedOptions.includes(option.id) ? 'selected' : ''} ${state.isSubmitted ? 'submitted' : ''}"
                   data-option-id="${option.id}">
              <input type="${question.maxSelections === 1 ? 'radio' : 'checkbox'}" 
                     name="question-${question.id}"
                     value="${option.id}"
                     ${state.selectedOptions.includes(option.id) ? 'checked' : ''}
                     ${state.isSubmitted ? 'disabled' : ''}
                     aria-describedby="option-${option.id}-text" />
              <span class="option-marker">${String.fromCharCode(65 + index)}</span>
              <span class="option-text" id="option-${option.id}-text">${option.text}</span>
              <span class="checkmark"></span>
              ${state.showFeedback && option.isCorrect ? '<span class="correct-indicator">✓</span>' : ''}
            </label>
          `).join('')}
        </div>
        
        ${state.showFeedback ? `
          <div class="question-feedback">
            <h4>解析:</h4>
            <div class="feedback-content">${question.explanation || '暫無解析'}</div>
          </div>
        ` : ''}
        
        <div class="question-actions">
          <button class="btn btn-secondary" data-action="clear">清除選擇</button>
          <button class="btn btn-primary" data-action="submit" ${this.validateAnswer().isValid ? '' : 'disabled'}>
            確認答案
          </button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.on('mount', () => {
      const container = this.element;
      
      // 選項點擊事件
      container.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' || e.target.type === 'radio') {
          const optionId = e.target.value;
          this.handleOptionSelect(optionId);
        }
      });
      
      // 按鈕點擊事件
      container.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'clear') {
          this.clearSelection();
        } else if (action === 'submit') {
          this.submitAnswer();
        }
      });
      
      // 鍵盤事件
      container.addEventListener('keydown', (e) => {
        this.handleKeydown(e);
      });
    });
  }

  handleKeydown(e) {
    // 實現鍵盤導覽和選擇
    const options = this.element.querySelectorAll('.option-item input');
    const currentIndex = Array.from(options).findIndex(option => 
      option === document.activeElement
    );
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        options[nextIndex].focus();
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        options[prevIndex].focus();
        break;
        
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (currentIndex >= 0) {
          options[currentIndex].click();
        }
        break;
    }
  }
}
```

## 驗收標準

* 所有24種題型可以正常渲染和顯示
* 每種題型的互動功能完全正常 (選擇、輸入、拖拽等)
* 答案收集和驗證機制準確可靠
* 測驗計時器和進度指示器正常運作
* 結果顯示和統計功能正確
* 所有組件的單元測試全部通過
* 無障礙功能 (鍵盤操作、螢幕閱讀器) 完全支援
* 響應式設計在各種裝置上正常顯示
* 測驗流程的用戶體驗流暢自然
* 錯誤處理和邊界情況處理完善
* 所有程式碼已提交到版本控制系統 (Git) 