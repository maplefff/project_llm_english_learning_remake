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
exports.saveHistoryEntry = saveHistoryEntry;
exports.getHistory = getHistory;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// 歷史記錄檔案的基礎目錄
const HISTORY_BASE_DIR = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read_write/backend/historyData/";
/**
 * 輔助方法，根據題型 ID 獲取歷史記錄檔案的完整路徑。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @returns 歷史記錄檔案的完整路徑
 */
function getHistoryFilePath(questionType) {
    const sanitizedQuestionType = questionType.replace(/\./g, ''); // 移除題型 ID 中的點號
    return path.join(HISTORY_BASE_DIR, `history${sanitizedQuestionType}.json`);
}
/**
 * 確保 historyData 目錄存在，如果不存在則創建。
 */
function ensureHistoryDirExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.access(HISTORY_BASE_DIR);
        }
        catch (error) {
            // 目錄不存在，創建它
            try {
                yield fs.mkdir(HISTORY_BASE_DIR, { recursive: true });
                // console.log(`[DEBUG HistoryService.ts] Created directory: ${HISTORY_BASE_DIR}`);
            }
            catch (mkdirError) {
                console.error(`[DEBUG HistoryService.ts] Error creating history directory ${HISTORY_BASE_DIR}:`, mkdirError);
                throw mkdirError; // 重新拋出錯誤，讓上層處理
            }
        }
    });
}
/**
 * 儲存作答記錄。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @param entryData 包含 UUID (題目ID), questionData, userAnswer, isCorrect 的物件
 * @returns 創建的 HistoryEntry，如果失敗則返回 null
 */
function saveHistoryEntry(questionType, entryData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ensureHistoryDirExists();
        const filePath = getHistoryFilePath(questionType);
        const newRecord = Object.assign(Object.assign({}, entryData), { timestamp: Date.now() });
        try {
            let history = [];
            try {
                const fileContent = yield fs.readFile(filePath, 'utf-8');
                if (fileContent) {
                    history = JSON.parse(fileContent);
                }
            }
            catch (readError) {
                if (readError.code !== 'ENOENT') { // ENOENT 表示檔案不存在，這是正常的初始情況
                    console.error(`[DEBUG HistoryService.ts] Error reading history file ${filePath}:`, readError);
                }
            }
            history.unshift(newRecord); // 將新記錄添加到陣列開頭
            yield fs.writeFile(filePath, JSON.stringify(history, null, 2), 'utf-8');
            // console.log(`[DEBUG HistoryService.ts] Successfully saved history entry to ${filePath}`);
            return newRecord;
        }
        catch (error) {
            console.error(`[DEBUG HistoryService.ts] Error saving history entry to ${filePath}:`, error);
            return null;
        }
    });
}
/**
 * 檢索歷史記錄。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @param limit (可選) 返回記錄的數量上限
 * @param offset (可選) 返回記錄的起始偏移量
 * @returns HistoryEntry 陣列
 */
function getHistory(questionType, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ensureHistoryDirExists();
        const filePath = getHistoryFilePath(questionType);
        try {
            const fileContent = yield fs.readFile(filePath, 'utf-8');
            if (!fileContent) {
                return [];
            }
            let history = JSON.parse(fileContent);
            // 處理分頁邏輯
            if (offset !== undefined && limit !== undefined) {
                history = history.slice(offset, offset + limit);
            }
            else if (limit !== undefined) {
                history = history.slice(0, limit);
            }
            return history;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            console.error(`[DEBUG HistoryService.ts] Error reading or parsing history file ${filePath}:`, error);
            return [];
        }
    });
}
//# sourceMappingURL=HistoryService.js.map