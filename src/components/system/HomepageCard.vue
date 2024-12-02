<script setup>
import { ref, onMounted } from 'vue';
import { useSavedProductsStore } from '@/stores/savedProducts';
import supabase from '@/utils/supabase.js';
import { useThemeStore } from '@/stores/theme.js'; // Import the theme store

const savedProductsStore = useSavedProductsStore();
const themeStore = useThemeStore(); // Access the theme store

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

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold')
    
    if (error) {
      console.error('Error fetching posts:', error);
<<<<<<< HEAD
      return;
    }

    for (const post of data) {
      if (post.image) {
        const { data: signedUrlData, error: signedUrlError } = await supabase
          .storage
          .from('post-images')
          .createSignedUrl(post.image, 3600);

        if (!signedUrlError) {
          post.image = signedUrlData.signedUrl;
        }
      }
=======
    } else {
      // Fetch the image for each post if the image exists
      for (let post of data) {
        if (post.image) {
          // Construct the path for the image
          const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('post-images') // your bucket name
            .createSignedUrl(post.image, 60 * 60); // 1-hour expiration for signed URL

          if (signedUrlError) {
            console.error('Error fetching signed URL:', signedUrlError.message);
          } else {
            post.image = signedUrlData.signedUrl; // Update post image with signed URL
          }
        }
      }

      // Sort posts:
      // 1. Posts that are unsold appear first.
      // 2. Within unsold posts, the most recent appear at the top.
      // 3. Sold posts are moved to the bottom, and they are displayed last.

      posts.value = data.sort((a, b) => {
        if (a.is_sold && !b.is_sold) return 1; // Sold posts go to the bottom
        if (!a.is_sold && b.is_sold) return -1; // Unsold posts go to the top

        // For unsold posts, sort by time to ensure the latest post appears first
        if (!a.is_sold && !b.is_sold) {
          return new Date(b.time) - new Date(a.time); // Latest post first
        }

        return 0; // No change for posts with the same `is_sold` status
      });
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
    }
    posts.value = data;
  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

// Function to handle saving a post
const toggleSave = (post) => {
  const saved = savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);
  saved ? savedProductsStore.removeProduct(post.item_name) : savedProductsStore.addProduct(post);
};

<<<<<<< HEAD
const isSaved = (post) =>
  savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);
=======
const isSaved = (post) => savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945

const selectedPost = ref(null); // Holds the currently selected post details
const isDialogOpen = ref(false); // Controls the dialog visibility

const viewPostDetails = (post) => {
  selectedPost.value = post;
  isDialogOpen.value = true;
};
<<<<<<< HEAD

const contactSeller = () => {
  if (selectedPost.value) {
    alert(`Contacting seller for: ${selectedPost.value.item_name}`);
  }
};
=======
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
</script>

<template>
  <v-container>
    <!-- Carousel -->
    <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background>
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
<<<<<<< HEAD
        <v-col v-for="(post, index) in posts" :key="index" cols="12" sm="6" md="4">
          <v-card class="post-card">
            <!-- Image Section -->
            <v-img :src="post.image" class="post-image" height="200px">
              <v-btn
                class="view-button"
                color="brown"
                @click.stop="viewPostDetails(post)"
                absolute
                top
                right
              >
                View
              </v-btn>
            </v-img>

            <!-- Details Section -->
            <v-card-text class="post-details">
              <div class="d-flex justify-space-between">
                <div>
                  <div class="post-title">{{ post.item_name }}</div>
                  <div class="post-type">{{ post.type }}</div>
                </div>
                <div class="post-price-box">
                  <div class="post-price">₱{{ post.price }}</div>
                </div>
              </div>
=======
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
              <div class="post-seller">by User</div>
              <div class="post-price">{{ post.price }}</div>
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post Detail Modal -->
<<<<<<< HEAD
    <v-dialog
      v-model="isDialogOpen"
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-card class="post-detail-card">
        <!-- Header Section -->
        <v-card-title class="post-detail-header">
=======
    <v-dialog v-model="isDialogOpen" max-width="800px" transition="dialog-bottom-transition">
      <v-card class="post-detail-card">
        <!-- Header Section -->
        <v-card-title class="post-detail-header">
          <div>
            <h2 class="post-title">{{ selectedPost?.item_name }}</h2>
            <p class="post-seller">by User</p>
          </div>
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
          <v-btn icon @click="isDialogOpen = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Content Section -->
        <v-card-text>
          <v-row>
