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
                  class="form-container"
                  width="100%"
                  max-width="600px"
                  outlined
                >
                  <slot name="content">
                    <v-text-field
                      label="Email"
                      type="email"
                      variant="outlined"
                      color="red"
                      class="custom-field"
                      density="compact"
                      hide-details
                    ></v-text-field>
                    <v-text-field
                      label="Password"
                      type="password"
                      variant="outlined"
                      color="red"
                      class="custom-field"
                      density="compact"
                      hide-details
                    ></v-text-field>
                  </slot>
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

/* Form Container Styling */
.form-container {
  background-color: rgba(245, 243, 246, 0.85); /* Light mode background */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dark-mode .form-container {
  background-color: rgba(33, 33, 33, 0.85); /* Dark mode background */
}

/* Custom Field Styles */
.custom-field .v-input {
  background-color: transparent !important; /* Transparent background */
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Remove blue focus outline in dark mode */
.custom-field input:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: rgba(255, 0, 0, 0.7) !important; /* Red border on focus */
}

/* Remove label blue effect */
.custom-field .v-label {
  color: rgba(255, 255, 255, 0.8) !important; /* White for dark mode */
}

.light-mode .custom-field .v-label {
  color: rgba(0, 0, 0, 0.8) !important; /* Black for light mode */
}

/* Responsive Design */
@media (max-width: 600px) {
  .form-container {
    padding: 10px;
    max-width: 100%;
  }
}
</style>
