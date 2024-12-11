<script setup>
import { useSidebarStore } from "@/stores/sidebarStore"; // Import the Pinia store
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import PictureForm from "@/components/system/account-settings/PictureForm.vue";

// Access the Pinia store
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
      :class="{'sidebar-closed': !sidebarStore.isSidebarOpen }"
    >
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="2" lg="2" class="sidebar"
                  v-show="sidebarStore.isSidebarOpen">
          <SidebarNav />
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" :md="sidebarStore.isSidebarOpen ? 9 : 12" :lg="sidebarStore.isSidebarOpen ? 10 : 12">
          <div class="content-wrapper rounded-lg">
            <v-card class="mb-5 ml-8 extended-card rounded-lg">
              <v-card-title class="pa-12">Profile Picture</v-card-title>
              <v-card-text>
                <div>
                  <PictureForm />
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
/* Ensure the container covers the entire page */
.custom-container {
  background-color: #210440;
  transition: margin-left 0.3s ease; /* Smooth transition for sidebar movement */
  min-height: 100vh;
}

/* Styles when sidebar is open */
.sidebar-open {
  margin-left: 0; /* Adjust based on your sidebar width */
}

/* Styles when sidebar is closed */
.sidebar-closed {
  margin-left: 0;
}

/* Additional styles for the content */
.extended-card {
  height: 450px; /* Adjust height as needed */
  border: 2px solid #e8657f;
}

.content-wrapper {
  padding: 50px;
  margin: 30px;
  background-color: #210440;
}
</style>
