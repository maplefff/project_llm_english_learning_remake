/**
 * Google Cloud TTS 語音合成示範 (JavaScript)
 * 此示例使用Google Cloud Text-to-Speech將固定文本轉換為語音
 */

import fs from 'fs';
import path from 'path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

async function main() {
  // 設定 Google Cloud TTS 憑證
  // 請先設定環境變數 GOOGLE_APPLICATION_CREDENTIALS 指向您的服務帳戶金鑰文件
  // 或在代碼中明確指定：
  // process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.env.GOOGLE_CREDS_PATH);

  const client = new TextToSpeechClient();

  // 使用固定的英文文本，不再使用Gemini生成
  const text = "Artificial intelligence is transforming our world through advanced algorithms that analyze data, learn patterns, and make decisions. It enhances productivity, solves complex problems, and creates new opportunities across industries.";
  console.log('使用的文字:', text);

  // 選擇語音模型 (請取消註解您想使用的語音)
  // 語言種類: en-US (美式英語)
  
  // 標準語音模型 (Standard) - 基本品質
  // const voiceName = 'en-US-Standard-A'; // 男聲
  // const voiceName = 'en-US-Standard-C'; // 女聲
  // const voiceName = 'en-US-Standard-E'; // 女聲
  // const voiceName = 'en-US-Standard-F'; // 女聲
  // const voiceName = 'en-US-Standard-I'; // 男聲
  
  // 高級語音模型 (Wavenet) - 更加自然
  // const voiceName = 'en-US-Wavenet-A'; // 男聲
  // const voiceName = 'en-US-Wavenet-C'; // 女聲
  // const voiceName = 'en-US-Wavenet-F'; // 女聲
  // const voiceName = 'en-US-Wavenet-H'; // 女聲
  // const voiceName = 'en-US-Wavenet-J'; // 男聲
  
  // 工作室語音 (Studio) - 高品質
  const voiceName = 'en-US-Studio-O'; // 女聲 (預設選項)
  // const voiceName = 'en-US-Studio-Q'; // 男聲
  
  // Neural2 語音 - 更新的神經網路語音
  // const voiceName = 'en-US-Neural2-A'; // 男聲
  // const voiceName = 'en-US-Neural2-C'; // 女聲
  // const voiceName = 'en-US-Neural2-F'; // 女聲
  // const voiceName = 'en-US-Neural2-H'; // 女聲
  
  // Chirp HD 語音 - 高清晰度
  // const voiceName = 'en-US-Chirp-HD-F'; // 女聲
  // const voiceName = 'en-US-Chirp-HD-D'; // 男聲
  
  // Chirp3 HD 星座語音 - 最高品質
  // const voiceName = 'en-US-Chirp3-HD-Achernar'; // 女聲
  // const voiceName = 'en-US-Chirp3-HD-Achird'; // 男聲
  // const voiceName = 'en-US-Chirp3-HD-Alnilam'; // 男聲
  // const voiceName = 'en-US-Chirp3-HD-Callirrhoe'; // 女聲
  // const voiceName = 'en-US-Chirp3-HD-Zephyr'; // 女聲
  
  // 特殊用途語音
  // const voiceName = 'en-US-News-K'; // 新聞播報風格 (女聲)
  // const voiceName = 'en-US-News-N'; // 新聞播報風格 (男聲)
  // const voiceName = 'en-US-Polyglot-1'; // 多語言支持 (男聲)

  // 使用 Google Cloud TTS 合成語音
  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', name: voiceName },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    // 使用相對路徑或從環境變數獲取輸出目錄
    const outputDir = process.env.OUTPUT_DIR || './output';
    fs.mkdirSync(outputDir, { recursive: true }); // 確保目錄存在
    // 構建新的輸出文件名
    const filename = `gemini_${voiceName}_Audio_example.mp3`;
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log(`語音檔案已成功儲存至 ${outputPath}`);
  } catch (error) {
    console.error('Google Cloud TTS 合成失敗:', error);
  }
}

main(); 