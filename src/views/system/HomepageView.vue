<script setup>
import SidebarNav from '@/components/system/SidebarNav.vue';
import HomepageCard from '@/components/system/HomepageCard.vue';
import Navbar from '@/components/system/Navbar.vue';
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();

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
    <v-app>
      <Navbar />

      <v-container fluid class="d-flex">
        <SidebarNav v-model:drawer="drawerVisible" />
        <v-main class="mt-5 pt-3">
          <HomepageCard />
        </v-main>
      </v-container>
    </v-app>
  </v-responsive>
</template>