<script setup>
import AppLayout from '@/components/system/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="false">
    <template #content>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="14" lg="7" :class="mobile ? '' : 'pt-20'">
            <v-card class="mx-auto rounded-lg" elevation="0" max-width="700">
              <v-card-title class="text-center">
                <h3 class="font-weight-black mt-5">Registration</h3>
                <v-img
                  class="mx-auto"
                  src="/images/logo.png"
                  :width="mobile ? '25%' : '25%'"
                ></v-img>
              </v-card-title>

              <v-card-text class="pt-4">
                <v-divider class="my-5"></v-divider>

                <RegisterForm></RegisterForm>

                <v-divider class="my-5"></v-divider>

                <h4 class="text-center">
                  Already have account?
                  <RouterLink class="text-red-darken-4 font-weight-black" to="/login">
                    Click here to Login
                  </RouterLink>
                </h4>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
