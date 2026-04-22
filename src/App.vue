<script setup lang="ts">
import {onMounted, ref} from 'vue';
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

const isExtensionPopup = ref(false);

onMounted(() => {
  const g = globalThis as any;
  const b = g.browser || g.chrome;
  // If we have browser APIs and we are in the popup (determined by window width or extension-specific markers)
  // WXT doesn't provide a direct "isPopup" but usually popups are small.
  // A better way is checking the URL or if we are in a tab.
  if (b && b.tabs && b.runtime) {
    // Basic check: if we are in a context that can create tabs but isn't a full tab itself yet (simplified)
    isExtensionPopup.value = true;
  }
});

function openFullTab() {
  const g = globalThis as any;
  const b = g.browser || g.chrome;
  if (b && b.tabs) {
    b.tabs.create({url: b.runtime.getURL('entrypoints/popup/index.html')});
  }
}
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
        <li v-if="isExtensionPopup">
          <button class="outline" @click="openFullTab"
                  style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-left: 0.5rem;">
            {{ t('nav.openFullTab') || 'Full Tab' }}
          </button>
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
            <li v-if="isExtensionPopup">
              <button class="outline" @click="openFullTab" style="width: 100%; margin-top: 0.5rem;">
                {{ t('nav.openFullTab') || 'Full Tab' }}
              </button>
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
