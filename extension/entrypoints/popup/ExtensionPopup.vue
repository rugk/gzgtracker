<script lang="ts" setup>
import App from "../../../src/App.vue";
import {openFullTab} from "@/extension-helper";
</script>

<template>
  <app isBrowserExtension isBrowserPopup @open-full-tab="openFullTab"></app>
</template>