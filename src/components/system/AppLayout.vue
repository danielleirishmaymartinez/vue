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
  <v-responsive>
    <v-app
      :theme="themeStore.theme"
      :class="themeStore.theme === 'dark' ? 'dark-mode' : 'light-mode'"
    >
      <!-- App Bar -->
      <v-app-bar flat>
        <v-btn text class="d-flex align-center" @click="navigateTo('/')">
          <img src="/images/logo.png" alt="logo" class="mr-2" width="25" />
          <span class="ml-1">STASH</span>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="themeStore.toggleTheme"
          variant="elevated"
          slim
        ></v-btn>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <!-- Dynamic Content -->
        <v-container class="d-flex">
          <!-- Sidebar -->
          <v-col cols="6 my-4" class="padded-row">
            <v-row class="my-4">
              <h3 class="h3 animated-text">Welcome to</h3>
            </v-row>

            <v-row justify="center" class="my-1 ml-2">
              <h1 class="title animated-text">Student Trade and <br>Sell Hub</h1>
            </v-row>
            <v-row class="ml-6">
              <p class="subtitle animated-text">
                your campus-exclusive platform for trading and selling items, 
                where you can easily post listings, browse deals, and connect with fellow students
              </p>
            </v-row>
          </v-col>

          <v-col cols="10">
            <slot name="content"></slot>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Light and Dark Mode Styling */
.light-mode {
  background-color: rgba(255, 255, 255, 0.712);
  color: #000000;
}

.dark-mode {
  background-color: rgba(18, 18, 18, 0.9);
  color: #ffffff;
}

/* Title and Subtitle Styling */
.title {
  font-size: 40px;
  font-weight: bold;
  color: #9b5f06;
  margin: 0;
  font-style: italic;
}

.subtitle {
  font-size: 18px;
  color: #e0932f; /* Subtle gold color */
}

/* Light and Dark Mode Title and Subtitle Colors */
.dark-mode .title {
  color: #e0b14b;
}

.light-mode .title {
  color: #663906;
}

.dark-mode .subtitle {
  color: #ffffff;
}

.light-mode .subtitle {
  color: #000000;
}

/* Padding for Row */
.padded-row {
  padding: 100px; /* Ample spacing around the title */
  text-align: center; /* Center-align text within the row */
}

/* Heading Styling */
.h3 {
  font-size: 28px;
  margin: 0;
}

/* Animation for text */
@keyframes slideUp {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Apply animation to text */
.animated-text {
  animation: slideUp 1s ease-out forwards;
}

/* Delay for the subtitle and title */
.animated-text:nth-child(2) {
  animation-delay: 0.3s;
}

.animated-text:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
