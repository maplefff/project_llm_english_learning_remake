/**
 * 速率限制器相關介面定義
 * 用於管理Gemini API請求的速率限制和排隊系統
 */

export interface QueuedRequest {
  id: string;
  promise: {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  };
  requestData: {
    prompt: string;
    options?: any;
  };
  timestamp: number;
  priority: number; // 1=高優先權, 2=中等, 3=低優先權
  retryCount: number;
  context?: string; // 請求來源上下文（如"cache_init", "user_request"等）
}

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  windowSizeMs: number;
  retryDelayMs: number;
  maxRetries: number;
  enablePriority: boolean;
  queueMaxSize: number;
  emergencyMode: boolean; // 緊急模式：暫停低優先權請求
}

export interface RateLimitStatus {
  isEnabled: boolean;
  queueLength: number;
  requestsInCurrentWindow: number;
  nextAvailableSlot: Date;
  estimatedWaitTime: number; // 毫秒
  successRate: number; // 最近成功率百分比
  totalProcessed: number;
  totalFailed: number;
  currentWindowStart: Date;
}

export interface RequestMetrics {
  requestId: string;
  prompt: string;
  priority: number;
  queueTime: number; // 排隊等待時間（毫秒）
  processingTime: number; // 實際處理時間（毫秒）
  success: boolean;
  errorType?: string;
  timestamp: Date;
}

export interface PriorityLevel {
  HIGH: 1;
  MEDIUM: 2;
  LOW: 3;
}

export const PRIORITY_LEVELS: PriorityLevel = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
} as const; 
 