<script setup>
import SidebarNav from '@/components/system/SidebarNav.vue';
import HomepageCard from '@/components/system/HomepageCard.vue';
import Navbar from '@/components/system/Navbar.vue';
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme.js'; // Import the theme store

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();
const themeStore = useThemeStore(); // Access the theme store

// Logout function
async function logout() {
  try {
    await supabase.auth.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app
    
      :theme="themeStore.theme"
      :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
    >
      <!-- Navbar -->
      <Navbar />

      <!-- Page Container -->
      <v-container fluid class="d-flex">
        <!-- Sidebar -->
        <SidebarNav v-model:drawer="drawerVisible" />

        <!-- Main Content -->
        <v-main class="mt-5 pt-3">
          <!-- Page Content -->
          <HomepageCard />
        </v-main>
      </v-container>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.light-mode {
  background-color: #ffffff;
  color: #000000;
}

/* Optional: Add styling for buttons or other elements to match the dark/light theme */
</style>
