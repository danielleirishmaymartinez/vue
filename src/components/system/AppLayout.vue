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
      class="bg-image"
    >
      <v-app-bar class="px-3 blurred-navbar" flat>
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

      <v-footer elevation="24" border app class="blurred-navbar">
        <v-container>
          <v-row>
        <div :class="mobile ? 'w-100 text-center' : ''">
          Copyright @ 2024 - Student Trade and Sell Hub
        </div>
          </v-row>
        </v-container>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Dark mode styles */
.dark-mode {
  background-color: rgba(18, 18, 18, 0.9);
  color: #ffffff;
}

/* Light mode styles */
.light-mode {
  background-color: rgba(255, 255, 255, 0.712);
  color: #000000;
}

/* Background image for the entire app */
.bg-image {
  background-image: url('/images/lp-bg.jpg'); /* Update the path as necessary */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.blurred-navbar {
  background-color: rgba(236, 216, 171, 0.3); 
  backdrop-filter: blur(10px);
  box-shadow: none;
}

.dark-mode .blurred-navbar {
  background-color: rgba(37, 22, 2, 0.658); /* Adjust for dark mode */
}
</style>
