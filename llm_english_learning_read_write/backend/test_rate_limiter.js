const { RateLimiterService } = require('./dist/src/services/RateLimiterService');
const { GeminiAPIService } = require('./dist/src/services/GeminiAPIService');

async function testRateLimiter() {
  console.log('🧪 開始測試速率限制器...');
  
  try {
    // 測試1：檢查速率限制器狀態
    console.log('\n📊 檢查速率限制器狀態:');
    const status = RateLimiterService.getStatus();
    console.log('- 是否啟用:', status.isEnabled);
    console.log('- 排隊長度:', status.queueLength);
    console.log('- 當前窗口請求數:', status.requestsInCurrentWindow);
    console.log('- 預估等待時間:', status.estimatedWaitTime + 'ms');
    
    // 測試2：發送一個簡單的API請求
    console.log('\n🚀 發送測試API請求:');
    const testPrompt = "Generate a simple English sentence.";
    
    console.log('發送請求:', testPrompt);
    const startTime = Date.now();
    
    try {
      const response = await GeminiAPIService.getResponse(
        testPrompt,
        undefined,
        2, // MEDIUM priority
        'test_script'
      );
      
      const endTime = Date.now();
      console.log('✅ 請求成功!');
      console.log('- 響應時間:', (endTime - startTime) + 'ms');
      console.log('- 響應內容:', typeof response === 'string' ? response.substring(0, 100) + '...' : 'JSON response');
      
    } catch (error) {
      console.log('❌ 請求失敗:', error.message);
    }
    
    // 測試3：檢查更新後的狀態
    console.log('\n📊 請求後的速率限制器狀態:');
    const statusAfter = RateLimiterService.getStatus();
    console.log('- 排隊長度:', statusAfter.queueLength);
    console.log('- 當前窗口請求數:', statusAfter.requestsInCurrentWindow);
    console.log('- 總處理數:', statusAfter.totalProcessed);
    console.log('- 總失敗數:', statusAfter.totalFailed);
    console.log('- 成功率:', statusAfter.successRate.toFixed(2) + '%');
    
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
  
  console.log('\n✅ 速率限制器測試完成!');
}

// 運行測試
testRateLimiter().catch(console.error); 
const { GeminiAPIService } = require('./dist/src/services/GeminiAPIService');

async function testRateLimiter() {
  console.log('🧪 開始測試速率限制器...');
  
  try {
    // 測試1：檢查速率限制器狀態
    console.log('\n📊 檢查速率限制器狀態:');
    const status = RateLimiterService.getStatus();
    console.log('- 是否啟用:', status.isEnabled);
    console.log('- 排隊長度:', status.queueLength);
    console.log('- 當前窗口請求數:', status.requestsInCurrentWindow);
    console.log('- 預估等待時間:', status.estimatedWaitTime + 'ms');
    
    // 測試2：發送一個簡單的API請求
    console.log('\n🚀 發送測試API請求:');
    const testPrompt = "Generate a simple English sentence.";
    
    console.log('發送請求:', testPrompt);
    const startTime = Date.now();
    
    try {
      const response = await GeminiAPIService.getResponse(
        testPrompt,
        undefined,
        2, // MEDIUM priority
        'test_script'
      );
      
      const endTime = Date.now();
      console.log('✅ 請求成功!');
      console.log('- 響應時間:', (endTime - startTime) + 'ms');
      console.log('- 響應內容:', typeof response === 'string' ? response.substring(0, 100) + '...' : 'JSON response');
      
    } catch (error) {
      console.log('❌ 請求失敗:', error.message);
    }
    
    // 測試3：檢查更新後的狀態
    console.log('\n📊 請求後的速率限制器狀態:');
    const statusAfter = RateLimiterService.getStatus();
    console.log('- 排隊長度:', statusAfter.queueLength);
    console.log('- 當前窗口請求數:', statusAfter.requestsInCurrentWindow);
    console.log('- 總處理數:', statusAfter.totalProcessed);
    console.log('- 總失敗數:', statusAfter.totalFailed);
    console.log('- 成功率:', statusAfter.successRate.toFixed(2) + '%');
    
  } catch (error) {
    console.error('❌ 測試過程中發生錯誤:', error);
  }
  
  console.log('\n✅ 速率限制器測試完成!');
}

// 運行測試
testRateLimiter().catch(console.error); 