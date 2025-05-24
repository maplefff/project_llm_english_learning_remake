import { defineStore } from 'pinia'
import type { UserSettings } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    settings: {
      theme: 'light',
      language: 'zh-TW',
      autoSave: true,
      soundEnabled: true,
    } as UserSettings,
  }),

  getters: {
    isDarkTheme: state => state.settings.theme === 'dark',
    isAutoTheme: state => state.settings.theme === 'auto',
    currentLanguage: state => state.settings.language,
  },

  actions: {
    // 更新設定
    updateSettings(newSettings: Partial<UserSettings>) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveToLocalStorage()
      // [DEBUG user.ts] 更新用戶設定
      console.log(`[DEBUG user.ts] 更新用戶設定:`, newSettings)
    },

    // 切換主題
    toggleTheme() {
      const themes: UserSettings['theme'][] = ['light', 'dark', 'auto']
      const currentIndex = themes.indexOf(this.settings.theme)
      const nextIndex = (currentIndex + 1) % themes.length
      this.settings.theme = themes[nextIndex]
      this.saveToLocalStorage()
      // [DEBUG user.ts] 切換主題: ${this.settings.theme}
      console.log(`[DEBUG user.ts] 切換主題: ${this.settings.theme}`)
    },

    // 切換語言
    toggleLanguage() {
      this.settings.language = this.settings.language === 'zh-TW' ? 'en' : 'zh-TW'
      this.saveToLocalStorage()
      // [DEBUG user.ts] 切換語言: ${this.settings.language}
      console.log(`[DEBUG user.ts] 切換語言: ${this.settings.language}`)
    },

    // 保存到本地存儲
    saveToLocalStorage() {
      try {
        localStorage.setItem('userSettings', JSON.stringify(this.settings))
      } catch (error) {
        console.error('[DEBUG user.ts] 保存設定失敗:', error)
      }
    },

    // 從本地存儲載入
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('userSettings')
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) }
          // [DEBUG user.ts] 載入用戶設定完成
          console.log(`[DEBUG user.ts] 載入用戶設定完成`)
        }
      } catch (error) {
        console.error('[DEBUG user.ts] 載入設定失敗:', error)
      }
    },
  },
})
