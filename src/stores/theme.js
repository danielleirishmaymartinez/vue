import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'light');

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }
  
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme);
  });

  return { theme, toggleTheme };
});
