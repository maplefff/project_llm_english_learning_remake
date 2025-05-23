"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RateLimiter_1 = require("../interfaces/RateLimiter");
const uuid_1 = require("uuid");
/**
 * 全局API速率限制器服務
 * 管理對Gemini API的請求排隊，確保不超過速率限制
 */
class RateLimiterService {
    config = {
        maxRequestsPerMinute: 10, // Gemini 免費層限制
        windowSizeMs: 60000, // 1分鐘 = 60000毫秒
        retryDelayMs: 6000, // 6秒間隔
        maxRetries: 3,
        enablePriority: true,
        queueMaxSize: 100,
        emergencyMode: false
    };
    requestQueue = [];
    processingQueue = false;
    requestTimestamps = []; // 記錄每個請求的時間戳
    lastProcessTime = 0;
    // 統計數據
    totalProcessed = 0;
    totalFailed = 0;
    metrics = [];
    maxMetricsHistory = 1000;
    constructor() {
        console.log('[DEBUG RateLimiterService.ts] 速率限制器已初始化');
        // 載入環境變數配置
        this.loadConfigFromEnv();
        // 啟動後台處理
        this.startQueueProcessor();
    }
    /**
     * 將請求加入排隊系統
     * @param prompt API請求的提示文字
     * @param options API請求選項
     * @param priority 優先權等級 (1=高, 2=中, 3=低)
     * @param context 請求來源上下文
     * @returns Promise，解析為API回應
     */
    async enqueueRequest(prompt, options, priority = RateLimiter_1.PRIORITY_LEVELS.MEDIUM, context) {
        return new Promise((resolve, reject) => {
            // 檢查排隊是否已滿
            if (this.requestQueue.length >= this.config.queueMaxSize) {
                console.error('[DEBUG RateLimiterService.ts] 排隊已滿，拒絕新請求');
                reject(new Error('API請求排隊已滿，請稍後再試'));
                return;
            }
            // 緊急模式：只允許高優先權請求
            if (this.config.emergencyMode && priority !== RateLimiter_1.PRIORITY_LEVELS.HIGH) {
                console.warn('[DEBUG RateLimiterService.ts] 緊急模式啟用，拒絕非高優先權請求');
                reject(new Error('系統處於緊急模式，僅處理高優先權請求'));
                return;
            }
            const queuedRequest = {
                id: (0, uuid_1.v4)(),
                promise: { resolve, reject },
                requestData: { prompt, options },
                timestamp: Date.now(),
                priority,
                retryCount: 0,
                context
            };
            // 根據優先權插入到適當位置
            this.insertRequestByPriority(queuedRequest);
            console.log(`[DEBUG RateLimiterService.ts] 請求已加入排隊 - ID: ${queuedRequest.id}, 優先權: ${priority}, 排隊長度: ${this.requestQueue.length}, 上下文: ${context || 'unknown'}`);
            // 觸發排隊處理
            this.processQueue();
        });
    }
    /**
     * 根據優先權將請求插入到正確位置
     */
    insertRequestByPriority(request) {
        if (!this.config.enablePriority) {
            // 如果未啟用優先權，直接加到隊尾
            this.requestQueue.push(request);
            return;
        }
        // 找到插入位置（優先權數字越小優先權越高）
        let insertIndex = this.requestQueue.length;
        for (let i = 0; i < this.requestQueue.length; i++) {
            if (this.requestQueue[i].priority > request.priority) {
                insertIndex = i;
                break;
            }
        }
        this.requestQueue.splice(insertIndex, 0, request);
    }
    /**
     * 處理請求排隊的主要邏輯
     */
    async processQueue() {
        if (this.processingQueue || this.requestQueue.length === 0) {
            return;
        }
        this.processingQueue = true;
        try {
            while (this.requestQueue.length > 0) {
                // 檢查是否可以發送請求
                if (!this.canMakeRequest()) {
                    const waitTime = this.getNextAvailableTime() - Date.now();
                    console.log(`[DEBUG RateLimiterService.ts] 達到速率限制，等待 ${waitTime}ms`);
                    await this.sleep(waitTime);
                    continue;
                }
                const request = this.requestQueue.shift();
                await this.processRequest(request);
            }
        }
        catch (error) {
            console.error('[DEBUG RateLimiterService.ts] 處理排隊時發生錯誤:', error);
        }
        finally {
            this.processingQueue = false;
        }
    }
    /**
     * 處理單個請求
     */
    async processRequest(request) {
        const startTime = Date.now();
        const queueTime = startTime - request.timestamp;
        try {
            console.log(`[DEBUG RateLimiterService.ts] 開始處理請求 - ID: ${request.id}, 排隊時間: ${queueTime}ms`);
            // 記錄請求時間戳
            this.requestTimestamps.push(startTime);
            this.cleanupOldTimestamps();
            // 這裡需要調用實際的API服務
            // 暫時先放置佔位符，稍後整合到GeminiAPIService時會替換
            const result = await this.makeActualAPICall(request.requestData.prompt, request.requestData.options);
            const processingTime = Date.now() - startTime;
            this.totalProcessed++;
            // 記錄成功的metrics
            this.recordMetrics({
                requestId: request.id,
                prompt: request.requestData.prompt.substring(0, 100) + '...', // 截取提示的前100字符
                priority: request.priority,
                queueTime,
                processingTime,
                success: true,
                timestamp: new Date()
            });
            console.log(`[DEBUG RateLimiterService.ts] 請求處理成功 - ID: ${request.id}, 處理時間: ${processingTime}ms`);
            request.promise.resolve(result);
        }
        catch (error) {
            console.error(`[DEBUG RateLimiterService.ts] 請求處理失敗 - ID: ${request.id}:`, error);
            // 檢查是否為429錯誤並且可以重試
            if (this.shouldRetry(error, request)) {
                request.retryCount++;
                const retryDelay = this.config.retryDelayMs * Math.pow(2, request.retryCount - 1); // 指數退避
                console.log(`[DEBUG RateLimiterService.ts] 將重試請求 - ID: ${request.id}, 重試次數: ${request.retryCount}, 延遲: ${retryDelay}ms`);
                setTimeout(() => {
                    this.insertRequestByPriority(request);
                    this.processQueue();
                }, retryDelay);
                return;
            }
            const processingTime = Date.now() - startTime;
            this.totalFailed++;
            // 記錄失敗的metrics
            this.recordMetrics({
                requestId: request.id,
                prompt: request.requestData.prompt.substring(0, 100) + '...',
                priority: request.priority,
                queueTime,
                processingTime,
                success: false,
                errorType: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date()
            });
            request.promise.reject(error);
        }
    }
    /**
     * 實際的API調用（佔位符）
     * 這個方法會在整合GeminiAPIService時被替換
     */
    async makeActualAPICall(prompt, options) {
        // 暫時的模擬實現
        throw new Error('API調用方法尚未整合到GeminiAPIService');
    }
    /**
     * 檢查是否應該重試請求
     */
    shouldRetry(error, request) {
        if (request.retryCount >= this.config.maxRetries) {
            return false;
        }
        // 檢查是否為429錯誤
        const errorMessage = error instanceof Error ? error.message : String(error);
        return errorMessage.includes('429') || errorMessage.includes('Too Many Requests') || errorMessage.includes('RESOURCE_EXHAUSTED');
    }
    /**
     * 檢查當前是否可以發送請求
     */
    canMakeRequest() {
        this.cleanupOldTimestamps();
        return this.requestTimestamps.length < this.config.maxRequestsPerMinute;
    }
    /**
     * 獲取下一個可用的請求時間
     */
    getNextAvailableTime() {
        if (this.requestTimestamps.length === 0) {
            return Date.now();
        }
        // 返回最舊請求時間戳 + 時間窗口
        return this.requestTimestamps[0] + this.config.windowSizeMs;
    }
    /**
     * 清理超出時間窗口的舊時間戳
     */
    cleanupOldTimestamps() {
        const cutoffTime = Date.now() - this.config.windowSizeMs;
        this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > cutoffTime);
    }
    /**
     * 記錄請求metrics
     */
    recordMetrics(metrics) {
        this.metrics.push(metrics);
        // 保持metrics歷史記錄在限制內
        if (this.metrics.length > this.maxMetricsHistory) {
            this.metrics = this.metrics.slice(-this.maxMetricsHistory);
        }
    }
    /**
     * 獲取當前速率限制狀態
     */
    getStatus() {
        this.cleanupOldTimestamps();
        const currentTime = new Date();
        const windowStart = new Date(currentTime.getTime() - this.config.windowSizeMs);
        // 計算成功率
        const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > Date.now() - this.config.windowSizeMs);
        const successRate = recentMetrics.length > 0
            ? (recentMetrics.filter(m => m.success).length / recentMetrics.length) * 100
            : 100;
        // 估算等待時間
        let estimatedWaitTime = 0;
        if (this.requestQueue.length > 0) {
            const requestsToProcess = Math.min(this.requestQueue.length, this.config.maxRequestsPerMinute - this.requestTimestamps.length);
            if (requestsToProcess <= 0) {
                estimatedWaitTime = this.getNextAvailableTime() - Date.now();
            }
            else {
                estimatedWaitTime = (this.requestQueue.length / this.config.maxRequestsPerMinute) * this.config.windowSizeMs;
            }
        }
        return {
            isEnabled: true,
            queueLength: this.requestQueue.length,
            requestsInCurrentWindow: this.requestTimestamps.length,
            nextAvailableSlot: new Date(this.getNextAvailableTime()),
            estimatedWaitTime: Math.max(0, estimatedWaitTime),
            successRate,
            totalProcessed: this.totalProcessed,
            totalFailed: this.totalFailed,
            currentWindowStart: windowStart
        };
    }
    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('[DEBUG RateLimiterService.ts] 配置已更新:', this.config);
    }
    /**
     * 清空排隊
     */
    clearQueue() {
        const queueLength = this.requestQueue.length;
        this.requestQueue.forEach(request => {
            request.promise.reject(new Error('排隊已被清空'));
        });
        this.requestQueue = [];
        console.log(`[DEBUG RateLimiterService.ts] 已清空排隊，共清空 ${queueLength} 個請求`);
    }
    /**
     * 切換緊急模式
     */
    toggleEmergencyMode(enabled) {
        this.config.emergencyMode = enabled;
        console.log(`[DEBUG RateLimiterService.ts] 緊急模式已${enabled ? '啟用' : '停用'}`);
        if (enabled) {
            // 清空所有非高優先權請求
            const lowPriorityRequests = this.requestQueue.filter(req => req.priority !== RateLimiter_1.PRIORITY_LEVELS.HIGH);
            lowPriorityRequests.forEach(request => {
                request.promise.reject(new Error('緊急模式啟用，非高優先權請求已取消'));
            });
            this.requestQueue = this.requestQueue.filter(req => req.priority === RateLimiter_1.PRIORITY_LEVELS.HIGH);
            console.log(`[DEBUG RateLimiterService.ts] 緊急模式：已清空 ${lowPriorityRequests.length} 個低優先權請求`);
        }
    }
    /**
     * 獲取metrics統計
     */
    getMetrics() {
        return [...this.metrics];
    }
    /**
     * 從環境變數載入配置
     */
    loadConfigFromEnv() {
        if (process.env.RATE_LIMIT_ENABLED === 'false') {
            console.log('[DEBUG RateLimiterService.ts] 速率限制已從環境變數中停用');
            return;
        }
        if (process.env.RATE_LIMIT_MAX_REQUESTS_PER_MINUTE) {
            this.config.maxRequestsPerMinute = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_MINUTE);
        }
        if (process.env.RATE_LIMIT_ENABLE_PRIORITY) {
            this.config.enablePriority = process.env.RATE_LIMIT_ENABLE_PRIORITY === 'true';
        }
        if (process.env.RATE_LIMIT_QUEUE_MAX_SIZE) {
            this.config.queueMaxSize = parseInt(process.env.RATE_LIMIT_QUEUE_MAX_SIZE);
        }
        console.log('[DEBUG RateLimiterService.ts] 從環境變數載入的配置:', this.config);
    }
    /**
     * 啟動後台排隊處理器
     */
    startQueueProcessor() {
        // 每5秒檢查一次排隊狀態
        setInterval(() => {
            if (this.requestQueue.length > 0 && !this.processingQueue) {
                console.log(`[DEBUG RateLimiterService.ts] 後台檢查：發現 ${this.requestQueue.length} 個待處理請求`);
                this.processQueue();
            }
        }, 5000);
    }
    /**
     * 睡眠工具函數
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// 導出單例實例
exports.default = new RateLimiterService();
//# sourceMappingURL=RateLimiterService.js.map