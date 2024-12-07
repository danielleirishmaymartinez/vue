<script setup>
import SidebarNav from '@/components/system/SidebarNav.vue';
import HomepageCard from '@/components/system/HomepageCard.vue';
import Navbar from '@/components/system/Navbar.vue';
import { useDisplay } from 'vuetify';
import { ref, onMounted } from 'vue';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme.js'; // Import the theme store

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();
const themeStore = useThemeStore(); // Access the theme store
const profile = ref(null); // Default profile is null

// Fetch user data on mount
onMounted(async () => {
  try {
    const user = supabase.auth.user;
    if (user) {
      // Fetch the profile data here, and assign it to the profile ref
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        profile.value = data;
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});

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
      <v-container fluid class="d-flex page-layout">
        <!-- Sidebar -->
        <SidebarNav v-model:drawer="drawerVisible" />

        <!-- Main Content -->
        <v-main class="main-content scroll-hidden mt-5 pt-3">
          <!-- Page Content -->
          <HomepageCard :profile="profile" />
        </v-main>
      </v-container>
    </v-app>
  </v-responsive>
</template>

<style scoped>

.page-layout {
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent parent container scrolling */
  
  /* Gradient Background Styling */
  background-color: linear-gradient(
    180deg, /* Angle of the gradient */
    #ffc95f,
    #ed9bbd /* Color 1 */
    #b0041a, /* Color 2 */
    #500711, /* Color 3 */
  );
  background-size: cover; /* Ensure gradient covers the area */
  background-repeat: no-repeat; /* Prevent tiling */
  background-position: center; /* Center the gradient */
  background-attachment: fixed; /* Fix the gradient during scrolling */
}

/* Hide scrollbar for main content */
.main-content::-webkit-scrollbar {
  display: none; /* For Webkit browsers */
}

.main-content {
  scrollbar-width: none; /* For Firefox */
}

.main-content {
  flex: 1;
  overflow-y: auto; /* Allow scrolling within the main content */
  padding: 20px;
}

.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.light-mode {
  background-color: #ffffff;
  color: #000000;
}
</style>
