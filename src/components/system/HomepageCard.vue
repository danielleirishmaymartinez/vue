<script setup>
import { useSavedProductsStore } from '@/stores/savedProducts';
import { ref } from 'vue';

const savedProductsStore = useSavedProductsStore();

const carouselItems = [
  {
    image: '/images/car-1.jpg',
    title: 'Discover unbeatable prices',
    subtitle: 'And swap opportunities right here on campus!',
  },
  {
    image: '/images/car-2.jpg',
    title: 'Unlock incredible deals at our virtual marketplace',
    subtitle: 'where every purchase and swap saves you more!',
  },
  {
    image: '/images/car-3.jpg',
    title: 'Buy what you need, swap what you don’t',
    subtitle: 'Check out our newest collections.',
  },
];

const products = ref([
  {
    image: '/images/binder.jpg',
    name: 'Binder',
    seller: 'by Dani',
    price: '179',
    description: 'for sale only, 4 pcs binder',
  },
  {
    image: '/images/aquaflask.jpg',
    name: 'Aquaflask',
    seller: 'by Lola',
    price: '1200',
    description: 'for sale only 40oz aquaflask rose pink',
  },
  {
    image: '/images/highlighter.jpg',
    name: 'Stabilo Boss Highlighter',
    seller: 'by Wine',
    price: '150',
    description: '1 set of highlighter, open for swap to a set of colored pen',
  },
  {
    image: '/images/ballpen.jpg',
    name: 'Dong-A Fine Tech',
    seller: 'by Lusi',
    price: '128',
    description: 'for sale 5 pcs Dong-A Sign Pen',
  },
]);

const toggleSave = (product) => {
  if (savedProductsStore.savedProducts.some((p) => p.name === product.name)) {
    savedProductsStore.removeProduct(product.name);
  } else {
    savedProductsStore.addProduct(product);
  }
};

const isSaved = (product) => savedProductsStore.savedProducts.some((p) => p.name === product.name);

// State for modal control and product details
const isDialogOpen = ref(false);
const showProductDetail = ref(null);

const viewProductDetails = (product) => {
  showProductDetail.value = product;
  isDialogOpen.value = true;
};
</script>

<template>
  <v-container>
    <!-- Carousel -->
    <v-carousel class="carousel-container" hide-delimiters height="400">
      <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <v-img :src="item.image" cover>
          <v-container class="carousel-content">
            <h1 class="carousel-title">{{ item.title }}</h1>
            <h3 class="carousel-subtitle">{{ item.subtitle }}</h3>
          </v-container>
        </v-img>
      </v-carousel-item>
    </v-carousel>

    <!-- Discover Section -->
    <div class="text-center mt-5">
      <h2 class="discover-title">Shop smart, save big!</h2>
      <p class="discover-subtitle">
        Affordable prices and easy swaps await you here!
      </p>
    </div>

    <!-- Product Cards -->
    <v-container class="product-section mt-5">
      <v-row justify="center" dense>
        <v-col
          v-for="(product, index) in products"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="product-card" @click="viewProductDetails(product)">
            <!-- Image with Heart Icon -->
            <v-img :src="product.image" class="product-image" height="200px">
              <v-btn
                icon
                @click.stop="toggleSave(product)"
                class="heart-icon"
                :class="{'saved': isSaved(product)}"
              >
                <v-icon>{{ isSaved(product) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>
            </v-img>

            <!-- Product Details -->
            <v-card-text class="text-center">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-seller">{{ product.seller }}</div>
              <div class="product-price">{{ product.price }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Product Detail Modal -->
    <v-dialog v-model="isDialogOpen" max-width="800px" transition="dialog-bottom-transition">
      <v-card class="product-detail-card">
        <!-- Header Section -->
        <v-card-title class="product-detail-header">
          <div>
            <h2 class="product-title">{{ showProductDetail?.name }}</h2>
            <p class="product-seller">{{ showProductDetail?.seller }}</p>
          </div>
          <v-btn icon @click="isDialogOpen = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Content Section -->
        <v-card-text>
          <v-row>
            <!-- Product Image -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-img
                :src="showProductDetail?.image"
                class="product-detail-image"
                cover
                height="300px"
              />
            </v-col>

            <!-- Product Details -->
            <v-col cols="12" md="6">
              <div class="product-description">
                <h3>Description</h3>
                <p>{{ showProductDetail?.description }}</p>
              </div>
              <div class="product-price">
                <h3>Price</h3>
                <p>P{{ showProductDetail?.price }}</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer Section -->
        <v-card-actions class="product-detail-footer">
          <v-btn block @click="isDialogOpen = false" color="primary" outlined>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<style scoped>
/* Carousel Styles */
.carousel-container {
  margin-bottom: 40px;
}

.carousel-content {
  color: rgb(255, 255, 255);
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.carousel-title {
  font-size: 2rem;
  font-weight: bold;
}

.carousel-subtitle {
  font-size: 1.5rem;
}

/* Discover Section */
.discover-title {
  font-size: 2rem;
  color: rgb(224, 83, 1);
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.25rem;
  color: rgb(248, 159, 42);
  margin-bottom: 30px;
}

/* Modal Card */
.product-detail-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

/* Header Styles */
.product-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffc9e9;
  padding: 16px;
}

.product-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.product-seller {
  font-size: 0.875rem;
  color: #fd7e34;
  margin-top: 4px;
}

.close-btn {
  color: #eaeaea;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Image Styles */
.product-detail-image {
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Description and Price */
.product-description h3,
.product-price h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.product-description p,
.product-price p {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

/* Footer Styles */
.product-detail-footer {
  padding: 16px;
  background-color: #f5f5f5;
}

.product-detail-footer .v-btn {
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.product-detail-footer .v-btn:hover {
  background-color: #c9c3c3;
  color: white;
}

/* Product Section */
.product-section {
  margin-top: 40px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 350px; /* Ensures all cards have the same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
  position: relative;
  height: 200px;
  object-fit: cover;
  background-color: #f9f9f9;
}

.heart-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
}

.heart-icon .v-icon {
  color: red;
}

.saved {
  color: #ff4081;
}

.product-name {
  font-weight: bold;
  font-size: 1rem;
}

.product-seller {
  color: gray;
  font-size: 0.875rem;
}

.product-price {
  color: orange;
  font-size: 1.25rem;
}

.product-detail-image {
  width: 100%;
  height: auto;
}

.product-description {
  margin-top: 10px;
  color: #333;
  font-size: 1rem;
}

.v-btn {
  text-transform: none;
}
</style>
