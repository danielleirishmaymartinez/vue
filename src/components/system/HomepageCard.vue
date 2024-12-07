<script setup>
import { ref, computed, onMounted } from 'vue';  // Fixed duplicate imports
import { useSavedProductsStore } from '@/stores/savedProducts';
import supabase from '@/utils/supabase.js';
import { useThemeStore } from '@/stores/theme.js';

const savedProductsStore = useSavedProductsStore();
const themeStore = useThemeStore();
const searchQuery = ref('');  // Search query reactive variable
const posts = ref([]);

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase(); // Trim and normalize the search query
  
  if (!query) return posts.value; // If no search query, show all posts
  
  return posts.value.filter(post => {
    const itemName = post.item_name ? post.item_name.toLowerCase().trim() : '';
    
    // Check if query matches any part of item_name, description, or location
    const itemMatches = itemName.includes(query);
    // Return true only if any of the matches are true
    return itemMatches;
  });
});


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

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold, user_id');

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    // Fetch user data and images in parallel
    const postPromises = data.map(async (post) => {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('fb_link, first_name, last_name, preferred_location, preferred_time, profile_image')
        .eq('user_id', post.user_id)
        .single();

      if (!userError && userData) {
        post.fb_link = userData.fb_link;
        post.first_name = userData.first_name;
        post.last_name = userData.last_name;
        post.preferred_location = userData.preferred_location;
        post.preferred_time = userData.preferred_time;
        post.profile_image = userData.profile_image;
      }

      if (post.image) {
        const { data: signedUrlData, error: signedUrlError } = await supabase
          .storage
          .from('post-images')
          .createSignedUrl(post.image, 3600);

        if (!signedUrlError) {
          post.image = signedUrlData.signedUrl;
        }
      }

      return post;
    });

    // Wait for all post promises to resolve
    const postsData = await Promise.all(postPromises);
    posts.value = postsData;

  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

const toggleSave = async (post) => {
  try {
    const isPostSaved = savedProductsStore.savedProducts.some(
      (p) => p.item_name === post.item_name
    );

    if (isPostSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', post.user_id)
        .eq('post_id', post.id);

      if (error) {
        console.error('Error unsaving post:', error);
        return;
      }

      savedProductsStore.removeProduct(post.item_name);
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert([{ user_id: post.user_id, post_id: post.id }]);

      if (error) {
        console.error('Error saving post:', error);
        return;
      }

      savedProductsStore.addProduct(post);
    }
  } catch (error) {
    console.error('Error toggling save:', error);
  }
};

const isSaved = (post) => 
  savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);

const selectedPost = ref(null);
const isDialogOpen = ref(false);

const viewPostDetails = (post) => {
  selectedPost.value = post;
  isDialogOpen.value = true;
};

const redirectToFacebookProfile = (post) => {
  if (post.fb_link) {
    window.open(post.fb_link, '_blank');
  } else {
    alert('Facebook profile link is not available for this user.');
  }
};
</script>

<template>
  <v-container class="custom-container">
    <v-carousel height="450px" show-arrows="hover" cycle hide-delimiter-background>
  <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
    <v-img :src="item.image" cover class="carousel-card border-accent">
      <div class="d-flex fill-height justify-center align-center">
        <div class="carousel-content">
          <h1 class="carousel-title">{{ item.title }}</h1>
          <h3 class="carousel-subtitle">{{ item.subtitle }}</h3>
        </div>
      </div>
    </v-img>
  </v-carousel-item>
</v-carousel>
    <!-- Discover Section (Unchanged) -->
    <div class="text-center mt-5">
      <h2 class="discover-title">Shop smart, save big!</h2>
      <p class="discover-subtitle">
        Affordable prices and easy swaps await you here!
      </p>
    </div>

    <!-- Search Bar (Centered) -->
    <v-container class="mx-auto d-flex justify-center align-center my-4">
      <v-text-field
        v-model="searchQuery"
        rounded
        outlined
        density="comfortable"
        label="Search for an item"
        append-inner-icon="mdi-magnify"
        class="search-bar"
      ></v-text-field>
    </v-container>

    <!-- Post Cards -->
    <v-container class="post-section mt-5">
      <v-row justify="start" dense>
        <v-col v-for="(post, index) in filteredPosts" :key="index" cols="10" sm="6" md="4">
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Post Detail Modal -->
    <v-dialog v-model="isDialogOpen" max-width="800px" transition="dialog-bottom-transition">
      <v-card class="post-detail-card">
        <!-- Updated Header Section -->
        <v-card-title class="post-detail-header d-flex align-center">
          <v-avatar size="40" class="me-3" v-if="selectedPost?.profile_image" color="grey lighten-2">
            <v-img :src="selectedPost?.profile_image" />
          </v-avatar>
          <div>
            <div class="seller-name">
              {{ selectedPost?.first_name }} {{ selectedPost?.last_name }}
            </div>
            <div class="seller-location">
              {{ selectedPost?.preferred_location }}
            </div>
          </div>
          <v-spacer />
          <v-btn icon @click="isDialogOpen = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-img :src="selectedPost?.image" class="post-detail-image" cover height="300px" />
            </v-col>
            <v-col cols="12" md="6">
              <div class="post-title">{{ selectedPost?.item_name }}</div>
              <div class="post-description">
                <h3>Description</h3>
                <p>{{ selectedPost?.description }}</p>
              </div>
              <div class="post-price">
                <h3>Price</h3>
                <p>₱{{ selectedPost?.price }}</p>
              </div>
              <div>
                <p><strong>Preferred Time:</strong> {{ selectedPost?.preferred_time }}</p>
              </div>
              <v-row justify="start" class="mt-4 button-row">
                <v-btn class="custom-button mx-2" @click="toggleSave(selectedPost)">
                  <v-icon left>mdi-bookmark-outline</v-icon>
                  {{ isSaved(selectedPost) ? "Unsave" : "Save" }}
                </v-btn>
                <v-btn class="custom-button mx-2" @click="redirectToFacebookProfile(selectedPost)">
                  <v-icon left>mdi-facebook</v-icon>
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
/* General Styles */
.custom-container {
  max-width: 1500px;
  margin: 0 auto;
}

.carousel-card {
  border: 3px; /* Dark brown border */
  box-sizing: border-box; /* Ensures border doesn't affect size */
  border-radius: 12px; /* Optional: Adds rounded corners */
  border-color: #9e7749f8; /* Replace with your preferred color */
  border-style: solid;
}

.dark-mode {
  color: #ffffff;
}

.light-mode {
  color: #000000;
}


.carousel-card {
  border: 3px; /* Dark brown border */
  box-sizing: border-box; /* Ensures border doesn't affect size */
  border-radius: 12px; /* Optional: Adds rounded corners */
  border-color: #9e7749f8; /* Replace with your preferred color */
  border-style: solid;
}

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
  font-size: 1.8rem;
  color: rgb(100, 46, 61);
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

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

.post-details {
  padding: 16px;
}

.post-detail-header {
  display: flex;
  align-items: center;
  background-color: rgb(216, 128, 101);
  color: white;
  padding: 16px;
  border-radius: 5px 5px 0 0;
}

.seller-name {
  font-size: 1rem;
  font-weight: bold;
}

.seller-location {
  font-size: 0.8rem;
  color: #f3e6e0;
}

.close-btn {
  color: rgb(105, 53, 53);
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
}

.post-price {
  font-size: 1rem;
  font-weight: bold;

}

.post-price h3 {
  font-size: 1rem;
  font-weight: bold;

}

.post-price p {
  font-size: 1rem;
  font-weight: bolder;
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
}
</style>
