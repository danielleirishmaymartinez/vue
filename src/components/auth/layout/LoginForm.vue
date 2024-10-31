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
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validators';

const email = ref('');
const password = ref('');

function onSubmit() {
  // Handle login logic here
}
</script>
