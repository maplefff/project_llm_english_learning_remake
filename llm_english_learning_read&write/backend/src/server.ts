// Backend server entry point
import questionCacheServiceInstance from './services/QuestionCacheService';

console.log('Hello from backend server.ts');

// Initialize services that require async setup
(async () => {
  try {
    await questionCacheServiceInstance.initialize();
    console.log('[server.ts] QuestionCacheService initialized successfully.');
    // 在這裡可以繼續初始化其他服務或啟動 Express 伺服器 (如果有的話)
  } catch (error) {
    console.error('[server.ts] Failed to initialize services:', error);
    process.exit(1); // 初始化失敗時退出，防止應用在錯誤狀態下運行
  }
})();

// 後續可以添加 Express 伺服器的啟動代碼
// import express from 'express';
// const app = express();
// const port = process.env.PORT || 3000;
// ... routes and middleware ...
// app.listen(port, () => { ... }); 