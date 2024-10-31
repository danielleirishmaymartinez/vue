<template>
  <v-form fast-fail @submit.prevent="onSubmit">
    <v-text-field label="Firstname:" variant="outlined" :rules="[requiredValidator, alphaValidator]" v-model="firstname"></v-text-field>

    <v-text-field label="Lastname:" variant="outlined" :rules="[requiredValidator, alphaValidator]" v-model="lastname"></v-text-field>

    <v-text-field label="Email:" variant="outlined" :rules="[requiredValidator, emailValidator]" v-model="email"></v-text-field>

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
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator, confirmPasswordValidator, alphaValidator } from '@/utils/validators';

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

function onSubmit() {
  // Handle registration logic here
}
</script>