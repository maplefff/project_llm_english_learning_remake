# API Contract Memo - LLM English Learning Application

## 📋 API 端點總覽

### ✅ 已實現的API (Backend Ready)

| 端點 | 方法 | 狀態 | 描述 |
|------|------|------|------|
| `/api/question-types` | GET | ✅ | 獲取支援的題型列表 |
| `/api/start-test` | POST | ✅ | 開始特定題型的測驗 |
| `/api/submit-answer` | POST | ✅ | 提交答案並獲取評分結果 |
| `/api/history` | GET | ✅ | 獲取特定題型的歷史記錄 |

### ❌ 需要實現的API (Frontend Ready, Backend Pending)

| 端點 | 方法 | 狀態 | 描述 |
|------|------|------|------|
| `/api/statistics/dashboard` | GET | ❌ | Dashboard統計數據 |
| `/api/statistics/summary` | GET | ❌ | 跨題型統計摘要 |
| `/api/settings` | GET | ❌ | 獲取用戶設定 |
| `/api/settings` | POST | ❌ | 更新用戶設定 |

---

## 📖 已實現API詳細規格

### 1. GET /api/question-types
**描述**: 獲取所有支援的題型列表

**請求參數**: 無

**回應格式**:
```typescript
Array<{
  id: string;        // 題型代碼 (如 "1.1.1")
  name: string;      // 題型名稱 (如 "詞義選擇 (Vocabulary - Multiple Choice)")
}>
```

**實現狀態**: ✅ 完成
**前端整合**: ✅ 完成

---

### 2. POST /api/start-test
**描述**: 開始特定題型的測驗，獲取一道題目

**請求參數**:
```typescript
{
  questionType: string;  // 題型代碼 (如 "1.1.1")
}
```

**回應格式**:
```typescript
{
  success: boolean;
  question?: {
    id: string;                              // 題目唯一ID
    questionType: string;                    // 題型代碼
    passage?: string;                        // 閱讀段落（選填）
    question: string;                        // 問題文字
    options: Array<{                         // 選項列表
      id: string;                            // 選項ID (如 "a", "b", "c", "d")
      text: string;                          // 選項文字
    }>;
    standard_answer: string;                 // 標準答案
  };
  message?: string;                          // 錯誤訊息
}
```

**支援的題型**: 24種 (1.1.1 到 2.8.2)
**實現狀態**: ✅ 完成
**前端整合**: ✅ 完成

---

### 3. POST /api/submit-answer
**描述**: 提交答案並獲取評分結果

**請求參數**:
```typescript
{
  questionId: string;                        // 題目ID
  userAnswer: string;                        // 用戶答案
  questionDataSnapshot: {                    // 題目完整快照
    id: string;
    questionType: string;
    passage?: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    standard_answer: string;
  };
}
```

**回應格式**:
```typescript
{
  isCorrect: boolean;                        // 是否正確
  score: number;                             // 得分 (0-100)
  explanation?: string;                      // 解題說明
  correctAnswer: string;                     // 正確答案
}
```

**實現狀態**: ✅ 完成
**前端整合**: ✅ 完成

---

### 4. GET /api/history
**描述**: 獲取特定題型的歷史記錄

**請求參數**:
```typescript
{
  questionType: string;                      // 必填：題型代碼
  limit?: number;                            // 選填：返回記錄數量限制
  offset?: number;                           // 選填：偏移量（分頁）
}
```

**回應格式**:
```typescript
Array<{
  UUID: string;                              // 題目UUID
  questionData: {                            // 題目數據快照
    passage: string;
    targetWord?: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    standard_answer: string;
  };
  userAnswer: string;                        // 用戶答案
  isCorrect: boolean;                        // 是否正確
  timestamp: number;                         // Unix時間戳
}>
```

**實現狀態**: ✅ 完成
**前端整合**: ✅ 完成

---

## 🚧 需要實現的API詳細規格

### 5. GET /api/statistics/dashboard
**描述**: 獲取Dashboard頁面所需的統計數據

**請求參數**: 無

