<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore, ibanStore, peopleStore, submissionStore} from '../store';
import {FwbCard} from 'flowbite-vue';

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
    <fwb-card class="text-center">
      <div class="text-3xl font-bold">{{ counts.deals }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.deals') }}</div>
    </fwb-card>
    <fwb-card class="text-center">
      <div class="text-3xl font-bold">{{ counts.submissions }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.submissions') }}</div>
    </fwb-card>
    <fwb-card class="text-center">
      <div class="text-3xl font-bold">{{ counts.people }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.people') }}</div>
    </fwb-card>
    <fwb-card class="text-center">
      <div class="text-3xl font-bold">{{ counts.ibans }}</div>
      <div class="text-sm text-gray-500">{{ t('nav.ibans') }}</div>
    </fwb-card>
  </div>
</template>
