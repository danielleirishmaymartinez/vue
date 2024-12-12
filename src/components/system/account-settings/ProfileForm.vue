<script setup>
import { ref, onMounted } from 'vue';
import { useAuthUserStore } from '@/stores/authUser';
import AlertNotification from '@/components/common/AlertNotification.vue';
import supabase from '@/utils/supabase.js';
import { formActionDefault } from '@/utils/supabase.js';

const authStore = useAuthUserStore();

const formData = ref({
  firstname: '',
  lastname: '',
  email: authStore.userData?.email || '',
  facebookLink: '',
  location: '',
  time: '',
});

const formAction = ref({ ...formActionDefault });
const refVForm = ref();

const fetchUserData = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, fb_link, preferred_location, preferred_time')
      .eq('user_id', authStore.userData?.id)
      .single();

    if (error) {
      console.error('Error fetching profile data:', error.message);
    } else if (data) {
      formData.value = {
        firstname: data.first_name || '',
        lastname: data.last_name || '',
        email: authStore.userData?.email || '',
        facebookLink: data.fb_link || '',
        location: data.preferred_location || '',
        time: data.preferred_time || '',
      };
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};

const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  try {
    // Fetch the existing profile data to ensure no fields are lost
    const { data: existingData, error: fetchError } = await supabase
      .from('profiles')
      .select('first_name, last_name, fb_link, preferred_location, preferred_time')
      .eq('user_id', authStore.userData?.id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // Merge existing data with the new form values
    const updatedData = {
      first_name: formData.value.firstname || existingData.first_name,
      last_name: formData.value.lastname || existingData.last_name,
      fb_link: formData.value.facebookLink || existingData.fb_link,
      preferred_location: formData.value.location || existingData.preferred_location || 'Not specified',
      preferred_time: formData.value.time || existingData.preferred_time || 'Not specified',
    };

    // Update the database
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('user_id', authStore.userData?.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Update local store with new data
    authStore.userData = { ...authStore.userData, ...updatedData };

    formAction.value.formSuccessMessage = 'Successfully updated account information.';
  } catch (error) {
    formAction.value.formErrorMessage = error.message;
    formAction.value.formStatus = 'error';
  } finally {
    formAction.value.formProcess = false;
  }
};

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit();
  });
};

// Pre-fill form when component is mounted
onMounted(() => {
  fetchUserData();
});
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
          v-model="formData.firstname"
          label="Firstname"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.lastname"
          label="Lastname"
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
    </v-row>

    <v-btn
      class="mt-2"
      type="submit"
      color="pink-accent-2"
      rounded="pill"
      prepend-icon="mdi-account-box-edit-outline"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Update Information
    </v-btn>
  </v-form>
</template>
