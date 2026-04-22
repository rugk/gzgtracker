<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ibanStore } from '../store';
import type { Iban } from '../models';

const { t } = useI18n();
const ibans = ref<Iban[]>([]);

onMounted(async () => {
  ibans.value = await ibanStore.getAll();
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('nav.ibans') }}</h1>
  <p v-if="!ibans.length" class="text-gray-500">{{ t('common.noData') }}</p>
  <ul v-else class="space-y-2">
    <li v-for="iban in ibans" :key="iban.id" class="bg-white dark:bg-gray-800 rounded shadow p-3">
      <div class="font-semibold">{{ iban.label }}</div>
      <div class="text-sm text-gray-500 font-mono">{{ iban.iban }}</div>
    </li>
  </ul>
</template>
