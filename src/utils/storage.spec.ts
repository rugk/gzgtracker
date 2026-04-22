import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage, STORAGE_KEYS } from './storage'
import localforage from 'localforage'
import type { Person, Deal, ExportData } from '@/types'

// Mock localforage
vi.mock('localforage', () => {
  const store = new Map()
  return {
    default: {
      config: vi.fn(),
      getItem: vi.fn((key: string) => Promise.resolve(store.get(key) || null)),
      setItem: vi.fn((key: string, value: any) => {
        store.set(key, value)
        return Promise.resolve(value)
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key)
        return Promise.resolve()
      }),
      clear: vi.fn(() => {
        store.clear()
        return Promise.resolve()
      })
    }
  }
})

describe('Storage Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('STORAGE_KEYS', () => {
    it('should have all required storage keys', () => {
      expect(STORAGE_KEYS.PEOPLE).toBe('people')
      expect(STORAGE_KEYS.IBANS).toBe('ibans')
      expect(STORAGE_KEYS.DEALS).toBe('deals')
      expect(STORAGE_KEYS.SUBMISSIONS).toBe('submissions')
      expect(STORAGE_KEYS.SETTINGS).toBe('settings')
    })
  })

  describe('storage.get', () => {
    it('should return empty array when no data exists', async () => {
      const result = await storage.get(STORAGE_KEYS.PEOPLE)
      expect(result).toEqual([])
    })

    it('should return stored data when it exists', async () => {
      const mockPeople: Person[] = [{
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        address: '',
        contacts: [],
        createdAt: new Date().toISOString()
      }]

      await localforage.setItem(STORAGE_KEYS.PEOPLE, mockPeople)
      const result = await storage.get<Person>(STORAGE_KEYS.PEOPLE)

      expect(result).toEqual(mockPeople)
      expect(result[0].name).toBe('John Doe')
    })

    it('should handle errors gracefully and return empty array', async () => {
      vi.spyOn(localforage, 'getItem').mockRejectedValueOnce(new Error('Storage error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await storage.get(STORAGE_KEYS.PEOPLE)

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('storage.set', () => {
    it('should save data successfully', async () => {
      const mockData = [{ id: '1', name: 'Test' }]
      const result = await storage.set(STORAGE_KEYS.PEOPLE, mockData)

      expect(result).toBe(true)
      expect(localforage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.PEOPLE, mockData)
    })

    it('should return false on error', async () => {
      vi.spyOn(localforage, 'setItem').mockRejectedValueOnce(new Error('Save error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await storage.set(STORAGE_KEYS.PEOPLE, [])

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('storage.remove', () => {
    it('should remove data successfully', async () => {
      const result = await storage.remove(STORAGE_KEYS.PEOPLE)

      expect(result).toBe(true)
      expect(localforage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.PEOPLE)
    })

    it('should return false on error', async () => {
      vi.spyOn(localforage, 'removeItem').mockRejectedValueOnce(new Error('Remove error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await storage.remove(STORAGE_KEYS.PEOPLE)

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('storage.clear', () => {
    it('should clear all data successfully', async () => {
      const result = await storage.clear()

      expect(result).toBe(true)
      expect(localforage.clear).toHaveBeenCalled()
    })

    it('should return false on error', async () => {
      vi.spyOn(localforage, 'clear').mockRejectedValueOnce(new Error('Clear error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await storage.clear()

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('storage.exportAll', () => {
    it('should export all data with correct structure', async () => {
      const mockPeople: Person[] = [{
        id: '1',
        name: 'John',
        email: 'john@test.com',
        phone: '',
        address: '',
        contacts: [],
        createdAt: new Date().toISOString()
      }]

      await localforage.setItem(STORAGE_KEYS.PEOPLE, mockPeople)
      const result = await storage.exportAll()

      expect(result).toHaveProperty('version', '1.0')
      expect(result).toHaveProperty('exportDate')
      expect(result).toHaveProperty('data')
      expect(result.data.people).toEqual(mockPeople)
    })

    it('should include all storage keys in export', async () => {
      const result = await storage.exportAll()

      expect(result.data).toHaveProperty('people')
      expect(result.data).toHaveProperty('ibans')
      expect(result.data).toHaveProperty('deals')
      expect(result.data).toHaveProperty('submissions')
      expect(result.data).toHaveProperty('settings')
    })

    it('should throw error on failure', async () => {
      vi.spyOn(localforage, 'getItem').mockRejectedValueOnce(new Error('Export error'))

      await expect(storage.exportAll()).rejects.toThrow()
    })
  })

  describe('storage.importAll', () => {
    it('should import valid data successfully', async () => {
      const importData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          people: [{
            id: '1',
            name: 'Jane',
            email: 'jane@test.com',
            phone: '',
            address: '',
            contacts: [],
            createdAt: new Date().toISOString()
          }]
        }
      }

      const result = await storage.importAll(importData)

      expect(result).toBe(true)
      expect(localforage.setItem).toHaveBeenCalledWith('people', importData.data.people)
    })

    it('should reject invalid data format (missing version)', async () => {
      const invalidData = {
        exportDate: new Date().toISOString(),
        data: {}
      } as any

      await expect(storage.importAll(invalidData)).rejects.toThrow('Invalid import data format')
    })

    it('should reject invalid data format (missing data)', async () => {
      const invalidData = {
        version: '1.0',
        exportDate: new Date().toISOString()
      } as any

      await expect(storage.importAll(invalidData)).rejects.toThrow('Invalid import data format')
    })

    it('should only import valid storage keys', async () => {
      const importData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          people: [],
          invalidKey: [] // This should be ignored
        } as any
      }

      await storage.importAll(importData)

      expect(localforage.setItem).toHaveBeenCalledWith('people', [])
      expect(localforage.setItem).not.toHaveBeenCalledWith('invalidKey', expect.anything())
    })
  })
})
