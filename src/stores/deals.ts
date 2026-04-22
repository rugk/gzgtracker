import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns'

export const useDealsStore = defineStore('deals', () => {
  const deals = ref([])
  const loading = ref(false)

  // Load deals from storage
  async function loadDeals() {
    loading.value = true
    try {
      deals.value = await storage.get(STORAGE_KEYS.DEALS)
    } finally {
      loading.value = false
    }
  }

  // Save deals to storage
  async function saveDeals() {
    await storage.set(STORAGE_KEYS.DEALS, deals.value)
  }

  // Add deal
  function addDeal(deal) {
    const newDeal = {
      id: Date.now().toString(),
      company: deal.company,
      product: deal.product || '',
      cashbackAmount: deal.cashbackAmount,
      cashbackType: deal.cashbackType || 'full', // full, partial, fixed
      startDate: deal.startDate,
      endDate: deal.endDate,
      status: deal.status || 'active', // active, expired, renewed
      conditions: deal.conditions || '',
      participationLimits: deal.participationLimits || '',
      notes: deal.notes || '',
      source: deal.source || 'manual', // manual, community, platform
      platform: deal.platform || '',
      createdAt: new Date().toISOString()
    }
    deals.value.push(newDeal)
    saveDeals()
    return newDeal
  }

  // Update deal
  function updateDeal(id, updates) {
    const index = deals.value.findIndex(d => d.id === id)
    if (index !== -1) {
      deals.value[index] = {
        ...deals.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveDeals()
      return deals.value[index]
    }
    return null
  }

  // Delete deal
  function deleteDeal(id) {
    const index = deals.value.findIndex(d => d.id === id)
    if (index !== -1) {
      deals.value.splice(index, 1)
      saveDeals()
      return true
    }
    return false
  }

  // Clone deal
  function cloneDeal(id) {
    const deal = deals.value.find(d => d.id === id)
    if (deal) {
      const clonedDeal = {
        ...deal,
        id: Date.now().toString(),
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        createdAt: new Date().toISOString()
      }
      deals.value.push(clonedDeal)
      saveDeals()
      return clonedDeal
    }
    return null
  }

  // Get deal by id
  const getDealById = computed(() => {
    return (id) => deals.value.find(d => d.id === id)
  })

  // Get active deals
  const activeDeals = computed(() => {
    const now = new Date()
    return deals.value.filter(d => {
      if (d.status !== 'active') return false
      if (!d.endDate) return true

      try {
        const endDate = parseISO(d.endDate)
        return isAfter(endDate, now) || endDate.toDateString() === now.toDateString()
      } catch {
        return true
      }
    })
  })

  // Get expired deals
  const expiredDeals = computed(() => {
    const now = new Date()
    return deals.value.filter(d => {
      if (d.status === 'expired') return true
      if (!d.endDate) return false

      try {
        const endDate = parseISO(d.endDate)
        return isBefore(endDate, now)
      } catch {
        return false
      }
    })
  })

  // Search deals
  const searchDeals = computed(() => {
    return (query) => {
      const lowerQuery = query.toLowerCase()
      return deals.value.filter(d =>
        d.company.toLowerCase().includes(lowerQuery) ||
        d.product.toLowerCase().includes(lowerQuery) ||
        d.notes.toLowerCase().includes(lowerQuery)
      )
    }
  })

  return {
    deals,
    loading,
    loadDeals,
    addDeal,
    updateDeal,
    deleteDeal,
    cloneDeal,
    getDealById,
    activeDeals,
    expiredDeals,
    searchDeals
  }
})
