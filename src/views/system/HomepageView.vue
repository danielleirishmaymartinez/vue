<script setup>
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
      <!-- Top Navbar -->
      <v-app-bar app elevation="0" color="transparent" class="px-4">
        <v-btn icon @click="drawerVisible = !drawerVisible" v-if="mobile">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-toolbar-title class="d-flex align-center" @click="$router.push('/homepage')">
          <img src="/images/logo.png" alt="logo" class="mr-2" width="25" />
          <span class="ml-1">STASH</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-text-field
          solo
          flat
          dense
          prepend-inner-icon="mdi-magnify"
          label="Search"
          hide-details
          class="mx-3"
        ></v-text-field>

        <v-btn text @click="logout">Logout</v-btn>
      </v-app-bar>

      <v-container fluid class="d-flex">
        <SidebarNav v-model:drawer="drawerVisible" />
        <v-main class="mt-5 pt-3">

        </v-main>
      </v-container>
    </v-app>
  </v-responsive>
</template>
