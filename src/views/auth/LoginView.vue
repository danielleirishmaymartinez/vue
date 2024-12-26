<script setup>
import AppLayout from '@/components/system/AppLayout.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import { useDisplay } from 'vuetify';
import { RouterLink, useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase'; // Supabase client instance

const { mobile } = useDisplay();
const router = useRouter();
const onGoogleSignIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google OAuth error:', error.message);
    } else if (data) {
      console.log('Google OAuth success:', data);
      router.push('/home'); // Navigate to home page after successful login
    }
  } catch (error) {
    console.error('Error during Google sign-in:', error);
  }
};

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

                <!-- Google OAuth Button -->
                <div class="text-center mt-4">
                  <v-btn
                    color="red darken-1"
                    class="text-white"
                    size="large"
                    @click="onGoogleSignIn"
                  >
                    <v-icon left>mdi-google</v-icon>
                    Sign in with Google
                  </v-btn>
                </div>
                
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