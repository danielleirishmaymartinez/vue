<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

// Mock product data
const products = ref([
  { name: "Laptop", price: "₱20,000", image: "/images/laptop.jpg", seller: "John Doe", description: "High-performance laptop" },
  { name: "Phone", price: "₱15,000", image: "/images/phone.jpg", seller: "Jane Doe", description: "Latest model smartphone" },
]);

const showProductDetail = ref(null);
const isSaved = ref([]);

const toggleSave = (product) => {
  if (isSaved.value.includes(product.name)) {
    isSaved.value = isSaved.value.filter((item) => item !== product.name);
  } else {
    isSaved.value.push(product.name);
  }
};

const isSaved = (product) => isSaved.value.includes(product.name);

const viewProductDetails = (product) => {
  showProductDetail.value = product;
};
</script>

<template>
  <v-container>
    <!-- Carousel -->
    <v-carousel hide-delimiters height="400">
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
      <h2 class="discover-title">Pamalit namo</h2>
      <p class="discover-subtitle">Para di kuni ipang labay!</p>
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
          <v-btn text @click="showProductDetail = null">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.product-card {
  box-shadow: none;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
}

.product-description {
  font-size: 14px;
}

.product-price {
  font-size: 16px;
  color: #ff4081;
}

.product-detail-image {
  max-height: 400px;
  object-fit: contain;
}

.heart-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ff4081;
}

.saved {
  color: red;
}

.carousel-title {
  font-size: 30px;
  font-weight: bold;
}

.carousel-subtitle {
  font-size: 20px;
}

.discover-title {
  font-size: 24px;
  font-weight: bold;
}

.product-section {
  margin-top: 50px;
}
</style>
