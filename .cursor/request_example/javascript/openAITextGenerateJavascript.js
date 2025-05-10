/**
 * openAI 文字生成示範 (JavaScript)
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai'; // 更新為最新的 OpenAI API 客戶端

async function main() {
  // 方式1: 從環境變數讀取 API 金鑰
  const apiKey = process.env.OPENAI_API_KEY;
  // 方式2: 從檔案讀取 API 金鑰 (使用環境變數設定路徑)
  // const apiKey = fs.readFileSync(process.env.OPENAI_KEY_PATH, 'utf8').trim();

  if (!apiKey) {
    console.error('錯誤: 無法取得 OpenAI API 金鑰');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey }); // 更新為新的客戶端初始化方式

  // 模型設定，請參考最新價格: https://openai.com/pricing
  // 以下列出多種最新模型選項，實際使用時請選擇一種取消註解
  
  //const model = 'gpt-3.5-turbo'; // 經濟實惠且通用的選擇
  
  // 官方推薦的最新模型
  const model = 'gpt-4o';         // OpenAI 多模態旗艦模型
  // const model = 'gpt-4o-mini';    // gpt-4o 的輕量版
  
  // 高性能研究模型
  // const model = 'gpt-4.1';        // 最先進的研究模型
  // const model = 'gpt-4.1-mini';   // gpt-4.1 的輕量版
  // const model = 'gpt-4.1-nano';   // 更輕量的 gpt-4.1 版本
  
  // 實用且高效的模型
  // const model = 'o3';             // 平衡性能與效率的選擇
  // const model = 'o4-mini';        // 最新 o4 系列的輕量版

  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: '請用簡短的中文介紹人工智慧如何運作。' }
  ];
  const prompt = messages.find(m => m.role === 'user')?.content || ''; // 提取用戶prompt

  try {
    // 使用最新的 OpenAI API 方法
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 1000
    });
    
    const content = response.choices[0].message.content.trim();
    // 使用相對路徑或從環境變數獲取輸出目錄
    const outputDir = process.env.OUTPUT_DIR || './output';
    fs.mkdirSync(outputDir, { recursive: true }); // 確保目錄存在
    // 構建新的輸出文件名
    const filename = `openai_${model}_Text_example.md`;
    const outputPath = path.join(outputDir, filename);
    // 寫入檔案
    fs.writeFileSync(outputPath, `# OpenAI Text Generation Example

## Model: ${model}

## Prompt:
${prompt}

## Output:
${content}
`);
    console.log(`文字結果已成功儲存至 ${outputPath}`);
    console.log(content);
  } catch (error) {
    console.error(`OpenAI 文字生成失敗: ${error}`);
  }
}

main(); 