# 前端開發階段 6：效能優化與部署

**對應 `devFrontEnd.md` Phase 6 效能優化與部署**

## 目標

本階段的核心目標是進行最終的效能優化和部署準備。包括程式碼分割和懶載入優化、建構流程優化、部署自動化、監控和分析系統建立、安全性強化，以及生產環境的完整配置，確保應用程式能夠穩定、高效地在生產環境中運行。

## 主要產出物

* 完整的建構和部署流程
* 程式碼分割和懶載入優化
* 生產環境配置和環境管理
* 監控和錯誤追蹤系統
* 安全性強化和資料保護
* SEO 優化和 Meta 標籤管理
* CDN 配置和資源優化
* 效能測試和基準建立
* 部署文檔和維護指南
* 生產環境監控儀表板

## 詳細步驟

### Phase6.1 建構流程優化
1. **進階建構系統 (`build-advanced.js`)**:
   * 實現多環境建構配置 (開發、測試、生產)
   * 支援程式碼分割和 Tree Shaking
   * 實現資源壓縮和最佳化
   * 包含建構快取和增量建構
   * 實現建構效能分析和報告

2. **資源優化工具鏈**:
   * 實現 CSS 和 JavaScript 壓縮
   * 支援圖片最佳化和 WebP 轉換
   * 實現字體子集化和預載入
   * 包含 Critical CSS 提取和內聯
   * 實現資源指紋和快取破壞

3. **程式碼分割策略**:
   * 實現路由級別的程式碼分割
   * 支援組件級別的懶載入
   * 實現第三方庫的分離打包
   * 包含公共代碼的提取和快取
   * 實現動態導入和預載入策略

### Phase6.2 效能監控和分析
1. **效能監控系統 (`PerformanceMonitor.js`)**:
   * 實現 Core Web Vitals 監控
   * 支援用戶行為和互動分析
   * 實現 API 響應時間監控
   * 包含記憶體使用和 FPS 追蹤
   * 實現效能警報和通知機制

2. **錯誤追蹤和日誌系統**:
   * 實現全域錯誤捕獲和報告
   * 支援 Source Map 和錯誤還原
   * 實現用戶會話和操作重現
   * 包含錯誤分類和優先級設定
   * 實現錯誤趨勢分析和預警

3. **分析和報告工具**:
   * 實現用戶使用情況統計
   * 支援 A/B 測試和特性開關
   * 實現轉換率和目標追蹤
   * 包含效能基準和比較分析

### Phase6.3 安全性和隱私保護
1. **安全性強化 (`SecurityManager.js`)**:
   * 實現 Content Security Policy (CSP)
   * 支援 HTTPS 強制和 HSTS
   * 實現 XSS 和 CSRF 防護
   * 包含敏感資料加密和保護
   * 實現 API 金鑰和憑證管理

2. **隱私保護措施**:
   * 實現 GDPR 合規和 Cookie 同意
   * 支援資料匿名化和加密
   * 實現用戶資料匯出和刪除
   * 包含隱私政策和使用條款整合

3. **資料驗證和清理**:
   * 實現輸入驗證和過濾
   * 支援 SQL 注入和 XSS 防護
   * 實現資料完整性檢查
   * 包含敏感資訊的遮罩和保護

### Phase6.4 SEO 和 Meta 管理
1. **SEO 優化系統 (`SEOManager.js`)**:
   * 實現動態 Meta 標籤管理
   * 支援 Open Graph 和 Twitter Cards
   * 實現結構化資料和 Schema.org
   * 包含 Sitemap 生成和管理
   * 實現 robots.txt 和搜索引擎指令

2. **內容優化**:
   * 實現語義化 HTML 結構優化
   * 支援圖片 Alt 文字和描述
   * 實現內部連結和導覽優化
   * 包含頁面載入速度優化

3. **分析和追蹤**:
   * 實現 Google Analytics 4 整合
   * 支援 Google Search Console 整合
   * 實現轉換追蹤和目標設定
   * 包含 SEO 效能監控和報告

### Phase6.5 部署自動化和 CI/CD
1. **CI/CD 流程建立**:
   * 實現 GitHub Actions 或類似的 CI/CD 流程
   * 支援自動化測試和代碼品質檢查
   * 實現多環境部署管道
   * 包含自動化回滾和健康檢查
   * 實現部署通知和狀態報告

2. **環境管理系統**:
   * 實現開發、測試、生產環境配置
   * 支援環境變數和秘密管理
   * 實現配置驗證和環境健康檢查
   * 包含環境間的資料同步和遷移

