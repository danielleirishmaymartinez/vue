<script setup>
import { useSavedProductsStore } from '@/stores/savedProducts';

// Pinia store
const savedProductsStore = useSavedProductsStore();
</script>

<template>
  <v-container>
    <h1 class="text-center">Saved Products</h1>
    <v-row>
      <v-col
        v-for="(product, index) in savedProductsStore.savedProducts"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-card class="product-card">
          <v-img :src="product.image" class="product-image"></v-img>
          <v-card-text>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-seller">{{ product.seller }}</div>
            <div class="product-price">{{ product.price }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" text @click="savedProductsStore.removeProduct(product.name)">
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
