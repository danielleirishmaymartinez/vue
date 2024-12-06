<script setup>
import AlertNotification from '@/components/common/AlertNotification.vue';
import { useAuthUserStore } from '@/stores/authUser';
import { formActionDefault } from '@/utils/supabase.js';
import { imageValidator, requiredValidator } from '@/utils/validators';
import { ref } from 'vue';
import { fileExtract } from '@/utils/helpers';
import supabase from '@/utils/supabase.js';

const authStore = useAuthUserStore();

const formDataDefault = {
  image: null,
};

const formData = ref({
  ...formDataDefault,
});

const formAction = ref({
  ...formActionDefault,
});

const refVForm = ref();
const imgPreview = ref('/images/profile.png'); // Default preview image

// Fetch the profile image URL from the database for the current user
const fetchProfileImage = async () => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('profile_image')
    .eq('user_id', authStore.userData?.id)
    .single(); // Assuming user_id is unique

  if (profileError) {
    console.error('Error fetching profile image:', profileError.message);
    return;
  }

  if (profileData?.profile_image) {
    // Generate a signed URL for the profile image stored in Supabase Storage
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('profile-images')
      .createSignedUrl(profileData.profile_image, 60 * 60); // 1-hour expiration

    if (!signedUrlError) {
      imgPreview.value = signedUrlData.signedUrl; // Update the image preview with the signed URL
    } else {
      console.error('Error generating signed URL:', signedUrlError.message);
    }
  } else {
    imgPreview.value = '/images/profile.png'; // Default image if no profile image exists
  }
};

// Call the function to fetch the profile image on mount
fetchProfileImage();

// Handle file change and show image preview
const onPreview = async (event) => {
  const { fileObject, fileUrl } = await fileExtract(event);
  formData.value.image = fileObject;
  imgPreview.value = fileUrl; // Update preview image immediately
};

// Reset preview to the current profile image
const onPreviewReset = () => {
  fetchProfileImage(); // Reload the current profile image
};

// Submit the form
const onSubmit = async () => {
  formAction.value = { ...formActionDefault, formProcess: true };

  if (!formData.value.image) {
    formAction.value.formErrorMessage = "Please select an image to upload.";
    formAction.value.formProcess = false;
    return;
  }

  // Upload the image to Supabase Storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(`${authStore.userData?.id}/${formData.value.image.name}`, formData.value.image);

  if (uploadError) {
    formAction.value.formErrorMessage = `Error uploading image: ${uploadError.message}`;
    formAction.value.formProcess = false;
    return;
  }

  // Generate a signed URL for the uploaded file
  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('profile-images')
    .createSignedUrl(fileData.path, 60 * 60); // 1-hour expiration

  if (signedUrlError) {
    formAction.value.formErrorMessage = `Error creating signed URL: ${signedUrlError.message}`;
    formAction.value.formProcess = false;
    return;
  }

  const imageUrl = signedUrlData.signedUrl;

  // Update the profile image URL in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({
      profile_image: fileData.path, // Save file path to DB
    })
    .eq('user_id', authStore.userData?.id); // Ensure we're updating the correct profile based on user_id

  if (error) {
    formAction.value.formErrorMessage = `Error updating profile: ${error.message}`;
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully updated profile image.';
    imgPreview.value = imageUrl; // Update preview immediately after successful upload
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
    <v-row>
      <v-col cols="12" sm="6" md="5">
        <v-img
          width="50%"
          class="mx-auto rounded-circle"
          color="white-darken-4"
          aspect-ratio="1"
          :src="imgPreview"
          alt="Profile Picture Preview"
          cover
        />
      </v-col>

      <v-col cols="12" sm="6" md="5">
        <v-file-input
          class="mt-5"
          :rules="[requiredValidator, imageValidator]"
          accept="image/png, image/jpeg, image/bmp"
          label="Browse Profile Picture"
          placeholder="Browse Profile Picture"
          prepend-icon="mdi-camera"
          show-size
          chips
          @change="onPreview"
          @click:clear="onPreviewReset"
        />

        <v-btn
          class="mt-2"
          type="submit"
          color="red-darken-4"
          rounded="pill"
          prepend-icon="mdi-image-edit"
          :disabled="formAction.formProcess"
          :loading="formAction.formProcess"
        >
          Update Picture
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
