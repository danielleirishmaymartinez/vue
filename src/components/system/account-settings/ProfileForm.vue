<script setup>
import { requiredValidator } from '@/utils/validators';
import AlertNotification from '@/components/common/AlertNotification.vue';
import { formActionDefault } from '@/utils/supabase.js';
import { useAuthUserStore } from '@/stores/authUser';
import { ref } from 'vue';
import supabase from '@/utils/supabase.js';

const authStore = useAuthUserStore();

const formData = ref({
  firstname: authStore.userData?.first_name || '',
  lastname: authStore.userData?.last_name || '',
  email: authStore.userData?.email || '',
  facebookLink: authStore.userData?.fb_link || '',
  bio: authStore.userData?.bio || '',
  location: authStore.userData?.preferred_location || '',
  time: authStore.userData?.preferred_time || '',
});

const formAction = ref({ ...formActionDefault });
const refVForm = ref();

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  // Use defaults if certain fields are empty
  const updatedData = {
    first_name: formData.value.firstname,
    last_name: formData.value.lastname,
    fb_link: formData.value.facebookLink,
    bio: formData.value.bio || 'No bio available.',  // Default bio if empty
    preferred_location: formData.value.location || 'Not specified', // Default location
    preferred_time: formData.value.time || 'Not specified', // Default time
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(updatedData)
    .eq('user_id', authStore.userData?.id); // Ensure the update is for the current user

  if (error) {
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = error.status;
  } else if (data) {
    // Optionally update the store with the new data
    authStore.userData.first_name = formData.value.firstname;
    authStore.userData.last_name = formData.value.lastname;
    authStore.userData.fb_link = formData.value.facebookLink;
    authStore.userData.bio = formData.value.bio;
    authStore.userData.preferred_location = formData.value.location;
    authStore.userData.preferred_time = formData.value.time;

    formAction.value.formSuccessMessage = 'Successfully updated account information.';
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

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.facebookLink"
          label="Facebook Link"
          prepend-inner-icon="mdi-facebook"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.location"
          label="Location"
          prepend-inner-icon="mdi-map-marker-outline"
          hint="Enter your location"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.time"
          label="Available Time"
          prepend-inner-icon="mdi-clock-outline"
          type="time"
          hint="Enter the time"
        />
      </v-col>

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
