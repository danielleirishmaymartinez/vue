import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/system/LandingView.vue'
import HomepageView from '@/views/system/HomepageView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import SettingsView from '@/views/system/SettingsView.vue'
import SavedView from '@/views/system/SavedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: HomepageView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedView,
    },
  ],
})

export default router
