import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/utils/supabase';

export const useAuthUserStore = defineStore('authUser', () => {
  const userData = ref(null);
  const authPages = ref([]);

  // Actions
  async function isAuthenticated() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return false;
    }
    if (data.session) {
      const { id, email, user_metadata } = data.session.user;
      userData.value = { id, email, ...user_metadata };
    }
    return !!data.session;
  }

  // Fetch user data from Supabase
  async function getUserInformation() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user data:', error.message);
      return null;
    }
    userData.value = data.user;
  }

  // Update user information
  async function updateUserInformation(updatedData) {
    const { data, error } = await supabase.auth.updateUser({
      data: { ...updatedData },
    });
    if (error) {
      console.error('Error updating user data:', error.message);
      return { error };
    }
    userData.value = { ...userData.value, ...updatedData };
    return { data: userData.value };
  }

  return {
    userData,
    authPages,
    isAuthenticated,
    getUserInformation,
    updateUserInformation,
  };
});
