<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser.js'; // Update import path to the merged authUser.js file
import supabase from '@/utils/supabase.js';

const router = useRouter();
const showAppearancePage = ref(false); // Use `ref` here to manage the dropdown page toggle
const userProfile = ref({});

const userStore = useAuthUserStore(); // Use the updated store

// Initialize session and fetch user profile on mounted
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated(); // Check if the user is authenticated
  if (!isLoggedIn) {
    router.push('/login');
    return;
  }

  // Fetch user profile using user_id from profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, profile_image')
    .eq('user_id', userStore.userData?.id) // Access user ID from the store
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    userProfile.value = data || { first_name: 'Unknown', last_name: 'User', profile_image: '/default-avatar.jpg' };

    // If there is a profile image, fetch the signed URL
    if (userProfile.value?.profile_image) {
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('profile-images') // Assuming 'profile-images' is the storage bucket
        .createSignedUrl(userProfile.value.profile_image, 60 * 60); // 1-hour expiration

      if (signedUrlError) {
        console.error('Error fetching signed URL:', signedUrlError.message);
      } else {
        userProfile.value.profile_image = signedUrlData.signedUrl; // Update the profile image with the signed URL
      }
    }
  }
});

// Redirect to Profile Page
const goToProfile = () => {
  router.push('/profile');
};

// Switch Appearance Page Toggle
const switchAppearance = () => {
  showAppearancePage.value = true; // This will toggle the visibility of the appearance page
};

// Switch to Light Mode
const switchToLightMode = () => {
  console.log('Switched to Light Mode');
};

// Switch to Dark Mode
const switchToDarkMode = () => {
  console.log('Switched to Dark Mode');
};

// Go Back to the Original Dropdown Page
const goBack = () => {
  showAppearancePage.value = false; // Reset to original dropdown view
};

// Logout function
async function logout() {
  try {
    await supabase.auth.signOut();
    userStore.$reset(); // Reset user data in the store
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>
<template>
  <v-app-bar dark>
    <!-- Logo and Web Name -->
    <v-container class="d-flex align-center">
      <img src="/images/logo.png" alt="Logo" class="me-2" style="width: 40px; height: 40px;" />
      <span class="text-h6">STASH</span>
    </v-container>

    <!-- Center Search Bar -->
    <v-spacer></v-spacer>
    <v-container class="mx-auto" max-width="600px">
      <v-text-field
        rounded
        outlined
        density="comfortable"
        label="Search"
        hide-details
        append-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-container>
    <v-spacer></v-spacer>

    <!-- Account Dropdown -->
    <v-menu offset-y :close-on-content-click="false" class="mdi-account-dropdown">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-avatar size="40" class="avatar-img">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Account Icon" />
          </v-avatar>
        </v-btn>
      </template>

      <!-- Main Dropdown Box -->
      <v-sheet rounded elevation="2" width="300" class="pa-4 d-flex flex-column align-start">
        <!-- Profile and Name (Clickable) -->
        <div 
          class="d-flex align-center clickable-profile mb-3"
          @click="goToProfile"
        >
          <v-avatar size="40" class="avatar-img">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Profile Picture" />
          </v-avatar>
          <span class="ms-3 text-subtitle-1">{{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}</span>
        </div>

        <v-divider></v-divider>

        <!-- Switch Appearance Button -->
        <v-btn
          variant="text"
          class="mt-2 full-width-btn align-start"
          prepend-icon="mdi-moon"
          @click="switchAppearance"
        >
          Switch Appearance
        </v-btn>

        <!-- Logout Button -->
        <v-btn
          variant="text"
          color="error"
          class="mt-2 full-width-btn align-start"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>

        <!-- Switch Appearance Page Content -->
        <div v-if="showAppearancePage" class="mt-4">
          <v-btn
            text
            class="d-flex align-center full-width-btn align-start"
            @click="switchToLightMode"
            prepend-icon="mdi-white-balance-sunny"
          >
            Light Mode
          </v-btn>
          <v-btn
            text
            class="d-flex align-center full-width-btn align-start mt-2"
            @click="switchToDarkMode"
            prepend-icon="mdi-moon"
          >
            Dark Mode
          </v-btn>

          <!-- Back Button -->
          <v-btn
            icon
            class="mt-4 full-width-btn align-start"
            @click="goBack"
            prepend-icon="mdi-arrow-left"
          ></v-btn>
        </div>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.avatar-img img {
  object-fit: cover; /* Ensure the image fits nicely */
  width: 100%; /* Full width of the avatar container */
  height: 100%; /* Full height of the avatar container */
  border-radius: 50%; /* Keep it round */
}

.clickable-profile {
  cursor: pointer; /* Change the cursor to a hand when hovering */
  transition: background-color 0.3s ease; /* Smooth transition */
  padding: 8px; /* Add some padding for better clickable area */
  width: 100%; /* Make it stretch to full width of the dropdown */
}

.clickable-profile:hover {
  background-color: #f0f0f0; /* Light grey background on hover */
}

/* Stretch the buttons to the full width of the dropdown */
.full-width-btn {
  width: 100%; /* Make buttons span the full width of the dropdown */
  transition: background-color 0.3s ease; /* Smooth background color transition */
}

/* Buttons background change on hover */
.full-width-btn:hover {
  background-color: #f0f0f0; /* Subtle grey background on hover */
}

/* Align buttons to the left */
.align-start {
  justify-content: flex-start; /* Align buttons to the left */
  text-align: left; /* Text alignment to the left */
}
</style>