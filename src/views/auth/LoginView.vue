<script setup>
import AppLayout from '@/components/system/AppLayout.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useDisplay } from 'vuetify';
import { RouterLink, useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase'; // Supabase client instance
import { useSidebarStore } from "@/stores/sidebarStore"; // Import the Pinia store


const { mobile } = useDisplay();
const router = useRouter();
const sidebarStore = useSidebarStore();

sidebarStore.isSidebarOpen = false;

</script>

<template>
  <AppLayout :is-with-app-bar-nav-icon="false">
    <template #content>
      <v-container fluid>
        <div class="row justify-content-center pt-4">
          <div class="col-12" sm="10" md="8" lg="6">
            <v-card class="mx-auto rounded-lg">
              <v-card-title class="text-center">
                <h3 class="font-weight-black mt-5">Login your account</h3>
                <v-img
                  class="mx-auto"
                  src="/images/logo.png"
                  :width="mobile ? '25%' : '25%'"
                ></v-img>
              </v-card-title>

              <v-card-text class="pt-4">
                <v-divider class="my-6"></v-divider>

                <LoginForm></LoginForm>

                <v-divider class="my-5"></v-divider>

                <div class="row justify-content-center my-10">
                  <h4 class="text-center">
                    Don't have an account? 
                    <RouterLink class="text-red-darken-4 font-weight-black " to="/register">
                      Register
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