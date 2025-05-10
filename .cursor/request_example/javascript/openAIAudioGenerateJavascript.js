/**
 * OpenAI 語音合成示範 (JavaScript)
 * 此示例使用OpenAI的Text-to-Speech API將固定文本轉換為語音
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

async function main() {
  // 從環境變數讀取 API 金鑰
  const apiKey = process.env.OPENAI_API_KEY;
  // 從檔案讀取 API 金鑰 (使用環境變數設定路徑)
  // const apiKey = fs.readFileSync(process.env.OPENAI_KEY_PATH, 'utf8').trim();

  if (!apiKey) {
    console.error('錯誤: 無法取得 OpenAI API 金鑰');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  // 語音模型設定
  // 請參考最新價格: https://openai.com/pricing
  // const model = "tts-1"; // 基本模型，約 $0.015 / 1K 字符
  // const model = "tts-1-hd"; // 高品質模型，約 $0.030 / 1K 字符
  const model = "gpt-4o-mini-tts"; // GPT-4o Mini TTS 模型，約 $0.002 / 1K 字符
  const voice = 'alloy'; // 可選: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'

  // 使用固定的英文文本
  const text = "Artificial intelligence is transforming our world through advanced algorithms that analyze data, learn patterns, and make decisions. It enhances productivity, solves complex problems, and creates new opportunities across industries.";
  console.log('使用的文字:', text);
  
  // 使用相對路徑或從環境變數獲取輸出目錄
  const outputDir = process.env.OUTPUT_DIR || './output';
  fs.mkdirSync(outputDir, { recursive: true }); // 確保目錄存在
  // 構建新的輸出文件名
  const filename = `openai_${model}_${voice}_Audio_example.mp3`;
  const outputPath = path.join(outputDir, filename);

  try {
    // 使用 OpenAI TTS API 合成語音
    const mp3 = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
    });
    
    // 獲取並保存音頻數據
    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`語音檔案已成功儲存至 ${outputPath}`);
  } catch (error) {
    console.error(`OpenAI TTS 合成失敗: ${error}`);
  }
}

main(); 