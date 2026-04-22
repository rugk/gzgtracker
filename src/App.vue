<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { usePeopleStore } from '@/stores/people'
import { useIbansStore } from '@/stores/ibans'
import { useDealsStore } from '@/stores/deals'
import { useSubmissionsStore } from '@/stores/submissions'
import AppLayout from '@/components/AppLayout.vue'

const { locale } = useI18n()
const settingsStore = useSettingsStore()
const peopleStore = usePeopleStore()
const ibansStore = useIbansStore()
const dealsStore = useDealsStore()
const submissionsStore = useSubmissionsStore()

onMounted(async () => {
  // Load settings
  await settingsStore.loadSettings()

  // Apply theme
  settingsStore.applyTheme()

  // Set locale
  locale.value = settingsStore.locale

  // Load all data from storage
  await Promise.all([
    peopleStore.loadPeople(),
    ibansStore.loadIbans(),
    dealsStore.loadDeals(),
    submissionsStore.loadSubmissions()
  ])
})
</script>

<template>
  <AppLayout />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #4F46E5;
  --primary-hover: #4338CA;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}

.dark {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
