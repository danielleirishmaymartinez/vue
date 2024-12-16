import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { supabase } from '@/utils/supabase';

export const useSavedProductsStore = defineStore('savedProducts', () => {
  const savedProducts = ref([]);

  // Load saved products from localStorage on initialization
  const loadSavedProducts = () => {
    const storedProducts = localStorage.getItem('savedProducts');
    if (storedProducts) {
      savedProducts.value = JSON.parse(storedProducts);
    }
  };

  // Add product to saved list
  const addProduct = (product) => {
    if (!savedProducts.value.some((p) => p.item_name === product.item_name)) {
      savedProducts.value.push(product);
      saveToLocalStorage();
    }
  };

  // Remove product from saved list
  const removeProduct = (productName) => {
    savedProducts.value = savedProducts.value.filter(
      (p) => p.item_name !== productName
    );
    saveToLocalStorage();
  };

  // Save products to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts.value));
  };

  // Watch for changes in savedProducts and update localStorage
  watch(savedProducts, saveToLocalStorage, { deep: true });

  // Load data from localStorage when store is initialized
  loadSavedProducts();

  // Fetch updated saved products from the database (e.g., after marking as sold)
  const fetchSavedProductsFromDb = async (userId) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('saved_by', userId); // Assuming saved_by column is used to store the user who saved the post

    if (error) {
      console.error('Error fetching saved products:', error.message);
      return;
    }

    // Update the saved products in the store with the latest data from the database
    savedProducts.value = data;

    // Also update localStorage with the new data
    saveToLocalStorage();
  };

  // Example function to mark a post as sold
  const markAsSold = async (postId) => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("No active user session found.");
      return;
    }

    const userId = user.id;

    // Update the post in the database to mark it as sold
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ is_sold: true })
      .eq('id', postId)
      .eq('saved_by', userId) // Ensure the user is the one who saved the post
      .single();

    if (updateError) {
      console.error("Error marking post as sold:", updateError.message);
      return;
    }

    // Update the local saved products
    savedProducts.value = savedProducts.value.map(post =>
      post.id === postId ? { ...post, is_sold: true } : post
    );

    // Update localStorage with the modified data
    saveToLocalStorage();

    // Re-fetch saved products from the database
    await fetchSavedProductsFromDb(userId);
  };

  return {
    savedProducts,
    addProduct,
    removeProduct,
    fetchSavedProductsFromDb,
    markAsSold,
  };
});