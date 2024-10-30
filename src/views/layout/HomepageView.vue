<script setup>
import SidebarNav from '@/components/layout/SidebarNav.vue';
import { useDisplay } from 'vuetify';
import { ref } from 'vue';

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
</script>

<template>
  <v-app>
    <!-- Top Navbar -->
    <v-app-bar app
      elevation="0"
      color="transparent"
      class="px-4">
      <v-btn icon @click="drawerVisible = !drawerVisible" v-if="mobile">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title class="d-flex align-center">
        <img src="@/assets/logo.png" alt="Logo" class="mr-2" width="30" />
        <span>Student Trade and Sell Hub</span>
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

      <v-btn text>Logout</v-btn>
    </v-app-bar>

    <!-- Sidebar and Main Content Area -->
    <v-container fluid class="d-flex">
      <SidebarNav v-model:drawer="drawerVisible" />

      <v-main class="mt-5 pt-3">
      </v-main>
    </v-container>
  </v-app>
</template>
