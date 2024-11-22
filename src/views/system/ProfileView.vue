<script setup>
import Navbar from '@/components/system/Navbar.vue'; // Import the Navbar component
import SidebarNav from '@/components/system/SidebarNav.vue';
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
      <!-- Top Navbar (integrated Navbar component) -->
      <Navbar />

      <v-container fluid class="d-flex">
        <!-- Sidebar Navigation -->
        <SidebarNav v-model:drawer="drawerVisible" />

        <!-- Main Content Area -->
        <v-main class="mt-5 pt-3">
          <v-container>
            <!-- Main content for your page goes here -->
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title>Main Content Area</v-card-title>
                  <v-card-text>
                    Add the content for this page here.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-container>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Style adjustments for layout, if necessary */
.v-responsive {
  height: 100%;
}
</style>
