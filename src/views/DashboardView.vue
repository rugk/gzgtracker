<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {dealStore, ibanStore, peopleStore, submissionStore} from '../store';

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
  <h1>{{ t('nav.dashboard') }}</h1>
  <div class="dashboard-grid">
    <div class="dashboard-card">
      <div class="count">{{ counts.deals }}</div>
      <div class="label">{{ t('nav.deals') }}</div>
    </div>
    <div class="dashboard-card">
      <div class="count">{{ counts.submissions }}</div>
      <div class="label">{{ t('nav.submissions') }}</div>
    </div>
    <div class="dashboard-card">
      <div class="count">{{ counts.people }}</div>
      <div class="label">{{ t('nav.people') }}</div>
    </div>
    <div class="dashboard-card">
      <div class="count">{{ counts.ibans }}</div>
      <div class="label">{{ t('nav.ibans') }}</div>
    </div>
  </div>
</template>
