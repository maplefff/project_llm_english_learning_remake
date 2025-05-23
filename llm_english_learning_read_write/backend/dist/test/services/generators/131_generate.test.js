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
const _131_generate_1 = require("../../../src/services/generators/131_generate");
describe('131_generate', () => {
    test('應該生成有效的 1.3.1 段落主旨題', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, _131_generate_1.generate131Question)(1);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
        if (result && result.length > 0) {
            const question = result[0];
            // 驗證必需欄位
            expect(question).toHaveProperty('passage');
            expect(question).toHaveProperty('question');
            expect(question).toHaveProperty('options');
            expect(question).toHaveProperty('standard_answer');
            expect(question).toHaveProperty('explanation_of_Question');
            // 驗證欄位類型
            expect(typeof question.passage).toBe('string');
            expect(typeof question.question).toBe('string');
            expect(Array.isArray(question.options)).toBe(true);
            expect(typeof question.standard_answer).toBe('string');
            expect(typeof question.explanation_of_Question).toBe('string');
            // 驗證選項數量
            expect(question.options).toHaveLength(4);
            // 驗證選項格式
            question.options.forEach(option => {
                expect(option).toHaveProperty('id');
                expect(option).toHaveProperty('text');
                expect(typeof option.id).toBe('string');
                expect(typeof option.text).toBe('string');
            });
            // 驗證標準答案在選項中
            const optionIds = question.options.map(opt => opt.id);
            expect(optionIds).toContain(question.standard_answer);
        }
    }), 30000); // 30秒超時
    test('應該生成多個題目', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, _131_generate_1.generate131Question)(2);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
    }), 45000);
    test('應該處理不同的難度設定', () => __awaiter(void 0, void 0, void 0, function* () {
        const easyResult = yield (0, _131_generate_1.generate131Question)(1, "", 30);
        const hardResult = yield (0, _131_generate_1.generate131Question)(1, "", 90);
        expect(easyResult).not.toBeNull();
        expect(hardResult).not.toBeNull();
    }), 30000);
    test('應該處理歷史摘要', () => __awaiter(void 0, void 0, void 0, function* () {
        const historyMock = "Previous questions: topics about environment and technology";
        const result = yield (0, _131_generate_1.generate131Question)(1, historyMock);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    }), 30000);
    test('應該在生成失敗時返回 null', () => __awaiter(void 0, void 0, void 0, function* () {
        // 測試無效參數
        const result = yield (0, _131_generate_1.generate131Question)(0);
        expect(result).toBeNull();
    }));
});
//# sourceMappingURL=131_generate.test.js.map