/**
 * Gemini AI 文字生成示範 (JavaScript) - 使用 @google/genai
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai'; // 使用 @google/genai 套件

async function main() {
  // 方式1: 從環境變數讀取 API 金鑰
  const apiKey = process.env.GEMINI_API_KEY;
  // 方式2: 從檔案讀取 API 金鑰 (使用環境變數設定路徑)
  // const apiKey = fs.readFileSync(process.env.GEMINI_KEY_PATH, 'utf8').trim();

  if (!apiKey) {
    console.error('錯誤: 無法取得 Gemini API 金鑰');
    process.exit(1);
  }

  // 使用 @google/genai 的初始化方式
  const ai = new GoogleGenAI({ apiKey });

  // 模型設定，請參考 https://ai.google.dev/gemini-api/docs/models 獲取最新模型資訊
  // 以下列出多種最新模型選項，實際使用時請選擇一種取消註解
  
  // 預設使用 Gemini 2.5 Flash Preview (最新預覽版)
  const modelName = 'gemini-2.5-flash-preview-04-17'; // 最佳性價比模型，良好的全方位能力
  
  // 其他可選模型
  // const modelName = 'gemini-2.5-pro-preview-03-25'; // 最強大的思考模型，最高回應準確度
  // const modelName = 'gemini-2.0-flash'; // 最新多模態模型，支援代碼生成、影像分析等功能
  // const modelName = 'gemini-1.5-flash'; // 快速通用性能模型
  
  const prompt = '請用簡短的中文介紹人工智慧如何運作。';
  try {
    // 使用 ai.models.generateContent 方法
    const response = await ai.models.generateContent({ 
        model: modelName, 
        contents: prompt 
    });
    // 直接獲取 response.text
    const text = response.text; 
    if (text) {
      // 使用相對路徑或從環境變數獲取輸出目錄
      const outputDir = process.env.OUTPUT_DIR || './output';
      fs.mkdirSync(outputDir, { recursive: true }); // 確保目錄存在
      // 構建新的輸出文件名
      const filename = `gemini_${modelName}_Text_example.md`;
      const outputPath = path.join(outputDir, filename);
      // 寫入檔案
      fs.writeFileSync(outputPath, `# Gemini Text Generation Example

## Model: ${modelName}

## Prompt:
${prompt}

## Output:
${text}
`);
      console.log(text);
      console.log(`文字結果已成功儲存至 ${outputPath}`);
    } else {
      console.error('錯誤: API 回傳空內容. 完整響應:', response);
    }
  } catch (e) {
    console.error('Gemini 文字生成失敗:', e);
  }
}

main(); 