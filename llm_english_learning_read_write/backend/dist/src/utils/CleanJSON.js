"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanJSON = void 0;
/**
 * 嘗試從原始字串中提取並解析 JSON 物件。
 * LLM 的回應有時會將 JSON 包裹在 Markdown 區塊中，或者在 JSON 前後附加額外文字。
 * 此函數會嘗試處理這些情況並安全地解析 JSON。
 */
class CleanJSON {
    /**
     * 從 LLM 的原始回應中提取並解析 JSON。
     *
     * @param rawLLMResponse LLM 返回的原始字串。
     * @returns 解析後的 JavaScript 物件/陣列，如果無法提取或解析則返回 null。
     */
    extractAndParse(rawLLMResponse) {
        if (!rawLLMResponse || typeof rawLLMResponse !== 'string') {
            return null;
        }
        let jsonString = rawLLMResponse.trim();
        // 1. 嘗試移除 Markdown JSON 區塊標記
        //    匹配 ```json ... ``` 或 ``` ... ``` (不區分大小寫的 json 標籤)
        const markdownMatch = jsonString.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
        if (markdownMatch && markdownMatch[1]) {
            jsonString = markdownMatch[1].trim();
        }
        // 2. 嘗試定位 JSON 的開始和結束大括號/中括號
        //    這有助於去除前後的額外文字。
        //    尋找第一個 '{' 或 '[' 以及最後一個 '}' 或 ']'
        const firstBracket = jsonString.indexOf('{');
        const firstSquareBracket = jsonString.indexOf('[');
        let startIndex = -1;
        if (firstBracket === -1 && firstSquareBracket === -1) {
            // 如果完全沒有大括號或中括號，很可能不是 JSON
            return null;
        }
        if (firstBracket !== -1 && firstSquareBracket !== -1) {
            startIndex = Math.min(firstBracket, firstSquareBracket);
        }
        else if (firstBracket !== -1) {
            startIndex = firstBracket;
        }
        else {
            startIndex = firstSquareBracket; // firstSquareBracket !== -1
        }
        const lastBracket = jsonString.lastIndexOf('}');
        const lastSquareBracket = jsonString.lastIndexOf(']');
        let endIndex = -1;
        if (lastBracket !== -1 && lastSquareBracket !== -1) {
            endIndex = Math.max(lastBracket, lastSquareBracket);
        }
        else if (lastBracket !== -1) {
            endIndex = lastBracket;
        }
        else if (lastSquareBracket !== -1) {
            endIndex = lastSquareBracket;
        }
        else {
            // 有開始但沒有結束，可能格式不對
            return null;
        }
        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
            // 無法有效定位 JSON 的起點和終點
            return null;
        }
        jsonString = jsonString.substring(startIndex, endIndex + 1);
        // 3. 嘗試修復常見的 JSON 瑕疵 (例如，尾隨逗號)
        //    注意：這個修復比較基礎，複雜的瑕疵可能無法處理
        //    移除物件和陣列中最後一個元素後的尾隨逗號
        jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
        // 4. 解析 JSON
        try {
            const parsedJson = JSON.parse(jsonString);
            // 額外檢查，確保解析出來的是物件或陣列，而不是單純的字串或數字等 (雖然 JSON.parse 通常會處理)
            if (typeof parsedJson === 'object' && parsedJson !== null) {
                return parsedJson;
            }
            return null;
        }
        catch (error) {
            // console.error('CleanJSON: JSON 解析失敗', error, '原始字串:', jsonString); // 開發時可開啟
            return null;
        }
    }
}
exports.CleanJSON = CleanJSON;
// 如果更傾向於直接調用函數而非實例化：
// export function extractAndParseJSON(rawLLMResponse: string | null | undefined): object | null {
//   const cleaner = new CleanJSON();
//   return cleaner.extractAndParse(rawLLMResponse);
// } 
//# sourceMappingURL=CleanJSON.js.map