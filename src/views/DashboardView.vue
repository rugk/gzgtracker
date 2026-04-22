<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { dealStore, submissionStore, peopleStore, ibanStore } from '../store';

const { t } = useI18n();

const counts = ref({ deals: 0, submissions: 0, people: 0, ibans: 0 });

onMounted(async () => {
  const [deals, submissions, people, ibans] = await Promise.all([
    dealStore.getAll(),
    submissionStore.getAll(),
    peopleStore.getAll(),
    ibanStore.getAll(),
  ]);
  counts.value = {
    deals: deals.length,
    submissions: submissions.length,
    people: people.length,
    ibans: ibans.length,
  };
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-6">{{ t('nav.dashboard') }}</h1>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div class="text-3xl font-bold">{{ counts.deals }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.deals') }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div class="text-3xl font-bold">{{ counts.submissions }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.submissions') }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div class="text-3xl font-bold">{{ counts.people }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.people') }}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div class="text-3xl font-bold">{{ counts.ibans }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.ibans') }}</div>
    </div>
  </div>
</template>
