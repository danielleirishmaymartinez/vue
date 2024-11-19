<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const router = useRouter();
const { mobile } = useDisplay();
const drawerLeft = ref(!mobile.value); // Left Drawer visibility toggle
const drawerRight = ref(!mobile.value); // Right Drawer visibility toggle

// Function to navigate to different routes
function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-row>
    <!-- Left Sidebar Column -->
    <v-col cols="3">
      <v-navigation-drawer
        v-model="drawerLeft"
        :permanent="!mobile"
        :temporary="mobile"
        app
        width="220"
      >
        <v-list class="d-flex flex-column mt-15 flex-row mx-6">
          <v-list-item
            prepend-icon="mdi-account"
            title="Profile"
            @click="navigateTo('/profile')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            @click="navigateTo('/home')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cog"
            title="Settings"
            @click="navigateTo('/settings')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-bookmark"
            title="Saved"
            @click="navigateTo('/saved')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>

    <!-- Right Sidebar Column -->
    <v-col cols="3">
      <v-navigation-drawer
        v-model="drawerRight"
        :permanent="!mobile"
        :temporary="mobile"
        app
        width="220"
      >
        <v-list-item>
          <v-list-item-title class="text-h6 font-weight-bold">Settings</v-list-item-title>
        </v-list-item>
        <v-list class="d-flex flex-column mt-15 flex-row mx-2">
          <v-list-item
            prepend-icon="mdi-account-edit"
            title="Personal Info"
            @click="navigateTo('/settings/personal')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-lock"
            title="Privacy Settings"
            @click="navigateTo('/settings/privacy')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-security"
            title="Security Settings"
            @click="navigateTo('/settings/security')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-navigation-drawer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.v-list-item {
  justify-content: center;
}

.v-navigation-drawer--is-mobile .v-list {
  align-items: center;
}
</style>