**建議回應格式**:
```typescript
{
  todayQuestions: number;                    // 今日完成題數
  overallAccuracy: number;                   // 整體正確率 (0-100)
  totalQuestions: number;                    // 總答題數
  consecutiveDays: number;                   // 連續答題天數
  recentActivity: Array<{                    // 最近活動（最多10筆）
    questionType: string;                    // 題型代碼
    timestamp: number;                       // Unix時間戳
    isCorrect: boolean;                      // 是否正確
    timeSpent?: number;                      // 答題耗時（毫秒）
  }>;
}
```

**實現狀態**: ❌ 待實現
**前端整合**: ✅ 架構已準備（目前使用示範數據）

---

### 6. GET /api/statistics/summary
**描述**: 獲取跨題型統計摘要

**請求參數**: 無

**建議回應格式**:
```typescript
{
  byQuestionType: Record<string, {           // 按題型統計
    totalAnswered: number;                   // 總答題數
    accuracy: number;                        // 正確率 (0-100)
    averageTime: number;                     // 平均答題時間（毫秒）
    lastAttempt?: number;                    // 最後答題時間戳
  }>;
  weeklyTrend: Array<{                       // 週趨勢（最近7天）
    date: string;                            // 日期 (YYYY-MM-DD)
    questionsAnswered: number;               // 當日答題數
    accuracy: number;                        // 當日正確率
  }>;
}
```

**實現狀態**: ❌ 待實現
**前端整合**: ⚠️ 尚未開始（等待API實現）

---

### 7. GET /api/settings
**描述**: 獲取用戶設定

**請求參數**: 無

**建議回應格式**:
```typescript
{
  apiKey?: string;                           // LLM API金鑰（遮罩顯示）
  dailyGoal?: number;                        // 每日答題目標
  preferredDifficulty?: 'easy' | 'medium' | 'hard';  // 偏好難度
  notifications?: boolean;                   // 是否啟用通知
  autoSave?: boolean;                        // 是否自動保存進度
  theme?: 'light' | 'dark' | 'auto';        // 主題偏好
}
```

**實現狀態**: ❌ 待實現
**前端整合**: ⚠️ 尚未開始（等待API實現）

---

### 8. POST /api/settings
**描述**: 更新用戶設定

**請求參數**:
```typescript
{
  apiKey?: string;                           // LLM API金鑰
  dailyGoal?: number;                        // 每日答題目標
  preferredDifficulty?: 'easy' | 'medium' | 'hard';  // 偏好難度
  notifications?: boolean;                   // 是否啟用通知
  autoSave?: boolean;                        // 是否自動保存進度
  theme?: 'light' | 'dark' | 'auto';        // 主題偏好
}
```

**回應格式**:
```typescript
{
  success: boolean;                          // 更新是否成功
  message?: string;                          // 成功/錯誤訊息
  settings?: {                               // 更新後的設定
    // 同 GET /api/settings 回應格式
  };
}
```

**實現狀態**: ❌ 待實現
**前端整合**: ⚠️ 尚未開始（等待API實現）

---

## 📁 檔案結構參考

### 後端實現位置
- 路由定義: `backend/src/routes/api.routes.ts`
- 控制器: `backend/src/controllers/api.controller.ts`
- 服務層: `backend/src/services/`

### 前端整合位置
- API服務: `frontend/src/services/api.ts`
- Store: `frontend/src/stores/`
- 組件: `frontend/src/views/`

---

## 🔄 開發優先級

### 高優先級 (立即需要)
1. `GET /api/statistics/dashboard` - Dashboard功能完整化
2. `GET /api/settings` + `POST /api/settings` - 基礎設定管理

### 中優先級 (下個階段)
3. `GET /api/statistics/summary` - 進階統計分析

---

## 📝 備註

- 所有API應遵循RESTful設計原則
- 錯誤回應應包含適當的HTTP狀態碼和錯誤訊息
- 考慮實現API速率限制和用戶認證（未來需求）
- 建議加入請求/回應日誌記錄以便調試

---

**最後更新**: 2024-12-19
**文檔版本**: 1.0 