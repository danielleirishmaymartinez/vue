<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formActionDefault, supabase } from '@/utils/supabase.js';
import { requiredValidator, passwordValidator } from '@/utils/validators';
import { ref, computed } from 'vue';

// Default form data
const formDataDefault = {
  password: '',
  password_confirmation: '',
};
const formData = ref({ ...formDataDefault });
const formAction = ref({ ...formActionDefault });

// Dynamic visibility for password fields
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

// Reference to the VForm component for validation
const refVForm = ref();

// Validator for confirming password matches
const confirmedValidator = computed(() => (value) =>
  value === formData.value.password || 'Passwords do not match.'
);

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  // Check if password is valid before submitting
  const validPassword = passwordValidator(formData.value.password);

  // Only log success or failure on password validation
  if (validPassword === true) {
    // Proceed to update password
    const { data, error } = await supabase.auth.updateUser({
      password: formData.value.password,
    });

    if (error) {
      formAction.value.formErrorMessage = error.message;
      formAction.value.formStatus = 'error';
      console.log('Password update error:', error.message);  // Only log the error message
    } else {
      formAction.value.formSuccessMessage = 'Password updated successfully!';
      formAction.value.formStatus = 'success';
      console.log('Password update success');  // Success log without sensitive info
      formData.value = { ...formDataDefault };  // Reset form
    }
  } else {
    // Handle validation failure
    formAction.value.formErrorMessage = validPassword;
    formAction.value.formStatus = 'error';
    console.log('Password validation failed.');
  }
};

// Handle the form submission
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) {
      onSubmit();
    } else {
      console.log('Form validation failed.');
    }
  });
};
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row dense>
      <v-col cols="12" sm="6">
        <!-- New Password Field -->
        <v-text-field
          v-model="formData.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          label="New Password"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[requiredValidator, passwordValidator]"
          :append-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="isPasswordVisible = !isPasswordVisible"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <!-- Confirm Password Field -->
        <v-text-field
          v-model="formData.password_confirmation"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          label="Confirm Password"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[requiredValidator, confirmedValidator]"
          :append-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="isPasswordConfirmVisible = !isPasswordConfirmVisible"
        />
      </v-col>
    </v-row>

    <v-btn
      class="mt-2"
      type="submit"
      color="pink-accent-2"
      rounded="pill"
      prepend-icon="mdi-key-variant"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Update Password
    </v-btn>
  </v-form>
</template>