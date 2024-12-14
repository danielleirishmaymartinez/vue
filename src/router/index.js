import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/supabase.js'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomepageView from '@/views/system/HomepageView.vue'
import ProfileView from '@/views/system/ProfileView.vue'
import PasswordSettingsView from '@/views/system/account-settings/PasswordSettingsView.vue';
import PictureSettingsView from '@/views/system/account-settings/PictureSettingsView.vue';
import ProfileInfoSettingsView from '@/views/system/account-settings/ProfileInfoSettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LoginView,
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
      path: '/home',
      name: 'home',
      component: HomepageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/password',
      name: 'password',
      component: PasswordSettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/picture',
      name: 'picture',
      component: PictureSettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile-info',
      name: 'profile-info',
      component: ProfileInfoSettingsView,
      meta: { requiresAuth: true },
    },

  ],
});

// Navigation guard
router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated();

  // Redirect authenticated users away from login/register
  if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
    return { name: 'home' };
  }

  // Redirect unauthenticated users to login for protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' };
  }

  // Redirect to home if landing page is accessed when logged in
  if (to.name === 'landing' && isLoggedIn) {
    return { name: 'home' };
  }
});

export default router;
