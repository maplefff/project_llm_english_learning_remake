#!/opt/homebrew/anaconda3/envs/python3.13/bin/python3
# -*- coding: utf-8 -*-
"""
Google Cloud TTS 語音合成示範 (Python)
此示例使用Google Cloud Text-to-Speech將固定文本轉換為語音
"""
import os
from pathlib import Path
from google.cloud import texttospeech


def main():
    # 取得 Google Cloud TTS 憑證
    # 方式1: 使用環境變數設定憑證路徑
    # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getenv("GOOGLE_CREDS_PATH")
    # 請確保已設定 GOOGLE_APPLICATION_CREDENTIALS 環境變數
    
    # 初始化 TTS Client
    tts_client = texttospeech.TextToSpeechClient()

    # 使用固定的英文文本，不再使用Gemini生成
    text = "Artificial intelligence is transforming our world through advanced algorithms that analyze data, learn patterns, and make decisions. It enhances productivity, solves complex problems, and creates new opportunities across industries."
    print(f"使用的文字: {text}")

    # 選擇語音模型 (請取消註解您想使用的語音)
    # 語言種類: en-US (美式英語)
    
    # 標準語音模型 (Standard) - 基本品質
    # voice_name = "en-US-Standard-A"  # 男聲
    # voice_name = "en-US-Standard-C"  # 女聲
    # voice_name = "en-US-Standard-E"  # 女聲
    # voice_name = "en-US-Standard-F"  # 女聲
    # voice_name = "en-US-Standard-I"  # 男聲
    
    # 高級語音模型 (Wavenet) - 更加自然
    # voice_name = "en-US-Wavenet-A"  # 男聲
    # voice_name = "en-US-Wavenet-C"  # 女聲
    # voice_name = "en-US-Wavenet-F"  # 女聲
    # voice_name = "en-US-Wavenet-H"  # 女聲
    # voice_name = "en-US-Wavenet-J"  # 男聲
    
    # 工作室語音 (Studio) - 高品質
    voice_name = "en-US-Studio-O"  # 女聲 (預設選項)
    # voice_name = "en-US-Studio-Q"  # 男聲
    
    # Neural2 語音 - 更新的神經網路語音
    # voice_name = "en-US-Neural2-A"  # 男聲
    # voice_name = "en-US-Neural2-C"  # 女聲
    # voice_name = "en-US-Neural2-F"  # 女聲
    # voice_name = "en-US-Neural2-H"  # 女聲
    
    # Chirp HD 語音 - 高清晰度
    # voice_name = "en-US-Chirp-HD-F"  # 女聲
    # voice_name = "en-US-Chirp-HD-D"  # 男聲
    
    # Chirp3 HD 星座語音 - 最高品質
    # voice_name = "en-US-Chirp3-HD-Achernar"  # 女聲
    # voice_name = "en-US-Chirp3-HD-Achird"    # 男聲
    # voice_name = "en-US-Chirp3-HD-Alnilam"   # 男聲
    # voice_name = "en-US-Chirp3-HD-Callirrhoe"  # 女聲
    # voice_name = "en-US-Chirp3-HD-Zephyr"    # 女聲
    
    # 特殊用途語音
    # voice_name = "en-US-News-K"  # 新聞播報風格 (女聲)
    # voice_name = "en-US-News-N"  # 新聞播報風格 (男聲)
    # voice_name = "en-US-Polyglot-1"  # 多語言支持 (男聲)

    # 使用 Google Cloud TTS 合成語音
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name=voice_name
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # 使用相對路徑或從環境變數獲取輸出目錄
    output_dir = os.getenv("OUTPUT_DIR", "./output")
    os.makedirs(output_dir, exist_ok=True)  # 確保目錄存在
    # 構建新的輸出文件名
    filename = f"gemini_{voice_name}_Audio_example.mp3"
    output_path = os.path.join(output_dir, filename)
    
    try:
        result = tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        with open(output_path, 'wb') as f:
            f.write(result.audio_content)
        print(f"語音檔案已成功儲存至 {output_path}")
    except Exception as e:
        print(f"Google Cloud TTS 合成失敗: {e}")


if __name__ == "__main__":
    main() 