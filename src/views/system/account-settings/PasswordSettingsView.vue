<script setup>
import { ref } from "vue";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import PasswordForm from "@/components/system/account-settings/PasswordForm.vue";
import { useThemeStore } from '@/stores/theme.js';

const drawerVisible = ref(true);
const themeStore = useThemeStore();
</script>

<template>
  <v-app
    :theme="themeStore.theme"
    :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
  >
    <Navbar />
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" lg="2" class="sidebar">
          <SidebarNav v-model:drawer="drawerVisible" />
        </v-col>
        <v-col cols="12" md="9" lg="10">
          <div class="content-wrapper">
            <v-card class="mb-5 ml-8 extended-card border-lg">
              <v-card-title class="pa-12">Change Password</v-card-title>
              <v-container class="d-flex justify-center">
                <v-card-text>
                  <PasswordForm />
                </v-card-text>
              </v-container>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.extended-card {
  height: 400px; /* Adjust height as needed */
}

.content-wrapper {
  padding: 50px;
  margin: 30px;
}
</style>
