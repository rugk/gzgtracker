import localforage from 'localforage'
import type { ExportData } from '@/types'

// Configure localforage
localforage.config({
  name: 'GzGTracker',
  storeName: 'gzgtracker_data',
  description: 'GzGTracker local storage'
})

// Storage keys
export const STORAGE_KEYS = {
  PEOPLE: 'people',
  IBANS: 'ibans',
  DEALS: 'deals',
  SUBMISSIONS: 'submissions',
  SETTINGS: 'settings'
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

// Generic storage functions
export const storage = {
  async get<T = any>(key: StorageKey): Promise<T[]> {
    try {
      const data = await localforage.getItem<T[]>(key)
      return data || []
    } catch (error) {
      console.error(`Error loading ${key}:`, error)
      return []
    }
  },

  async set<T = any>(key: StorageKey, value: T): Promise<boolean> {
    try {
      await localforage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
      return false
    }
  },

  async remove(key: StorageKey): Promise<boolean> {
    try {
      await localforage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
      return false
    }
  },

  async clear(): Promise<boolean> {
    try {
      await localforage.clear()
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  },

  async exportAll(): Promise<ExportData> {
    try {
      const data: Record<string, any> = {}
      const keys = Object.values(STORAGE_KEYS)

      for (const key of keys) {
        data[key] = await localforage.getItem(key)
      }

      return {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  },

  async importAll(importData: ExportData): Promise<boolean> {
    try {
      if (!importData.version || !importData.data) {
        throw new Error('Invalid import data format')
      }

      for (const [key, value] of Object.entries(importData.data)) {
        if (Object.values(STORAGE_KEYS).includes(key as StorageKey)) {
          await localforage.setItem(key, value)
        }
      }

      return true
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }
}
