import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// 全局測試配置
config.global.plugins = [
  createPinia(),
  createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/quiz', component: { template: '<div>Quiz</div>' } },
      { path: '/history', component: { template: '<div>History</div>' } },
      { path: '/settings', component: { template: '<div>Settings</div>' } },
    ],
  }),
]

// 模擬 Element Plus 組件
config.global.stubs = {
  'el-card': true,
  'el-button': true,
  'el-row': true,
  'el-col': true,
  'el-table': true,
  'el-table-column': true,
  'el-form': true,
  'el-form-item': true,
  'el-select': true,
  'el-option': true,
  'el-switch': true,
  'el-progress': true,
  'el-empty': true,
  'el-result': true,
}
