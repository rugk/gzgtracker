<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSubmissionsStore } from '@/stores/submissions'
import { useDealsStore } from '@/stores/deals'
import { usePeopleStore } from '@/stores/people'
import { useIbansStore } from '@/stores/ibans'
import { format, parseISO } from 'date-fns'

const { t } = useI18n()
const submissionsStore = useSubmissionsStore()
const dealsStore = useDealsStore()
const peopleStore = usePeopleStore()
const ibansStore = useIbansStore()

const showModal = ref(false)
const editingSubmission = ref(null)

const form = ref({
  dealId: '',
  personId: '',
  ibanId: '',
  contactUsed: '',
  submissionDate: '',
  purchaseDate: '',
  purchaseAmount: '',
  receiptReference: '',
  status: 'submitted',
  paymentReceivedDate: null,
  notes: ''
})

function openAddModal() {
  editingSubmission.value = null
  form.value = {
    dealId: '',
    personId: '',
    ibanId: '',
    contactUsed: '',
    submissionDate: new Date().toISOString().split('T')[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseAmount: '',
    receiptReference: '',
    status: 'submitted',
    paymentReceivedDate: null,
    notes: ''
  }
  showModal.value = true
}

function openEditModal(submission) {
  editingSubmission.value = submission
  form.value = { ...submission }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingSubmission.value = null
}

function saveSubmission() {
  if (!form.value.dealId || !form.value.personId || !form.value.ibanId) {
    alert(t('validation.required'))
    return
  }

  if (editingSubmission.value) {
    submissionsStore.updateSubmission(editingSubmission.value.id, form.value)
  } else {
    submissionsStore.addSubmission(form.value)
  }

  closeModal()
}

function deleteSubmission(id) {
  if (confirm(t('submissions.deleteConfirm'))) {
    submissionsStore.deleteSubmission(id)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'dd.MM.yyyy')
  } catch {
    return dateStr
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

function getDealName(dealId) {
  const deal = dealsStore.getDealById(dealId)
  return deal ? `${deal.company} - ${deal.product}` : 'Unknown'
}

function getPersonName(personId) {
  const person = peopleStore.getPersonById(personId)
  return person ? person.name : 'Unknown'
}

function getIbanString(ibanId) {
  const iban = ibansStore.getIbanById(ibanId)
  return iban ? iban.iban : 'Unknown'
}
</script>

<template>
  <div class="submissions-view">
    <div class="view-header">
      <h1 class="page-title">{{ t('submissions.title') }}</h1>
      <button @click="openAddModal" class="btn btn-primary">
        + {{ t('submissions.add') }}
      </button>
    </div>

    <div v-if="submissionsStore.submissions.length === 0" class="empty-state">
      {{ t('common.noData') }}
    </div>

    <div v-else class="submissions-table-container">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>{{ t('submissions.deal') }}</th>
            <th>{{ t('submissions.person') }}</th>
            <th>{{ t('submissions.submissionDate') }}</th>
            <th>{{ t('submissions.purchaseAmount') }}</th>
            <th>{{ t('submissions.status') }}</th>
            <th>{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissionsStore.submissions" :key="submission.id">
            <td>{{ getDealName(submission.dealId) }}</td>
            <td>{{ getPersonName(submission.personId) }}</td>
            <td>{{ formatDate(submission.submissionDate) }}</td>
            <td>{{ formatCurrency(submission.purchaseAmount) }}</td>
            <td>
              <span :class="['status-badge', submission.status]">
                {{ t(`submissions.statuses.${submission.status}`) }}
              </span>
            </td>
            <td class="actions-cell">
              <button @click="openEditModal(submission)" class="btn btn-sm btn-secondary">
                {{ t('common.edit') }}
              </button>
              <button @click="deleteSubmission(submission.id)" class="btn btn-sm btn-danger">
                {{ t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h2>{{ editingSubmission ? t('submissions.edit') : t('submissions.add') }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('submissions.deal') }} *</label>
            <select v-model="form.dealId" class="form-input" required>
              <option value="">{{ t('common.search') }}...</option>
              <option v-for="deal in dealsStore.deals" :key="deal.id" :value="deal.id">
                {{ deal.company }} - {{ deal.product }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('submissions.person') }} *</label>
              <select v-model="form.personId" class="form-input" required>
                <option value="">{{ t('common.search') }}...</option>
                <option v-for="person in peopleStore.people" :key="person.id" :value="person.id">
                  {{ person.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('submissions.iban') }} *</label>
              <select v-model="form.ibanId" class="form-input" required>
                <option value="">{{ t('common.search') }}...</option>
                <option v-for="iban in ibansStore.ibans" :key="iban.id" :value="iban.id">
                  {{ iban.iban }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('submissions.contactUsed') }}</label>
            <input v-model="form.contactUsed" type="text" class="form-input" placeholder="email@example.com" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('submissions.purchaseDate') }}</label>
              <input v-model="form.purchaseDate" type="date" class="form-input" />
            </div>

            <div class="form-group">
              <label>{{ t('submissions.submissionDate') }}</label>
              <input v-model="form.submissionDate" type="date" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('submissions.purchaseAmount') }}</label>
              <input v-model="form.purchaseAmount" type="number" step="0.01" class="form-input" />
            </div>

            <div class="form-group">
              <label>{{ t('submissions.status') }}</label>
              <select v-model="form.status" class="form-input">
                <option value="submitted">{{ t('submissions.statuses.submitted') }}</option>
                <option value="approved">{{ t('submissions.statuses.approved') }}</option>
                <option value="paid">{{ t('submissions.statuses.paid') }}</option>
                <option value="rejected">{{ t('submissions.statuses.rejected') }}</option>
              </select>
            </div>
          </div>

          <div class="form-group" v-if="form.status === 'paid'">
            <label>{{ t('submissions.paymentReceivedDate') }}</label>
            <input v-model="form.paymentReceivedDate" type="date" class="form-input" />
          </div>

          <div class="form-group">
            <label>{{ t('submissions.receiptReference') }}</label>
            <input v-model="form.receiptReference" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>{{ t('deals.notes') }}</label>
            <textarea v-model="form.notes" class="form-input" rows="3"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="saveSubmission" class="btn btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submissions-table-container {
  overflow-x: auto;
  background-color: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
}

.submissions-table th {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}

.submissions-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.submissions-table tbody tr:hover {
  background-color: var(--bg-secondary);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .submissions-table {
    font-size: 0.875rem;
  }

  .submissions-table th,
  .submissions-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