3. **部署策略**:
   * 實現藍綠部署或滾動更新
   * 支援金絲雀發布和 A/B 測試
   * 實現自動縮放和負載均衡
   * 包含災難恢復和備份策略

### Phase6.6 生產環境優化
1. **CDN 和快取配置**:
   * 實現 CDN 資源分發和最佳化
   * 支援智慧快取策略和 TTL 管理
   * 實現邊緣運算和地理分發
   * 包含快取預熱和失效管理

2. **服務器配置優化**:
   * 實現 Gzip/Brotli 壓縮配置
   * 支援 HTTP/2 和 HTTP/3 優化
   * 實現負載均衡和故障轉移
   * 包含 SSL/TLS 配置和安全性設定

3. **監控和警報系統**:
   * 實現 24/7 系統監控
   * 支援即時警報和通知
   * 實現效能基準和異常檢測
   * 包含運維儀表板和報告系統

## 核心代碼實作規格

### 進階建構系統設計
```javascript
// build-advanced.js
class AdvancedBuilder {
  constructor(config) {
    this.config = {
      entry: './src/main.js',
      output: './dist',
      environment: 'production',
      splitChunks: true,
      treeshaking: true,
      compression: true,
      sourceMap: false,
      ...config
    };
    this.plugins = [];
    this.stats = {
      buildTime: 0,
      bundleSize: 0,
      chunks: [],
      assets: []
    };
  }

  async build() {
    console.log(`[BUILD] 開始建構 - 環境: ${this.config.environment}`);
    const startTime = Date.now();

    try {
      // 清理輸出目錄
      await this.clean();
      
      // 分析依賴圖譜
      const dependencyGraph = await this.analyzeDependencies();
      
      // 執行程式碼分割
      const chunks = this.config.splitChunks ? 
        await this.splitCode(dependencyGraph) : 
        [{ name: 'main', modules: dependencyGraph.modules }];
      
      // 處理每個 chunk
      const assets = [];
      for (const chunk of chunks) {
        const asset = await this.processChunk(chunk);
        assets.push(asset);
      }
      
      // 最佳化資源
      if (this.config.compression) {
        await this.optimizeAssets(assets);
      }
      
      // 生成資源清單
      await this.generateManifest(assets);
      
      // 生成 HTML
      await this.generateHTML(assets);
      
      // 複製靜態資源
      await this.copyStaticAssets();
      
      // 計算統計信息
      this.stats.buildTime = Date.now() - startTime;
      this.stats.bundleSize = this.calculateTotalSize(assets);
      this.stats.chunks = chunks;
      this.stats.assets = assets;
      
      console.log(`[BUILD] 建構完成 - 耗時: ${this.stats.buildTime}ms`);
      this.printBuildStats();
      
    } catch (error) {
      console.error('[BUILD] 建構失敗:', error);
      throw error;
    }
  }

  async splitCode(dependencyGraph) {
    const chunks = [];
    
    // 提取第三方庫
    const vendorModules = dependencyGraph.modules.filter(module => 
      module.path.includes('node_modules')
    );
    
    if (vendorModules.length > 0) {
      chunks.push({
        name: 'vendor',
        modules: vendorModules,
        type: 'vendor'
      });
    }
    
    // 提取公共模組
    const commonModules = this.findCommonModules(dependencyGraph);
    if (commonModules.length > 0) {
      chunks.push({
        name: 'common',
        modules: commonModules,
        type: 'common'
      });
    }
    
    // 路由級別分割
    const routeChunks = await this.createRouteChunks(dependencyGraph);
    chunks.push(...routeChunks);
    
    // 剩餘的主要模組
    const remainingModules = this.getRemainingModules(
      dependencyGraph, 
      [...vendorModules, ...commonModules, ...routeChunks.flatMap(c => c.modules)]
    );
    
    if (remainingModules.length > 0) {
      chunks.push({
        name: 'main',
        modules: remainingModules,
        type: 'main'
      });
    }
    
    return chunks;
  }

  async processChunk(chunk) {
    // 合併模組代碼
    let code = await this.bundleModules(chunk.modules);
    
    // Tree Shaking
    if (this.config.treeshaking) {
      code = await this.treeShake(code);
    }
    
    // 轉譯和優化
    code = await this.transform(code);
    
    // 壓縮
    if (this.config.environment === 'production') {
      code = await this.minify(code);
    }
    
    // 生成檔案
    const filename = this.generateFilename(chunk);
    const filepath = path.join(this.config.output, filename);
    
    await fs.writeFile(filepath, code);
    
    // 生成 Source Map
    if (this.config.sourceMap) {
      await this.generateSourceMap(chunk, code, filepath);
    }
    
    return {
      name: chunk.name,
      filename,
      filepath,
      size: Buffer.byteLength(code),
      type: chunk.type
    };
  }

  async optimizeAssets(assets) {
    for (const asset of assets) {
      // Gzip 壓縮
      await this.gzipCompress(asset);
      
      // Brotli 壓縮
      await this.brotliCompress(asset);
      
      // 計算檔案雜湊
      asset.hash = await this.calculateHash(asset.filepath);
      
      // 重命名為帶雜湊的檔名
      if (this.config.environment === 'production') {
        asset.hashedFilename = this.addHashToFilename(asset.filename, asset.hash);
        await this.renameFile(asset.filepath, asset.hashedFilename);
      }
    }
  }

  printBuildStats() {
    console.log('\n📊 建構統計:');
    console.log(`⏱️  建構時間: ${this.stats.buildTime}ms`);
    console.log(`📦 總包大小: ${this.formatSize(this.stats.bundleSize)}`);
    console.log(`🧩 Chunk 數量: ${this.stats.chunks.length}`);
    
    console.log('\n📋 Chunk 詳情:');
    this.stats.chunks.forEach(chunk => {
      const asset = this.stats.assets.find(a => a.name === chunk.name);
      console.log(`  ${chunk.name}: ${this.formatSize(asset.size)} (${chunk.modules.length} 模組)`);
    });
  }
}
```

