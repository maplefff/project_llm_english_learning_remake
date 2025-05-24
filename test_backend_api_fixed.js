#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

async function testCorrectAPI() {
  console.log('🔍 開始測試正確的後端API...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    questionTypes: null,
    testResults: []
  };

  try {
    // 1. 獲取可用的題型列表
    console.log('📋 獲取題型列表...');
    const typesResponse = await fetch(`${BASE_URL}/api/question-types`);
    const questionTypes = await typesResponse.json();
    
    results.questionTypes = {
      status: typesResponse.status,
      success: typesResponse.ok,
      data: questionTypes,
      count: Array.isArray(questionTypes) ? questionTypes.length : 0
    };

    console.log(`✅ 獲取到 ${questionTypes.length} 個題型`);
    questionTypes.forEach(type => {
      console.log(`  - ${type.id}: ${type.name}`);
    });

    // 2. 測試每個題型的完整流程
    for (const questionType of questionTypes) {
      console.log(`\n📝 測試題型: ${questionType.id} - ${questionType.name}`);
      
      const testResult = {
        questionType: questionType.id,
        questionTypeName: questionType.name,
        startTest: null,
        submitAnswer: null,
        completeFlow: false
      };

      try {
        // 2a. 開始測驗
        console.log(`  ├─ POST /api/start-test`);
        const startPayload = { questionType: questionType.id };
        const startResponse = await fetch(`${BASE_URL}/api/start-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(startPayload)
        });

        const startData = await startResponse.json();
        
        testResult.startTest = {
          status: startResponse.status,
          success: startResponse.ok,
          payload: startPayload,
          data: startData,
          dataStructure: analyzeDataStructure(startData)
        };

        if (startResponse.ok && startData.success && startData.question) {
          console.log(`  │  ✅ 成功獲取題目`);
          console.log(`  │  📊 題目ID: ${startData.question.id}`);
          console.log(`  │  📊 題目類型: ${startData.question.type}`);
          
          // 顯示題目內容摘要
          const question = startData.question;
          if (question.original_sentence) {
            console.log(`  │  📝 原句: ${question.original_sentence.substring(0, 50)}...`);
          }
          if (question.passage) {
            console.log(`  │  📖 段落: ${question.passage.substring(0, 50)}...`);
          }
          if (question.options) {
            console.log(`  │  🔘 選項數: ${question.options.length}`);
          }

          // 2b. 提交答案
          console.log(`  └─ POST /api/submit-answer`);
          
          const userAnswer = generateMockAnswer(questionType.id, question);
          const submitPayload = {
            questionId: question.id,
            userAnswer: userAnswer,
            questionDataSnapshot: question
          };

          const submitResponse = await fetch(`${BASE_URL}/api/submit-answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitPayload)
          });

          const submitData = await submitResponse.json();
          
          testResult.submitAnswer = {
            status: submitResponse.status,
            success: submitResponse.ok,
            payload: submitPayload,
            data: submitData,
            dataStructure: analyzeDataStructure(submitData)
          };

          if (submitResponse.ok) {
            console.log(`     ✅ 成功提交答案`);
            if (submitData.submissionResult) {
              console.log(`     📊 答案正確性: ${submitData.submissionResult.isCorrect ? '✅ 正確' : '❌ 錯誤'}`);
              console.log(`     📊 正確答案: ${submitData.submissionResult.correctAnswer || 'N/A'}`);
            }
            if (submitData.nextQuestion) {
              console.log(`     📊 下一題: ${submitData.nextQuestion ? '✅ 已提供' : '❌ 無'}`);
            }
            testResult.completeFlow = true;
          } else {
            console.log(`     ❌ 提交答案失敗: ${submitResponse.status}`);
            console.log(`     📄 錯誤回應: ${JSON.stringify(submitData, null, 2)}`);
          }

        } else {
          console.log(`  │  ❌ 獲取題目失敗: ${startResponse.status}`);
          console.log(`  │  📄 錯誤回應: ${JSON.stringify(startData, null, 2)}`);
        }

      } catch (error) {
        console.log(`  └─ ❌ 測試錯誤: ${error.message}`);
        testResult.error = error.message;
      }

      results.testResults.push(testResult);
    }

    // 3. 測試歷史記錄API
    console.log('\n📚 測試歷史記錄API...');
    try {
      const historyResponse = await fetch(`${BASE_URL}/api/history`);
      const historyData = await historyResponse.json();
      
      results.historyAPI = {
        status: historyResponse.status,
        success: historyResponse.ok,
        data: historyData,
        dataStructure: analyzeDataStructure(historyData),
        count: Array.isArray(historyData) ? historyData.length : 0
      };

      if (historyResponse.ok) {
        console.log(`✅ 歷史記錄API正常，共 ${results.historyAPI.count} 筆記錄`);
      } else {
        console.log(`❌ 歷史記錄API失敗: ${historyResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ 歷史記錄API錯誤: ${error.message}`);
      results.historyAPI = { error: error.message };
    }

  } catch (error) {
    console.log(`❌ 主要測試流程錯誤: ${error.message}`);
    results.error = error.message;
  }

  // 儲存測試結果
  const outputFile = `/Users/wu_cheng_yan/cursor/project_llm_english_learning_remake/api_test_results_fixed_${Date.now()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  
  console.log(`\n📄 完整測試結果已儲存至: ${outputFile}`);
  
  // 生成分析報告
  generateAnalysisReport(results);
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
  if (questionType.startsWith('1.1')) {
    // 詞彙類選擇題
    if (questionData.options && questionData.options.length > 0) {
      return questionData.options[0]; // 選擇第一個選項
    }
    return 'A';
  } else if (questionType.startsWith('1.2.1')) {
    // 句子改錯
    if (questionData.standard_corrections && questionData.standard_corrections.length > 0) {
      return questionData.standard_corrections[0]; // 使用標準答案
    }
    return 'This is a corrected sentence.';
  } else if (questionType.startsWith('1.2')) {
    // 語法類選擇題
    if (questionData.options && questionData.options.length > 0) {
      return questionData.options[0];
    }
    return 'A';
  } else {
    // 其他寫作類題型
    return 'This is a test answer for API testing purposes.';
  }
}

function generateAnalysisReport(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📈 後端API分析報告');
  console.log('='.repeat(80));
  
  // 整體統計
  const totalTypes = results.testResults.length;
  const successfulStarts = results.testResults.filter(test => 
    test.startTest && test.startTest.success
  ).length;
  const successfulSubmits = results.testResults.filter(test => 
    test.submitAnswer && test.submitAnswer.success
  ).length;
  const completeFlows = results.testResults.filter(test => test.completeFlow).length;
  
  console.log(`📊 整體統計:`);
  console.log(`  總題型數: ${totalTypes}`);
  console.log(`  成功開始測驗: ${successfulStarts}/${totalTypes} (${(successfulStarts/totalTypes*100).toFixed(1)}%)`);
  console.log(`  成功提交答案: ${successfulSubmits}/${totalTypes} (${(successfulSubmits/totalTypes*100).toFixed(1)}%)`);
  console.log(`  完整流程: ${completeFlows}/${totalTypes} (${(completeFlows/totalTypes*100).toFixed(1)}%)`);

  // 各題型詳細狀態
  console.log('\n📋 各題型詳細狀態:');
  results.testResults.forEach(test => {
    const startStatus = test.startTest?.success ? '✅' : '❌';
    const submitStatus = test.submitAnswer?.success ? '✅' : '❌';
    const flowStatus = test.completeFlow ? '✅' : '❌';
    
    console.log(`  ${test.questionType}:`);
    console.log(`    開始測驗: ${startStatus}`);
    console.log(`    提交答案: ${submitStatus}`);
    console.log(`    完整流程: ${flowStatus}`);
  });

  // 數據結構分析
  console.log('\n🔍 數據結構分析:');
  
  const successfulTests = results.testResults.filter(test => test.startTest?.success);
  if (successfulTests.length > 0) {
    const sampleQuestion = successfulTests[0].startTest.data.question;
    console.log('\n📝 題目數據結構範例:');
    console.log('  主要欄位:');
    Object.keys(sampleQuestion).forEach(key => {
      const value = sampleQuestion[key];
      const type = Array.isArray(value) ? `array(${value.length})` : typeof value;
      console.log(`    ${key}: ${type}`);
    });

    // 分析各題型的數據差異
    console.log('\n📊 各題型數據特徵:');
    successfulTests.forEach(test => {
      const question = test.startTest.data.question;
      const features = [];
      
      if (question.options) features.push(`選項:${question.options.length}個`);
      if (question.passage) features.push('有段落');
      if (question.original_sentence) features.push('有原句');
      if (question.standard_corrections) features.push('有標準答案');
      if (question.instruction) features.push('有指令');
      
      console.log(`    ${test.questionType}: ${features.join(', ')}`);
    });
  }

  // 前端渲染建議
  console.log('\n💡 前端渲染建議:');
  console.log('  1. 題目結構統一，前端可用通用組件處理');
  console.log('  2. 根據題型判斷顯示哪些欄位:');
  console.log('     - 1.1.x: 顯示 passage + options');
  console.log('     - 1.2.1: 顯示 original_sentence + instruction');
  console.log('     - 1.2.x: 顯示 question + options');
  console.log('  3. 答案輸入組件需根據題型調整:');
  console.log('     - 選擇題: radio buttons');
  console.log('     - 改錯題: textarea');
  console.log('  4. 結果顯示需要處理 submissionResult 結構');
}

// 主程序
if (require.main === module) {
  testCorrectAPI().catch(error => {
    console.error('❌ 測試過程發生錯誤:', error);
    process.exit(1);
  });
}

module.exports = { testCorrectAPI, analyzeDataStructure }; 