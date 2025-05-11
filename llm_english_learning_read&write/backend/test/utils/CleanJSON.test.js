"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CleanJSON_1 = require("../../src/utils/CleanJSON");
describe('CleanJSON', () => {
    let cleaner;
    beforeEach(() => {
        cleaner = new CleanJSON_1.CleanJSON();
    });
    describe('extractAndParse', () => {
        it('案例 1: 應能解析標準的 JSON 字串', () => {
            const jsonStr = '{"name":"John Doe","age":30}';
            const expected = { name: 'John Doe', age: 30 };
            expect(cleaner.extractAndParse(jsonStr)).toEqual(expected);
        });
        it('案例 2: 應能解析被 Markdown ```json ... ``` 包裹的 JSON 字串', () => {
            const markdownJson = '```json\n{"message":"Hello"}\n```';
            const expected = { message: 'Hello' };
            expect(cleaner.extractAndParse(markdownJson)).toEqual(expected);
        });
        it('案例 2.1: 應能解析被 Markdown ``` ... ``` (無 json 標籤) 包裹的 JSON 字串', () => {
            const markdownJson = '```\n{"data":[1,2,3]}\n```';
            const expected = { data: [1, 2, 3] };
            expect(cleaner.extractAndParse(markdownJson)).toEqual(expected);
        });
        it('案例 3: 應能解析前後帶有非 JSON 文本的 JSON 字串', () => {
            const mixedStr = '一些前置文字... { "key": "value", "number": 123 } ...一些後置文字';
            const expected = { key: 'value', number: 123 };
            expect(cleaner.extractAndParse(mixedStr)).toEqual(expected);
        });
        it('案例 3.1: 應能解析前後帶有換行符和非 JSON 文本的 JSON 字串', () => {
            const mixedStr = '\n  LLM 說： \n { "status": "success", "items": ["a", "b"] } \n 請查收。 \n';
            const expected = { status: 'success', items: ['a', 'b'] };
            expect(cleaner.extractAndParse(mixedStr)).toEqual(expected);
        });
        it('案例 3.2: 應能解析 Markdown 和前後文本混合的情況', () => {
            const mixedStr = '這是結果：\n```json\n{\"complex\": {\"nested\": true, \"arr\": [1, \"test\"]}}\n```\n希望你喜歡。';
            const expected = { complex: { nested: true, arr: [1, 'test'] } };
            expect(cleaner.extractAndParse(mixedStr)).toEqual(expected);
        });
        it('案例 4: 應能解析包含尾隨逗號的 JSON 物件 (簡單情況)', () => {
            const jsonWithTrailingComma = '{"a":1,"b":2,}';
            const expected = { a: 1, b: 2 };
            expect(cleaner.extractAndParse(jsonWithTrailingComma)).toEqual(expected);
        });
        it('案例 4.1: 應能解析包含尾隨逗號的 JSON 陣列 (簡單情況)', () => {
            const jsonWithTrailingComma = '[1,2,3,]';
            const expected = [1, 2, 3];
            expect(cleaner.extractAndParse(jsonWithTrailingComma)).toEqual(expected);
        });
        it('案例 4.2: 應能解析多層結構中包含尾隨逗號的 JSON (簡單情況)', () => {
            const jsonStr = '{\"id\": \"001\", \"items\": [\"apple\", \"banana\",], \"meta\": {\"count\": 2,},}';
            const expected = { id: '001', items: ['apple', 'banana'], meta: { count: 2 } };
            expect(cleaner.extractAndParse(jsonStr)).toEqual(expected);
        });
        it('案例 5: 輸入不完整的 JSON 字串應返回 null (例如，只有左括號)', () => {
            const incompleteJson = '{';
            expect(cleaner.extractAndParse(incompleteJson)).toBeNull();
        });
        it('案例 5.1: 輸入不完整的 JSON 字串應返回 null (例如，缺少右括號)', () => {
            const incompleteJson = '{"name":"test" ;'; // 故意放個分號使其無效
            expect(cleaner.extractAndParse(incompleteJson)).toBeNull();
        });
        it('案例 6: 輸入完全不含 JSON 的字串應返回 null', () => {
            const nonJsonStr = '這是一段普通文字，沒有 JSON。';
            expect(cleaner.extractAndParse(nonJsonStr)).toBeNull();
        });
        it('案例 7: 輸入空字串應返回 null', () => {
            expect(cleaner.extractAndParse('')).toBeNull();
        });
        it('案例 7.1: 輸入 null 應返回 null', () => {
            expect(cleaner.extractAndParse(null)).toBeNull();
        });
        it('案例 7.2: 輸入 undefined 應返回 null', () => {
            expect(cleaner.extractAndParse(undefined)).toBeNull();
        });
        it('案例 8: 只有 JSON 陣列的情況', () => {
            const arrayJson = '[{"id":1}, {"id":2}]';
            const expected = [{ id: 1 }, { id: 2 }];
            expect(cleaner.extractAndParse(arrayJson)).toEqual(expected);
        });
        it('案例 8.1: Markdown 包裹的 JSON 陣列', () => {
            const markdownArrayJson = '```json\n[\"a\", \"b\", \"c\"]\n```';
            const expected = ['a', 'b', 'c'];
            expect(cleaner.extractAndParse(markdownArrayJson)).toEqual(expected);
        });
        it('案例 8.2: 前後有文字的 JSON 陣列', () => {
            const mixedArrayJson = '結果如下： [true, false, null, 100] 請看。';
            const expected = [true, false, null, 100];
            expect(cleaner.extractAndParse(mixedArrayJson)).toEqual(expected);
        });
        //     it('案例 9: 如果提取和清理後的字串不是有效的 JSON，應返回 null', () => {
        //       const malformedJsonInMarkdown = '\```json\n{\"key\": \"value\", \"error
        // ione\n```'; // 故意破壞結構
        //       expect(cleaner.extractAndParse(malformedJsonInMarkdown)).toBeNull();
        //     });
        it('案例 10: 處理 JSON 字串中包含轉義的引號', () => {
            const jsonWithEscapedQuotes = '{"title":"The \\"Best\\" Book","author":"Jane Doe"}';
            const expected = { title: 'The "Best" Book', author: 'Jane Doe' };
            expect(cleaner.extractAndParse(jsonWithEscapedQuotes)).toEqual(expected);
        });
        it('案例 11: 處理 JSON 內容僅為一個簡單字串 (JSON.parse 後不是物件或陣列)', () => {
            const simpleStringJson = '"this is just a string"'; // JSON.parse 會解析為字串
            // 根據目前的 extractAndParse 實現，如果解析結果不是 object，會返回 null
            expect(cleaner.extractAndParse(simpleStringJson)).toBeNull();
        });
        it('案例 11.1: 處理 JSON 內容僅為一個數字 (JSON.parse 後不是物件或陣列)', () => {
            const simpleNumberJson = '12345'; // JSON.parse 會解析為數字
            expect(cleaner.extractAndParse(simpleNumberJson)).toBeNull();
        });
        it('案例 12: 內部包含 JSON 字串但整體不是 JSON 的情況', () => {
            const textWithJsonInside = 'The data is { \"name\": \"test\" } and the status is active.';
            const expected = { name: 'test' }; // 期望能提取出中間的 JSON 部分
            expect(cleaner.extractAndParse(textWithJsonInside)).toEqual(expected);
        });
        it('案例 13: 僅有空白或換行符的 Markdown 區塊', () => {
            const emptyMarkdown = '```json\n\n```';
            expect(cleaner.extractAndParse(emptyMarkdown)).toBeNull();
        });
        it('案例 14: 非常規的 Markdown JSON 標籤 (例如大寫 JSON)', () => {
            const markdownJson = '```JSON\n{\"valid\":true}\n```';
            const expected = { valid: true };
            expect(cleaner.extractAndParse(markdownJson)).toEqual(expected);
        });
        it('案例 15: 處理包含 Unicode 字元的 JSON', () => {
            const unicodeJson = '{\"name\":\"測試名稱\",\"value\":\"\u2713 checked\"}';
            const expected = { name: '測試名稱', value: '✓ checked' };
            expect(cleaner.extractAndParse(unicodeJson)).toEqual(expected);
        });
    });
});
//# sourceMappingURL=CleanJSON.test.js.map