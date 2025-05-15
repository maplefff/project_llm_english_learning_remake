import requests
import json

BASE_URL = 'http://localhost:3001/api'

def print_response(response: requests.Response):
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except requests.exceptions.JSONDecodeError:
        print("Response Text:")
        print(response.text)
    print("----------")

def test_get_question_types():
    print("測試 GET /question-types")
    try:
        response = requests.get(f'{BASE_URL}/question-types')
        print_response(response)
    except requests.exceptions.RequestException as e:
        print(f"請求錯誤: {e}")
        print("----------")

def test_start_test_and_submit():
    print("測試 POST /start-test 和 POST /submit-answer")
    current_question_data = None
    
    # 1. 開始測驗 (獲取第一題)
    try:
        print("調用 POST /start-test...")
        start_payload = {'questionType': '1.1.1'}
        response_start = requests.post(f'{BASE_URL}/start-test', json=start_payload)
        print("POST /start-test 回應:")
        print_response(response_start)
        
        if response_start.status_code == 200:
            current_question_data = response_start.json()
            if not current_question_data or 'id' not in current_question_data or 'options' not in current_question_data:
                print("從 /start-test 收到的題目數據格式不正確，無法繼續提交答案。")
                current_question_data = None # 重置以避免後續錯誤
        else:
            print(f"無法開始測驗，狀態碼: {response_start.status_code}")
            return
            
    except requests.exceptions.RequestException as e:
        print(f"POST /start-test 請求錯誤: {e}")
        print("----------")
        return

    if not current_question_data:
        print("由於無法獲取有效的第一題，終止提交答案的測試。")
        return

    # 2. 提交答案 (假設選擇第一個選項)
    try:
        print("\n調用 POST /submit-answer...")
        question_id = current_question_data.get('id')
        # 模擬選擇第一個選項作為答案
        user_answer = None
        if current_question_data.get('options') and len(current_question_data['options']) > 0:
            user_answer = current_question_data['options'][0].get('id') 
        else:
            print("題目數據中沒有有效的選項，無法模擬答案。")
            # 可以選擇一個預設答案或終止
            user_answer = "A" # 預設一個答案以繼續流程，但這可能不正確
            print(f"警告: 未找到選項，使用預設答案 {user_answer}")
            
        if not question_id or user_answer is None:
            print(f"缺少 question_id ({question_id}) 或 user_answer ({user_answer})，無法提交。")
            return

        submit_payload = {
            'questionId': question_id,
            'userAnswer': user_answer,
            'questionDataSnapshot': current_question_data # 後端需要這個快照來判斷答案和記錄
        }
        response_submit = requests.post(f'{BASE_URL}/submit-answer', json=submit_payload)
        print("POST /submit-answer 回應:")
        print_response(response_submit)
    except requests.exceptions.RequestException as e:
        print(f"POST /submit-answer 請求錯誤: {e}")
        print("----------")

def test_get_history():
    print("\n測試 GET /history")
    try:
        # 假設我們測試題型 1.1.1 的歷史
        params = {'questionType': '1.1.1', 'limit': 5}
        response = requests.get(f'{BASE_URL}/history', params=params)
        print_response(response)
    except requests.exceptions.RequestException as e:
        print(f"請求錯誤: {e}")
        print("----------")

if __name__ == '__main__':
    print("開始手動 API 測試...")
    test_get_question_types()
    test_start_test_and_submit() # 內部會獲取第一題並嘗試提交一次答案
    test_get_history() # 在提交一些答案後檢查歷史記錄
    print("手動 API 測試完成。") 