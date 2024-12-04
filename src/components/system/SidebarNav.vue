<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useThemeStore } from '@/stores/theme.js'; // Import the theme store

const router = useRouter();
const { mobile } = useDisplay();
const drawer = ref(!mobile.value);
const themeStore = useThemeStore(); // Access the theme store

// Define reactive data
const admins = ref([
  { title: 'Profile Picture', icon: 'mdi-account', path: '/picture' },
  { title: 'Profile Information', icon: 'mdi-account-edit', path: '/profile-info' },
  { title: 'Change Password', icon: 'mdi-shield', path: '/password' },
]);

// Function to navigate to different routes
function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!mobile"
    :temporary="mobile"
    app
    width="300"
    :theme="themeStore.theme"
    :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
    class="border border-e-lg"
  > 


    <v-list class=" mt-15 flex-row  pt-12">
      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        @click="navigateTo('/home')"
        :theme="themeStore.theme"
        :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
      >
        <template v-slot:prepend>
          <v-icon class="icon-circle">mdi-home</v-icon>
        </template>
      </v-list-item>

      <v-list-item
        prepend-icon="mdi-account"
        title="Profile"
        @click="navigateTo('/profile')"
        :theme="themeStore.theme"
        :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
      >
        <template v-slot:prepend>
          <v-icon class="icon-circle" :theme="themeStore.theme" :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'">mdi-account</v-icon>
        </template>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-cog-outline"
            title="Account Settings"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="admin in admins"
          :key="admin.title"
          :prepend-icon="admin.icon"
          :title="admin.title"
          @click="navigateTo(admin.path)"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.light-mode {
  background-color: #ffffff;
}

.dark-mode {
  background-color: #121212;
}

.v-navigation-drawer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-size: contain;
  background-position: center;
}

.v-list-item {
  transition: all 0.3s ease;
  border-radius: 15px;
  font-weight: 500;
}

.v-list-item:hover {
  border-radius: 15px;
  transform: scale(1.1);
  font-weight: 800;
}

.v-navigation-drawer--is-mobile .v-list {
  align-items: center;
}

.icon-circle {
  border-radius: 50%;
  padding: 10px;
  font-size: 24px;
  transition: all 0.3s ease;
}

.icon-circle:hover {
  transform: scale(1.5);
}
</style>