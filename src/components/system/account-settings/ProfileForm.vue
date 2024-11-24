<script setup>
import { requiredValidator, integerValidator } from '@/utils/validators';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formActionDefault } from '@/utils/supabase.js';
import { useAuthUserStore } from '@/stores/authUser';
import { ref } from 'vue';

const authStore = useAuthUserStore();

const formData = ref({
  firstname: authStore.userData?.firstname || '',
  middlename: authStore.userData?.middlename || '',
  lastname: authStore.userData?.lastname || '',
  email: authStore.userData?.email || '',
  phone: authStore.userData?.phone || '',
  facebookLink: authStore.userData?.facebookLink || '', // Added Facebook link
  bio: authStore.userData?.bio || '', // Added bio
  location: authStore.userData?.location || '', // Added location
  time: authStore.userData?.time || '', // Added time
});

const formAction = ref({ ...formActionDefault });
const refVForm = ref();

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  const { data, error } = await authStore.updateUserInformation(formData.value);

  if (error) {
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully updated account.';
  }

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
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="formData.firstname"
          label="Firstname"
          :rules="[requiredValidator]"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model="formData.middlename"
          label="Middlename"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model="formData.lastname"
          label="Lastname"
          :rules="[requiredValidator]"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          readonly
          disabled
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
        />
      </v-col>

      <!-- Facebook Link Field -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.facebookLink"
          label="Facebook Link"
          prepend-inner-icon="mdi-facebook"
        />
      </v-col>

      <!-- Location Field -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.location"
          label="Location"
          prepend-inner-icon="mdi-map-marker-outline"
          hint="Enter your location"
        />
      </v-col>

      <!-- Time Field -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.time"
          label="Available Time"
          prepend-inner-icon="mdi-clock-outline"
          type="time"
          hint="Enter the time"
        />
      </v-col>

      <!-- Bio Field -->
      <v-col cols="12" sm="6">
        <v-textarea
          v-model="formData.bio"
          label="Bio"
          rows="2"
          hint="Tell us about yourself"
        />
      </v-col>

    </v-row>

    <v-btn
      class="mt-2"
      type="submit"
      color="red-darken-4"
      rounded="pill"
      prepend-icon="mdi-account-box-edit-outline"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Update Information
    </v-btn>
  </v-form>
</template>
