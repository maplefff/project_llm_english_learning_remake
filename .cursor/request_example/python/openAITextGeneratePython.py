#!/opt/homebrew/anaconda3/envs/python3.13/bin/python3
# -*- coding: utf-8 -*-
"""
openAI 文字生成示範 (Python)
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

    # 模型設定，請參考最新價格: https://openai.com/pricing
    # 以下列出多種最新模型選項，實際使用時請選擇一種取消註解
    
    # model = "gpt-3.5-turbo"  # 經濟實惠且通用的選擇
    
    # 官方推薦的最新模型
    model = "gpt-4o"          # OpenAI 多模態旗艦模型
    # model = "gpt-4o-mini"     # gpt-4o 的輕量版
    
    # 高性能研究模型
    # model = "gpt-4.1"         # 最先進的研究模型
    # model = "gpt-4.1-mini"    # gpt-4.1 的輕量版
    # model = "gpt-4.1-nano"    # 更輕量的 gpt-4.1 版本
    
    # 實用且高效的模型
    # model = "o3"              # 平衡性能與效率的選擇
    # model = "o4-mini"         # 最新 o4 系列的輕量版

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "請用簡短的中文介紹人工智慧如何運作。"}
    ]
    prompt = next((m["content"] for m in messages if m["role"] == "user"), "") # 提取用戶prompt

    try:
        # 使用 OpenAI API 生成文字
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=1000
        )
        content = response.choices[0].message.content.strip()
        # 使用相對路徑或從環境變數獲取輸出目錄
        output_dir = os.getenv("OUTPUT_DIR", "./output")
        os.makedirs(output_dir, exist_ok=True)  # 確保目錄存在
        # 構建新的輸出文件名
        filename = f"openai_{model}_Text_example.md"
        output_path = Path(output_dir) / filename
        # 寫入檔案
        output_content = f"# OpenAI Text Generation Example\n\n## Model: {model}\n\n## Prompt:\n{prompt}\n\n## Output:\n{content}\n"
        output_path.write_text(output_content, encoding="utf-8")
        print(f"{output_content}\n")
        print(f"文字結果已成功儲存至 {output_path}")
    except Exception as e:
        print(f"OpenAI 文字生成失敗: {e}")


if __name__ == "__main__":
    main() 