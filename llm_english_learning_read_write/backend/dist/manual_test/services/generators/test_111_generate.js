"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const _111_generate_1 = require("../../../src/services/generators/111_generate"); // 導入目標函數
// --- .env 設定 ---
// 此腳本位於 backend/manual_test/services/generators/
// .env 文件位於 backend 目錄的父目錄
// 需要向上回溯四層 ('..', '..', '..', '..')
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');
const envPath = path.join(projectRoot, '.env');
const configResult = dotenv.config({ path: envPath });
if (configResult.error) {
    console.error(`[Manual Test] 無法載入 .env 文件，路徑: ${envPath}`, configResult.error);
    process.exit(1); // 如果沒有 .env，測試無法執行
}
if (!process.env.GEMINI_API_KEY) {
    console.error(`[Manual Test] .env 文件中未找到 GEMINI_API_KEY。請檢查: ${envPath}`);
    process.exit(1);
}
console.log(`[Manual Test] 成功載入 .env 文件: ${envPath}`);
console.log('[Manual Test] 開始執行 generate111Question...');
function runTest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // --- 在這裡自訂測試參數 ---
            const historySummary = "Learner is at B1 level, often confuses synonyms.";
            const difficultySetting = 65; // 期望正確率 65%
            // --- -------------------- ---
            console.log(`[Manual Test] 使用參數: historySummary="${historySummary}", difficultySetting=${difficultySetting}`);
            const question = yield (0, _111_generate_1.generate111Question)(1, // 函數內部已固定為 1
            historySummary, difficultySetting);
            if (question) {
                console.log("[Manual Test] 成功生成問題:");
                console.log(JSON.stringify(question, null, 2));
            }
            else {
                console.log("[Manual Test] 生成問題失敗 (函數返回 null)。請檢查服務日誌或 API 金鑰。");
            }
        }
        catch (error) {
            console.error("[Manual Test] 執行 generate111Question 時發生未預期的錯誤:", error);
        }
    });
}
runTest();
//# sourceMappingURL=test_111_generate.js.map