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
<v-container>
  <v-app-bar color="brown-lighten-2" dark>
    
        <v-container class="d-flex align-center">
      <img
        src="/images/logo.png"
        alt="Logo"
        class="me-2"
        style="width: 40px; height: 40px;"
      />
  <a href="/home" class="text-h6" style="text-decoration: none; color: white; ">
    <span>STASH</span>
  </a>
    </v-container>

    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <!-- Theme Toggle Button -->
    <v-btn
      :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
      @click="themeStore.toggleTheme"
      variant="elevated"
      class="me-3"
    ></v-btn>

    <!-- User Menu -->
    <v-menu offset-y :close-on-content-click="false" class="mdi-account-dropdown">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon class="avatar-btn">
          <v-avatar size="40" class="avatar-img">
            <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Account Icon" />
            <v-icon class="chevron-icon" size="18">mdi-chevron-down</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-sheet
        rounded="lg"
        elevation="2"
        width="300"
        class="pa-4 d-flex flex-column align-start custom-rounded-sheet"
        color="brown-lighten-4"
      >
      <v-container class="justify-center align-center">
        <v-card
          elevation="2"
          class="profile-card d-flex align-center "
          @click="goToProfile"
        >
          <v-avatar size="50" class="avatar-img">
            <img
              :src="userProfile.profile_image || '/default-avatar.jpg'"
              alt="Profile Picture"
            />
          </v-avatar>
          <span class="ms-3 text-subtitle-1 underlined-name">
            {{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}
          </span>
        </v-card>
        </v-container>

        <v-divider></v-divider>

        <v-btn
          variant="text"
          color="error"
          class="mt-2 full-width-btn align-start custom-btn my-2"
          @click="logout"
        >
          <div class="icon-circle">
            <v-icon>mdi-logout</v-icon>
          </div>
          Logout
        </v-btn>
      </v-sheet>
    </v-menu>
  </v-app-bar>
  </v-container>
</template>

<style scoped>
.dark-mode {
  background-color: #121212;
  color: #e76317;
}

.light-mode {
  background-color: #ffffff;
  color: #000000;
}

.avatar-img img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar-img {
  position: relative;
}

.chevron-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
  color: black;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.clickable-profile {
  cursor: pointer;
  transition: background-color 0.3s ease;

  width: 100%;
}

.clickable-profile:hover {
  background-color: #ebe2e2;
}

.profile-card {
 width: 250px; /* Ensures a fixed width */ 
  min-width: 200px; /* Ensures minimum width for flexibility */
  max-width: 800px; /* Prevents expansion beyond this width */
  cursor: pointer;
  border-radius: 15px;
  transition: box-shadow 0.3s ease-in-out;
  padding: 16px;
}

.profile-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.underlined-name {
  position: relative;
  font-weight: bold;
  white-space: nowrap; /* Prevents text from wrapping */
  text-overflow: ellipsis; /* Adds '...' for truncated text */
  width: 250px; /* Ensures a fixed width */ 
}

.underlined-name::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 2px;
  background-color: #746667;
}

.full-width-btn {
  width: 100%;
  transition: background-color 0.3s ease;
}

.align-start {
  justify-content: flex-start;
  text-align: left;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.icon-circle v-icon {
  color: #a70212;
  font-size: 24px;
}

.custom-btn {
  display: flex;
  align-items: center;
  text-transform: none;
  font-weight: bold;
}

.custom-btn:hover .icon-circle {
  background-color: #dc3545;
  color: white;
}
</style>
