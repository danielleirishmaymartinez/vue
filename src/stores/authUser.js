import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase';

export const useAuthUserStore = defineStore('authUser', () => {
  // Reactive variable to store user data
  const userData = ref(null);

  // Computed property to determine user role
  const userRole = computed(() => {
    if (userData.value?.is_admin) {
      return 'Super Administrator';
    }
    return userData.value?.user_role || 'User';
  });

  // Reset user data
  function $reset() {
    userData.value = null;
  }

  // Check if the user is authenticated and load session details
  async function isAuthenticated() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        return false;
      }

      if (data.session) {
        const { id, email, user_metadata } = data.session.user;
        userData.value = {
          id,
          email,
          name: user_metadata?.full_name || user_metadata?.name || 'Unknown User',
          image_url: user_metadata?.avatar_url || '/default-avatar.jpg',
        };
      }

      return !!data.session;
    } catch (error) {
      console.error('Error during authentication check:', error);
      return false;
    }
  }

  // Update user information
  async function updateUserInformation(updatedData) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { ...updatedData },
      });

      if (error) {
        return { error };
      }

      if (data) {
        const { id, email, user_metadata } = data.user;
        userData.value = { id, email, ...user_metadata };
        return { data: userData.value };
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      return { error };
    }
  }

  // Update user's profile image
  async function updateUserImage(imageFile) {
    try {
      // Upload the image file to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('profile-images') // Replace with your storage bucket name
        .upload(`public/${userData.value.id}/${imageFile.name}`, imageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (storageError) {
        console.error('Error uploading image:', storageError.message);
        return { error: storageError };
      }

      // Get the public URL of the uploaded image
      const { publicURL } = supabase.storage
        .from('profile-images')
        .getPublicUrl(storageData.path);

      // Update user's metadata with the new image URL
      const { data, error } = await supabase.auth.updateUser({
        data: { image_url: publicURL },
      });

      if (error) {
        return { error };
      }

      if (data) {
        userData.value.image_url = publicURL;
        return { data: userData.value };
      }
    } catch (error) {
      console.error('Error updating user image:', error);
      return { error };
    }
  }

  return {
    userData,
    userRole,
    $reset,
    isAuthenticated,
    updateUserInformation,
    updateUserImage,
  };
});
