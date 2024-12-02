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

const posts = ref([]);
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold')
      .eq('is_sold', false);

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      for (let post of data) {
        if (post.image) {
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('post-images')
            .createSignedUrl(post.image, 60 * 60);

          if (signedUrlError) {
            console.error('Error fetching signed URL:', signedUrlError.message);
          } else {
            post.image = signedUrlData.signedUrl;
          }
        }
      }
      posts.value = data;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

const toggleSave = (post) => {
  if (savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name)) {
    savedProductsStore.removeProduct(post.item_name);
  } else {
    savedProductsStore.addProduct(post);
  }
};

const isSaved = (post) =>
  post
    ? savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name)
    : false;

const selectedPost = ref(null);
const isDialogOpen = ref(false);

const viewPostDetails = (post) => {
  selectedPost.value = post;
  isDialogOpen.value = true;
};

const contactSeller = () => {
  if (selectedPost.value) {
    console.log(`Contact seller for: ${selectedPost.value.item_name}`);
    // Placeholder action
    alert("Contacting seller...");
  }
};
</script>


<template>
  <v-container>
    <!-- Carousel -->
    <v-carousel
  height="400"
  show-arrows="hover"
  cycle
  hide-delimiter-background
>
  <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
    <v-img :src="item.image" cover height="100%">
      <div class="d-flex fill-height justify-center align-center">
        <div class="carousel-content">
          <h1 class="carousel-title">{{ item.title }}</h1>
          <h3 class="carousel-subtitle">{{ item.subtitle }}</h3>
        </div>
      </div>
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
            <!-- Image -->
            <v-img :src="post.image" class="post-image" height="200px" />
            <!-- Post Details -->
            <v-card-text class="text-center">
              <div class="post-name">{{ post.item_name }}</div>
              <div class="post-price">{{ post.price }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post Detail Modal -->
    <v-dialog v-model="isDialogOpen" max-width="800px" transition="dialog-bottom-transition">
  <v-card class="post-detail-card">
    <!-- Header Section -->
    <v-card-title class="post-detail-header">
      <v-btn icon @click="isDialogOpen = false" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <!-- Content Section -->
    <v-card-text>
      <v-row>
        <!-- Post Image -->
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-img
            :src="selectedPost?.image"
            class="post-detail-image"
            cover
            height="300px"
          />
        </v-col>

        <!-- Post Details -->
        <v-col cols="12" md="6">
          <div class="post-title">{{ selectedPost?.item_name }}</div>
          <div class="post-seller">by User</div>
          <div class="post-description">
            <h3>Description</h3>
            <p>{{ selectedPost?.description }}</p>
          </div>
          <div class="post-price">
            <h3>Price</h3>
            <p>P{{ selectedPost?.price }}</p>
          </div>
          <!-- Buttons Below Price -->
          <v-row justify="start" class="mt-4 button-row">
             <v-btn class="custom-button mx-2" @click="toggleSave(selectedPost)">
             <v-icon left>mdi-bookmark-outline</v-icon>
              {{ isSaved(selectedPost) ? "Unsave" : "Save" }}
           </v-btn>
           <v-btn class="custom-button mx-2" @click="contactSeller">
             <v-icon left>mdi-email-outline</v-icon>
                 Contact Seller
                 </v-btn>
              </v-row>
        </v-col>
      </v-row>
    </v-card-text>
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
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
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
  font-size: 1.50rem;
  color: rgb(239, 119, 28);
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.25rem;
  color: rgb(46, 45, 46);
  margin-bottom: 30px;
}

/* Post Section */
.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-image {
  border-bottom: 1px solid #e0e0e0;
}

.post-name {
  font-size: 1.125rem;
  color: rgb(247, 182, 61);
  font-weight: bold;
  margin-top: 10px;
}

.post-price {
  font-size: 1rem;
  color: rgb(0, 0, 0);
  font-weight: bold;
  margin-bottom: 10px;
}

/* Modal Styles */
.post-detail-card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  padding: 20px;
}

.post-detail-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fab9d9;
  padding: 16px;
}

.post-title {
  font-size: 1.50rem;
  font-weight: bolder;
  color: rgb(239, 119, 28);
}

.post-seller {
  font-size: 0.8rem;
  color: rgb(46, 45, 46);
  margin-bottom: 10px;
}

.post-description h3 {
  font-size: 1rem;
  font-weight: bold;
  color: rgb(0, 0, 0);
}

.post-description p {
  font-size: 0.9rem;
  font-weight: normal; /* Non-bold text for the product description */
  color: #353535;
}

.post-price h3 {
  font-size: 1rem;
  font-weight: bold; /* Bold label for price */
  color: rgb(0, 0, 0);
}

.post-price p {
  font-size: 0.9rem;
  font-weight: bolder; /* Non-bold text for the price value */
  color: #353535;
}

/* Ensure buttons are positioned properly */
.button-row {
  margin-top: 20px;
  gap: 10px;
}

/* Buttons */
.custom-button {
  background-color: #d3d3d3;
  color: #000;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #ffc0cb;
}

/* Post Image Styling */
.post-detail-image {
  border-radius: 8px;
}

/* Responsive adjustments */
@media screen and (max-width: 600px) {
  .button-row {
    flex-direction: column;
    gap: 10px;
  }
}
</style>


