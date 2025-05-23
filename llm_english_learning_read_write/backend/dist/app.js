"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // 導入 cors
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001; // 注意：上次伺服器啟動在 3001
// 中間件
app.use((0, cors_1.default)()); // <--- 在這裡啟用 CORS
app.use(express_1.default.json());
// API 路由
app.use('/api', api_routes_1.default);
// 基本的 404 處理
app.use((req, res) => {
    res.status(404).send('資源未找到');
});
// 全局錯誤處理中間件
app.use((err, req, res, next) => {
    console.error('[DEBUG app.ts] Uncaught error:', err);
    res.status(500).json({
        message: '伺服器內部錯誤',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});
exports.default = app; // 主要用於測試時導入，或者如果其他模組需要 app 實例 
//# sourceMappingURL=app.js.map