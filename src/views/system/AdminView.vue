<template>
  <v-container>
    <!-- Admin Navbar -->
    <v-app-bar color="#B43E8F" class="position-fixed">
      <!-- App Logo and Title -->
      <v-container class="d-flex align-center">
        <img
          src="/images/logo.png"
          alt="Logo"
          class="me-2"
          style="width: 38px; height: 38px"
        />

        <a
          class="text-h6"
          style="text-decoration: none; color: white"
        >
          <span>Campus Deals</span>
        </a>
      </v-container>

      <v-spacer></v-spacer>

      <!-- User Menu -->
      <v-menu offset-y :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon class="no-shadow mr-6">
            <v-avatar size="50">
              <!-- Display profile picture if available, otherwise display initials -->
              <template v-if="userProfile.profile_image">
                <img
                  :src="userProfile.profile_image"
                  alt="Profile Picture"
                  class="avatar-image"
                />
              </template>
              <template v-else>
                <span class="avatar-initials">
                  {{ getInitials(userProfile.first_name + " " + userProfile.last_name) }}
                </span>
              </template>
            </v-avatar>
          </v-btn>
        </template>

        <!-- Menu Dropdown -->
        <v-sheet rounded="lg" elevation="5" width="300" class="pa-2">
          <v-container class="d-flex flex-column justify-center align-center">
            <!-- Profile Button -->
            <v-btn
              variant="text"
              class="mt-3 full-width-btn profile-btn"
            >
              <v-avatar size="45" class="me-3 no-shadow">
                <!-- Same logic for avatar in dropdown -->
                <template v-if="userProfile.profile_image">
                  <img
                    :src="userProfile.profile_image"
                    alt="Profile Picture"
                    class="avatar-image"
                  />
                </template>
                <template v-else>
                  <span class="avatar-initials">
                    {{ getInitials(userProfile.first_name + " " + userProfile.last_name) }}
                  </span>
                </template>
              </v-avatar>
              <span>{{ userProfile.first_name + " " + userProfile.last_name || "Unknown User" }}</span>
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
              <span class="logout-text ms-5">Logout</span>
            </v-btn>
          </v-container>
        </v-sheet>
      </v-menu>
    </v-app-bar>

    <!-- Admin Dashboard Content -->
    <v-container class="mt-12">
      <v-card>
        <v-card-title class="text-h4 font-weight-bold">Admin Dashboard</v-card-title>
        <v-divider></v-divider>

        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          item-value="id"
          class="elevation-2 custom-table-border"
        >
          <!-- Status Column -->
          <template v-slot:[`item.is_blocked`]="{ item }">
            <span>{{ item.is_blocked ? 'Blocked' : 'Active' }}</span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              color="red"
              variant="outlined"
              size="small"
              @click="deleteUser(item.id)"
            >
              Delete
            </v-btn>
            <v-btn
              color="orange"
              variant="outlined"
              size="small"
              class="ms-2"
              @click="toggleBlockUser(item)"
            >
              {{ item.is_blocked ? "Unblock" : "Block" }}
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthUserStore } from "@/stores/authUser.js";
import supabase from "@/utils/supabase.js";

const router = useRouter();
const userProfile = ref({
  first_name: "",
  last_name: "",
  profile_image: null, // Profile image placeholder
});

const userStore = useAuthUserStore();
const users = ref([]);
const loading = ref(true);

// Table Headers
const headers = [
  { title: "ID", key: "id" },
  { title: "Email", key: "email" },
  { title: "First Name", key: "first_name" },
  { title: "Last Name", key: "last_name" },
  { title: "Status", key: "is_blocked", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

// Get user initials for avatar
const getInitials = (name) => {
  if (!name) return "??";
  const names = name.split(" ");
  return names.map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, is_blocked, profile_image");

    if (profileError) {
      console.error("Error fetching profiles:", profileError.message);
      return;
    }

    // Now assign '---' for email column
    users.value = profiles.map((user) => ({
      ...user,
      email: "---", // Placeholder for email
    }));

  } catch (err) {
    console.error("Unexpected error fetching users:", err.message);
  } finally {
    loading.value = false;
  }
};

// Static Delete (does not affect Supabase database)
const deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to remove this user from the list?")) return;

  // Remove user from the local users array (UI only)
  users.value = users.value.filter((user) => user.id !== userId);
};

// Block or Unblock a user
const toggleBlockUser = async (user) => {
  const newStatus = !user.is_blocked;

  const { error } = await supabase
    .from("profiles")
    .update({ is_blocked: newStatus })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating user status:", error.message);
  } else {
    user.is_blocked = newStatus; // Update the status locally
  }
};

// Fetch user profile data
onMounted(async () => {
  const isLoggedIn = await userStore.isAuthenticated();
  if (!isLoggedIn) {
    router.push("/login");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image")
      .eq("user_id", userStore.userData?.id)
      .single();

    if (error) throw error;

    // Update profile details
    userProfile.value.first_name = data?.first_name || "Unknown";
    userProfile.value.last_name = data?.last_name || "User";

    if (data?.profile_image) {
      // Generate public or signed URL for the profile image
      const { data: publicUrlData, error: publicUrlError } = await supabase
        .storage
        .from("profile-images")
        .createSignedUrl(data.profile_image, 60 * 60); // 1-hour expiry

      if (!publicUrlError) {
        userProfile.value.profile_image = publicUrlData.signedUrl;
      } else {
        console.error("Error fetching profile image URL:", publicUrlError.message);
      }
    }
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
  }

  // Fetch users for admin dashboard
  fetchUsers();
});

// Logout Functionality
const logout = async () => {
  try {
    await supabase.auth.signOut();
    userStore.$reset();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<style scoped>
.avatar-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  font-weight: bold;
  color: #b43e8f;
  background-color: #fff; /* Fallback color */
  border-radius: 50%;
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

.logout-btn {
  margin-top: 20px;
}

.logout-text {
  font-size: 0.9rem;
}

.logout-icon {
  font-size: 1.2rem;
}
</style>
