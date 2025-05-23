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
const HistoryService_1 = require("../../src/services/HistoryService");
// 清理函式：可選，用於在測試前清空特定的歷史檔案
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const HISTORY_BASE_DIR_MANUAL_TEST = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/";
function clearHistoryFile(questionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const sanitizedQuestionType = questionType.replace(/\./g, '');
        const filePath = path.join(HISTORY_BASE_DIR_MANUAL_TEST, `history${sanitizedQuestionType}.json`);
        try {
            yield fs.unlink(filePath);
            console.log(`[ManualTest] Cleared history file: ${filePath}`);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                // console.log(`[ManualTest] History file not found, no need to clear: ${filePath}`);
            }
            else {
                console.error(`[ManualTest] Error clearing history file ${filePath}:`, error);
            }
        }
    });
}
function runManualTests() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("[ManualTest] 開始手動測試 HistoryService...");
        const questionType1 = '1.1.1';
        const questionType2 = '1.2.1';
        const questionType3 = '2.1.1'; // 一個新的題型
        // 在執行前清除特定歷史檔案，以便重複測試
        console.log("\n[ManualTest] 清理舊的歷史檔案 (如果存在)...");
        yield clearHistoryFile(questionType1);
        yield clearHistoryFile(questionType2);
        yield clearHistoryFile(questionType3);
        // 也清理一下上次測試可能遺留的 9.9.9 (雖然不在此次儲存之列)
        yield clearHistoryFile('9.9.9');
        // 範例作答數據 - 更新：使用 UUID，移除 Omit 中的 recordId
        const entryData1_1 = {
            UUID: 'manual-test-uuid-111-alpha', // 新增 UUID
            questionData: {
                passage: "The resilient athlete quickly recovered from her injury.",
                targetWord: "resilient",
                question: "In the sentence above, the word 'resilient' most nearly means:",
                options: [
                    { id: "A", text: "weak" },
                    { id: "B", text: "determined" },
                    { id: "C", text: "flexible and quick to recover" },
                    { id: "D", text: "tired" }
                ],
                standard_answer: "C"
            },
            userAnswer: "C",
            isCorrect: true
        };
        const entryData1_2 = {
            UUID: 'manual-test-uuid-111-beta', // 新增 UUID
            questionData: {
                passage: "The novel had a convoluted plot that was difficult to follow.",
                targetWord: "convoluted",
                question: "The word 'convoluted' means:",
                options: [
                    { id: "A", text: "simple" },
                    { id: "B", text: "complex and intricate" },
                    { id: "C", text: "straightforward" }
                ],
                standard_answer: "B"
            },
            userAnswer: "A", // 故意答錯
            isCorrect: false
        };
        const entryData2_1 = {
            UUID: 'manual-test-uuid-121-gamma', // 新增 UUID
            questionData: {
                passage: "He showed great acumen in his business dealings.",
                targetWord: "acumen",
                question: "What does 'acumen' mean?",
                options: [
                    { id: "A", text: "ignorance" },
                    { id: "B", text: "keen insight and good judgment" },
                    { id: "C", text: "carelessness" }
                ],
                standard_answer: "B"
            },
            userAnswer: "B",
            isCorrect: true
        };
        // 測試 saveHistoryEntry
        console.log("\n[ManualTest] 測試 saveHistoryEntry...");
        console.log(`[ManualTest] 儲存題型 ${questionType1} 的第一筆記錄...`);
        const savedEntry1_1 = yield (0, HistoryService_1.saveHistoryEntry)(questionType1, entryData1_1);
        console.log("[ManualTest] 儲存結果 1.1:", savedEntry1_1 ? "成功" : "失敗", savedEntry1_1);
        console.log(`[ManualTest] 儲存題型 ${questionType1} 的第二筆記錄 (將成為最新的)...`);
        const savedEntry1_2 = yield (0, HistoryService_1.saveHistoryEntry)(questionType1, entryData1_2);
        console.log("[ManualTest] 儲存結果 1.2:", savedEntry1_2 ? "成功" : "失敗", savedEntry1_2);
        console.log(`[ManualTest] 儲存題型 ${questionType2} 的第一筆記錄...`);
        const savedEntry2_1 = yield (0, HistoryService_1.saveHistoryEntry)(questionType2, entryData2_1);
        console.log("[ManualTest] 儲存結果 2.1:", savedEntry2_1 ? "成功" : "失敗", savedEntry2_1);
        console.log(`[ManualTest] 儲存題型 ${questionType3} 的第一筆記錄 (將創建新檔案)...`);
        // 更新 entryData3_1 以包含 UUID 並修正重複定義問題
        const entryData3_1 = Object.assign(Object.assign({}, entryData1_1), { UUID: 'manual-test-uuid-211-delta', questionData: Object.assign(Object.assign({}, entryData1_1.questionData), { passage: "Passage for type 3.1" }), userAnswer: "A", isCorrect: false // 更新 isCorrect
         });
        const savedEntry3_1 = yield (0, HistoryService_1.saveHistoryEntry)(questionType3, entryData3_1);
        console.log("[ManualTest] 儲存結果 3.1:", savedEntry3_1 ? "成功" : "失敗", savedEntry3_1);
        // 測試 getHistory
        console.log("\n[ManualTest] 測試 getHistory...");
        console.log(`[ManualTest] 獲取題型 ${questionType1} 的所有歷史記錄...`);
        const history1 = yield (0, HistoryService_1.getHistory)(questionType1);
        console.log(`[ManualTest] 題型 ${questionType1} 的歷史記錄 (應有 ${history1.length} 筆, 最新在前):`);
        history1.forEach((entry) => console.log(entry));
        console.log(`\n[ManualTest] 獲取題型 ${questionType2} 的所有歷史記錄...`);
        const history2 = yield (0, HistoryService_1.getHistory)(questionType2);
        console.log(`[ManualTest] 題型 ${questionType2} 的歷史記錄 (應有 ${history2.length} 筆):`);
        history2.forEach((entry) => console.log(entry));
        console.log(`\n[ManualTest] 獲取題型 ${questionType3} 的所有歷史記錄...`);
        const history3 = yield (0, HistoryService_1.getHistory)(questionType3);
        console.log(`[ManualTest] 題型 ${questionType3} 的歷史記錄 (應有 ${history3.length} 筆):`);
        history3.forEach((entry) => console.log(entry));
        console.log("\n[ManualTest] 嘗試獲取一個不存在題型的歷史記錄 (例如 '9.9.9')...");
        const historyNonExistent = yield (0, HistoryService_1.getHistory)('9.9.9');
        console.log("[ManualTest] 不存在題型的歷史記錄:", historyNonExistent, `(應為空陣列, 長度: ${historyNonExistent.length})`);
        // 測試分頁 (limit 和 offset)
        console.log("\n[ManualTest] 測試 getHistory 的分頁功能 (針對題型 " + questionType1 + ")...");
        if (history1.length >= 2) {
            console.log("[ManualTest] 獲取前 1 筆記錄 (limit: 1)...");
            const history1_limit1 = yield (0, HistoryService_1.getHistory)(questionType1, 1);
            console.log(`[ManualTest] 結果 (應有 1 筆):`, history1_limit1);
            console.log("\n[ManualTest] 獲取從第 2 筆開始的 1 筆記錄 (limit: 1, offset: 1)...");
            const history1_offset1_limit1 = yield (0, HistoryService_1.getHistory)(questionType1, 1, 1);
            console.log(`[ManualTest] 結果 (應為原始的第 2 筆):`, history1_offset1_limit1);
            if (history1_offset1_limit1.length > 0 && history1.length > 1) {
                // 驗證是否真的是原始的第二筆 (即 savedEntry1_1，因為 entryData1_2 是後存的，在最前面)
                const originalSecondEntry = history1[1];
                // 修改比較條件，使用 UUID
                if (history1_offset1_limit1[0].UUID === originalSecondEntry.UUID) {
                    console.log("[ManualTest] 分頁 Offset 驗證成功: 獲取的記錄與預期的第二條記錄匹配。");
                }
                else {
                    console.error("[ManualTest] 分頁 Offset 驗證失敗!");
                    console.log("[ManualTest] 期望得到: ", originalSecondEntry);
                    console.log("[ManualTest] 實際得到: ", history1_offset1_limit1[0]);
                }
            }
            console.log("\n[ManualTest] 獲取 5 筆記錄，但 offset 使其超出範圍 (offset: 10)...");
            const history1_offset_overflow = yield (0, HistoryService_1.getHistory)(questionType1, 5, 10);
            console.log(`[ManualTest] 結果 (應為空陣列):`, history1_offset_overflow);
        }
        else {
            console.log(`[ManualTest] 題型 ${questionType1} 的記錄少於2筆，跳過部分分頁測試。`);
        }
        console.log("\n[ManualTest] 手動測試完成。");
        console.log("[ManualTest] 請檢查 " + HISTORY_BASE_DIR_MANUAL_TEST + " 目錄下的 json 檔案以及以上控制台輸出。");
    });
}
runManualTests().catch(error => {
    console.error("[ManualTest] 手動測試過程中發生未預期錯誤:", error);
});
//# sourceMappingURL=testHistoryService.js.map