<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const router = useRouter();
const { mobile } = useDisplay();
const drawer = ref(!mobile.value); // Drawer visibility toggle

// Function to navigate to different routes
function navigateTo(path) {
  router.push(path);
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!mobile"
    :temporary="mobile"
    app
    width="250"
  >
    <!-- Profile Section -->
    <v-list class="pt-6">
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        subtitle="sandra_a88@gmail.com"
        title="Sandra Adams"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- Centered List Items for Navigation -->
    <v-list class="d-flex flex-column align-center mt-5">
      <v-list-item
        prepend-icon="mdi-folder"
        title="My Files"
        @click="navigateTo('/myfiles')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Shared with me"
        @click="navigateTo('/shared')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-star"
        title="Starred"
        @click="navigateTo('/starred')"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
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
