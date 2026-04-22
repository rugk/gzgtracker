<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { submissionStore } from '../store';
import type { Submission } from '../models';

const { t } = useI18n();
const submissions = ref<Submission[]>([]);

onMounted(async () => {
  submissions.value = await submissionStore.getAll();
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('nav.submissions') }}</h1>
  <p v-if="!submissions.length" class="text-gray-500">{{ t('common.noData') }}</p>
  <ul v-else class="space-y-2">
    <li v-for="sub in submissions" :key="sub.id" class="bg-white dark:bg-gray-800 rounded shadow p-3">
      <div class="font-semibold">{{ sub.status }}</div>
      <div class="text-sm text-gray-500">{{ sub.amount }}€ · {{ sub.submittedAt }}</div>
    </li>
  </ul>
</template>
