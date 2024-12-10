<template>
  <v-container>
    <v-app-bar color="#1b1028" class="fixed-navbar">
      <!-- Sidebar Toggle Button -->
      <v-btn @click="toggleSidebar" icon class="ms-3">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- App Logo and Title -->
      <v-container class="d-flex align-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          color="white"
          class="me-2"
          style="width: 38px; height: 38px;"
        />
        
        <a href="/home" class="text-h6" style="text-decoration: none; color: white;">
          <span>Campus Deals</span>
        </a>
      </v-container>


      <v-spacer></v-spacer>

      <!-- User Menu -->
      <v-menu offset-y :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon class="no-shadow mr-6">
            <v-avatar size="50">
              <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Account Icon" class="avatar-image"/>
            </v-avatar>
          </v-btn>
        </template>

        <v-sheet rounded="lg" elevation="5" width="300" class="pa-2">
          <v-container class="d-flex flex-column justify-center align-center">
            <!-- Profile Button -->
            <v-btn
              variant="text"
              class="mt-2 full-width-btn profile-btn"
              @click="goToProfile"
            >
              <v-avatar size="45" class="me-2 no-shadow">
                <img :src="userProfile.profile_image || '/default-avatar.jpg'" alt="Profile Picture" class="avatar-image"/>
              </v-avatar>
              <span>{{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}</span>
            </v-btn>

            <!-- Divider -->
            <v-divider class="my-2"></v-divider>

            <!-- Logout Button -->
            <v-btn
              variant="text"
              color="error"
              class="ms-8 full-width-btn logout-btn"
              @click="logout"
            >
              <v-icon left class="logout-icon">mdi-logout</v-icon>
              <span class="logout-text">Logout</span>
            </v-btn>
          </v-container>
        </v-sheet>
      </v-menu>
    </v-app-bar>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthUserStore } from '@/stores/authUser.js';
import { useSidebarStore } from '@/stores/sidebarStore';
import supabase from '@/utils/supabase.js';

const router = useRouter();
const sidebarStore = useSidebarStore();
const userProfile = ref({
  first_name: '',
  last_name: '',
  profile_image: '/default-avatar.jpg', // Default avatar
});

const userStore = useAuthUserStore();

// Fetch user profile data
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated();
  if (!isLoggedIn) {
    router.push('/login');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, profile_image')
      .eq('user_id', userStore.userData?.id)
      .single();

    if (error) throw error;

    // Update profile details
    userProfile.value.first_name = data?.first_name || 'Unknown';
    userProfile.value.last_name = data?.last_name || 'User';

    if (data?.profile_image) {
      // Generate public or signed URL for the profile image
      const { data: publicUrlData, error: publicUrlError } = await supabase
        .storage
        .from('profile-images')
        .createSignedUrl(data.profile_image, 60 * 60); // 1-hour expiry

      if (publicUrlError) {
        console.error('Error fetching profile image URL:', publicUrlError.message);
        userProfile.value.profile_image = '/default-avatar.jpg';
      } else {
        userProfile.value.profile_image = publicUrlData.signedUrl;
      }
    } else {
      userProfile.value.profile_image = '/default-avatar.jpg';
    }
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
  }
});

// Navigate to Profile Page
const goToProfile = () => {
  router.push('/profile');
};

// Logout Functionality
const logout = async () => {
  try {
    await supabase.auth.signOut();
    userStore.$reset();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Sidebar Toggle
const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};
</script>

<style scoped>

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
  transition: 0.3s ease;
}

.profile-card {
  width: 250px; /* Ensures a fixed width */ 
  cursor: pointer;
  transition: 0.3s ease-in-out;
  padding: 16px;
}

.full-width-btn {
  width: 100%;
  transition: 0.3s ease;
}

.avatar-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.align-start {
  justify-content: flex-start;
  text-align: left;
}

.no-shadow {
  box-shadow: none !important;
  background-color: transparent;
}

.full-width-btn {
  width: 100%;
  justify-content: flex-start;
}

.profile-btn {
  color: inherit;
  display: flex;
  align-items: center;
}

.v-btn {
  text-transform: none;
}

.logout-btn {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px; /* Adjust the spacing as needed */
}

.logout-icon {
  margin-right: 20px; /* Additional fine-tuning */
}
.fixed-navbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}
</style>
