<script setup>
import { useSidebarStore } from "@/stores/sidebarStore";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import PasswordForm from "@/components/system/account-settings/PasswordForm.vue";

// Use the Pinia store
const sidebarStore = useSidebarStore();
</script>

<template>
  <v-app>
    <!-- Navbar -->
    <Navbar />

    <!-- Main Container -->
    <v-container
      fluid
      class="custom-container"
      :class="{ 'sidebar-open': sidebarStore.isSidebarOpen, 'sidebar-closed': !sidebarStore.isSidebarOpen }"
    >
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="2" lg="2" class="sidebar">
          <SidebarNav />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" :md="sidebarStore.isSidebarOpen ? 9 : 12" :lg="sidebarStore.isSidebarOpen ? 10 : 12">
          <div class="content-wrapper">
            <v-card class="mb-5 ml-8 extended-card rounded-lg">
              <v-card-title class="pa-12">Change Password</v-card-title>
              <v-container>
                <v-card-text>
                  <PasswordForm />
                </v-card-text>
              </v-container>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.extended-card {
  height: 420px; /* Adjust height as needed */
  border: 2px solid #e8657f;
}

.custom-container {
  background-color: #210440; /* Replace with your desired color */
  transition: margin-left 1.0s ease; /* Smooth transition for movement */
  min-height: 100vh; /* Ensure the container covers the entire page */
}

.sidebar-open {
  margin-left: 0; /* Adjust to the width of the sidebar */
}

.sidebar-closed {
  margin-left: 0;
}

.content-wrapper {
  padding: 50px;
  margin: 30px;
}
</style>
