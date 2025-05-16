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

export default app; // 主要用於測試時導入，或者如果其他模組需要 app 實例 