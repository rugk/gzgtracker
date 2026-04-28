<script lang="ts" setup>
import App from "../../src/App.vue";

function openFullTab() {
  browser.tabs.create({url: browser.runtime.getURL('/dashboard.html')});
}
</script>

<template>
  <app :isBrowserExtension="true" @open-full-tab="openFullTab"></app>
</template>