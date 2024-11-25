<template>
  <v-app-bar color="primary" dark>
    <!-- Logo and Web Name -->
    <v-container class="d-flex align-center">
      <img src="/public/images/logo.png" alt="Logo" class="me-2" style="width: 40px; height: 40px;" />
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
          <v-avatar>
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Account Icon" />
          </v-avatar>
        </v-btn>
      </template>

      <!-- Main Dropdown Box -->
      <v-sheet rounded elevation="2" width="300" class="pa-4 d-flex flex-column align-start">
        <!-- Profile and Name (Clickable) -->
        <div class="d-flex align-center mb-3" @click="goToProfile">
          <v-avatar size="40">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Profile Picture" />
          </v-avatar>
          <span class="ms-3 text-subtitle-1">{{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}</span>
        </div>

        <v-divider></v-divider>

        <!-- Switch Appearance Button -->
        <v-btn
          variant="text"
          class="mt-2"
          prepend-icon="mdi-moon"
          @click="switchAppearance"
        >
          Switch Appearance
        </v-btn>

        <!-- Logout Button -->
        <v-btn
          variant="text"
          color="error"
          class="mt-2"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>

        <!-- Switch Appearance Page Content -->
        <div v-if="showAppearancePage" class="mt-4">
          <v-btn
            text
            class="d-flex align-center"
            @click="switchToLightMode"
            prepend-icon="mdi-white-balance-sunny"
            :hover="true"
          >
            Light Mode
          </v-btn>
          <v-btn
            text
            class="d-flex align-center mt-2"
            @click="switchToDarkMode"
            prepend-icon="mdi-moon"
            :hover="true"
          >
            Dark Mode
          </v-btn>

          <!-- Back Button -->
          <v-btn
            icon
            class="mt-4"
            @click="goBack"
            prepend-icon="mdi-arrow-left"
          ></v-btn>
        </div>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import supabase from '@/utils/supabase.js';
import { useAuthUserStore } from '@/stores/authUserStore.js';

const router = useRouter();
const showAppearancePage = ref(false); // Use `ref` here to manage the dropdown page toggle
const userProfile = ref({});

const userStore = useAuthUserStore();

// Initialize session and fetch user profile on mounted
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated();
  if (!isLoggedIn) {
    router.push('/login');
    return;
  }

  // Fetch user profile using user_id from profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, profile_image')
    .eq('user_id', userStore.userData.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
  } else {
    userProfile.value = data || { first_name: 'Unknown', last_name: 'User', profile_image: '/default-avatar.jpg' };
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
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>

<style scoped>
.account-dropdown {
  margin-right: 16px; /* Adjust position to avoid the edge */
  min-width: 300px;
}

.dark-mode {
  background-color: #121212;
  color: white;
}

.v-btn:hover {
  cursor: pointer;
}
</style>
