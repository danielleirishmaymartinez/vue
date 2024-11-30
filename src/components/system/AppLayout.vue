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
              <v-col cols="12" md="7" class="d-flex flex-column justify-center">
        
              </v-col>

              <!-- Right Column: Login Form -->
              <v-col cols="12" md="5" class="d-flex justify-center align-center">
                <v-card
                  class="blur-container"
                  width="100%"
                  max-width="600px"
                  outlined
                >
                  <slot name="content"></slot>
                </v-card>
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
  background-image: url('/images/lr1-form.png'); /* Path to your background image */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
}

/* Blurry Container Styling */
.blur-container {
  backdrop-filter: blur(2px); /* Adds blur to the form container */
  background-color: rgba(245, 243, 246, 0.749); /* Transparent white */
  border-radius: 8px;
  box-shadow: none; /* Removes any shadow for a cleaner look */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Transparent Inner Elements */
.blur-container ::v-deep(.v-card, .v-card__text, input, button, label, .v-btn) {
  backdrop-filter: blur(5px); /* Apply blur to all inner elements */
  background-color: rgba(206, 202, 207, 0.385); /* Ensure transparency */
  border: none; /* Remove borders for consistency */
  color: inherit; /* Use the theme's text color */
  box-shadow: none; /* Remove shadows */
}

/* Responsiveness for smaller screens */
@media (max-width: 600px) {
  .blur-container {
    padding: 10px;
    max-width: 100%;
  }
}
</style>
