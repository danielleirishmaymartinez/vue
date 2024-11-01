<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const theme = ref('light');
const router = useRouter();

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3">
        <v-btn text class="d-flex align-center" @click="$router.push('/')">
          <img src="/images/logo.png" alt="logo" class="mr-2" width="25" />
          <span class="ml-1">STASH</span>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text @click="$router.push('/login')">Login</v-btn>
        <v-btn text @click="$router.push('/register')">Sign Up</v-btn>

        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"></v-btn>
      </v-app-bar>
      
      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer elevation="24" border app>
        <v-container>
          <v-row>
            <v-col class="text-center">
              Copyright @ 2024 - Student Trade and Sell Hub
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-app>
  </v-responsive>
</template>