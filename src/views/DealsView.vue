<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDealsStore } from '@/stores/deals'
import { format, parseISO } from 'date-fns'

const { t } = useI18n()
const dealsStore = useDealsStore()

const showModal = ref(false)
const editingDeal = ref(null)
const searchQuery = ref('')
const filterStatus = ref('all')

const form = ref({
  company: '',
  product: '',
  cashbackAmount: '',
  cashbackType: 'full',
  startDate: '',
  endDate: '',
  status: 'active',
  conditions: '',
  participationLimits: '',
  notes: '',
  source: 'manual',
  platform: ''
})

const filteredDeals = computed(() => {
  let deals = dealsStore.deals

  if (filterStatus.value !== 'all') {
    deals = deals.filter(d => d.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    deals = deals.filter(d =>
      d.company.toLowerCase().includes(query) ||
      d.product.toLowerCase().includes(query)
    )
  }

  return deals
})

function openAddModal() {
  editingDeal.value = null
  form.value = {
    company: '',
    product: '',
    cashbackAmount: '',
    cashbackType: 'full',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    conditions: '',
    participationLimits: '',
    notes: '',
    source: 'manual',
    platform: ''
  }
  showModal.value = true
}

function openEditModal(deal) {
  editingDeal.value = deal
  form.value = { ...deal }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingDeal.value = null
}

function saveDeal() {
  if (!form.value.company.trim() || !form.value.cashbackAmount) {
    alert(t('validation.required'))
    return
  }

  if (editingDeal.value) {
    dealsStore.updateDeal(editingDeal.value.id, form.value)
  } else {
    dealsStore.addDeal(form.value)
  }

  closeModal()
}

function deleteDeal(id) {
  if (confirm(t('deals.deleteConfirm'))) {
    dealsStore.deleteDeal(id)
  }
}

function cloneDeal(id) {
  dealsStore.cloneDeal(id)
  alert(t('deals.cloneSuccess'))
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
</script>

<template>
  <div class="deals-view">
    <div class="view-header">
      <h1 class="page-title">{{ t('deals.title') }}</h1>
      <button @click="openAddModal" class="btn btn-primary">
        + {{ t('deals.add') }}
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('common.search')"
        class="search-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="all">{{ t('common.filter') }} - {{ t('deals.status') }}</option>
        <option value="active">{{ t('deals.statuses.active') }}</option>
        <option value="expired">{{ t('deals.statuses.expired') }}</option>
        <option value="renewed">{{ t('deals.statuses.renewed') }}</option>
      </select>
    </div>

    <div v-if="filteredDeals.length === 0" class="empty-state">
      {{ t('common.noData') }}
    </div>

    <div v-else class="deals-grid">
      <div v-for="deal in filteredDeals" :key="deal.id" class="deal-card">
        <div class="deal-header">
          <h3>{{ deal.company }}</h3>
          <span :class="['status-badge', deal.status]">
            {{ t(`deals.statuses.${deal.status}`) }}
          </span>
        </div>
        <p v-if="deal.product" class="deal-product">{{ deal.product }}</p>
        <div class="deal-info">
          <p><strong>{{ t('deals.cashbackAmount') }}:</strong> {{ formatCurrency(deal.cashbackAmount) }}</p>
          <p><strong>{{ t('deals.startDate') }}:</strong> {{ formatDate(deal.startDate) }}</p>
          <p><strong>{{ t('deals.endDate') }}:</strong> {{ formatDate(deal.endDate) }}</p>
          <p v-if="deal.conditions"><strong>{{ t('deals.conditions') }}:</strong> {{ deal.conditions }}</p>
        </div>
        <div class="deal-actions">
          <button @click="cloneDeal(deal.id)" class="btn btn-sm btn-secondary">
            {{ t('common.clone') }}
          </button>
          <button @click="openEditModal(deal)" class="btn btn-sm btn-secondary">
            {{ t('common.edit') }}
          </button>
          <button @click="deleteDeal(deal.id)" class="btn btn-sm btn-danger">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h2>{{ editingDeal ? t('deals.edit') : t('deals.add') }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('deals.company') }} *</label>
              <input v-model="form.company" type="text" class="form-input" required />
            </div>

            <div class="form-group">
              <label>{{ t('deals.product') }}</label>
              <input v-model="form.product" type="text" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('deals.cashbackAmount') }} *</label>
              <input v-model="form.cashbackAmount" type="number" step="0.01" class="form-input" required />
            </div>

            <div class="form-group">
              <label>{{ t('deals.cashbackType') }}</label>
              <select v-model="form.cashbackType" class="form-input">
                <option value="full">{{ t('deals.cashbackTypes.full') }}</option>
                <option value="partial">{{ t('deals.cashbackTypes.partial') }}</option>
                <option value="fixed">{{ t('deals.cashbackTypes.fixed') }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('deals.startDate') }}</label>
              <input v-model="form.startDate" type="date" class="form-input" />
            </div>

            <div class="form-group">
              <label>{{ t('deals.endDate') }}</label>
              <input v-model="form.endDate" type="date" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('deals.status') }}</label>
              <select v-model="form.status" class="form-input">
                <option value="active">{{ t('deals.statuses.active') }}</option>
                <option value="expired">{{ t('deals.statuses.expired') }}</option>
                <option value="renewed">{{ t('deals.statuses.renewed') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('deals.source') }}</label>
              <select v-model="form.source" class="form-input">
                <option value="manual">{{ t('deals.sources.manual') }}</option>
                <option value="community">{{ t('deals.sources.community') }}</option>
                <option value="platform">{{ t('deals.sources.platform') }}</option>
              </select>
            </div>
          </div>

          <div class="form-group" v-if="form.source === 'platform'">
            <label>{{ t('deals.platform') }}</label>
            <input v-model="form.platform" type="text" class="form-input" placeholder="Scondoo, marktguru, etc." />
          </div>

          <div class="form-group">
            <label>{{ t('deals.conditions') }}</label>
            <textarea v-model="form.conditions" class="form-input" rows="2"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('deals.participationLimits') }}</label>
            <textarea v-model="form.participationLimits" class="form-input" rows="2"></textarea>
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
          <button @click="saveDeal" class="btn btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/common-styles.css';
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.deal-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.deal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.deal-header h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.deal-product {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.deal-info {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.deal-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.deal-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.expired {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.renewed {
  background-color: #dbeafe;
  color: #1e40af;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-large {
  max-width: 700px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .search-input {
    max-width: 100%;
  }

  .deals-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
