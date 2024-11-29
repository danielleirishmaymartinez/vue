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
      <!-- Background Image -->
      <div class="background-wrapper">
        <!-- App Bar -->
        <v-app-bar flat>
          <v-btn text class="d-flex align-center" @click="navigateTo('/')">
            <img
              src="/images/logo.png"
              alt="STASH logo"
              class="mr-2"
              width="25"
            />
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
          <v-container>
            <v-row>
              <!-- Left Column: Text -->
              <v-col cols="12" md="6" class="d-flex flex-column justify-center">
                <h3 class="h3 animated-text">Welcome to</h3>
                <h1 class="title animated-text">Student Trade and <br />Sell Hub</h1>
                <p class="subtitle animated-text">
                  Your campus-exclusive platform for trading and selling items,
                  where you can easily post listings, browse deals, and connect
                  with fellow students.
                </p>
              </v-col>

              <!-- Right Column: Login Form -->
              <v-col cols="12" md="6" class="d-flex justify-center align-center">
                <slot name="content"></slot>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </div>
    </v-app>
  </v-responsive>
</template>

<style scoped>
/* Background Wrapper */
.background-wrapper {
  background-image: url('/images/form-bg.jpg'); /* Path to your background image */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
}

/* Light and Dark Mode Styling */
.light-mode {
  color: #000000;
}

.dark-mode {
  color: #ffffff;
}

/* Title and Subtitle Styling */
.title {
  font-size: 40px;
  font-weight: bold;
  margin: 0;
  font-style: italic;
}

.subtitle {
  font-size: 18px;
}

/* Light and Dark Mode Title and Subtitle Colors */
.dark-mode .title {
  color: #ff84d4;
}

.light-mode .title {
  color: #ef2087;
}

.dark-mode .subtitle {
  color: #ffffff;
}

.light-mode .subtitle {
  color: #000000;
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

.animated-text {
  animation: slideUp 1s ease-out forwards;
}

/* Delay for animated elements */
.animated-text:nth-child(2) {
  animation-delay: 0.3s;
}

.animated-text:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