### 效能監控系統實作
```javascript
class PerformanceMonitor {
  constructor() {
    this.observers = new Map();
    this.metrics = {
      webVitals: {},
      customMetrics: {},
      userInteractions: [],
      apiPerformance: {}
    };
    this.reportEndpoint = '/api/performance';
    this.bufferSize = 100;
    this.reportInterval = 30000; // 30秒
    
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Core Web Vitals 監控
    this.observeWebVitals();
    
    // 用戶互動監控
    this.observeUserInteractions();
    
    // API 效能監控
    this.observeAPIPerformance();
    
    // 記憶體使用監控
    this.observeMemoryUsage();
    
    // 開始定期報告
    this.startPeriodicReporting();
  }

  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.metrics.webVitals.lcp = {
        value: entry.renderTime || entry.loadTime,
        timestamp: Date.now(),
        element: entry.element?.tagName || 'unknown'
      };
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry) => {
      this.metrics.webVitals.fid = {
        value: entry.processingStart - entry.startTime,
        timestamp: Date.now(),
        inputType: entry.name
      };
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        if (!this.metrics.webVitals.cls) {
          this.metrics.webVitals.cls = {
            value: 0,
            timestamp: Date.now(),
            shifts: []
          };
        }
        
        this.metrics.webVitals.cls.value += entry.value;
        this.metrics.webVitals.cls.shifts.push({
          value: entry.value,
          timestamp: Date.now(),
          sources: entry.sources?.map(s => s.node?.tagName) || []
        });
      }
    });

    // Interaction to Next Paint (INP)
    this.observeMetric('event', (entry) => {
      if (entry.interactionId) {
        const interaction = {
          duration: entry.duration,
          startTime: entry.startTime,
          interactionId: entry.interactionId,
          type: entry.name
        };
        
        if (!this.metrics.webVitals.inp || entry.duration > this.metrics.webVitals.inp.value) {
          this.metrics.webVitals.inp = {
            value: entry.duration,
            timestamp: Date.now(),
            interaction
          };
        }
      }
    });
  }

  observeMetric(type, callback) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      try {
        observer.observe({ type, buffered: true });
        this.observers.set(type, observer);
      } catch (error) {
        console.warn(`[PERF] 無法監控 ${type}:`, error);
      }
    }
  }

  observeUserInteractions() {
    // 點擊事件監控
    document.addEventListener('click', (event) => {
      this.recordInteraction('click', event);
    });

    // 表單提交監控
    document.addEventListener('submit', (event) => {
      this.recordInteraction('form-submit', event);
    });

    // 頁面切換監控
    window.addEventListener('popstate', () => {
      this.recordInteraction('navigation', { type: 'popstate' });
    });
  }

  recordInteraction(type, event) {
    const interaction = {
      type,
      timestamp: Date.now(),
      target: event.target?.tagName || 'unknown',
      pathname: window.location.pathname
    };

    this.metrics.userInteractions.push(interaction);
    
    // 保持緩衝區大小
    if (this.metrics.userInteractions.length > this.bufferSize) {
      this.metrics.userInteractions = this.metrics.userInteractions.slice(-this.bufferSize);
    }
  }

  observeAPIPerformance() {
    // 攔截 fetch 請求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.recordAPICall(url, endTime - startTime, response.status, 'success');
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.recordAPICall(url, endTime - startTime, 0, 'error');
        throw error;
      }
    };
  }

  recordAPICall(url, duration, status, result) {
    const apiCall = {
      url: this.sanitizeURL(url),
      duration,
      status,
      result,
      timestamp: Date.now()
    };

    const endpoint = this.getEndpointKey(url);
    if (!this.metrics.apiPerformance[endpoint]) {
      this.metrics.apiPerformance[endpoint] = {
        calls: [],
        averageDuration: 0,
        errorRate: 0
      };
    }

    const endpointMetrics = this.metrics.apiPerformance[endpoint];
    endpointMetrics.calls.push(apiCall);
    
    // 保持緩衝區大小
    if (endpointMetrics.calls.length > this.bufferSize) {
      endpointMetrics.calls = endpointMetrics.calls.slice(-this.bufferSize);
    }
    
    // 更新統計
    this.updateAPIStatistics(endpoint);
  }

  updateAPIStatistics(endpoint) {
    const metrics = this.metrics.apiPerformance[endpoint];
    const calls = metrics.calls;
    
    // 計算平均響應時間
    metrics.averageDuration = calls.reduce((sum, call) => sum + call.duration, 0) / calls.length;
    
    // 計算錯誤率
    const errorCount = calls.filter(call => call.result === 'error').length;
    metrics.errorRate = (errorCount / calls.length) * 100;
  }

  async reportMetrics() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      metrics: {
        webVitals: this.metrics.webVitals,
        customMetrics: this.metrics.customMetrics,
        userInteractions: this.metrics.userInteractions.slice(-10), // 最近 10 個互動
        apiPerformance: this.getAPIPerformanceSummary()
      }
    };

    try {
      await fetch(this.reportEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      
      console.log('[PERF] 效能報告已發送');
    } catch (error) {
      console.error('[PERF] 發送效能報告失敗:', error);
    }
  }

  startPeriodicReporting() {
    setInterval(() => {
      this.reportMetrics();
    }, this.reportInterval);
    
    // 頁面卸載時發送最終報告
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }
    return null;
  }

  // 提供公共 API 用於自定義指標
  recordCustomMetric(name, value, unit = 'ms') {
    this.metrics.customMetrics[name] = {
      value,
      unit,
      timestamp: Date.now()
    };
  }

  // 測量函數執行時間
  async measureFunction(name, fn) {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.recordCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordCustomMetric(`${name}_error`, duration);
      throw error;
    }
  }
}

// 全域效能監控實例
const performanceMonitor = new PerformanceMonitor();

// 匯出供其他模組使用
window.performanceMonitor = performanceMonitor;
```

