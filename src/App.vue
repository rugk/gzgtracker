<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const navItems = [
  { to: '/', key: 'nav.dashboard' },
  { to: '/deals', key: 'nav.deals' },
  { to: '/submissions', key: 'nav.submissions' },
  { to: '/people', key: 'nav.people' },
  { to: '/ibans', key: 'nav.ibans' },
  { to: '/settings', key: 'nav.settings' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-4 h-14">
        <span class="font-bold text-lg mr-4">GzG Tracker</span>
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-blue-100 dark:bg-blue-900 font-semibold"
        >
          {{ t(item.key) }}
        </router-link>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
