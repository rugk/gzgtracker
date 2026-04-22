<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'de' : 'en';
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('nav.settings') }}</h1>
  <div class="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">Language</label>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="toggleLocale"
      >
        {{ locale === 'en' ? 'Deutsch' : 'English' }}
      </button>
    </div>
  </div>
</template>
