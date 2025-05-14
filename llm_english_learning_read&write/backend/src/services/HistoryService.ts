import * as fs from 'fs/promises';
import * as path from 'path';
// import { v4 as uuidv4 } from 'uuid'; // 不再需要為歷史記錄生成 UUID

// 參考 devPlanRead&Write.md 3.6 節關於「記錄資訊 (每條記錄)」的描述
interface QuestionData {
    passage: string;
    targetWord: string;
    question: string;
    options: { id: string; text: string }[];
    standard_answer: string;
}

export interface HistoryEntry {
    UUID: string;  // 題目的 UUID (來自快取，欄位名嚴格為 UUID)
    questionData: QuestionData; // 作答時的題目完整快照
    userAnswer: string; // 使用者提交的答案 (例如選項字母)
    isCorrect: boolean; // 後端判斷答案是否正確
    timestamp: number; // 作答完成的時間戳 Unix timeStamp
}

// 歷史記錄檔案的基礎目錄
const HISTORY_BASE_DIR = "/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/";

/**
 * 輔助方法，根據題型 ID 獲取歷史記錄檔案的完整路徑。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @returns 歷史記錄檔案的完整路徑
 */
function getHistoryFilePath(questionType: string): string {
    const sanitizedQuestionType = questionType.replace(/\./g, ''); // 移除題型 ID 中的點號
    return path.join(HISTORY_BASE_DIR, `history${sanitizedQuestionType}.json`);
}

/**
 * 確保 historyData 目錄存在，如果不存在則創建。
 */
async function ensureHistoryDirExists(): Promise<void> {
    try {
        await fs.access(HISTORY_BASE_DIR);
    } catch (error) {
        // 目錄不存在，創建它
        try {
            await fs.mkdir(HISTORY_BASE_DIR, { recursive: true });
            // console.log(`[DEBUG HistoryService.ts] Created directory: ${HISTORY_BASE_DIR}`);
        } catch (mkdirError) {
            console.error(`[DEBUG HistoryService.ts] Error creating history directory ${HISTORY_BASE_DIR}:`, mkdirError);
            throw mkdirError; // 重新拋出錯誤，讓上層處理
        }
    }
}

/**
 * 儲存作答記錄。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @param entryData 包含 UUID (題目ID), questionData, userAnswer, isCorrect 的物件
 * @returns 創建的 HistoryEntry，如果失敗則返回 null
 */
export async function saveHistoryEntry(
    questionType: string,
    entryData: Omit<HistoryEntry, 'timestamp'> // 現在需要傳入 UUID
): Promise<HistoryEntry | null> {
    await ensureHistoryDirExists();
    const filePath = getHistoryFilePath(questionType);
    const newRecord: HistoryEntry = {
        ...entryData, // entryData 中應包含 UUID, questionData, userAnswer, isCorrect
        // recordId: uuidv4(), // 不再生成 recordId
        timestamp: Date.now(),
    };

    try {
        let history: HistoryEntry[] = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            if (fileContent) {
                history = JSON.parse(fileContent);
            }
        } catch (readError: any) {
            if (readError.code !== 'ENOENT') { // ENOENT 表示檔案不存在，這是正常的初始情況
                console.error(`[DEBUG HistoryService.ts] Error reading history file ${filePath}:`, readError);
            }
        }

        history.unshift(newRecord); // 將新記錄添加到陣列開頭

        await fs.writeFile(filePath, JSON.stringify(history, null, 2), 'utf-8');
        // console.log(`[DEBUG HistoryService.ts] Successfully saved history entry to ${filePath}`);
        return newRecord;
    } catch (error) {
        console.error(`[DEBUG HistoryService.ts] Error saving history entry to ${filePath}:`, error);
        return null;
    }
}

/**
 * 檢索歷史記錄。
 * @param questionType 題型 ID (例如 '1.1.1')
 * @param limit (可選) 返回記錄的數量上限
 * @param offset (可選) 返回記錄的起始偏移量
 * @returns HistoryEntry 陣列
 */
export async function getHistory(
    questionType: string,
    limit?: number,
    offset?: number
): Promise<HistoryEntry[]> {
    await ensureHistoryDirExists();
    const filePath = getHistoryFilePath(questionType);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        if (!fileContent) {
            return [];
        }
        let history: HistoryEntry[] = JSON.parse(fileContent);

        // 處理分頁邏輯
        if (offset !== undefined && limit !== undefined) {
            history = history.slice(offset, offset + limit);
        } else if (limit !== undefined) {
            history = history.slice(0, limit);
        }

        return history;
    } catch (error: any) {
        if (error.code === 'ENOENT') { 
            return [];
        }
        console.error(`[DEBUG HistoryService.ts] Error reading or parsing history file ${filePath}:`, error);
        return [];
    }
} 