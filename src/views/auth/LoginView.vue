<script setup>
import AppLayout from '@/components/system/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'
import { RouterLink } from 'vue-router' // Import RouterLink to create a clickable link

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="false">
    <template #content>
      <v-container fluid>
        <v-row justify="center pt-4">
          <v-col cols="14" lg="7" :class="mobile ? '' : 'pt-4'">
            <v-card class="mx-auto rounded-lg" elevation="0" max-width="700">
              <v-card-title class="text-center">
                <h3 class="font-weight-black mt-5">Login your account</h3>
                <v-img
                  class="mx-auto"
                  src="/images/logo.png"
                  :width="mobile ? '25%' : '25%'"
                ></v-img>
              </v-card-title>

              <v-card-text class="pt-6">
                <v-divider class="my-6"></v-divider>

                <LoginForm></LoginForm>

                <v-divider class="my-5"></v-divider>

                <!-- Register text with clickable link -->
                <v-row justify="center" class="my-1">
                  <h4 class="text-center">
                    Don't have an account? 
                    <RouterLink class="text-red-darken-4 font-weight-black " to="/register">
                      Register
                    </RouterLink>
                  </h4>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>