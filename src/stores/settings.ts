import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import type {Settings} from "@/types";

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<string>('en')
  const theme = ref<string>('auto') // light, dark, auto

  // Load settings from storage
  async function loadSettings(): Promise<void> {
    try {
      const savedSettings = await storage.get(STORAGE_KEYS.SETTINGS) as unknown as Settings | undefined
      if (savedSettings) {
        locale.value = savedSettings.locale || 'en'
        theme.value = savedSettings.theme || 'auto'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  // Save settings to storage
  async function saveSettings(): Promise<void> {
    await storage.set(STORAGE_KEYS.SETTINGS, {
      locale: locale.value,
      theme: theme.value
    })
  }

  // Watch for changes and auto-save
  watch([locale, theme], () => {
    saveSettings()
  })

  // Set locale
  function setLocale(newLocale: string): void {
    locale.value = newLocale
  }

  // Set theme
  function setTheme(newTheme: string): void {
    theme.value = newTheme
    applyTheme()
  }

  // Apply theme to document
  function applyTheme(): void {
    const root = document.documentElement

    if (theme.value === 'dark') {
      root.classList.add('dark')
    } else if (theme.value === 'light') {
      root.classList.remove('dark')
    } else {
      // Auto mode - use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  // Export all data
  async function exportData(): Promise<boolean> {
    try {
      const data = await storage.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gzgtracker-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('Error exporting data:', error)
      return false
    }
  }

  // Import data
  async function importData(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await storage.importAll(data)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }

  // Clear all data
  async function clearAllData(): Promise<boolean> {
    try {
      await storage.clear()
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  return {
    locale,
    theme,
    loadSettings,
    setLocale,
    setTheme,
    applyTheme,
    exportData,
    importData,
    clearAllData
  }
})
