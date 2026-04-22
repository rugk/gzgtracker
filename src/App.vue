<script setup lang="ts">
import {useI18n} from 'vue-i18n';

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
  <nav>
    <ul>
      <li><strong>GzG Tracker</strong></li>
    </ul>
    <ul>
      <li v-for="item in navItems" :key="item.to">
        <a :href="'#' + item.to">{{ t(item.key) }}</a>
      </li>
    </ul>
  </nav>
  <main class="container">
    <router-view/>
  </main>
</template>
