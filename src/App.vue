<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const { t } = useI18n();

function closeNav() {
  const cb = document.getElementById('checkbox-navigation') as HTMLInputElement | null;
  if (cb) cb.checked = false;
}

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
  <main class="container">
    <nav>
      <ul>
        <li><strong>GzG Tracker</strong></li>
        <li role="separator">
          <label for="checkbox-navigation">&#9776;</label>
        </li>
      </ul>
      <ul>
        <li v-for="item in navItems" :key="item.to">
          <a :href="'#' + item.to">{{ t(item.key) }}</a>
        </li>
      </ul>
    </nav>
  </main>

  <input type="checkbox" id="checkbox-navigation" hidden>
  <dialog>
    <article>
      <header>
        <nav>
          <ul>
            <li>GzG Tracker</li>
          </ul>
          <ul>
            <li><label for="checkbox-navigation">&times;</label></li>
          </ul>
        </nav>
      </header>
      <aside>
        <nav>
          <ul>
            <li v-for="item in navItems" :key="item.to">
              <a :href="'#' + item.to" @click="closeNav">{{ t(item.key) }}</a>
            </li>
          </ul>
        </nav>
      </aside>
    </article>
  </dialog>

  <main class="container">
    <router-view/>
  </main>
</template>
