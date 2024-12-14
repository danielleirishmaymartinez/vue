import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { supabase } from '@/utils/supabase.js';

export const useSavedProductsStore = defineStore('savedProducts', () => {
  const savedProducts = ref([]);

  // Load saved products from localStorage or fetch from DB if necessary
  const loadSavedProducts = async (userId) => {
    // Fetch saved posts from the database based on the logged-in user
    const { data: savedPosts, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold')
      .eq('user_id', userId); // Fetch only posts saved by the current user

    if (error) {
      console.error('Error fetching saved posts:', error.message);
      return;
    }

    savedProducts.value = savedPosts;
  };

  // Add product to saved list (update localStorage and DB if needed)
  const addProduct = async (product, userId) => {
    if (!savedProducts.value.some((p) => p.item_name === product.item_name)) {
      savedProducts.value.push(product);
      await saveToLocalStorage();
      await saveProductToDB(product, userId); // Add to DB too
    }
  };

  // Remove product from saved list (update localStorage and DB if needed)
  const removeProduct = async (productName, userId) => {
    savedProducts.value = savedProducts.value.filter(
      (p) => p.item_name !== productName
    );
    await saveToLocalStorage();
    await removeProductFromDB(productName, userId); // Remove from DB too
  };

  // Save products to localStorage
  const saveToLocalStorage = async () => {
    localStorage.setItem('savedProducts', JSON.stringify(savedProducts.value));
  };

  // Save product to the database
  const saveProductToDB = async (product, userId) => {
    const { error } = await supabase
      .from('saved_posts')  // Assuming there's a saved_posts table for saving posts
      .upsert([{ user_id: userId, post_id: product.id }]);  // Save to DB as well

    if (error) {
      console.error('Error saving product to DB:', error.message);
    }
  };

  // Remove product from the database
  const removeProductFromDB = async (productName, userId) => {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', productName);

    if (error) {
      console.error('Error removing product from DB:', error.message);
    }
  };

  // Watch for changes in savedProducts and update localStorage
  watch(savedProducts, saveToLocalStorage, { deep: true });

  return { savedProducts, loadSavedProducts, addProduct, removeProduct };
});
