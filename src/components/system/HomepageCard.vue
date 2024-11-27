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
    subtitle: 'affordability meets sustainability here!',
  },
];

const products = ref([
  {
    image: '/images/binder.jpg',
    name: 'Binder',
    seller: 'by Dani',
    price: 'P179',
    description: 'for sale only, 4 pcs binder',
  },
  {
    image: '/images/aquaflask.jpg',
    name: 'Aquaflask',
    seller: 'by Lola',
    price: 'P1200',
    description: 'for sale only 40oz aquaflask rose pink',
  },
  {
    image: '/images/highlighter.jpg',
    name: 'Stabilo Boss Highlighter',
    seller: 'by Wine',
    price: 'P150',
    description: '1 set of highlighter, open for swap to a set og colored pen',
  },
  {
    image: '/images/ballpen.jpg',
    name: 'Dong-A Fine Tech',
    seller: 'by Lusi',
    price: 'P128',
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

const showProductDetail = ref(null);

const viewProductDetails = (product) => {
  showProductDetail.value = product;
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
    <v-dialog v-model="showProductDetail" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">{{ showProductDetail?.name }}</v-card-title>
        <v-card-subtitle>{{ showProductDetail?.seller }}</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-img :src="showProductDetail?.image" class="product-detail-image" />
            </v-col>
            <v-col cols="12" md="6">
              <div class="product-description">{{ showProductDetail?.description }}</div>
              <div class="product-price">{{ showProductDetail?.price }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showProductDetail = null" text>Close</v-btn>
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
  color: white;
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
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.25rem;
  color: gray;
  margin-bottom: 30px;
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
