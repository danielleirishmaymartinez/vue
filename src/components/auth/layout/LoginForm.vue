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
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators';
import supabase from '@/utils/supabase'; // Adjust the path as necessary
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref(''); // For error messages

const router = useRouter(); // Create a router instance

async function onSubmit() {
  const { user, error } = await supabase.auth.signIn({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = `Login error: ${error.message}`; // Set the error message
  } else {
    console.log('Logged in:', user);
    errorMessage.value = ''; // Clear any previous error messages

    // Redirect to the homepage after successful login
    router.push('/homepage'); // Adjust this route based on your homepage configuration
  }
}
</script>
