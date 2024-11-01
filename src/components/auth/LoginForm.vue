<template>
  <v-form fast-fail @submit.prevent="onSubmit">
    <v-text-field
      label="Email:"
      variant="outlined"
      :rules="[requiredValidator, emailValidator]"
      v-model="email"
    ></v-text-field>

    <v-text-field
      label="Password:"
      type="password"
      variant="outlined"
      :rules="[requiredValidator, passwordValidator]"
      v-model="password"
    ></v-text-field>

    <v-btn class="mt-2" type="submit" block color="primary">Login</v-btn>

    <!-- Error message -->
    <v-alert v-if="errorMessage" type="error" class="mt-3">
      {{ errorMessage }}
    </v-alert>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators.js';
import supabase from '@/utils/supabase.js';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

async function onSubmit() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = `Login error: ${error.message}`;
    } else if (data.user) {
      console.log('Logged in:', data.user);
      errorMessage.value = '';
      router.push('/homepage');
    }
  } catch (err) {
    errorMessage.value = `Unexpected error: ${err.message}`;
    console.error(err);
  }
}
</script>
