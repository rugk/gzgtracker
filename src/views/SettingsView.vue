<script setup lang="ts">
import {useI18n} from 'vue-i18n';

const { t, locale } = useI18n();

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'de' : 'en';
}
</script>

<template>
  <h1>{{ t('nav.settings') }}</h1>
  <article>
    <label>Language / Sprache</label>
    <button @click="toggleLocale">
      {{ locale === 'en' ? 'Wechseln zu Deutsch' : 'Switch to English' }}
    </button>
  </article>
</template>
