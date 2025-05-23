"use strict";
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
function generateQuestionByType(questionType_1) {
    return __awaiter(this, arguments, void 0, function* (questionType, difficulty = 70, historySummary = 'No history available.', questionNumber = 1) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        console.log(`[DEBUG QuestionGeneratorService.ts] Received request for type: ${questionType}, difficulty: ${difficulty}, number: ${questionNumber}`);
        switch (questionType) {
            case '1.1.1':
                try {
                    // 查詢歷史紀錄，這裡直接查詢 1.1.1 題型的所有紀錄
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.1.1');
                    // 直接將歷史紀錄序列化為字串作為 summary 傳遞
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _111_generate_1.generate111Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_a = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _a !== void 0 ? _a : 0} question(s) for type 1.1.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.1:`, error);
                    return null;
                }
            case '1.1.2':
                try {
                    // 查詢歷史紀錄，這裡直接查詢 1.1.2 題型的所有紀錄
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.1.2');
                    // 直接將歷史紀錄序列化為字串作為 summary 傳遞
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _112_generate_1.generate112Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_b = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _b !== void 0 ? _b : 0} question(s) for type 1.1.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.1.2:`, error);
                    return null;
                }
            case '1.2.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.2.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _121_generate_1.generate121Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_c = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _c !== void 0 ? _c : 0} question(s) for type 1.2.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.1:`, error);
                    return null;
                }
            case '1.2.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.2.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _122_generate_1.generate122Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_d = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _d !== void 0 ? _d : 0} question(s) for type 1.2.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.2:`, error);
                    return null;
                }
            case '1.2.3':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.2.3');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _123_generate_1.generate123Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_e = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _e !== void 0 ? _e : 0} question(s) for type 1.2.3.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.2.3:`, error);
                    return null;
                }
            case '1.3.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.3.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _131_generate_1.generate131Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_f = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _f !== void 0 ? _f : 0} question(s) for type 1.3.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.3.1:`, error);
                    return null;
                }
            case '1.4.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.4.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _141_generate_1.generate141Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_g = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _g !== void 0 ? _g : 0} question(s) for type 1.4.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.4.1:`, error);
                    return null;
                }
            case '1.5.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.5.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _151_generate_1.generate151Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_h = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _h !== void 0 ? _h : 0} question(s) for type 1.5.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.1:`, error);
                    return null;
                }
            case '1.5.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.5.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _152_generate_1.generate152Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_j = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _j !== void 0 ? _j : 0} question(s) for type 1.5.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.2:`, error);
                    return null;
                }
            case '1.5.3':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('1.5.3');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _153_generate_1.generate153Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_k = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _k !== void 0 ? _k : 0} question(s) for type 1.5.3.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 1.5.3:`, error);
                    return null;
                }
            case '2.1.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.1.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _211_generate_1.generate211Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_l = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _l !== void 0 ? _l : 0} question(s) for type 2.1.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.1:`, error);
                    return null;
                }
            case '2.1.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.1.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _212_generate_1.generate212Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_m = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _m !== void 0 ? _m : 0} question(s) for type 2.1.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.1.2:`, error);
                    return null;
                }
            case '2.2.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.2.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _221_generate_1.generate221Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_o = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _o !== void 0 ? _o : 0} question(s) for type 2.2.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.1:`, error);
                    return null;
                }
            case '2.2.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.2.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _222_generate_1.generate222Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_p = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _p !== void 0 ? _p : 0} question(s) for type 2.2.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.2.2:`, error);
                    return null;
                }
            case '2.3.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.3.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _231_generate_1.generate231Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_q = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _q !== void 0 ? _q : 0} question(s) for type 2.3.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.3.1:`, error);
                    return null;
                }
            case '2.4.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.4.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _241_generate_1.generate241Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_r = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _r !== void 0 ? _r : 0} question(s) for type 2.4.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.1:`, error);
                    return null;
                }
            case '2.4.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.4.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _242_generate_1.generate242Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_s = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _s !== void 0 ? _s : 0} question(s) for type 2.4.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.4.2:`, error);
                    return null;
                }
            case '2.5.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.5.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _251_generate_1.generate251Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_t = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _t !== void 0 ? _t : 0} question(s) for type 2.5.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.1:`, error);
                    return null;
                }
            case '2.5.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.5.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _252_generate_1.generate252Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_u = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _u !== void 0 ? _u : 0} question(s) for type 2.5.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.5.2:`, error);
                    return null;
                }
            case '2.6.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.6.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _261_generate_1.generate261Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_v = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _v !== void 0 ? _v : 0} question(s) for type 2.6.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.6.1:`, error);
                    return null;
                }
            case '2.7.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.7.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _271_generate_1.generate271Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_w = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _w !== void 0 ? _w : 0} question(s) for type 2.7.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.1:`, error);
                    return null;
                }
            case '2.7.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.7.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _272_generate_1.generate272Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_x = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _x !== void 0 ? _x : 0} question(s) for type 2.7.2.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.7.2:`, error);
                    return null;
                }
            case '2.8.1':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.8.1');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _281_generate_1.generate281Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_y = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _y !== void 0 ? _y : 0} question(s) for type 2.8.1.`);
                    return questionDataArray;
                }
                catch (error) {
                    console.error(`[DEBUG QuestionGeneratorService.ts] Error generating question for type 2.8.1:`, error);
                    return null;
                }
            case '2.8.2':
                try {
                    const historyRecords = yield (0, HistoryService_1.getHistory)('2.8.2');
                    const historySummary = JSON.stringify(historyRecords);
                    const questionDataArray = yield (0, _282_generate_1.generate282Question)(questionNumber, historySummary, difficulty);
                    console.log(`[DEBUG QuestionGeneratorService.ts] Generated ${(_z = questionDataArray === null || questionDataArray === void 0 ? void 0 : questionDataArray.length) !== null && _z !== void 0 ? _z : 0} question(s) for type 2.8.2.`);
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
    });
}
exports.QuestionGeneratorService = {
    generateQuestionByType,
};
// 如果希望直接導出函數而非物件，也可以這樣寫：
// export { generateQuestionByType }; 
//# sourceMappingURL=QuestionGeneratorService.js.map