"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionGeneratorService = void 0;
const _111_generate_1 = require("./generators/111_generate");
const _112_generate_1 = require("./generators/112_generate");
const _121_generate_1 = require("./generators/121_generate");
const _122_generate_1 = require("./generators/122_generate");
const _123_generate_1 = require("./generators/123_generate");
const _131_generate_1 = require("./generators/131_generate");
const _141_generate_1 = require("./generators/141_generate");
const _151_generate_1 = require("./generators/151_generate");
const _152_generate_1 = require("./generators/152_generate");
const _153_generate_1 = require("./generators/153_generate");
const _211_generate_1 = require("./generators/211_generate");
const _212_generate_1 = require("./generators/212_generate");
const _221_generate_1 = require("./generators/221_generate");
const _222_generate_1 = require("./generators/222_generate");
const _231_generate_1 = require("./generators/231_generate");
const _241_generate_1 = require("./generators/241_generate");
const _242_generate_1 = require("./generators/242_generate");
const _251_generate_1 = require("./generators/251_generate");
const _252_generate_1 = require("./generators/252_generate");
const _261_generate_1 = require("./generators/261_generate");
const _271_generate_1 = require("./generators/271_generate");
const _272_generate_1 = require("./generators/272_generate");
const _281_generate_1 = require("./generators/281_generate");
const _282_generate_1 = require("./generators/282_generate");
const HistoryService_1 = require("../services/HistoryService"); // 匯入查詢歷史紀錄的函數
/**
 * 根據題目類型生成題目資料。
 * @param questionType - 題目類型代碼 (例如 '1.1.1')。
 * @param difficulty - 難度設定 (0-100)。
 * @param historySummary - 學習者歷史摘要。
 * @param questionNumber - 需要生成的題目數量 (默認為 1)。
 * @returns 返回對應題型的題目資料物件或物件陣列，若不支援該題型或生成失敗則返回 null。
 */
async function generateQuestionByType(questionType, difficulty = 70, historySummary = 'No history available.', questionNumber = 1) {
    console.log(`[DEBUG QuestionGeneratorService.ts] Received request for type: ${questionType}, difficulty: ${difficulty}, number: ${questionNumber}`);
    switch (questionType) {
        case '1.1.1':
            try {
                // 查詢歷史紀錄，這裡直接查詢 1.1.1 題型的所有紀錄
                const historyRecords = await (0, HistoryService_1.getHistory)('1.1.1');
                // 直接將歷史紀錄序列化為字串作為 summary 傳遞
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _111_generate_1.generate111Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.1.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.1:`, error);
                return null;
            }
        case '1.1.2':
            try {
                // 查詢歷史紀錄，這裡直接查詢 1.1.2 題型的所有紀錄
                const historyRecords = await (0, HistoryService_1.getHistory)('1.1.2');
                // 直接將歷史紀錄序列化為字串作為 summary 傳遞
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _112_generate_1.generate112Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.1.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.2:`, error);
                return null;
            }
        case '1.2.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.2.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _121_generate_1.generate121Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.1:`, error);
                return null;
            }
        case '1.2.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.2.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _122_generate_1.generate122Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.2:`, error);
                return null;
            }
        case '1.2.3':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.2.3');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _123_generate_1.generate123Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.2.3.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.3:`, error);
                return null;
            }
        case '1.3.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.3.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _131_generate_1.generate131Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.3.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.3.1:`, error);
                return null;
            }
        case '1.4.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.4.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _141_generate_1.generate141Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.4.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.4.1:`, error);
                return null;
            }
        case '1.5.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.5.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _151_generate_1.generate151Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.1:`, error);
                return null;
            }
        case '1.5.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.5.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _152_generate_1.generate152Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.2:`, error);
                return null;
            }
        case '1.5.3':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('1.5.3');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _153_generate_1.generate153Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 1.5.3.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.3:`, error);
                return null;
            }
        case '2.1.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.1.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _211_generate_1.generate211Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.1.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.1:`, error);
                return null;
            }
        case '2.1.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.1.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _212_generate_1.generate212Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.1.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.2:`, error);
                return null;
            }
        case '2.2.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.2.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _221_generate_1.generate221Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.2.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.1:`, error);
                return null;
            }
        case '2.2.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.2.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _222_generate_1.generate222Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.2.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.2:`, error);
                return null;
            }
        case '2.3.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.3.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _231_generate_1.generate231Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.3.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.3.1:`, error);
                return null;
            }
        case '2.4.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.4.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _241_generate_1.generate241Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.4.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.1:`, error);
                return null;
            }
        case '2.4.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.4.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _242_generate_1.generate242Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.4.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.2:`, error);
                return null;
            }
        case '2.5.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.5.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _251_generate_1.generate251Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.5.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.1:`, error);
                return null;
            }
        case '2.5.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.5.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _252_generate_1.generate252Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.5.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.2:`, error);
                return null;
            }
        case '2.6.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.6.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _261_generate_1.generate261Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.6.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.6.1:`, error);
                return null;
            }
        case '2.7.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.7.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _271_generate_1.generate271Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.7.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.1:`, error);
                return null;
            }
        case '2.7.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.7.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _272_generate_1.generate272Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.7.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.2:`, error);
                return null;
            }
        case '2.8.1':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.8.1');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _281_generate_1.generate281Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.8.1.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.8.1:`, error);
                return null;
            }
        case '2.8.2':
            try {
                const historyRecords = await (0, HistoryService_1.getHistory)('2.8.2');
                const historySummary = JSON.stringify(historyRecords);
                const questionDataArray = await (0, _282_generate_1.generate282Question)(questionNumber, historySummary, difficulty);
                console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${questionDataArray?.length ?? 0} question(s) for type 2.8.2.`);
                return questionDataArray;
            }
            catch (error) {
                console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.8.2:`, error);
                return null;
            }
        default:
            console.warn(`[DEBUG QuestionGeneratorService.ts] Unsupported question type: ${questionType}`);
            return null;
    }
}
exports.QuestionGeneratorService = {
    generateQuestionByType,
};
//# sourceMappingURL=QuestionGeneratorService.js.map