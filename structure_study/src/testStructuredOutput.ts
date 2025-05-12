import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, GenerativeModel, Content, Part, FunctionDeclarationSchema, FunctionDeclaration, FunctionDeclarationsTool, FunctionResponsePart, GenerateContentResult, Schema, SchemaType } from '@google/generative-ai';

// --- .env 設定 ---
// structure_study 目錄相對於 llm_english_learning_read&write 目錄是 '../structure_study'
// 因此，要從 structure_study/src/testStructuredOutput.ts 找到 llm_english_learning_read&write/.env
// 需要向上回溯三層 ('..', '..', '..') 然後進入 'llm_english_learning_read&write'
const projectRoot = path.resolve(__dirname, '..', '..', '..', 'llm_english_learning_read&write');
const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

// --- API 金鑰與模型名稱 ---
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // 根據 project_rule

if (!API_KEY) {
    console.error(`
        --------------------------------------------------
        錯誤：找不到 GEMINI_API_KEY！
        請確認您的 API 金鑰已設定在以下路徑的 .env 檔案中：
        ${envPath}
        --------------------------------------------------
    `);
    process.exit(1); // 缺少 API 金鑰則終止執行
}

// --- 主測試函數 ---
async function testStructuredOutput() {
    console.log(`正在初始化 Gemini API (模型: ${MODEL_NAME})...`);
    const genAI = new GoogleGenerativeAI(API_KEY as string);
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        // 設定與 GeminiAPIService.ts 相同的安全閾值
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ]
    });

    console.log('Gemini API 初始化完成。');

    // --- 定義期望的回應綱要 (Response Schema) ---
    // 使用推測的 SchemaType 枚舉
    const personSchema: Schema = {
        type: SchemaType.OBJECT,     // 使用 SchemaType.OBJECT
        properties: {
            name: { type: SchemaType.STRING }, // 使用 SchemaType.STRING
            age: { type: SchemaType.NUMBER }   // 使用 SchemaType.NUMBER
        },
        required: ['name', 'age']
    };

    console.log('定義的回應綱要 (Response Schema):');
    console.log(JSON.stringify(personSchema, null, 2));

    // --- 準備提示 (Prompt) ---
    const prompt = "請生成一個關於名叫 Bob 的人物資訊，他 30 歲。";
    console.log(`\n正在使用提示發送請求至 Gemini: "${prompt}"`);

    try {
        // --- 發送請求 ---
        const result: GenerateContentResult = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { // 將 generationConfig 放在這裡
                responseMimeType: "application/json",
                responseSchema: personSchema,
            }
            // 其他 SingleRequestOptions 可以在這裡添加，例如 safetySettings (如果需要覆蓋模型級別的設定)
        });
        
        const response = result.response;
        console.log('\n--- Gemini API 回應 ---');

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
            const content = response.candidates[0].content;
            if (content.parts && content.parts.length > 0) {
                const part = content.parts[0];
                console.log('收到的 Content Part:', JSON.stringify(part, null, 2));
                
                // 檢查 part.text 是否存在且為非空字串
                if (part.text && typeof part.text === 'string') {
                    try {
                        const parsedJson = JSON.parse(part.text);
                        console.log('\n成功解析 Part 中的文字為 JSON:');
                        console.log(JSON.stringify(parsedJson, null, 2));
                    } catch (parseError) {
                        console.warn('\n警告：無法將 Part 中的文字直接解析為 JSON。原始文字:', part.text, parseError);
                    }
                } else {
                    console.warn('\n警告：Content Part 中缺少有效的文字內容 (part.text)。');
                }
            } else {
                console.warn('警告：回應的 Content 中沒有 parts。');
            }
        } else {
            console.error('錯誤：Gemini 回應中缺少有效的 candidates 或 content。');
            console.log('完整回應:', JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error('\n--- 呼叫 Gemini API 時發生錯誤 ---');
        if (error instanceof Error) {
            console.error('錯誤訊息:', error.message);
            console.error('錯誤堆疊:', error.stack);
        } else {
            console.error('未知錯誤:', error);
        }
    }
}

// --- 執行測試 ---
testStructuredOutput(); 