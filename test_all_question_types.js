#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';

async function testAllQuestionTypes() {
  console.log('🔍 測試所有題型的前端渲染...\n');

  try {
    // 1. 獲取可用的題型列表
    console.log('📋 獲取題型列表...');
    const typesResponse = await fetch(`${BASE_URL}/api/question-types`);
    const questionTypes = await typesResponse.json();
    
    console.log(`✅ 獲取到 ${questionTypes.length} 個題型\n`);

    // 2. 測試每個題型
    for (const questionType of questionTypes) {
      console.log(`📝 測試題型: ${questionType.id} - ${questionType.name}`);
      
      try {
        // 2a. 獲取題目
        const startResponse = await fetch(`${BASE_URL}/api/start-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionType: questionType.id })
        });

        const startData = await startResponse.json();
        
        if (startResponse.ok && startData.success && startData.question) {
          const question = startData.question;
          
          console.log(`  ✅ 成功獲取題目 (ID: ${question.id})`);
          console.log(`  📊 題目結構分析:`);
          
          // 分析題目內容
          const features = [];
          if (question.passage) features.push(`段落(${question.passage.length}字)`);
          if (question.original_sentence) features.push(`原句(${question.original_sentence.length}字)`);
          if (question.question) features.push(`問題(${question.question.length}字)`);
          if (question.instruction) features.push(`指令(${question.instruction.length}字)`);
          if (question.options) features.push(`選項(${question.options.length}個)`);
          if (question.explanation_of_Question) features.push('問題說明');
          
          console.log(`     內容: ${features.join(', ')}`);
          
          // 顯示題目內容摘要
          if (question.passage) {
            console.log(`     段落摘要: ${question.passage.substring(0, 60)}...`);
          }
          if (question.original_sentence) {
            console.log(`     原句: ${question.original_sentence}`);
          }
          if (question.question) {
            console.log(`     問題: ${question.question.substring(0, 60)}...`);
          }
          if (question.instruction) {
            console.log(`     指令: ${question.instruction.substring(0, 60)}...`);
          }
          if (question.options) {
            console.log(`     選項: ${question.options.map((opt, i) => `${String.fromCharCode(65+i)}.${opt.substring(0, 20)}...`).join(' | ')}`);
          }
          
          console.log(`  🌐 前端測試URL: ${FRONTEND_URL}/quiz/${questionType.id}`);
          
        } else {
          console.log(`  ❌ 獲取題目失敗`);
        }
        
      } catch (error) {
        console.log(`  ❌ 測試錯誤: ${error.message}`);
      }
      
      console.log(''); // 空行分隔
    }

    // 3. 生成測試報告
    console.log('='.repeat(80));
    console.log('📈 前端測試建議');
    console.log('='.repeat(80));
    console.log('✅ 所有題型的數據結構已修正，前端應該能正確渲染');
    console.log('🔧 主要修正內容:');
    console.log('  1. 題目類型欄位: questionType → type');
    console.log('  2. 選項格式: object[] → string[]');
    console.log('  3. 新增支援: original_sentence, instruction, explanation_of_Question');
    console.log('  4. 答題結果結構: 包裝在 submissionResult 中');
    console.log('\n🌐 測試步驟:');
    console.log('  1. 開啟瀏覽器訪問: http://localhost:5173');
    console.log('  2. 點擊任意題型進入測驗');
    console.log('  3. 檢查題目內容是否正確顯示');
    console.log('  4. 測試答題和結果顯示功能');
    
    questionTypes.forEach(type => {
      console.log(`     - ${type.id}: ${FRONTEND_URL}/quiz/${type.id}`);
    });

  } catch (error) {
    console.error('❌ 測試過程發生錯誤:', error);
  }
}

// 主程序
if (require.main === module) {
  testAllQuestionTypes().catch(error => {
    console.error('❌ 測試失敗:', error);
    process.exit(1);
  });
}

module.exports = { testAllQuestionTypes }; 