<script setup>
import { ref } from "vue";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import ProfileForm from "@/components/system/account-settings/ProfileForm.vue";

const drawerVisible = ref(true);
</script>

<template>
  <v-app>
    <Navbar />
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2" lg="2" class="sidebar">
          <SidebarNav v-model:drawer="drawerVisible" />
        </v-col>
        <v-col cols="12" md="9" lg="10">
          <div class="content-wrapper">
            <v-card class="mb-5 ml-8 extended-card border-lg">
              <v-card-title class= "pa-12">Profile Information</v-card-title>
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
.content-wrapper {
  padding: 50px;
  margin: 30px;
}
.sidebar {
  border-right: 1px solid #e0e0e0;
  padding: 16px;
  background-color: #f9f9f9;
}
</style>