<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { dealStore } from '../store';
import type { Deal } from '../models';

const { t } = useI18n();
const deals = ref<Deal[]>([]);

onMounted(async () => {
  deals.value = await dealStore.getAll();
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('nav.deals') }}</h1>
  <p v-if="!deals.length" class="text-gray-500">{{ t('common.noData') }}</p>
  <ul v-else class="space-y-2">
    <li v-for="deal in deals" :key="deal.id" class="bg-white dark:bg-gray-800 rounded shadow p-3">
      <div class="font-semibold">{{ deal.title }}</div>
      <div class="text-sm text-gray-500">{{ deal.brand }} · {{ deal.maxCashback }}€</div>
    </li>
  </ul>
</template>
