import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/deals',
      name: 'deals',
      component: () => import('@/views/DealsView.vue')
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('@/views/SubmissionsView.vue')
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('@/views/PeopleView.vue')
    },
    {
      path: '/ibans',
      name: 'ibans',
      component: () => import('@/views/IbansView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue')
    }
  ]
})

export default router
