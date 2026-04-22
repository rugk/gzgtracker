<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navigation from './Navigation.vue'

const { t } = useI18n()
const route = useRoute()
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="app-layout">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>{{ t('app.name') }}</h1>
            <p class="tagline">{{ t('app.tagline') }}</p>
          </div>

          <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="layout-container">
      <Navigation :mobile-open="mobileMenuOpen" @close="closeMobileMenu" />

      <main class="main-content">
        <div class="container">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.tagline {
  font-size: 0.875rem;
  opacity: 0.9;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.layout-container {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .logo h1 {
    font-size: 1.25rem;
  }

  .tagline {
    font-size: 0.75rem;
  }

  .main-content {
    padding: 1rem 0;
  }
}
</style>
