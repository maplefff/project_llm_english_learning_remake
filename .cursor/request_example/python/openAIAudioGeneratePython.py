#!/opt/homebrew/anaconda3/envs/python3.13/bin/python3
# -*- coding: utf-8 -*-
"""
OpenAI 語音合成示範 (Python)
此示例使用OpenAI的Text-to-Speech API將固定文本轉換為語音
"""

import os
from pathlib import Path
from openai import OpenAI


def main():
    # 從環境變數讀取 API 金鑰
    api_key = os.getenv("OPENAI_API_KEY")
    # 從檔案讀取 API 金鑰 (使用環境變數設定路徑)
    # api_key = Path(os.getenv("OPENAI_KEY_PATH")).read_text(encoding="utf-8").strip()

    if not api_key:
        print("錯誤: 無法取得 OpenAI API 金鑰")
        return

    # 初始化 OpenAI 客戶端
    client = OpenAI(api_key=api_key)

    # 語音模型設定
    # 請參考最新價格: https://openai.com/pricing
    # model = "tts-1"      # 基本模型，約 $0.015 / 1K 字符
    # model = "tts-1-hd"   # 高品質模型，約 $0.030 / 1K 字符
    model = "gpt-4o-mini-tts"  # GPT-4o Mini TTS 模型，約 $0.002 / 1K 字符
    voice = "alloy"  # 可選: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'

    # 使用固定的英文文本
    text = "Artificial intelligence is transforming our world through advanced algorithms that analyze data, learn patterns, and make decisions. It enhances productivity, solves complex problems, and creates new opportunities across industries."
    print(f"使用的文字: {text}")
    
    # 使用相對路徑或從環境變數獲取輸出目錄
    output_dir = os.getenv("OUTPUT_DIR", "./output")
    os.makedirs(output_dir, exist_ok=True)  # 確保目錄存在
    # 構建新的輸出文件名
    filename = f"openai_{model}_{voice}_Audio_example.mp3"
    output_path = os.path.join(output_dir, filename)

    try:
        # 使用 OpenAI TTS API 合成語音
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text
        )
        
        # 保存音頻檔案
        response.stream_to_file(output_path)
        print(f"語音檔案已成功儲存至 {output_path}")
    except Exception as e:
        print(f"OpenAI TTS 合成失敗: {e}")


if __name__ == "__main__":
    main() 