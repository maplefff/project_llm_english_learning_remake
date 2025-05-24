import { createPinia } from 'pinia'

// 建立 Pinia 實例
const pinia = createPinia()

export default pinia

// 導出所有 stores
export { useAppStore } from './app'
export { useQuizStore } from './quiz'
export { useHistoryStore } from './history'
export { useUserStore } from './user'
