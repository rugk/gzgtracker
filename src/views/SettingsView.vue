<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {FwbButton, FwbCard} from 'flowbite-vue';

const { t, locale } = useI18n();

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'de' : 'en';
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-6">{{ t('nav.settings') }}</h1>
  <fwb-card class="max-w-none">
    <div class="space-y-4">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Language / Sprache</label>
        <fwb-button
            color="blue"
            @click="toggleLocale"
        >
          {{ locale === 'en' ? 'Wechseln zu Deutsch' : 'Switch to English' }}
        </fwb-button>
      </div>
    </div>
  </fwb-card>
</template>
