<script setup>
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import { ref, onMounted } from "vue";
import supabase from "@/utils/supabase.js";
import { useDisplay } from "vuetify";

// Sidebar visibility
const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);

// Product data
const products = ref([]);
const selectedProduct = ref(null);
const isModalOpen = ref(false);

// Fetch products from Supabase
async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
  } else {
    products.value = data;
  }
}

// Open modal for product details
function openModal(product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}

// Close modal
function closeModal() {
  isModalOpen.value = false;
  selectedProduct.value = null;
}

// Fetch products on load
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <v-app>
    <Navbar />
    <v-container fluid class="d-flex">
      <SidebarNav v-model:drawer="drawerVisible" />
      <v-main>
        <!-- Banner -->
        <v-banner color="primary" dark class="mb-6">
          <template #avatar>
            <v-icon size="40">mdi-shopping</v-icon>
          </template>
          <v-banner-text>
            <h2 class="text-h5 mb-0">Welcome to STASH!</h2>
            <p>The ultimate trade and sell hub for Caraga State University.</p>
          </v-banner-text>
        </v-banner>

        <!-- Product Grid -->
        <v-row dense>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card :class="{ 'gray-filter': product.is_sold }">
              <v-img :src="product.image" alt="Product Image" height="200"></v-img>
              <v-card-title>{{ product.item_name }}</v-card-title>
              <v-card-subtitle>₱{{ product.price }}</v-card-subtitle>
              <v-card-actions>
                <v-btn color="primary" @click="openModal(product)">
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal for Product Details -->
        <v-dialog v-model="isModalOpen" max-width="500">
          <v-card>
            <v-img :src="selectedProduct?.image" alt="Product Image" height="300"></v-img>
            <v-card-title>{{ selectedProduct?.item_name }}</v-card-title>
            <v-card-subtitle>₱{{ selectedProduct?.price }}</v-card-subtitle>
            <v-card-text>
              <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
              <p><strong>Location:</strong> {{ selectedProduct?.location }}</p>
              <p><strong>Time:</strong> {{ selectedProduct?.time }}</p>
              <p><strong>Type:</strong> {{ selectedProduct?.type }}</p>
              <p v-if="selectedProduct?.is_sold" class="text-error">
                <strong>Status:</strong> Sold Out
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" text @click="closeModal">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped>
.gray-filter {
  filter: grayscale(100%);
}
</style>