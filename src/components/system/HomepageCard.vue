<script setup>
import { ref, onMounted } from 'vue';
import { useSavedProductsStore } from '@/stores/savedProducts';
import supabase from '@/utils/supabase.js';

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

const posts = ref([]); // This will hold the posts data

// Fetch data from the posts table on component mount
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold')
      .eq('is_sold', false); // If you want to fetch only unsold items

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      posts.value = data;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

// Function to handle saving a post (this can be customized further as needed)
const toggleSave = (post) => {
  if (savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name)) {
    savedProductsStore.removeProduct(post.item_name);
  } else {
    savedProductsStore.addProduct(post);
  }
};

const isSaved = (post) => savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);

const showPostDetail = ref(null);

const viewPostDetails = (post) => {
  showPostDetail.value = post;
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

    <!-- Post Cards -->
    <v-container class="post-section mt-5">
      <v-row justify="start" dense>
        <v-col
          v-for="(post, index) in posts"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="post-card" @click="viewPostDetails(post)">
            <!-- Image with Heart Icon -->
            <v-img :src="post.image" class="post-image" height="200px">
              <v-btn
                icon
                @click.stop="toggleSave(post)"
                class="heart-icon"
                :class="{'saved': isSaved(post)}"
              >
                <v-icon>{{ isSaved(post) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              </v-btn>
            </v-img>

            <!-- Post Details -->
            <v-card-text class="text-center">
              <div class="post-name">{{ post.item_name }}</div>
              <div class="post-seller">by User</div> <!-- Modify this as needed -->
              <div class="post-price">{{ post.price }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post Detail Modal -->
    <v-dialog v-model="showPostDetail" max-width="800px" transition="dialog-bottom-transition">
      <v-card class="post-detail-card">
        <!-- Header Section -->
        <v-card-title class="post-detail-header">
          <div>
            <h2 class="post-title">{{ showPostDetail?.item_name }}</h2>
            <p class="post-seller">by User</p> <!-- Modify this as needed -->
          </div>
          <v-btn icon @click="showPostDetail = null" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Content Section -->
        <v-card-text>
          <v-row>
            <!-- Post Image -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-img
                :src="showPostDetail?.image"
                class="post-detail-image"
                cover
                height="300px"
              />
            </v-col>

            <!-- Post Details -->
            <v-col cols="12" md="6">
              <div class="post-description">
                <h3>Description</h3>
                <p>{{ showPostDetail?.description }}</p>
              </div>
              <div class="post-price">
                <h3>Price</h3>
                <p>P{{ showPostDetail?.price }}</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer Section -->
        <v-card-actions class="post-detail-footer">
          <v-btn block @click="showPostDetail = null" color="primary" outlined>
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

/* Modal Card */
.post-detail-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
}

/* Header Styles */
.post-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f693c1;
  padding: 16px;
}

.post-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.post-seller {
  font-size: 0.875rem;
  color: #757575;
  margin-top: 4px;
}

.close-btn {
  color: #ff5252;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Image Styles */
.post-detail-image {
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Description and Price */
.post-description h3,
.post-price h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.post-description p,
.post-price p {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

/* Footer Styles */
.post-detail-footer {
  padding: 16px;
  background-color: #f5f5f5;
}

.post-detail-footer .v-btn {
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.post-detail-footer .v-btn:hover {
  background-color: #c9c3c3;
  color: white;
}

/* Post Section */
.post-section {
  margin-top: 40px;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 350px; /* Ensures all cards have the same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-image {
  border-bottom: 1px solid #e0e0e0;
}

.post-name {
  font-size: 1.125rem;
  font-weight: bold;
  margin-top: 10px;
}

.post-price {
  font-size: 1rem;
  color: #ff5252;
  font-weight: bold;
  margin-bottom: 10px;
}

.heart-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border-radius: 50%;
}

.saved {
  color: #ff5252;
}

</style>