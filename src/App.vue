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
  <div id="app" class="min-h-screen">
    <AppLayout />
  </div>
</template>
