// stores/sidebarStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(true); // Default state, can be true or false

  // Toggle the sidebar state (this will be used in Navbar for manual control)
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  return {
    isSidebarOpen,
    toggleSidebar,
  };
});
