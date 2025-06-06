"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Backend server entry point
const QuestionCacheService_v2_1 = __importDefault(require("./services/QuestionCacheService_v2"));
const app_1 = __importDefault(require("./app")); // 導入 Express app
console.log('Hello from backend server.ts');
const PORT = process.env.PORT || 3001; // 保持與之前手動測試一致的端口
// Initialize services that require async setup
(async () => {
    try {
        await QuestionCacheService_v2_1.default.initialize();
        console.log('[server.ts] QuestionCacheService initialized successfully.');
        // 在這裡可以繼續初始化其他服務或啟動 Express 伺服器 (如果有的話)
        // 啟動 Express 伺服器
        app_1.default.listen(PORT, () => {
            console.log(`[server.ts] Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('[server.ts] Failed to initialize services or start server:', error);
        process.exit(1); // 初始化失敗時退出，防止應用在錯誤狀態下運行
    }
})();
// 後續可以添加 Express 伺服器的啟動代碼
// import express from 'express';
// const app = express();
// const port = process.env.PORT || 3000;
// ... routes and middleware ...
// app.listen(port, () => { ... }); 
//# sourceMappingURL=server.js.map