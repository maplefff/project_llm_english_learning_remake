import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由定義
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@views/Dashboard.vue'),
    meta: {
      title: '儀表板',
      requiresAuth: false,
    },
  },
  {
    path: '/quiz/:questionType',
    name: 'Quiz',
    component: () => import('@views/Quiz.vue'),
    meta: {
      title: '測驗',
      requiresAuth: false,
    },
    props: true,
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@views/History.vue'),
    meta: {
      title: '歷史記錄',
      requiresAuth: false,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@views/Settings.vue'),
    meta: {
      title: '設定',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@views/NotFound.vue'),
    meta: {
      title: '頁面不存在',
    },
  },
]

// 建立路由實例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
