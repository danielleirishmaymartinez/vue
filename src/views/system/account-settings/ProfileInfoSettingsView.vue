<script setup>
import { useSidebarStore } from "@/stores/sidebarStore";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import ProfileForm from "@/components/system/account-settings/ProfileForm.vue";

// Access the Pinia store
const sidebarStore = useSidebarStore();
</script>

<template>
  <v-app>
    <Navbar />
    <v-container
      fluid
      class="custom-container"
      :class="{ 'sidebar-closed': !sidebarStore.isSidebarOpen }"
    >
      <v-row>
        <v-col
          cols="12"
          md="2"
          lg="2"
          class="sidebar"
          v-show="sidebarStore.isSidebarOpen"
        >
          <SidebarNav />
        </v-col>
        <v-col
          cols="12"
          :md="sidebarStore.isSidebarOpen ? 9 : 12"
          :lg="sidebarStore.isSidebarOpen ? 10 : 12"
          class="content-column"
        >
          <div class="content-wrapper rounded-lg">
            <v-card class="mb-5 ml-8 extended-card rounded-lg">
              <v-card-title class="pa-12">Profile Information</v-card-title>
              <v-card-text>
                <ProfileForm />
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.extended-card {
  border: 2px solid #e8657f;
}


.custom-container {
  background-color: #210440; /* Replace with your desired color */
  transition: margin-left 0.3s ease; /* Smooth transition for movement */
}

.custom-container.sidebar-closed {
  margin-left: 0; /* Adjust as needed */
}

.content-wrapper {
  padding: 50px;
  margin: 30px;
}

.sidebar {
  transition: width 0.3s ease; /* Smooth transition for sidebar width */
}
</style>
