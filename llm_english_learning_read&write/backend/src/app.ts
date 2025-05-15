import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'; // 導入 cors
import apiRoutes from './routes/api.routes';
import { QuestionCacheService } from './services/QuestionCacheService'; // 導入類別

const app: Express = express();
const PORT = process.env.PORT || 3001; // 注意：上次伺服器啟動在 3001

// 中間件
app.use(cors()); // <--- 在這裡啟用 CORS
app.use(express.json());

// API 路由
app.use('/api', apiRoutes);

// 基本的 404 處理
app.use((req: Request, res: Response) => {
  res.status(404).send('資源未找到');
});

// 全局錯誤處理中間件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[DEBUG app.ts] Uncaught error:', err);
  res.status(500).json({ 
    message: '伺服器內部錯誤', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

async function startServer() {
  try {
    // 初始化 QuestionCacheService
    console.log('[DEBUG app.ts] Initializing QuestionCacheService...');
    const questionCacheService = QuestionCacheService.getInstance();
    await questionCacheService.initialize();
    console.log('[DEBUG app.ts] QuestionCacheService initialized successfully.');

    // 啟動伺服器
    app.listen(PORT, () => {
      console.log(`[DEBUG app.ts] 伺服器正在監聽端口 ${PORT}`);
      console.log(`[DEBUG app.ts] API base path: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('[DEBUG app.ts] Failed to initialize services or start server:', error);
    process.exit(1); // 初始化失敗則退出
  }
}

startServer();

export default app; // 主要用於測試時導入，或者如果其他模組需要 app 實例 