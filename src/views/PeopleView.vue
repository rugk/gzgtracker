<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { peopleStore } from '../store';
import type { Person } from '../models';

const { t } = useI18n();
const people = ref<Person[]>([]);

onMounted(async () => {
  people.value = await peopleStore.getAll();
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('nav.people') }}</h1>
  <p v-if="!people.length" class="text-gray-500">{{ t('common.noData') }}</p>
  <ul v-else class="space-y-2">
    <li v-for="person in people" :key="person.id" class="bg-white dark:bg-gray-800 rounded shadow p-3">
      <div class="font-semibold">{{ person.name }}</div>
      <div class="text-sm text-gray-500">{{ person.email }}</div>
    </li>
  </ul>
</template>
