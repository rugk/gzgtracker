<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDealsStore } from '@/stores/deals'
import { useSubmissionsStore } from '@/stores/submissions'
import { format, parseISO } from 'date-fns'

const { t } = useI18n()
const router = useRouter()
const dealsStore = useDealsStore()
const submissionsStore = useSubmissionsStore()

const stats = computed(() => ({
  totalDeals: dealsStore.deals.length,
  activeDeals: dealsStore.activeDeals.length,
  totalSubmissions: submissionsStore.submissions.length,
  pendingPayments: submissionsStore.pendingPayments.length,
  totalReceived: submissionsStore.totalReceived,
  pendingAmount: submissionsStore.pendingAmount
}))

function formatDate(dateStr) {
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
  <div class="dashboard">
    <h1 class="page-title">{{ t('dashboard.title') }}</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ t('dashboard.totalDeals') }}</h3>
        <p class="stat-value">{{ stats.totalDeals }}</p>
        <span class="stat-subtitle">{{ stats.activeDeals }} {{ t('dashboard.activeDeals').toLowerCase() }}</span>
      </div>

      <div class="stat-card">
        <h3>{{ t('dashboard.totalSubmissions') }}</h3>
        <p class="stat-value">{{ stats.totalSubmissions }}</p>
        <span class="stat-subtitle">{{ stats.pendingPayments }} {{ t('dashboard.pendingPayments').toLowerCase() }}</span>
      </div>

      <div class="stat-card success">
        <h3>{{ t('dashboard.totalReceived') }}</h3>
        <p class="stat-value">{{ formatCurrency(stats.totalReceived) }}</p>
      </div>

      <div class="stat-card warning">
        <h3>{{ t('dashboard.pendingAmount') }}</h3>
        <p class="stat-value">{{ formatCurrency(stats.pendingAmount) }}</p>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <div class="card-header">
          <h2>{{ t('dashboard.activeDeals') }}</h2>
          <button @click="router.push({ name: 'deals' })" class="btn-link">
            {{ t('nav.deals') }} →
          </button>
        </div>
        <div v-if="dealsStore.activeDeals.length === 0" class="empty-state">
          {{ t('common.noData') }}
        </div>
        <ul v-else class="deal-list">
          <li v-for="deal in dealsStore.activeDeals.slice(0, 5)" :key="deal.id" class="deal-item">
            <div>
              <strong>{{ deal.company }}</strong>
              <span v-if="deal.product"> - {{ deal.product }}</span>
              <p class="item-meta">
                {{ t('deals.endDate') }}: {{ formatDate(deal.endDate) }}
              </p>
            </div>
            <span class="badge">{{ formatCurrency(deal.cashbackAmount) }}</span>
          </li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>{{ t('dashboard.recentSubmissions') }}</h2>
          <button @click="router.push({ name: 'submissions' })" class="btn-link">
            {{ t('nav.submissions') }} →
          </button>
        </div>
        <div v-if="submissionsStore.recentSubmissions.length === 0" class="empty-state">
          {{ t('common.noData') }}
        </div>
        <ul v-else class="submission-list">
          <li v-for="submission in submissionsStore.recentSubmissions.slice(0, 5)" :key="submission.id" class="submission-item">
            <div>
              <strong>{{ dealsStore.getDealById(submission.dealId)?.company || 'Unknown' }}</strong>
              <p class="item-meta">
                {{ formatDate(submission.submissionDate) }} - {{ t(`submissions.statuses.${submission.status}`) }}
              </p>
            </div>
            <span :class="['status-badge', submission.status]">
              {{ t(`submissions.statuses.${submission.status}`) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 100%;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-card.success {
  border-left: 4px solid var(--success);
}

.stat-card.warning {
  border-left: 4px solid var(--warning);
}

.stat-card h3 {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-link:hover {
  color: var(--primary-hover);
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-secondary);
}

.deal-list,
.submission-list {
  list-style: none;
}

.deal-item,
.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.deal-item:last-child,
.submission-item:last-child {
  border-bottom: none;
}

.item-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.badge {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.submitted {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.approved {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.paid {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
