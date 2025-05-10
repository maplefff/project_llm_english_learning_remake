#!/opt/homebrew/anaconda3/envs/python3.13/bin/python3
# -*- coding: utf-8 -*-
"""
Gemini AI 文字生成示範 (Python) - 使用 genai.Client
"""

import os
from pathlib import Path
import google.genai as genai  # 注意：使用 genai.Client 方式


def main():
    # 方式1: 從環境變數讀取 API 金鑰
    api_key = os.getenv("GEMINI_API_KEY")
    # 方式2: 從檔案讀取 API 金鑰 (使用環境變數設定路徑)
    # api_key = Path(os.getenv("GEMINI_KEY_PATH")).read_text(encoding="utf-8").strip()

    if not api_key:
        print("錯誤: 無法取得 Gemini API 金鑰")
        return

    # 初始化 Gemini Client
    # 注意：這是相對於 google.generativeai 的舊版或不同風格的 SDK 使用方式
    client = genai.Client(api_key=api_key)

    # 模型設定，請參考 https://ai.google.dev/gemini-api/docs/models 獲取最新模型資訊
    # 以下列出多種最新模型選項，實際使用時請選擇一種取消註解
    
    # 預設使用 Gemini 2.5 Flash Preview (最新預覽版)
    model_name = "gemini-2.5-flash-preview-04-17"  # 最佳性價比模型，良好的全方位能力
    
    # 其他可選模型
    # model_name = "gemini-2.5-pro-preview-03-25"  # 最強大的思考模型，最高回應準確度
    # model_name = "gemini-2.0-flash"              # 最新多模態模型，支援代碼生成、影像分析等功能
    # model_name = "gemini-1.5-flash"              # 快速通用性能模型
    
    prompt = "請用簡短的中文介紹人工智慧如何運作。"

    try:
        # 使用 client.models.generate_content 方法
        response = client.models.generate_content(
            model=model_name, 
            contents=[prompt]
        )
        # 檢查 response 是否包含 text 屬性
        text = getattr(response, 'text', None)
        
        if text:
            # 使用相對路徑或從環境變數獲取輸出目錄
            output_dir = os.getenv("OUTPUT_DIR", "./output")
            os.makedirs(output_dir, exist_ok=True)  # 確保目錄存在
            # 構建新的輸出文件名
            filename = f"gemini_{model_name}_Text_example.md"
            output_path = Path(output_dir) / filename
            # 寫入檔案
            output_content = f"# Gemini Text Generation Example\n\n## Model: {model_name}\n\n## Prompt:\n{prompt}\n\n## Output:\n{text}\n"
            output_path.write_text(output_content, encoding="utf-8")
            print(f"文字結果已成功儲存至 {output_path}")
        else:
            print("錯誤: API 回傳內容不包含文字。完整響應:", response)
    except Exception as e:
        print(f"Gemini 文字生成失敗: {e}")


if __name__ == "__main__":
    main() 