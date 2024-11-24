<script setup>
import SidebarNav from '@/components/system/SidebarNav.vue';
import PasswordForm from '@/components/system/account-settings/PasswordForm.vue';
import ProfileForm from '@/components/system/account-settings/ProfileForm.vue';
import PictureForm from '@/components/system/account-settings/PictureForm.vue';
import { useDisplay } from 'vuetify';
import { ref } from 'vue';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser';

const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();
const authStore = useAuthUserStore();

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
  <v-app>
    <v-app-bar app elevation="0" color="transparent" class="px-4">
      <v-btn icon @click="drawerVisible = !drawerVisible" v-if="mobile">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title @click="$router.push('/homepage')">
        <img src="/images/logo.png" alt="logo" class="mr-2" width="50" />
        <span class="ml-1">STASH</span>
      </v-toolbar-title>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-container fluid class="d-flex">
      <SidebarNav v-model:drawer="drawerVisible" />
      <v-container>
        <v-card class="mb-5">
          <template #title>
            <span class="text-h6 font-weight-bold">
              <v-breadcrumbs :items="['Account', 'Settings']">
                <template #prepend>
                  <v-icon>mdi-wrench</v-icon>
                </template>
              </v-breadcrumbs>
            </span>
          </template>
          <template #subtitle>
            <p>Edit profile information, update profile picture, and change password.</p>
          </template>
        </v-card>

        <v-card class="mb-5">
          <v-card-text>
            <PictureForm /> <!-- Added -->
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <v-card-text>
            <ProfileForm />
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <v-card-text>
            <PasswordForm />
          </v-card-text>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>
