import type { Router } from 'vue-router'

// 設定路由守衛
export function setupRouterGuards(router: Router) {
  // 導航前置守衛
  router.beforeEach((to, from, next) => {
    // [DEBUG guards.ts] 路由導航: ${from.path} -> ${to.path}
    console.log(`[DEBUG guards.ts] 路由導航: ${from.path} -> ${to.path}`)

    // 檢查路由參數有效性
    if (to.name === 'Quiz' && to.params.questionType) {
      // 這裡可以添加題型驗證邏輯
      // console.log(`[DEBUG guards.ts] 題型參數: ${to.params.questionType}`)
    }

    next()
  })

  // 導航後置守衛
  router.afterEach(to => {
    // 更新頁面標題
    const title = to.meta?.title as string
    if (title) {
      document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
    }

    // [DEBUG guards.ts] 頁面標題已更新: ${document.title}
    console.log(`[DEBUG guards.ts] 頁面標題已更新: ${document.title}`)
  })
}
