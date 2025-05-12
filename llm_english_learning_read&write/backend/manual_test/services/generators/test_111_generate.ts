import * as dotenv from 'dotenv';
import * as path from 'path';
import { generate111Question } from '../../../src/services/generators/111_generate'; // 導入目標函數

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

async function runTest() {
    try {
        // --- 在這裡自訂測試參數 ---
        const historySummary = "Learner is at B1 level, often confuses synonyms.";
        const difficultySetting = 65; // 期望正確率 65%
        // --- -------------------- ---

        console.log(`[Manual Test] 使用參數: historySummary="${historySummary}", difficultySetting=${difficultySetting}`);

        const question = await generate111Question(
            1, // 函數內部已固定為 1
            historySummary, 
            difficultySetting
        );

        if (question) {
            console.log("[Manual Test] 成功生成問題:");
            console.log(JSON.stringify(question, null, 2));
        } else {
            console.log("[Manual Test] 生成問題失敗 (函數返回 null)。請檢查服務日誌或 API 金鑰。");
        }
    } catch (error) {
        console.error("[Manual Test] 執行 generate111Question 時發生未預期的錯誤:", error);
    }
}

runTest(); 