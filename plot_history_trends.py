import json
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker # 用於格式化X軸

# 設定 Matplotlib 使用支援中文的字型
# 請確保您的系統中安裝了支援中文的字型，例如 'SimHei' (黑體) 或 'Microsoft JhengHei' (微軟正黑體)
# 如果以下字型無法使用，請替換成您系統中可用的中文字型名稱
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS'] # 或者 'SimHei', 'Microsoft JhengHei' 等
plt.rcParams['axes.unicode_minus'] = False  # 解決負號顯示問題

def load_history_data(file_path):
    """從 JSON 檔案載入歷史數據"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not data:
            print(f"警告: 檔案 {file_path} 為空。")
            return []
        # 按時間戳排序，確保數據順序正確
        data.sort(key=lambda x: x.get('timestamp', 0))
        return data
    except FileNotFoundError:
        print(f"錯誤: 找不到檔案 {file_path}")
        return []
    except json.JSONDecodeError:
        print(f"錯誤: 解析 JSON 檔案 {file_path} 失敗。")
        return []

def process_data_cumulative(history_data):
    """處理歷史數據，計算逐筆累計統計和移動平均"""
    if not history_data:
        return None

    processed_records = []
    for record in history_data:
        try:
            processed_records.append({
                'timestamp': datetime.fromtimestamp(record['timestamp'] / 1000),
                'isCorrect': bool(record['isCorrect'])
            })
        except KeyError as e:
            print(f"警告: 記錄中缺少鍵 {e}：{record}")
        except Exception as e:
            print(f"警告: 處理記錄時出錯 {record}: {e}")

    if not processed_records:
        print("沒有成功處理的記錄。")
        return None

    df = pd.DataFrame(processed_records)
    # 確保按時間戳排序，即使原始數據已排序，這裡再次確認
    df.sort_values(by='timestamp', inplace=True)
    df.reset_index(drop=True, inplace=True) # 重置索引，確保從0開始

    # 計算累計答題數
    df['cumulative_attempts'] = range(1, len(df) + 1)
    
    # 計算累計答對數
    df['cumulative_correct'] = df['isCorrect'].cumsum()
    
    # 計算累計正確率
    df['cumulative_accuracy_rate'] = (df['cumulative_correct'] / df['cumulative_attempts']).fillna(0)
    
    # 計算 10 筆記錄的移動平均
    df['accuracy_ma_10'] = df['cumulative_accuracy_rate'].rolling(window=10, min_periods=1).mean()
    
    return df

def plot_cumulative_accuracy_trend(cumulative_df, output_image_path):
    """僅繪製累計答題正確率的趨勢圖"""
    if cumulative_df is None or cumulative_df.empty:
        print("沒有數據可供繪圖。")
        return

    # 調整圖表大小以適應單個子圖
    fig, ax = plt.subplots(1, 1, figsize=(12, 6)) # 修改了 figsize，並且只有一個 ax

    # 繪製累計正確率
    ax.plot(cumulative_df.index + 1, cumulative_df['cumulative_accuracy_rate'], marker='.', linestyle='-', label='累計正確率')
    ax.plot(cumulative_df.index + 1, cumulative_df['accuracy_ma_10'], marker='', linestyle='--', color='red', label='10筆累計正確率移動平均')
    ax.set_ylabel('正確率 (0.0 - 1.0)')
    ax.set_title('累計答題正確率趨勢 (history111.json)') # 將檔名資訊直接放入標題
    ax.set_ylim(0, 1.1)
    ax.legend()
    ax.grid(True)

    ax.set_xlabel('作答序號 (按時間排序)')
    ax.xaxis.set_major_locator(ticker.MaxNLocator(integer=True))

    plt.tight_layout() # 自動調整佈局
    # fig.suptitle 不再需要，因為只有一個子圖，其標題已包含足夠資訊
    
    try:
        plt.savefig(output_image_path)
        print(f"圖表已儲存至: {output_image_path}")
    except Exception as e:
        print(f"儲存圖表失敗: {e}")
    
    try:
        plt.show()
    except Exception as e:
        print(f"顯示圖表時發生錯誤 (可能在無 GUI 環境中執行): {e}")

if __name__ == "__main__":
    # 使用者根目錄下的絕對路徑
    # 注意：請根據您的實際專案結構調整此路徑
    json_file_path = '/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/llm_english_learning_read&write/backend/historyData/history111.json'
    # 更新輸出檔名以反映內容變化
    output_image_file = '/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/history_cumulative_accuracy_trend.png' 
    
    history_data = load_history_data(json_file_path)
    if history_data:
        cumulative_stats_df = process_data_cumulative(history_data)
        if cumulative_stats_df is not None:
            #呼叫新的繪圖函數
            plot_cumulative_accuracy_trend(cumulative_stats_df, output_image_file)
        else:
            print("數據處理失敗，無法繪圖。")
    else:
        print("未能載入歷史數據。") 