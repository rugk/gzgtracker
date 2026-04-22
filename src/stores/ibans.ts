import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import type { Iban, IbanForm } from '@/types'

export const useIbansStore = defineStore('ibans', () => {
  const ibans = ref<Iban[]>([])
  const loading = ref<boolean>(false)

  async function loadIbans(): Promise<void> {
    loading.value = true
    try {
      ibans.value = await storage.get<Iban>(STORAGE_KEYS.IBANS)
    } finally {
      loading.value = false
    }
  }

  async function saveIbans(): Promise<void> {
    await storage.set(STORAGE_KEYS.IBANS, ibans.value)
  }

  function addIban(iban: IbanForm): Iban {
    const newIban: Iban = {
      id: Date.now().toString(),
      iban: iban.iban,
      bankName: iban.bankName || '',
      owners: iban.owners || [],
      createdAt: new Date().toISOString()
    }
    ibans.value.push(newIban)
    saveIbans()
    return newIban
  }

  function updateIban(id: string, updates: Partial<IbanForm>): Iban | null {
    const index = ibans.value.findIndex(i => i.id === id)
    if (index !== -1) {
      ibans.value[index] = {
        ...ibans.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      } as Iban
      saveIbans()
      return ibans.value[index] || null
    }
    return null
  }

  function deleteIban(id: string): boolean {
    const index = ibans.value.findIndex(i => i.id === id)
    if (index !== -1) {
      ibans.value.splice(index, 1)
      saveIbans()
      return true
    }
    return false
  }

  const getIbanById = computed(() => {
    return (id: string): Iban | undefined => ibans.value.find(i => i.id === id)
  })

  const getIbansByOwner = computed(() => {
    return (personId: string): Iban[] => ibans.value.filter(i => i.owners.includes(personId))
  })

  const isSharedAccount = computed(() => {
    return (id: string): boolean => {
      const iban = ibans.value.find(i => i.id === id)
      return iban ? iban.owners.length > 1 : false
    }
  })

  return {
    ibans,
    loading,
    loadIbans,
    addIban,
    updateIban,
    deleteIban,
    getIbanById,
    getIbansByOwner,
    isSharedAccount
  }
})
