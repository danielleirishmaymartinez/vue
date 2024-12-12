<script setup>
import SidebarNav from '@/components/system/SidebarNav.vue';
import HomepageCard from '@/components/system/HomepageCard.vue';
import Navbar from '@/components/system/Navbar.vue';
import { useDisplay } from 'vuetify';
import { ref, onMounted } from 'vue';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();
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
  <v-responsive>
    <v-app>
      <!-- Navbar -->
      <Navbar />

      <!-- Page Container -->
      <v-container fluid class="layout" >
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

.layout {
  background-color: #210440;
}


/* Hide scrollbar for main content */
.main-content::-webkit-scrollbar {
  display: none; /* For Webkit browsers */
}

.main-content {
  scrollbar-width: none; /* For Firefox */
}

.main-content {
  overflow-y: auto; /* Allow scrolling within the main content */

}
</style>
