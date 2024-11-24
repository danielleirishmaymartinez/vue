<script setup>
import { ref } from 'vue';

// Carousel items
const carouselItems = [
  {
    image: 'https://via.placeholder.com/800x400?text=Slide+1',
    title: 'Welcome to Our Store',
    subtitle: 'Explore the latest deals!',
  },
  {
    image: 'https://via.placeholder.com/800x400?text=Slide+2',
    title: 'Seasonal Discounts',
    subtitle: 'Limited-time offers just for you.',
  },
  {
    image: 'https://via.placeholder.com/800x400?text=Slide+3',
    title: 'New Arrivals',
    subtitle: 'Check out our newest collections.',
  },
];

// Product cards
const products = ref([
  {
    image: 'https://via.placeholder.com/300?text=Product+1',
    name: 'Ballpen',
    description: 'asdghjk',
    price: '10',
    label: null,
  },
  {
    image: 'https://via.placeholder.com/300?text=Product+2',
    name: 'Yellow Pad',
    description: '1 whole',
    price: '35',
    label: 'Sale',
  },
  {
    image: 'https://via.placeholder.com/300?text=Product+3',
    name: 'Shoes',
    description: 'Converge',
    price: '1900',
    label: 'More Corors',
  },
  {
    image: 'https://via.placeholder.com/300?text=Product+4',
    name: 'Organic Honey Jar',
    description: 'by Sweet Honey Co.',
    price: '15',
    label: null,
  },
  {
    image: 'https://via.placeholder.com/300?text=Product+5',
    name: 'AMbot',
    description: 'bbbbbbbooot',
    price: '0',
    label: 'New',
  },
  {
    image: 'https://via.placeholder.com/300?text=Product+6',
    name: 'Saging',
    description: 'saging genggeng',
    price: '10',
    label: null,
  },
]);
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

    <!-- Product Cards -->
    <v-container>
      <v-row>
        <v-col
          v-for="(product, index) in products"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          class="d-flex"
        >
          <v-card class="product-card">
            <!-- Badge -->
            <v-badge
              v-if="product.label"
              color="orange"
              text-color="white"
              value="{{ product.label }}"
              location="top-right"
              class="badge-label"
            ></v-badge>

            <!-- Image -->
            <v-img :src="product.image" class="product-image"></v-img>

            <!-- Details -->
            <v-card-text>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-seller">{{ product.seller }}</div>
              <div class="product-price">{{ product.price }}</div>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions>
              <v-btn color="primary" text>View</v-btn>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
/* Carousel styles */
.carousel-container {
  margin-bottom: 40px;
}

.carousel-content {
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.carousel-title {
  font-size: 2rem;
  font-weight: bold;
}

.carousel-subtitle {
  font-size: 1.5rem;
}

/* Product card styles */
.product-card {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.product-image {
  height: 200px;
  object-fit: cover;
}

.product-name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.product-seller {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1rem;
  color: #ff5722;
  font-weight: bold;
}

.badge-label {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
}
</style>
