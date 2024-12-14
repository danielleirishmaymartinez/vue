<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-responsive>
    <v-app>      <!-- Background Image -->
      <div class="background-wrapper">
        <!-- Transparent App Bar -->
        <v-app-bar flat class="transparent-navbar">
          <v-btn text class="d-flex align-center" @click="navigateTo('/')">
            <img
              src="/images/logo.png"
              alt="Campus Logo logo"
              class="mr-2"
              width="25"
            />
            <span class="ml-2">Campus Deals</span>
          </v-btn>
          <v-spacer></v-spacer>

        </v-app-bar>

        <!-- Main Content -->
        <v-main>
          <v-container>
            <v-row>
              <!-- Left Column: Text -->
              <v-col cols="12" md="7" class="d-flex flex-column justify-center">
              </v-col>

              <!-- Right Column: Login Form -->
              <v-col
                cols="12"
                md="5"
                class="d-flex justify-center align-center"
              >
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
  background-image: url('/images/a.png'); /* Path to your background image */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed; /* Keeps the background fixed */
  width: 100%;
  height: 100vh; /* Full viewport height */
}

/* Transparent Navbar */
.transparent-navbar {
  background-color: transparent !important;
  position: absolute;
  width: 100%;
  z-index: 10;
  color: white; /* Ensures navbar text is visible over the background */
}

/* Form Container Styling */
.form-container {
  background-color: rgba(206, 124, 124, 0.19); /* Slightly transparent white */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: -50px; /* Moves the form up */
}

/* Custom Field Styles */
.custom-field .v-input {
  background-color: transparent !important; /* Transparent background */
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.custom-field input:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: rgba(255, 0, 0, 0.7) !important; /* Red border on focus */
}

/* Remove label blue effect */
.custom-field .v-label {
  color: rgba(255, 255, 255, 0.8) !important; /* White for dark mode */
}


/* Responsive Design */
@media (max-width: 600px) {
  .form-container {
    padding: 10px;
    max-width: 100%;
    margin-top: -30px; /* Adjust form position on smaller screens */
  }
}
</style>
