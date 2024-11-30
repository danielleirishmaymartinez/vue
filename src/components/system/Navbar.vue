<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser.js';
import { useThemeStore } from '@/stores/theme.js'; // Add theme store
import supabase from '@/utils/supabase.js';

const router = useRouter();
const themeStore = useThemeStore(); // Theme store for dark/light mode
const showAppearancePage = ref(false);
const userProfile = ref({});

const userStore = useAuthUserStore();

// Initialize session and fetch user profile on mounted
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated();
  if (!isLoggedIn) {
    router.push('/login');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, profile_image')
    .eq('user_id', userStore.userData?.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    userProfile.value = data || {
      first_name: 'Unknown',
      last_name: 'User',
      profile_image: '/default-avatar.jpg',
    };

    if (userProfile.value?.profile_image) {
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('profile-images')
        .createSignedUrl(userProfile.value.profile_image, 60 * 60);

      if (signedUrlError) {
        console.error('Error fetching signed URL:', signedUrlError.message);
      } else {
        userProfile.value.profile_image = signedUrlData.signedUrl;
      }
    }
  }
});

const goToProfile = () => router.push('/profile');
const logout = async () => {
  try {
    await supabase.auth.signOut();
    userStore.$reset();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>


<template>
  <v-app-bar dark>
    <v-container class="d-flex align-center">
      <img src="/images/logo.png" alt="Logo" class="me-2" style="width: 40px; height: 40px;" />
      <span class="text-h6">STASH</span>
    </v-container>

    <v-spacer></v-spacer>

    <!-- Search Bar -->
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

    <!-- Theme Toggle Button -->
    <v-btn
      :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="themeStore.toggleTheme"
      variant="elevated"
      class="me-3"
    >
      
    </v-btn>

    <!-- User Menu -->
    <v-menu offset-y :close-on-content-click="false" class="mdi-account-dropdown">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-avatar size="40" class="avatar-img">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Account Icon" />
          </v-avatar>
        </v-btn>
      </template>
      <v-sheet rounded elevation="2" width="300" class="pa-4 d-flex flex-column align-start">
        <div
          class="d-flex align-center clickable-profile mb-3"
          @click="goToProfile"
        >
          <v-avatar size="40" class="avatar-img">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Profile Picture" />
          </v-avatar>
          <span class="ms-3 text-subtitle-1">
            {{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}
          </span>
        </div>
        <v-divider></v-divider>
        <v-btn
          variant="text"
          color="error"
          class="mt-2 full-width-btn align-start"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>


<style scoped>

.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.light-mode {
  background-color: #ffffff;
  color: #000000;
}

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