## 部署檢查清單

### 🔧 技術檢查
- [ ] 所有建構腳本正常運行
- [ ] 程式碼分割和懶載入正確實作
- [ ] 資源壓縮和最佳化完成
- [ ] Source Maps 正確生成
- [ ] 環境變數正確配置

### 🚀 效能檢查
- [ ] Core Web Vitals 指標達標 (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Bundle 大小在合理範圍內 (< 2MB)
- [ ] 載入時間 < 2秒
- [ ] API 響應時間 < 500ms
- [ ] 記憶體使用穩定

### 🔒 安全性檢查
- [ ] CSP 政策正確配置
- [ ] HTTPS 強制啟用
- [ ] XSS 和 CSRF 防護就位
- [ ] 敏感資料加密保護
- [ ] API 金鑰安全管理

### 📊 監控檢查
- [ ] 錯誤追蹤系統正常運作
- [ ] 效能監控正確收集資料
- [ ] 警報系統配置完成
- [ ] 日誌系統正常記錄
- [ ] 監控儀表板可訪問

### 🌐 SEO 檢查
- [ ] Meta 標籤正確設定
- [ ] Open Graph 標籤完整
- [ ] Sitemap 生成並提交
- [ ] robots.txt 正確配置
- [ ] 結構化資料標記完整

## 驗收標準

* 所有建構流程自動化且穩定運行
* 效能指標達到預期目標 (Core Web Vitals 全綠)
* 監控系統正確收集和報告資料
* 安全性檢查全部通過
* SEO 優化完整實作
* 部署流程自動化且支援回滾
* 生產環境穩定運行無關鍵錯誤
* 文檔完整且易於維護
* 所有程式碼已提交到版本控制系統 (Git)
* 通過生產環境的完整測試 