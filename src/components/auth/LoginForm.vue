<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue'
import { formActionDefault, supabase } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

// Load Variables
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
  // Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password
  })

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Logged Account.'
    // Redirect Acct to Dashboard
    router.replace('/home')
  }

  // Reset Form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

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
      color="pink"
      prepend-icon="mdi-login"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Login
    </v-btn>
  </v-form>
</template>

<style scoped>
/* Full-page background image */
v-app {
  background: #f2f2f2;  /* Light gray background for the entire page */
  min-height: 100vh;
}

/* Style the login section with a background image */
.login-form {
  background: url('/images/') no-repeat center center;
  background-size: cover; /* Ensure the image covers the whole login section */
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: auto;  /* Center the form on the page */
  background-color: rgba(255, 255, 255, 0.8); /* Add transparency to the background */
  transition: all 0.3s ease;
}

/* Input fields with soft pink borders */
.input-field .v-input__control {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #f2b8b5; /* Light pink border */
  transition: all 0.3s ease;
}

.input-field .v-input__control:focus-within {
  border-color: #f4b6c2; /* Slightly darker pink on focus */
}

/* Focus effect for input fields */
.input-field input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 105, 180, 0.8); /* Light pink glow */
}

/* Button styles */
.submit-btn {
  background: linear-gradient(135deg, #ff9bb2, #f6a1c3); /* Light pink gradient */
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #ff7f94, #f48fb1); /* Darker pink gradient on hover */
}

/* Disabled button state */
.submit-btn:disabled {
  background-color: #f0d7d8; /* Lighter pink when disabled */
}

/* Alert notification styling */
.alert-notification {
  margin-bottom: 15px;
}

/* Add some spacing and padding for better readability */
v-row {
  margin-top: 20px;
}
</style>
