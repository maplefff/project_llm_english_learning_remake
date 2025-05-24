# 前端開發階段 5：使用者體驗優化

**對應 `devFrontEnd.md` Phase 5 使用者體驗優化**

## 目標

本階段的核心目標是優化使用者體驗，增加進階功能和視覺效果。實現流暢的動畫系統、進階互動功能、個人化設定、學習分析儀表板、離線功能支援，以及無障礙功能的全面優化，確保應用程式提供卓越的用戶體驗。

## 主要產出物

* 完整的動畫系統和過渡效果
* 個人化學習儀表板和統計分析
* 進階設定系統和偏好管理
* 離線功能和資料同步機制
* 通知系統和使用者反饋機制
* 無障礙功能完整實作
* 效能優化和載入體驗改善
* 多語言支援和國際化
* 主題系統和視覺客製化
* 進階互動功能和手勢支援

## 詳細步驟

### Phase5.1 動畫系統和視覺效果
1. **動畫引擎 (`AnimationEngine.js`)**:
   * 實現 CSS 動畫和 JavaScript 動畫的統一管理
   * 支援動畫序列和平行動畫執行
   * 實現動畫暫停、恢復、取消功能
   * 包含效能監控和 FPS 最佳化
   * 實現動畫預設和自定義動畫

2. **頁面轉場效果**:
   * 實現頁面間的平滑轉場動畫
   * 支援滑動、淡入淡出、縮放等效果
   * 實現轉場過程中的載入狀態顯示
   * 包含轉場動畫的可訪問性優化

3. **微互動動畫**:
   * 實現按鈕點擊、hover 效果動畫
   * 支援表單驗證的動畫反饋
   * 實現進度指示器的動畫效果
   * 包含測驗互動的動畫回饋

### Phase5.2 個人化學習儀表板
1. **Dashboard 增強 (`EnhancedDashboard.js`)**:
   * 實現可客製化的儀表板配置
   * 支援拖拽重新排列卡片組件
   * 實現即時統計和動態更新
   * 包含學習目標設定和追蹤功能
   * 實現學習建議和智慧提醒

2. **統計圖表系統 (`ChartComponents.js`)**:
   * 實現多種圖表類型 (線圖、柱狀圖、圓餅圖、雷達圖)
   * 支援即時資料更新和動畫效果
   * 實現圖表互動和詳細資訊顯示
   * 包含圖表匯出和分享功能
   * 實現響應式圖表佈局

3. **學習分析功能**:
   * 實現學習模式分析和可視化
   * 支援弱點識別和改進建議
   * 實現學習軌跡追蹤和預測
   * 包含比較分析和排名功能

### Phase5.3 進階設定和偏好系統
1. **SettingsManager 增強 (`AdvancedSettings.js`)**:
   * 實現分類設定和搜尋功能
   * 支援設定的即時預覽和套用
   * 實現設定同步和雲端備份
   * 包含設定匯入/匯出功能
   * 實現設定變更歷史和復原

2. **主題系統 (`ThemeManager.js`)**:
   * 實現深色/淺色模式自動切換
   * 支援自定義主題色彩和字體
   * 實現主題即時預覽和套用
   * 包含主題分享和匯入功能
   * 實現系統主題跟隨功能

3. **個人化偏好**:
   * 實現學習偏好和難度調整
   * 支援題型偏好和頻率設定
   * 實現介面佈局和功能客製化
   * 包含快捷鍵和手勢設定

### Phase5.4 離線功能和資料同步
1. **ServiceWorker 實作 (`sw.js`)**:
   * 實現應用程式離線快取策略
   * 支援靜態資源和動態資料快取
   * 實現背景同步和更新檢查
   * 包含快取管理和清理機制
   * 實現漸進式 Web 應用程式 (PWA) 功能

2. **離線資料管理 (`OfflineManager.js`)**:
   * 實現離線模式下的測驗功能
   * 支援離線答案暫存和同步
   * 實現衝突解決和資料合併
   * 包含離線狀態指示和使用者提示
   * 實現資料壓縮和最佳化存儲

3. **資料同步機制**:
   * 實現增量同步和衝突解決
   * 支援多裝置間的資料同步
   * 實現同步進度顯示和錯誤處理
   * 包含網路狀態檢測和自動重連

