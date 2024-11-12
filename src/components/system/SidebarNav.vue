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
        @click="navigateTo('/homepage')"
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
