<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { formActionDefault, supabase } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formDataDefault = {
  email: '',
  password: ''
}
const formData = ref({
  ...formDataDefault
})
const formAction = ref({
  ...formActionDefault
})
const isPasswordVisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  // Authenticate user
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  });

  if (error) {
    // Show error message if login fails
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  } else if (data?.user) {
    // Fetch current user session to access metadata (is_admin)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      formAction.value.formErrorMessage = sessionError.message;
    } else {
      const { user_metadata } = sessionData?.session?.user || {};

      // Check if the user is blocked
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_blocked')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        formAction.value.formErrorMessage = profileError.message;
      } else if (profileData?.is_blocked) {
        // Blocked user: show alert and log them out
        formAction.value.formErrorMessage = "Your account has been blocked. Please contact support.";
        await supabase.auth.signOut();
        return;
      } else {
        // User is not blocked, proceed as usual
        if (user_metadata?.is_admin) {
          formAction.value.formSuccessMessage = "Admin Logged In Successfully.";
          router.replace('/admin');
        } else {
          formAction.value.formSuccessMessage = "User Logged In Successfully.";
          router.replace('/home');
        }
      }
    }
  }

  // Reset form
  refVForm.value?.reset();
  formAction.value.formProcess = false;
};

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="login-form">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[requiredValidator, emailValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      class="mt-2 submit-btn"
      type="submit"
      color="purple"
      prepend-icon="mdi-login"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Login
    </v-btn>
  </v-form>
</template>