### Phase5.5 通知和反饋系統
1. **NotificationManager (`NotificationManager.js`)**:
   * 實現應用程式內通知系統
   * 支援瀏覽器原生通知 API
   * 實現通知的分類和優先級管理
   * 包含通知歷史和已讀狀態
   * 實現通知設定和靜音功能

2. **Toast 和 Alert 系統 (`ToastSystem.js`)**:
   * 實現多層級通知訊息顯示
   * 支援成功、警告、錯誤、資訊類型
   * 實現自動消失和手動關閉功能
   * 包含通知動畫和位置設定
   * 實現通知佇列和批量處理

3. **使用者反饋收集**:
   * 實現使用體驗評分和意見收集
   * 支援錯誤報告和改進建議
   * 實現反饋分類和處理追蹤
   * 包含用戶滿意度調查功能

### Phase5.6 無障礙功能完整實作
1. **AccessibilityManager (`A11yManager.js`)**:
   * 實現螢幕閱讀器完整支援
   * 支援高對比度和大字體模式
   * 實現鍵盤導覽和 focus 管理
   * 包含語音合成和聽覺回饋
   * 實現動畫減少和動作敏感性設定

2. **鍵盤操作增強**:
   * 實現全局快捷鍵和熱鍵支援
   * 支援 Tab 順序和 focus trap
   * 實現鍵盤快捷鍵提示和幫助
   * 包含自定義快捷鍵設定

3. **ARIA 和語義化增強**:
   * 實現完整的 ARIA 標籤和屬性
   * 支援語義化 HTML 結構優化
   * 實現螢幕閱讀器專用內容
   * 包含無障礙測試和驗證工具

### Phase5.7 效能優化和載入體驗
1. **LazyLoading 系統 (`LazyLoader.js`)**:
   * 實現組件和路由的懶載入
   * 支援圖片和資源的延遲載入
   * 實現預載入和智慧快取策略
   * 包含載入狀態和骨架屏顯示

2. **載入體驗優化**:
   * 實現應用程式啟動畫面
   * 支援漸進式載入和分片載入
   * 實現載入進度指示和預估時間
   * 包含載入錯誤處理和重試機制

3. **記憶體管理**:
   * 實現組件生命週期最佳化
   * 支援大型資料集的虛擬化渲染
   * 實現記憶體洩漏檢測和預防
   * 包含垃圾回收和快取清理

## 核心代碼實作規格

