<template>
  <v-container>
    <v-app-bar color="#B43E8F" class="position-fixed">
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
          <v-btn v-bind="props" icon>
            <v-avatar size="50">
              <img :src="userProfile.image_url || '/default-avatar.jpg'" alt="User Profile" />
            </v-avatar>
          </v-btn>
        </template>

        <v-sheet rounded="lg" elevation="5" width="300" class="pa-2">
          <v-container class="d-flex flex-column align-center">
            <v-avatar size="70" class="mb-3">
              <img :src="userProfile.image_url || '/default-avatar.jpg'" alt="Profile" />
            </v-avatar>
            <span>{{ userProfile.name || 'Unknown User' }}</span>
            <span class="text-muted">{{ userProfile.email }}</span>

            <v-btn variant="text" color="error" @click="logout">Logout</v-btn>
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
const userStore = useAuthUserStore();
const sidebarStore = useSidebarStore();

const userProfile = ref({
  first_name: '',
  last_name: '',
  profile_image: '/default-avatar.jpg', // Default avatar
});


// Fetch user profile data
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated();
  if (!isLoggedIn) {
    router.push('/login');
    return;
  }

  const { name, email, image_url } = userStore.userData || {};
  userProfile.value = { name, email, image_url };
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
  margin-right: 24px; /* Additional fine-tuning */
}

</style>