import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSavedProductsStore = defineStore('savedProducts', () => {
  const savedProducts = ref([]);

  // Add product to saved list
  const addProduct = (product) => {
    if (!savedProducts.value.some((p) => p.name === product.name)) {
      savedProducts.value.push(product);
    }
  };

  // Remove product from saved list
  const removeProduct = (productName) => {
    savedProducts.value = savedProducts.value.filter((p) => p.name !== productName);
  };

  return { savedProducts, addProduct, removeProduct };
});
