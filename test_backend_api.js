#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const AVAILABLE_QUESTION_TYPES = [
  '1.1.1', '1.1.2', '1.1.3', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.4.1',
  '1.5.1', '1.6.1', '1.6.2', '1.6.3',
  '2.1.1', '2.1.2', '2.1.3', '2.2.1', '2.2.2', '2.2.3', '2.3.1', '2.3.2',
  '2.4.1', '2.4.2', '2.5.1', '2.5.2'
];

async function testAPI() {
  console.log('🔍 開始測試後端API...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    tests: []
  };

  // 測試每個題型的API
  for (const questionType of AVAILABLE_QUESTION_TYPES) {
    console.log(`📝 測試題型: ${questionType}`);
    
    const testResult = {
      questionType,
      endpoints: {}
    };

    try {
      // 1. 測試獲取題目
      console.log(`  ├─ GET /api/questions/${questionType}`);
      const questionResponse = await fetch(`${BASE_URL}/api/questions/${questionType}`);
      const questionData = await questionResponse.json();
      
      testResult.endpoints.getQuestion = {
        status: questionResponse.status,
        success: questionResponse.ok,
        data: questionData,
        dataStructure: analyzeDataStructure(questionData)
      };

      if (questionResponse.ok) {
        console.log(`  │  ✅ 成功獲取題目`);
        console.log(`  │  📊 題目結構: ${JSON.stringify(testResult.endpoints.getQuestion.dataStructure, null, 2)}`);
        
        // 2. 測試提交答案（如果有題目ID）
        if (questionData.id) {
          console.log(`  └─ POST /api/questions/submit`);
          
          const submitPayload = {
            questionId: questionData.id,
            questionType: questionType,
            userAnswer: generateMockAnswer(questionType, questionData)
          };

          const submitResponse = await fetch(`${BASE_URL}/api/questions/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitPayload)
          });

          const submitData = await submitResponse.json();
          
          testResult.endpoints.submitAnswer = {
            status: submitResponse.status,
            success: submitResponse.ok,
            payload: submitPayload,
            data: submitData,
            dataStructure: analyzeDataStructure(submitData)
          };

          if (submitResponse.ok) {
            console.log(`     ✅ 成功提交答案`);
            console.log(`     📊 回應結構: ${JSON.stringify(testResult.endpoints.submitAnswer.dataStructure, null, 2)}`);
          } else {
            console.log(`     ❌ 提交答案失敗: ${submitResponse.status}`);
          }
        }
      } else {
        console.log(`  │  ❌ 獲取題目失敗: ${questionResponse.status}`);
        console.log(`  │  📄 錯誤回應: ${JSON.stringify(questionData, null, 2)}`);
      }

    } catch (error) {
      console.log(`  └─ ❌ 請求錯誤: ${error.message}`);
      testResult.error = error.message;
    }

    results.tests.push(testResult);
    console.log(''); // 空行分隔
  }

  // 3. 測試歷史記錄API
  console.log('📚 測試歷史記錄API...');
  try {
    const historyResponse = await fetch(`${BASE_URL}/api/history`);
    const historyData = await historyResponse.json();
    
    results.historyAPI = {
      status: historyResponse.status,
      success: historyResponse.ok,
      data: historyData,
      dataStructure: analyzeDataStructure(historyData)
    };

    if (historyResponse.ok) {
      console.log('✅ 歷史記錄API正常');
      console.log(`📊 歷史記錄結構: ${JSON.stringify(results.historyAPI.dataStructure, null, 2)}`);
    } else {
      console.log(`❌ 歷史記錄API失敗: ${historyResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ 歷史記錄API錯誤: ${error.message}`);
    results.historyAPI = { error: error.message };
  }

  // 4. 測試統計API
  console.log('\n📊 測試統計API...');
  try {
    const statsResponse = await fetch(`${BASE_URL}/api/stats`);
    const statsData = await statsResponse.json();
    
    results.statsAPI = {
      status: statsResponse.status,
      success: statsResponse.ok,
      data: statsData,
      dataStructure: analyzeDataStructure(statsData)
    };

    if (statsResponse.ok) {
      console.log('✅ 統計API正常');
      console.log(`📊 統計結構: ${JSON.stringify(results.statsAPI.dataStructure, null, 2)}`);
    } else {
      console.log(`❌ 統計API失敗: ${statsResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ 統計API錯誤: ${error.message}`);
    results.statsAPI = { error: error.message };
  }

  // 儲存測試結果
  const outputFile = `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/api_test_results_${Date.now()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  
  console.log(`\n📄 完整測試結果已儲存至: ${outputFile}`);
  
  // 生成摘要報告
  generateSummaryReport(results);
}

function analyzeDataStructure(data) {
  if (data === null) return { type: 'null' };
  if (data === undefined) return { type: 'undefined' };
  
  const type = Array.isArray(data) ? 'array' : typeof data;
  
  if (type === 'object') {
    const structure = {};
    for (const key in data) {
      structure[key] = analyzeDataStructure(data[key]);
    }
    return { type, properties: structure };
  } else if (type === 'array') {
    return {
      type,
      length: data.length,
      itemType: data.length > 0 ? analyzeDataStructure(data[0]) : 'empty'
    };
  } else {
    return { type, value: typeof data === 'string' && data.length > 100 ? `${data.substring(0, 100)}...` : data };
  }
}

function generateMockAnswer(questionType, questionData) {
  // 根據題型生成模擬答案
  if (questionType.startsWith('1.1') || questionType.startsWith('1.2')) {
    // 選擇題類型
    if (questionData.options && questionData.options.length > 0) {
      return questionData.options[0]; // 選擇第一個選項
    }
    return 'A'; // 預設答案
  } else {
    // 其他題型使用文字答案
    return 'This is a test answer for API testing purposes.';
  }
}

function generateSummaryReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📈 API測試摘要報告');
  console.log('='.repeat(80));
  
  const successCount = results.tests.filter(test => 
    test.endpoints.getQuestion && test.endpoints.getQuestion.success
  ).length;
  
  console.log(`✅ 成功的題型: ${successCount}/${results.tests.length}`);
  console.log(`📊 成功率: ${(successCount / results.tests.length * 100).toFixed(1)}%`);
  
  console.log('\n📋 各題型狀態:');
  results.tests.forEach(test => {
    const status = test.endpoints.getQuestion?.success ? '✅' : '❌';
    console.log(`  ${status} ${test.questionType}`);
  });

  console.log('\n🔧 建議修正方向:');
  
  // 分析常見的數據結構問題
  const questionStructures = results.tests
    .filter(test => test.endpoints.getQuestion?.success)
    .map(test => test.endpoints.getQuestion.dataStructure);
  
  if (questionStructures.length > 0) {
    console.log('📝 題目數據結構分析:');
    const sampleStructure = questionStructures[0];
    console.log(`  典型結構: ${JSON.stringify(sampleStructure, null, 4)}`);
    
    // 檢查關鍵欄位
    const hasQuestionText = questionStructures.some(s => 
      s.properties && (s.properties.question || s.properties.questionText || s.properties.content)
    );
    const hasOptions = questionStructures.some(s => 
      s.properties && s.properties.options
    );
    const hasPassage = questionStructures.some(s => 
      s.properties && (s.properties.passage || s.properties.text || s.properties.content)
    );
    
    console.log('🔍 關鍵欄位檢查:');
    console.log(`  題目文字: ${hasQuestionText ? '✅' : '❌'}`);
    console.log(`  選項列表: ${hasOptions ? '✅' : '❌'}`);
    console.log(`  文章段落: ${hasPassage ? '✅' : '❌'}`);
  }
  
  console.log('\n💡 前端修正建議:');
  console.log('  1. 檢查 QuestionRenderer.vue 的 props 對應');
  console.log('  2. 確認 API 回傳欄位名稱與前端預期一致');
  console.log('  3. 添加數據驗證和錯誤處理');
  console.log('  4. 檢查題目類型映射是否正確');
}

// 檢查 Node.js 環境和依賴
function checkEnvironment() {
  try {
    require('node-fetch');
    return true;
  } catch (error) {
    console.log('❌ 缺少 node-fetch 依賴');
    console.log('請執行: npm install node-fetch@2');
    return false;
  }
}

// 主程序
if (require.main === module) {
  if (checkEnvironment()) {
    testAPI().catch(error => {
      console.error('❌ 測試過程發生錯誤:', error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

module.exports = { testAPI, analyzeDataStructure }; 