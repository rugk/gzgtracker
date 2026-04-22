<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIbansStore } from '@/stores/ibans'
import { usePeopleStore } from '@/stores/people'

const { t } = useI18n()
const ibansStore = useIbansStore()
const peopleStore = usePeopleStore()

const showModal = ref(false)
const editingIban = ref(null)
const searchQuery = ref('')

const form = ref({
  iban: '',
  bankName: '',
  owners: []
})

const filteredIbans = computed(() => {
  if (!searchQuery.value) return ibansStore.ibans

  const query = searchQuery.value.toLowerCase()
  return ibansStore.ibans.filter(i =>
    i.iban.toLowerCase().includes(query) ||
    i.bankName.toLowerCase().includes(query)
  )
})

function openAddModal() {
  editingIban.value = null
  form.value = {
    iban: '',
    bankName: '',
    owners: []
  }
  showModal.value = true
}

function openEditModal(iban) {
  editingIban.value = iban
  form.value = { ...iban, owners: [...iban.owners] }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingIban.value = null
}

function saveIban() {
  if (!form.value.iban.trim()) {
    alert(t('validation.required'))
    return
  }

  if (editingIban.value) {
    ibansStore.updateIban(editingIban.value.id, form.value)
  } else {
    ibansStore.addIban(form.value)
  }

  closeModal()
}

function deleteIban(id) {
  if (confirm(t('ibans.deleteConfirm'))) {
    ibansStore.deleteIban(id)
  }
}

function getOwnerNames(ownerIds) {
  return ownerIds
    .map(id => peopleStore.getPersonById(id)?.name || 'Unknown')
    .join(', ')
}
</script>

<template>
  <div class="ibans-view">
    <div class="view-header">
      <h1 class="page-title">{{ t('ibans.title') }}</h1>
      <button @click="openAddModal" class="btn btn-primary">
        + {{ t('ibans.add') }}
      </button>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('common.search')"
        class="search-input"
      />
    </div>

    <div v-if="filteredIbans.length === 0" class="empty-state">
      {{ t('common.noData') }}
    </div>

    <div v-else class="ibans-list">
      <div v-for="iban in filteredIbans" :key="iban.id" class="iban-card">
        <div class="iban-info">
          <h3>{{ iban.iban }}</h3>
          <p v-if="iban.bankName" class="iban-detail">
            <span class="label">{{ t('ibans.bankName') }}:</span> {{ iban.bankName }}
          </p>
          <p v-if="iban.owners.length > 0" class="iban-detail">
            <span class="label">{{ t('ibans.owners') }}:</span> {{ getOwnerNames(iban.owners) }}
          </p>
          <span v-if="iban.owners.length > 1" class="badge">{{ t('ibans.sharedAccount') }}</span>
        </div>
        <div class="iban-actions">
          <button @click="openEditModal(iban)" class="btn btn-sm btn-secondary">
            {{ t('common.edit') }}
          </button>
          <button @click="deleteIban(iban.id)" class="btn btn-sm btn-danger">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingIban ? t('ibans.edit') : t('ibans.add') }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>{{ t('ibans.iban') }} *</label>
            <input v-model="form.iban" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>{{ t('ibans.bankName') }}</label>
            <input v-model="form.bankName" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label>{{ t('ibans.owners') }}</label>
            <select v-model="form.owners" multiple class="form-input form-select-multiple">
              <option v-for="person in peopleStore.people" :key="person.id" :value="person.id">
                {{ person.name }}
              </option>
            </select>
            <small class="form-help">{{ t('ibans.selectOwners') }}</small>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="saveIban" class="btn btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/common-styles.css';
.ibans-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.iban-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.iban-info h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  font-family: monospace;
  color: var(--text-primary);
}

.iban-detail {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.iban-detail .label {
  font-weight: 500;
  color: var(--text-primary);
}

.badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.iban-actions {
  display: flex;
  gap: 0.5rem;
}

.form-select-multiple {
  min-height: 150px;
}

.form-help {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
