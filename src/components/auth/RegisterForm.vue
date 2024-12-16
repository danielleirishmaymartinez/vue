<script setup>
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

// Load Variables
const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: ''
}
const formData = ref({
  ...formDataDefault
})
const formAction = ref({
  ...formActionDefault
})
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true }

  // Register user in Supabase auth
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        is_admin: false
      }
    }
  })

  if (error) {
    // Handle error and show message
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // User registration was successful, now insert profile data
    const { user } = data

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        user_id: user.id, // This is the user ID from auth
        first_name: formData.value.firstname,
        last_name: formData.value.lastname,
        // You can add any other additional profile info here
      }
    ])

    if (profileError) {
      // Handle any errors that occur while inserting into the profiles table
      formAction.value.formErrorMessage = profileError.message
      formAction.value.formStatus = profileError.status
    } else {
      // Add Success Message
      formAction.value.formSuccessMessage = 'Successfully Registered Account.'
      // Redirect to login
      router.replace('/login')
    }
  }

  // Reset Form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

// Debuggable form submission
const onFormSubmit = () => {
  console.log("onFormSubmit called");
  
  // Manually check validation for each field
  const isFirstNameValid = requiredValidator(formData.value.firstname);
  const isLastNameValid = requiredValidator(formData.value.lastname);
  const isEmailValid = emailValidator(formData.value.email);
  const isPasswordValid = passwordValidator(formData.value.password);
  const isPasswordConfirmationValid = confirmedValidator(formData.value.password_confirmation, formData.value.password);

  console.log("First Name Valid:", isFirstNameValid);
  console.log("Last Name Valid:", isLastNameValid);
  console.log("Email Valid:", isEmailValid);
  console.log("Password Valid:", isPasswordValid);
  console.log("Password Confirmation Valid:", isPasswordConfirmationValid);

  // Check if any validation failed
  if (isFirstNameValid !== true || isLastNameValid !== true || isEmailValid !== true || isPasswordValid !== true || isPasswordConfirmationValid !== true) {
    console.log("Validation failed!");
    return; // Prevent submitting the form
  }

  // Proceed to submit the form if validation passes
  console.log("Validation passed, submitting form...");
  refVForm.value?.validate().then(({ valid }) => {
    console.log("Validation result:", valid);
    if (valid) {
      onSubmit();
    }
  });
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="register-form">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.firstname"
          label="Firstname"
          :rules="[requiredValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.lastname"
          label="Lastname"
          :rules="[requiredValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[requiredValidator, emailValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator, passwordValidator]"
          class="input-field"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Password Confirmation"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :rules="[requiredValidator, confirmedValidator(formData.password_confirmation, formData.password)]"
          class="input-field"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-btn
      class="mt-2 submit-btn"
      type="submit"
      color="purple"
      prepend-icon="mdi-account-plus"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Register
    </v-btn>
  </v-form>
</template>

