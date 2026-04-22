import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import type { Person, PersonForm } from '@/types'

export const usePeopleStore = defineStore('people', () => {
  const people = ref<Person[]>([])
  const loading = ref<boolean>(false)

  // Load people from storage
  async function loadPeople(): Promise<void> {
    loading.value = true
    try {
      people.value = await storage.get<Person>(STORAGE_KEYS.PEOPLE)
    } finally {
      loading.value = false
    }
  }

  // Save people to storage
  async function savePeople(): Promise<void> {
    await storage.set(STORAGE_KEYS.PEOPLE, people.value)
  }

  // Add person
  function addPerson(person: PersonForm): Person {
    const newPerson: Person = {
      id: Date.now().toString(),
      name: person.name,
      email: person.email || '',
      phone: person.phone || '',
      address: person.address || '',
      contacts: person.contacts || [],
      createdAt: new Date().toISOString()
    }
    people.value.push(newPerson)
    savePeople()
    return newPerson
  }

  // Update person
  function updatePerson(id: string, updates: Partial<PersonForm>): Person | null {
    const index = people.value.findIndex(p => p.id === id)
    if (index !== -1) {
      people.value[index] = {
        ...people.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      savePeople()
      return people.value[index]
    }
    return null
  }

  // Delete person
  function deletePerson(id: string): boolean {
    const index = people.value.findIndex(p => p.id === id)
    if (index !== -1) {
      people.value.splice(index, 1)
      savePeople()
      return true
    }
    return false
  }

  // Get person by id
  const getPersonById = computed(() => {
    return (id: string): Person | undefined => people.value.find(p => p.id === id)
  })

  // Get people by ids
  const getPeopleByIds = computed(() => {
    return (ids: string[]): Person[] => people.value.filter(p => ids.includes(p.id))
  })

  return {
    people,
    loading,
    loadPeople,
    addPerson,
    updatePerson,
    deletePerson,
    getPersonById,
    getPeopleByIds
  }
})
