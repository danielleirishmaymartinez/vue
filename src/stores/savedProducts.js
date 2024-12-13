import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

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

  return { savedProducts, addProduct, removeProduct };
});
