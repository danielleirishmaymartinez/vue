<template>
  <v-form fast-fail @submit.prevent="onSubmit">
    <v-text-field
      label="Firstname:"
      variant="outlined"
      :rules="[requiredValidator, alphaValidator]"
      v-model="firstname"
    ></v-text-field>

    <v-text-field
      label="Lastname:"
      variant="outlined"
      :rules="[requiredValidator, alphaValidator]"
      v-model="lastname"
    ></v-text-field>

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

    <v-text-field
      label="Confirm Password:"
      type="password"
      variant="outlined"
      :rules="[requiredValidator, (value) => confirmPasswordValidator(value, password)]"
      v-model="confirmPassword"
    ></v-text-field>

    <v-btn class="mt-2" type="submit" block color="primary">Sign Up</v-btn>

    <!-- Error message -->
    <v-alert v-if="errorMessage" type="error" class="mt-3">
      {{ errorMessage }}
    </v-alert>

    <!-- Success message -->
    <v-alert v-if="successMessage" type="success" class="mt-3">
      {{ successMessage }}
    </v-alert>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator, confirmPasswordValidator, alphaValidator } from '@/utils/validators';
import supabase from '@/utils/supabase'; // Adjust the path as necessary
import { useRouter } from 'vue-router';

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref(''); // For error messages
const successMessage = ref(''); // For success messages

const router = useRouter(); // Create a router instance

async function onSubmit() {
  const { user, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        firstname: firstname.value,
        lastname: lastname.value,
      },
    },
  });

  if (error) {
    errorMessage.value = `Registration error: ${error.message}`; // Set the error message
    successMessage.value = ''; // Clear success message
  } else {
    successMessage.value = 'Registration successful! Redirecting to login...'; // Set success message
    errorMessage.value = ''; // Clear error message

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
}
</script>
