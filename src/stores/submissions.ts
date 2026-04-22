import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import { parseISO, isAfter } from 'date-fns'
import type { Submission, SubmissionForm } from '@/types'

export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref<Submission[]>([])
  const loading = ref(false)

  // Load submissions from storage
  async function loadSubmissions() {
    loading.value = true
    try {
      submissions.value = await storage.get(STORAGE_KEYS.SUBMISSIONS)
    } finally {
      loading.value = false
    }
  }

  // Save submissions to storage
  async function saveSubmissions() {
    await storage.set(STORAGE_KEYS.SUBMISSIONS, submissions.value)
  }

  // Add submission
  function addSubmission(submission: SubmissionForm) {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      dealId: submission.dealId,
      personId: submission.personId,
      ibanId: submission.ibanId,
      contactUsed: submission.contactUsed || '', // which email/phone/address variant was used
      submissionDate: submission.submissionDate || new Date().toISOString().split('T')[0],
      purchaseDate: submission.purchaseDate,
      purchaseAmount: submission.purchaseAmount,
      receiptReference: submission.receiptReference || '',
      status: submission.status || 'submitted', // submitted, approved, paid, rejected
      paymentReceivedDate: submission.paymentReceivedDate || null,
      notes: submission.notes || '',
      createdAt: new Date().toISOString()
    }
    submissions.value.push(newSubmission)
    saveSubmissions()
    return newSubmission
  }

  // Update submission
  function updateSubmission(id: string, updates: Partial<Submission>) {
    const index = submissions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      submissions.value[index] = {
        ...submissions.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      } as Submission
      saveSubmissions()
      return submissions.value[index]
    }
    return null
  }

  // Delete submission
  function deleteSubmission(id: string) {
    const index = submissions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      submissions.value.splice(index, 1)
      saveSubmissions()
      return true
    }
    return false
  }

  // Get submission by id
  const getSubmissionById = computed(() => {
    return (id: string) => submissions.value.find(s => s.id === id)
  })

  // Get submissions by deal
  const getSubmissionsByDeal = computed(() => {
    return (dealId: string) => submissions.value.filter(s => s.dealId === dealId)
  })

  // Get submissions by person
  const getSubmissionsByPerson = computed(() => {
    return (personId: string) => submissions.value.filter(s => s.personId === personId)
  })

  // Get submissions by IBAN
  const getSubmissionsByIban = computed(() => {
    return (ibanId: string) => submissions.value.filter(s => s.ibanId === ibanId)
  })

  // Get pending payments
  const pendingPayments = computed(() => {
    return submissions.value.filter(s =>
      s.status === 'submitted' || s.status === 'approved'
    )
  })

  // Get paid submissions
  const paidSubmissions = computed(() => {
    return submissions.value.filter(s => s.status === 'paid')
  })

  // Get recent submissions
  const recentSubmissions = computed(() => {
    return [...submissions.value]
      .sort((a, b) => {
        try {
          const dateA = parseISO(a.submissionDate)
          const dateB = parseISO(b.submissionDate)
          return isAfter(dateA, dateB) ? -1 : 1
        } catch {
          return 0
        }
      })
      .slice(0, 10)
  })

  // Check if deal/person/IBAN combination exists
  const hasSubmission = computed(() => {
    return (dealId: string, personId: string, ibanId: string) => {
      return submissions.value.some(s =>
        s.dealId === dealId &&
        s.personId === personId &&
        s.ibanId === ibanId
      )
    }
  })

  // Calculate total received amount
  const totalReceived = computed(() => {
    return paidSubmissions.value.reduce((sum, s) => {
      return sum + (s.purchaseAmount || 0)
    }, 0)
  })

  // Calculate pending amount
  const pendingAmount = computed(() => {
    return pendingPayments.value.reduce((sum, s) => {
      return sum + (s.purchaseAmount || 0)
    }, 0)
  })

  return {
    submissions,
    loading,
    loadSubmissions,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmissionById,
    getSubmissionsByDeal,
    getSubmissionsByPerson,
    getSubmissionsByIban,
    pendingPayments,
    paidSubmissions,
    recentSubmissions,
    hasSubmission,
    totalReceived,
    pendingAmount
  }
})
