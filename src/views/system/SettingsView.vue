<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import PictureForm from "@/components/system/account-settings/PictureForm.vue";
import ProfileForm from "@/components/system/account-settings/ProfileForm.vue";
import PasswordForm from "@/components/system/account-settings/PasswordForm.vue";
import supabase from "@/utils/supabase.js";

const drawerVisible = ref(true);
const router = useRouter();

async function logout() {
  try {
    await supabase.auth.signOut();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
}
</script>
<template>  
  <v-app>
    <!-- Navbar -->
    <Navbar @logout="logout" />

    <!-- Main Layout -->
    <v-container fluid>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3" lg="2" class="sidebar">
          <SidebarNav v-model:drawer="drawerVisible" />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9" lg="10">
          <!-- Apply global margin and padding here -->
          <div class="content-wrapper">
            <!-- Account Settings Breadcrumb -->
            <v-card class="mb-5">
              <template #title>
                <span class="text-h6 font-weight-bold">
                  <v-breadcrumbs :items="['Account', 'Settings']">
                    <template #prepend>
                      <v-icon>mdi-wrench</v-icon>
                    </template>
                  </v-breadcrumbs>
                </span>
              </template>
              <template #subtitle>
                <p>Edit profile information, update profile picture, and change password.</p>
              </template>
            </v-card>

            <!-- Profile Picture -->
            <v-card class="mb-5">
              <v-card-title>Profile Picture</v-card-title>
              <v-card-text>
                <PictureForm />
              </v-card-text>
            </v-card>

            <!-- Profile Information -->
            <v-card class="mb-5">
              <v-card-title>Profile Information</v-card-title>
              <v-card-text>
                <ProfileForm />
              </v-card-text>
            </v-card>

            <!-- Password Form -->
            <v-card class="mb-5">
              <v-card-title>Change Password</v-card-title>
              <v-card-text>
                <PasswordForm />
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<style scoped>
/* Wrapper for Main Content */
.content-wrapper {
  padding: 50px; /* Adjust padding as needed */
  margin: 30px; /* Adjust margin as needed */
}

/* Adjust spacing for the sidebar */
.sidebar {
  border-right: 1px solid #e0e0e0; /* Optional border for better separation */
  padding: 16px;
  background-color: #f9f9f9; /* Optional background for sidebar */
}
</style>