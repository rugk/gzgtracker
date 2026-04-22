<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {FwbNavbar, FwbNavbarCollapse, FwbNavbarLink, FwbNavbarLogo} from 'flowbite-vue';

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
    <fwb-navbar class="border-b border-gray-200 dark:border-gray-700 !bg-white dark:!bg-gray-800">
      <template #logo>
        <fwb-navbar-logo link="/" alt="GzG Tracker logo">
          GzG Tracker
        </fwb-navbar-logo>
      </template>
      <template #default="{isShowMenu}">
        <fwb-navbar-collapse :is-show-menu="isShowMenu">
          <fwb-navbar-link
              v-for="item in navItems"
              :key="item.to"
              :link="'#' + item.to"
              class="whitespace-nowrap"
          >
            {{ t(item.key) }}
          </fwb-navbar-link>
        </fwb-navbar-collapse>
      </template>
    </fwb-navbar>
    <main class="max-w-7xl mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