<<<<<<< HEAD
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-img :src="selectedPost?.image" class="post-detail-image" cover height="300px" />
            </v-col>
            <v-col cols="12" md="6">
              <div class="post-title">{{ selectedPost?.item_name }}</div>
              <div class="post-seller">by User</div>
=======
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
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
              <div class="post-description">
                <h3>Description</h3>
                <p>{{ selectedPost?.description }}</p>
              </div>
              <div class="post-price">
                <h3>Price</h3>
<<<<<<< HEAD
                <p>₱{{ selectedPost?.price }}</p>
              </div>
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
=======
                <p>P{{ selectedPost?.price }}</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer Section -->
        <v-card-actions class="post-detail-footer">
          <v-btn block @click="isDialogOpen = false" color="primary" outlined>
            Close
          </v-btn>
        </v-card-actions>
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
      </v-card>
    </v-dialog>
  </v-container>
</template>




<style scoped>
/* General Styles */
.carousel-content {
  color: rgb(242, 214, 206);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.carousel-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.carousel-subtitle {
  font-size: 1.2rem;
  font-weight: bold;
}

.discover-title {
<<<<<<< HEAD
  font-size: 1.8rem;
  color: rgb(100, 46, 61);
=======
  font-size: 2rem;
  color: rgb(239, 119, 28);
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.25rem;
  color: #2e2d2e;
  margin-bottom: 30px;
}

<<<<<<< HEAD
=======
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
  background-color: #fa48a1;
  padding: 16px;
}

.post-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #ffffff; /* Updated to a rich lavender */
}

.post-seller {
  font-size: 0.875rem;
  color: #1f1b1b;
  margin-top: 4px;
}

.close-btn {
  transition: transform 0.2s ease;
}

.close-btn:hover {
  color: #ff44d0;
  transform: scale(1.2);
}

/* Image Styles */
.post-detail-image {
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Description and Price */
.post-description h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: rgb(0, 0, 0); /* Updated to soft lavender */
}

.post-description p,
.post-price p {
  font-size: 1rem;
  color: #353535;
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

>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
.post-card {
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 1px solid #e0e0e0;
}

.post-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-image {
  border-bottom: 1px solid #ddd;
}

.view-button {
  font-size: 0.9rem;
  background-color: #fc6a70;
  color: white;
  border-radius: 12px;
}

.view-button:hover {
  background-color: #e8535f;
}

<<<<<<< HEAD
.post-details {
  padding: 16px;
}

.post-detail-header {
  background-color: #8a3f3f;
}

.post-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: rgb(216, 128, 101);
}

.post-type {
  font-size: 0.9rem;
  color: #777;
  margin-top: 4px;
}

.post-price-box {
  padding: 4px 8px;
  border: 1px solid rgb(239, 176, 186);
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.post-description h3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: hsl(11, 99%, 73%);
}

.post-description p {
  font-size: 0.9rem;
  color: hsl(0, 3%, 13%);
}

.post-price {
  font-size: 1rem;
  font-weight: bold;
  color: hsl(0, 22%, 44%);
}

.post-price h3 {
  font-size: 1rem;
  font-weight: bold;
  color: hsl(0, 22%, 44%);
}

.post-price p {
  font-size: 1rem;
  font-weight: bolder;
  color: hsl(0, 10%, 15%);
}

.post-detail-card {
  padding: 20px;
}

.custom-button {
  background-color: #421f2c;
  color: white;
  font-weight: bold;
}

.custom-button:hover {
  background-color: #fecfb6;
=======
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

.product-name {
  color: #ffffff; /* Matches the modal title for consistency */
  font-weight: bold;
  font-size: 1rem;
}

.product-seller {
  color: rgb(24, 24, 24);
  font-size: 0.875rem;
}

.product-price {
  color: rgb(33, 32, 32);
  font-size: 1.25rem;
}

.product-description {
  margin-top: 10px;
  color: rgb(218, 43, 43);
  font-size: 1rem;
}

.v-btn {
  text-transform: none;
>>>>>>> f4f9f3b20b8f20b1bef7be389126f9a05df9e945
}
</style>

