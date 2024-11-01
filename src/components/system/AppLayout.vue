<script setup>
import { useThemeStore } from '@/stores/theme.js';
import { useRouter } from 'vue-router';

const themeStore = useThemeStore();
const router = useRouter();

function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app
      :theme="themeStore.theme"
      :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
    >
      <v-app-bar class="px-3">
        <v-btn text class="d-flex align-center" @click="navigateTo('/')">
          <img src="/images/logo.png" alt="logo" class="mr-2" width="25" />
          <span class="ml-1">STASH</span>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text @click="navigateTo('/login')">Login</v-btn>
        <v-btn text @click="navigateTo('/register')">Sign Up</v-btn>

        <v-btn
          :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="themeStore.toggleTheme"
          variant="elevated"
          slim
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer elevation="24" border app>
        <v-container>
          <v-row>
            <v-col class="text-center">
              Copyright @ 2024 - Student Trade and Sell Hub
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Dark mode styles */
.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

/* Light mode styles */
.light-mode {
  background-color: #ffffff;
  color: #000000;
}
</style>