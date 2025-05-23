/**
 * 英語學習系統API測試腳本
 * 測試所有25個題型的讀取和答案提交功能
 */

const API_BASE = 'http://localhost:3001/api';

// 所有25個題型
const ALL_QUESTION_TYPES = [
  '1.1.1', '1.1.2', '1.2.1', '1.2.2', '1.2.3',
  '1.3.1', '1.4.1', '1.5.1', '1.5.2', '1.5.3',
  '2.1.1', '2.1.2', '2.2.1', '2.2.2', '2.3.1',
  '2.4.1', '2.4.2', '2.5.1', '2.5.2', '2.6.1',
  '2.7.1', '2.7.2', '2.8.1', '2.8.2'
];

// 測試結果統計
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

/**
 * 延遲函數
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 發送POST請求
 */
async function postRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

/**
 * 測試單個題型
 */
async function testQuestionType(questionType) {
  console.log(`\n🧪 測試題型 ${questionType}...`);
  
  try {
    // 1. 測試獲取題目
    console.log(`   步驟1: 獲取題目...`);
    const questionResponse = await postRequest(`${API_BASE}/start-test`, {
      questionType: questionType
    });

    if (!questionResponse || !questionResponse.id) {
      throw new Error('無法獲取題目或題目格式錯誤');
    }

    console.log(`   ✅ 題目獲取成功，ID: ${questionResponse.id}`);
    
    // 2. 準備測試答案
    let testAnswer = 'A'; // 默認答案
    
    // 根據題型調整測試答案
    if (questionType.startsWith('1.') && questionResponse.options && questionResponse.options.length > 0) {
      // 選擇題：使用第一個選項
      testAnswer = questionResponse.options[0].id;
    } else if (questionType.startsWith('2.')) {
      // 寫作、翻譯等題型：使用文本答案
      if (questionType === '2.4.1') {
        // 排序題：假設有3個段落，答案格式為 "0,1,2"
        testAnswer = questionResponse.scrambled_sentences ? 
          questionResponse.scrambled_sentences.map((_, i) => i).join(',') : '0,1,2';
      } else {
        // 其他文本輸入題型
        testAnswer = `This is a test answer for question type ${questionType}.`;
      }
    }

    // 3. 測試提交答案
    console.log(`   步驟2: 提交答案...`);
    const submitResponse = await postRequest(`${API_BASE}/submit-answer`, {
      questionId: questionResponse.id,
      userAnswer: testAnswer,
      questionDataSnapshot: questionResponse
    });

    if (!submitResponse || !submitResponse.submissionResult) {
      throw new Error('答案提交失敗或返回格式錯誤');
    }

    console.log(`   ✅ 答案提交成功`);
    console.log(`   📊 結果: ${submitResponse.submissionResult.isCorrect ? '正確' : '錯誤'}`);
    
    // 記錄成功
    testResults.passed++;
    testResults.details.push({
      questionType,
      status: 'PASSED',
      questionId: questionResponse.id,
      testAnswer,
      result: submitResponse.submissionResult.isCorrect ? '正確' : '錯誤'
    });

  } catch (error) {
    console.log(`   ❌ 測試失敗: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      questionType,
      status: 'FAILED',
      error: error.message
    });
  }

  testResults.total++;
}

/**
 * 主測試函數
 */
async function runAllTests() {
  console.log('🚀 開始測試所有25個題型的API功能...\n');
  console.log('=' .repeat(60));

  for (const questionType of ALL_QUESTION_TYPES) {
    await testQuestionType(questionType);
    
    // 在測試之間添加延遲，避免過於頻繁的請求
    await delay(1000);
  }

  // 輸出最終結果
  console.log('\n' + '='.repeat(60));
  console.log('📋 測試結果總結:');
  console.log(`總測試數: ${testResults.total}`);
  console.log(`通過: ${testResults.passed}`);
  console.log(`失敗: ${testResults.failed}`);
  console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  // 詳細結果
  console.log('\n📊 詳細結果:');
  testResults.details.forEach(detail => {
    if (detail.status === 'PASSED') {
      console.log(`✅ ${detail.questionType}: 成功 (${detail.result})`);
    } else {
      console.log(`❌ ${detail.questionType}: 失敗 - ${detail.error}`);
    }
  });

  // 如果有失敗的測試，列出失敗的題型
  const failedTypes = testResults.details
    .filter(d => d.status === 'FAILED')
    .map(d => d.questionType);
  
  if (failedTypes.length > 0) {
    console.log('\n⚠️  失敗的題型:');
    failedTypes.forEach(type => console.log(`   - ${type}`));
  }

  console.log('\n🏁 測試完成!');
}

// 檢查 fetch API 是否可用（Node.js 18+）
if (typeof fetch === 'undefined') {
  console.error('❌ 此腳本需要 Node.js 18+ 或安裝 node-fetch');
  console.log('請使用以下命令安裝 node-fetch:');
  console.log('npm install node-fetch');
  process.exit(1);
}

// 運行測試
runAllTests().catch(error => {
  console.error('❌ 測試過程中發生嚴重錯誤:', error);
  process.exit(1);
}); 