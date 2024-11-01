<script setup>
import AppLayout from '@/components/system/AppLayout.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const theme = ref('light') // Default theme

// Function to toggle between light and dark mode
function onToggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <AppLayout :theme="theme">
    <template #content>
    
    </template>
  </AppLayout>
</template>
