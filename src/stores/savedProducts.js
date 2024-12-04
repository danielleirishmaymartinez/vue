import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSavedProductsStore = defineStore('savedProducts', () => {
  const savedProducts = ref([]);

  // Add product to saved list
  const addProduct = (product) => {
    if (!savedProducts.value.some((p) => p.item_name === product.item_name)) {  // changed from name to item_name
      savedProducts.value.push(product);
    }
  };

  // Remove product from saved list
  const removeProduct = (productName) => {
    savedProducts.value = savedProducts.value.filter((p) => p.item_name !== productName);  // changed from name to item_name
  };

  return { savedProducts, addProduct, removeProduct };
});