### 動畫引擎設計
```javascript
class AnimationEngine {
  constructor() {
    this.animations = new Map();
    this.timelines = new Map();
    this.isEnabled = true;
    this.globalSpeed = 1;
    this.performance = {
      fps: 60,
      frameTime: 16.67,
      dropped: 0
    };
  }

  // 創建動畫實例
  animate(element, keyframes, options = {}) {
    const animationId = this.generateId();
    const animation = {
      id: animationId,
      element,
      keyframes,
      options: {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
        ...options
      },
      startTime: null,
      pausedTime: 0,
      state: 'ready'
    };

    // 檢查是否支援 CSS 動畫
    if (this.supportsCSSAnimation(keyframes)) {
      return this.createCSSAnimation(animation);
    } else {
      return this.createJSAnimation(animation);
    }
  }

  // CSS 動畫實作
  createCSSAnimation(animation) {
    const { element, keyframes, options } = animation;
    
    // 生成 CSS 關鍵幀
    const keyframeName = `anim-${animation.id}`;
    const keyframeCSS = this.generateKeyframeCSS(keyframeName, keyframes);
    
    // 插入樣式表
    this.insertKeyframe(keyframeCSS);
    
    // 套用動畫
    element.style.animation = `${keyframeName} ${options.duration}ms ${options.easing} ${options.fill}`;
    
    // 監聽動畫事件
    const promise = new Promise((resolve, reject) => {
      const onEnd = () => {
        this.cleanup(animation);
        resolve(animation);
      };
      
      const onError = () => {
        this.cleanup(animation);
        reject(new Error('Animation failed'));
      };
      
      element.addEventListener('animationend', onEnd, { once: true });
      element.addEventListener('animationcancel', onError, { once: true });
    });

    animation.state = 'running';
    animation.cleanup = () => {
      element.style.animation = '';
      this.removeKeyframe(keyframeName);
    };

    this.animations.set(animation.id, animation);
    return { ...animation, promise };
  }

  // JavaScript 動畫實作
  createJSAnimation(animation) {
    const { element, keyframes, options } = animation;
    let startTime = null;
    let rafId = null;

    const animate = (currentTime) => {
      if (!startTime) {
        startTime = currentTime;
        animation.startTime = startTime;
      }

      const elapsed = currentTime - startTime - animation.pausedTime;
      const progress = Math.min(elapsed / options.duration, 1);
      const easedProgress = this.applyEasing(progress, options.easing);

      // 應用關鍵幀
      this.applyKeyframe(element, keyframes, easedProgress);

      if (progress < 1 && animation.state === 'running') {
        rafId = requestAnimationFrame(animate);
      } else {
        animation.state = 'finished';
        this.cleanup(animation);
        animation.resolve(animation);
      }
    };

    const promise = new Promise((resolve, reject) => {
      animation.resolve = resolve;
      animation.reject = reject;
    });

    animation.state = 'running';
    animation.rafId = rafId;
    animation.cleanup = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };

    this.animations.set(animation.id, animation);
    rafId = requestAnimationFrame(animate);

    return { ...animation, promise };
  }

  // 動畫控制方法
  pause(animationId) {
    const animation = this.animations.get(animationId);
    if (animation && animation.state === 'running') {
      animation.state = 'paused';
      animation.pauseTime = performance.now();
    }
  }

  resume(animationId) {
    const animation = this.animations.get(animationId);
    if (animation && animation.state === 'paused') {
      animation.state = 'running';
      animation.pausedTime += performance.now() - animation.pauseTime;
    }
  }

  cancel(animationId) {
    const animation = this.animations.get(animationId);
    if (animation) {
      animation.state = 'cancelled';
      animation.cleanup();
      this.animations.delete(animationId);
    }
  }

  // 緩動函數
  applyEasing(progress, easing) {
    const easingFunctions = {
      'linear': t => t,
      'ease-in': t => t * t,
      'ease-out': t => 1 - (1 - t) * (1 - t),
      'ease-in-out': t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
      'ease-back': t => 2.70158 * t * t * t - 1.70158 * t * t
    };

    return easingFunctions[easing] ? easingFunctions[easing](progress) : progress;
  }

  // 動畫序列
  createTimeline(animations) {
    const timelineId = this.generateId();
    const timeline = {
      id: timelineId,
      animations: [],
      state: 'ready'
    };

    let totalDuration = 0;
    animations.forEach((animConfig, index) => {
      const delay = animConfig.delay || 0;
      const duration = animConfig.duration || 300;
      
      timeline.animations.push({
        ...animConfig,
        startTime: totalDuration + delay,
        endTime: totalDuration + delay + duration
      });

      totalDuration = Math.max(totalDuration, totalDuration + delay + duration);
    });

    timeline.totalDuration = totalDuration;
    this.timelines.set(timelineId, timeline);
    
    return timeline;
  }

  // 播放動畫序列
  async playTimeline(timelineId) {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) return;

    timeline.state = 'running';
    const startTime = performance.now();

    const animationPromises = timeline.animations.map(animConfig => {
      return new Promise(resolve => {
        setTimeout(() => {
          const animation = this.animate(
            animConfig.element,
            animConfig.keyframes,
            animConfig.options
          );
          animation.promise.then(resolve);
        }, animConfig.startTime);
      });
    });

    try {
      await Promise.all(animationPromises);
      timeline.state = 'finished';
    } catch (error) {
      timeline.state = 'error';
      throw error;
    }
  }
}
```

