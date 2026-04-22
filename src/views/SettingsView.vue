<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { usePeopleStore } from '@/stores/people'
import { useIbansStore } from '@/stores/ibans'
import { useDealsStore } from '@/stores/deals'
import { useSubmissionsStore } from '@/stores/submissions'

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()
const peopleStore = usePeopleStore()
const ibansStore = useIbansStore()
const dealsStore = useDealsStore()
const submissionsStore = useSubmissionsStore()

const fileInput = ref(null)

function changeLanguage(newLocale) {
  locale.value = newLocale
  settingsStore.setLocale(newLocale)
}

function changeTheme(newTheme) {
  settingsStore.setTheme(newTheme)
}

async function exportData() {
  const success = await settingsStore.exportData()
  if (success) {
    alert(t('settings.exportSuccess'))
  }
}

function triggerImport() {
  fileInput.value?.click()
}

async function importData(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    await settingsStore.importData(file)

    // Reload all stores
    await Promise.all([
      peopleStore.loadPeople(),
      ibansStore.loadIbans(),
      dealsStore.loadDeals(),
      submissionsStore.loadSubmissions()
    ])

    alert(t('settings.importSuccess'))
  } catch (error) {
    alert(t('settings.importError'))
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function clearAllData() {
  if (confirm(t('settings.clearDataConfirm'))) {
    await settingsStore.clearAllData()

    // Reload all stores
    await Promise.all([
      peopleStore.loadPeople(),
      ibansStore.loadIbans(),
      dealsStore.loadDeals(),
      submissionsStore.loadSubmissions()
    ])
  }
}
</script>

<template>
  <div class="settings-view">
    <h1 class="page-title">{{ t('settings.title') }}</h1>

    <div class="settings-sections">
      <div class="settings-card">
        <h2>{{ t('settings.language') }}</h2>
        <div class="setting-options">
          <button
            @click="changeLanguage('en')"
            :class="['option-btn', { active: locale === 'en' }]"
          >
            English
          </button>
          <button
            @click="changeLanguage('de')"
            :class="['option-btn', { active: locale === 'de' }]"
          >
            Deutsch
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h2>{{ t('settings.theme') }}</h2>
        <div class="setting-options">
          <button
            @click="changeTheme('light')"
            :class="['option-btn', { active: settingsStore.theme === 'light' }]"
          >
            {{ t('settings.themes.light') }}
          </button>
          <button
            @click="changeTheme('dark')"
            :class="['option-btn', { active: settingsStore.theme === 'dark' }]"
          >
            {{ t('settings.themes.dark') }}
          </button>
          <button
            @click="changeTheme('auto')"
            :class="['option-btn', { active: settingsStore.theme === 'auto' }]"
          >
            {{ t('settings.themes.auto') }}
          </button>
        </div>
      </div>

      <div class="settings-card">
        <h2>{{ t('settings.dataManagement') }}</h2>
        <div class="data-actions">
          <button @click="exportData" class="btn btn-primary">
            {{ t('settings.exportData') }}
          </button>
          <button @click="triggerImport" class="btn btn-secondary">
            {{ t('settings.importData') }}
          </button>
          <button @click="clearAllData" class="btn btn-danger">
            {{ t('settings.clearData') }}
          </button>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          @change="importData"
          style="display: none"
        />
        <p class="help-text">
          {{ t('settings.exportData') }}: Download your data as JSON<br>
          {{ t('settings.importData') }}: Restore from a backup file<br>
          {{ t('settings.clearData') }}: Delete all local data
        </p>
      </div>

      <div class="settings-card">
        <h2>About GzGTracker</h2>
        <p>Version: 1.0.0 (MVP)</p>
        <p>A local-first PWA for tracking Geld-zurück (cashback) deals and submissions.</p>
        <p>All data is stored locally on your device using IndexedDB.</p>
        <br>
        <p><strong>Features:</strong></p>
        <ul>
          <li>Track people and bank accounts</li>
          <li>Manage cashback deals</li>
          <li>Record submissions and payments</li>
          <li>Export/Import data for backups</li>
          <li>Works offline</li>
          <li>Privacy-first design</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 800px;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.settings-card h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.setting-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.option-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.option-btn:hover {
  border-color: var(--primary-color);
}

.option-btn.active {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
  color: white;
}

.data-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-danger {
  background-color: var(--error);
  color: white;
}

.btn-danger:hover {
  opacity: 0.9;
}

.help-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.settings-card ul {
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.settings-card li {
  margin-bottom: 0.5rem;
}
</style>
