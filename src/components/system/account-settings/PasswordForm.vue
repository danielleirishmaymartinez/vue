<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formActionDefault, supabase } from '@/utils/supabase.js';
import { requiredValidator, passwordValidator } from '@/utils/validators';
import { ref, computed } from 'vue';

const formDataDefault = {
  password: '',
  password_confirmation: '',
};
const formData = ref({
  ...formDataDefault,
});
const formAction = ref({
  ...formActionDefault,
});
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);
const refVForm = ref();

// A dynamic validator to check password confirmation
const confirmedValidator = computed(() => (value) =>
  value === formData.value.password || 'Passwords do not match.'
);

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  const { data, error } = await supabase.auth.updateUser({
    password: formData.value.password,
  });

  if (error) {
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully Changed Password.';
  }

  // Reset form fields after successful submission
  formData.value = { ...formDataDefault };
  formAction.value.formProcess = false;
};

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit();
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
      color="red-darken-4"
      rounded="pill"
      prepend-icon="mdi-key-variant"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Update Password
    </v-btn>
  </v-form>
</template>
