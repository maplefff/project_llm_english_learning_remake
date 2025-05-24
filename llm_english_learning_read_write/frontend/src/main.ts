import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { setupRouterGuards } from './router/guards'

// macOS 樣式
import '@styles/macos.scss'

// 建立應用實例
const app = createApp(App)

// 註冊插件
app.use(pinia)
app.use(router)

// 設定路由守衛
setupRouterGuards(router)

// 全局錯誤處理
app.config.errorHandler = (err, _vm, info) => {
  console.error('[DEBUG main.ts] 全局錯誤:', err, info)
}

// 掛載應用
app.mount('#app')

console.log('[DEBUG main.ts] macOS 風格應用已啟動')