### 個人化儀表板實作
```javascript
class EnhancedDashboard extends Component {
  constructor() {
    super();
    this.state = {
      widgets: [],
      layout: 'grid',
      isEditing: false,
      statistics: null,
      preferences: null
    };
    this.widgetRegistry = new Map();
    this.registerDefaultWidgets();
  }

  registerDefaultWidgets() {
    this.widgetRegistry.set('learning-progress', LearningProgressWidget);
    this.widgetRegistry.set('recent-activities', RecentActivitiesWidget);
    this.widgetRegistry.set('performance-chart', PerformanceChartWidget);
    this.widgetRegistry.set('study-goals', StudyGoalsWidget);
    this.widgetRegistry.set('quick-actions', QuickActionsWidget);
    this.widgetRegistry.set('achievements', AchievementsWidget);
  }

  async loadUserDashboard() {
    try {
      // 載入使用者偏好設定
      const preferences = await this.settingsService.getDashboardPreferences();
      
      // 載入統計資料
      const statistics = await this.analyticsService.getUserStatistics();
      
      // 創建 widgets
      const widgets = preferences.widgets.map(widgetConfig => {
        const WidgetClass = this.widgetRegistry.get(widgetConfig.type);
        if (!WidgetClass) return null;
        
        return new WidgetClass({
          ...widgetConfig,
          statistics: statistics[widgetConfig.type],
          position: widgetConfig.position,
          size: widgetConfig.size
        });
      }).filter(Boolean);

      this.setState({ 
        widgets, 
        preferences, 
        statistics,
        layout: preferences.layout || 'grid'
      });

      this.render();
    } catch (error) {
      console.error('[DEBUG EnhancedDashboard.js] 載入儀表板失敗:', error);
      this.showError('載入儀表板失敗，請重試');
    }
  }

  enableEditMode() {
    this.setState({ isEditing: true });
    this.setupDragAndDrop();
    this.showEditToolbar();
  }

  disableEditMode() {
    this.setState({ isEditing: false });
    this.cleanupDragAndDrop();
    this.hideEditToolbar();
    this.saveDashboardLayout();
  }

  setupDragAndDrop() {
    const container = this.element.querySelector('.widgets-container');
    let draggedElement = null;

    container.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('widget')) {
        draggedElement = e.target;
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      const afterElement = this.getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggedElement);
      } else {
        container.insertBefore(draggedElement, afterElement);
      }
    });

    container.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('widget')) {
        e.target.style.opacity = '';
        this.updateWidgetPositions();
      }
    });
  }

  async saveDashboardLayout() {
    const widgets = Array.from(this.element.querySelectorAll('.widget')).map((widget, index) => {
      const widgetId = widget.dataset.widgetId;
      const widgetInstance = this.state.widgets.find(w => w.id === widgetId);
      
      return {
        ...widgetInstance.config,
        position: index,
        size: widget.dataset.size || 'medium'
      };
    });

    try {
      await this.settingsService.saveDashboardPreferences({
        widgets,
        layout: this.state.layout
      });
      
      this.showToast('儀表板佈局已保存', 'success');
    } catch (error) {
      console.error('[DEBUG EnhancedDashboard.js] 保存佈局失敗:', error);
      this.showToast('保存失敗，請重試', 'error');
    }
  }

  render() {
    return `
      <div class="enhanced-dashboard">
        <div class="dashboard-header">
          <h1>學習儀表板</h1>
          <div class="dashboard-controls">
            <button class="btn btn-secondary" data-action="edit-layout">
              ${this.state.isEditing ? '完成編輯' : '編輯佈局'}
            </button>
            <button class="btn btn-secondary" data-action="add-widget">
              新增組件
            </button>
            <div class="layout-selector">
              <select data-action="change-layout">
                <option value="grid" ${this.state.layout === 'grid' ? 'selected' : ''}>網格佈局</option>
                <option value="masonry" ${this.state.layout === 'masonry' ? 'selected' : ''}>瀑布流</option>
                <option value="list" ${this.state.layout === 'list' ? 'selected' : ''}>列表佈局</option>
              </select>
            </div>
          </div>
        </div>

        <div class="widgets-container ${this.state.layout}-layout ${this.state.isEditing ? 'editing' : ''}">
          ${this.state.widgets.map(widget => widget.render()).join('')}
        </div>

        ${this.state.isEditing ? this.renderEditToolbar() : ''}
      </div>
    `;
  }

  renderEditToolbar() {
    return `
      <div class="edit-toolbar">
        <div class="available-widgets">
          <h3>可用組件</h3>
          ${Array.from(this.widgetRegistry.keys()).map(type => `
            <div class="widget-option" data-widget-type="${type}" draggable="true">
              ${this.getWidgetDisplayName(type)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
```

## 驗收標準

* 所有動畫效果流暢且效能良好 (60 FPS)
* 個人化儀表板功能完整且響應迅速
* 離線功能在網路中斷時正常運作
* 通知系統正確顯示各種類型的訊息
* 無障礙功能通過 WCAG 2.1 AA 標準
* 載入體驗優化明顯提升使用者滿意度
* 多語言支援功能正常運作
* 主題系統可以正確切換和自定義
* 所有進階功能的單元測試全部通過
* 效能指標達到預期目標 (載入時間 < 2秒)
* 所有程式碼已提交到版本控制系統 (Git) 