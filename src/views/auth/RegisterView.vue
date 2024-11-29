<script setup>
import AppLayout from '@/components/system/AppLayout.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import { useDisplay } from 'vuetify';
import { RouterLink } from 'vue-router'; // Import RouterLink to create a clickable link

const { mobile } = useDisplay();
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="false">
    <template #content>
      <v-container fluid>
        <div class="row justify-content-center pt-4">
          <div class="col-12" sm="10" md="8" lg="6">
            <v-card class="mx-auto rounded-lg" elevation="0" max-width="700">
              <!-- Title Section -->
              <v-card-title class="text-center">
                <h3 class="font-weight-black mt-5">Registration</h3>
                <v-img
                  class="mx-auto"
                  src="/images/logo.png"
                  :width="mobile ? '25%' : '25%'"
                ></v-img>
              </v-card-title>

              <!-- Content Section -->
              <v-card-text class="pt-4">
                <v-divider class="my-5"></v-divider>

                <RegisterForm></RegisterForm>

                <v-divider class="my-5"></v-divider>

                <!-- Login Text with Clickable Link -->
                <div class="row justify-content-center my-1">
                  <h4 class="text-center">
                    Already have an account? 
                    <RouterLink class="text-red-darken-4 font-weight-black" to="/login">
                      Click here to Login
                    </RouterLink>
                  </h4>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Responsive Padding for Larger Screens */
.pt-20 {
  padding-top: 5rem;
}

/* Adjust Card Responsiveness */
.v-card {
  max-width: 400px;
}

/* Title Alignment */
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
