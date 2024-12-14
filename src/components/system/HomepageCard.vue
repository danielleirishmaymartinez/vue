<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSavedProductsStore } from '@/stores/savedProducts';
import supabase from '@/utils/supabase.js';

const savedProductsStore = useSavedProductsStore();
const searchQuery = ref('');
const posts = ref([]);

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return posts.value;

  return posts.value.filter(post => {
    const itemName = post.item_name ? post.item_name.toLowerCase().trim() : '';
    return itemName.includes(query);
  });
});

const carouselItems = [
  {
    image: '/images/1.png',
  },
  {
    image: '/images/2.png',
  },
  {
    image: '/images/3.png',
  },
  {
    image: '/images/4.png',
  },
];

onMounted(async () => {
  await fetchPosts();
});
const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, item_name, price, description, location, time, type, image, is_sold, user_id');

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

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
        post.profile_image = userData.profile_image; // Ensure profile image is fetched and assigned

        console.log('Fetched Profile Image:', userData.profile_image); // Add this line for logging
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

    const postsData = await Promise.all(postPromises);
    posts.value = sortPosts(postsData); // Ensure posts are sorted correctly
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

const sortPosts = (postList) => {
  return postList.sort((a, b) => {
    if (a.is_sold && !b.is_sold) return 1; // Move sold items to the end
    if (!a.is_sold && b.is_sold) return -1;
    return new Date(b.time) - new Date(a.time); // Newest posts first
  });
};

const dialogVisible = ref(false); // Reactive variable for dialog visibility
const alertMessage = ref(""); // Reactive variable for dialog message

const toggleSave = async (post) => {
  try {
    const isPostSaved = savedProductsStore.savedProducts.some(
      (p) => p.item_name === post.item_name
    );

    if (isPostSaved) {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", post.user_id)
        .eq("post_id", post.id);

      if (error) {
        console.error("Error unsaving post:", error);
        alertMessage.value = "Error unsaving item!";
        dialogVisible.value = true;
        return;
      }

      savedProductsStore.removeProduct(post.item_name);
      alertMessage.value = "Item unsaved successfully!";
    } else {
      const { error } = await supabase
        .from("saved_posts")
        .insert([{ user_id: post.user_id, post_id: post.id }]);

      if (error) {
        console.error("Error saving post:", error);
        alertMessage.value = "Error saving item!";
        dialogVisible.value = true;
        return;
      }

      savedProductsStore.addProduct(post);
      alertMessage.value = "Item saved successfully!";
    }

    dialogVisible.value = true; // Show the dialog after save/unsave action
  } catch (error) {
    console.error("Error toggling save:", error);
    alertMessage.value = "An error occurred while toggling the save.";
    dialogVisible.value = true;
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

const markAsSold = async (post) => {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ is_sold: true })
      .eq('id', post.id);

    if (error) {
      console.error('Error marking post as sold:', error);
      return;
    }

    post.is_sold = true; // Update local state
    posts.value = sortPosts(posts.value); // Re-sort posts
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};
</script>

<template>
  <v-container class="custom-container">
    <v-carousel height="500px" show-arrows="hover" cycle hide-delimiter-background>
  <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
    <v-img :src="item.image" cover class="carousel-card">
      <!-- The overlay is applied on top of the image -->
    </v-img>
  </v-carousel-item>

  <!-- Fixed Overlay (Outside of carousel items, inside the carousel) -->
  <div class="carousel-overlay">
    <div class="carousel-caption">
      <h1 class="text-center white--text">Welcome to Campus Deals!</h1>
      <p class="text-center white--text">Explore endless opportunities to buy, sell, and trade 
        with your campus community.</p>
      <p class="text-center white--text">Find amazing deals and connect with students like you!</p>
    </div>
  </div>
</v-carousel>

<!-- Search Bar (Centered) -->
<v-container class="mx-auto d-flex justify-center align-center">
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

<!-- No Results Message -->
<v-container v-if="searchQuery && filteredPosts.length === 0" class="no-results-container">
  <img src="/public/images/no-results.png" alt="No results" class="no-results-icon" />
  <p class="no-results-text">No results found</p>
</v-container>

<v-container class="post-section">
  <v-row justify="start" dense>
    <v-col v-for="(post, index) in filteredPosts" :key="index" cols="10" sm="6" md="3">
      <v-card class="post-card position-relative">
        <v-img :src="post.image" class="post-image" height="250px">
          <v-btn
            class="view-button"
            @click.stop="viewPostDetails(post)"
            absolute
            top
            right
          >
            View
          </v-btn>
        </v-img>

        <!-- Sold Overlay -->
        <div v-if="post.is_sold" class="sold-overlay">
          <div class="sold-text">SOLD OUT</div>
        </div>

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
      <v-spacer />
      <v-btn icon @click="isDialogOpen = false" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
  <v-col cols="12" md="6" class="d-flex justify-center">
    <v-img :src="selectedPost?.image" class="post-detail-image" />
  </v-col>
  <v-col class="post-details-2" cols="12" md="6">
    <!-- Display seller's profile image if available -->
    <v-avatar size="55" class="me-4" v-if="selectedPost?.profile_image">
      <v-img :src="'https://oazrcjrqzmhbtnhxgzkk.supabase.co/storage/v1/object/public/profile-images/' + selectedPost.profile_image" />
      </v-avatar>
    <span class="seller-name">
      {{ selectedPost?.first_name }} {{ selectedPost?.last_name }}
    </span>
        <div class="post-title-2">{{ selectedPost?.item_name }}</div>
<div class="post-description d-flex icon-color align-center mb-8">
  <p class="text-color">{{ selectedPost?.description }}</p>
</div>
<div class="post-price d-flex align-center">
  <span class="mdi mdi-currency-php icon-color"></span>
  <p class="text-color">{{ selectedPost?.price }}</p>
</div>
<div class="post-location d-flex align-center">
  <span class="mdi mdi-map-marker-circle icon-color"></span>
  <p class="text-color">{{ selectedPost?.preferred_location }}</p>
</div>
<div class="post-time d-flex align-center">
  <span class="mdi mdi-calendar-text icon-color"></span>
  <p class="text-color">{{ selectedPost?.preferred_time }}</p>
</div>
<v-row justify="start" class="mt-15 button-row">
    <!-- Save/Unsave Button -->
    <v-btn class="custom-button mx-2" @click="toggleSave(selectedPost)">
      <v-icon left>mdi-bookmark-outline</v-icon>
      {{ isSaved(selectedPost) ? "Unsave" : "Save" }}
    </v-btn>

    <!-- Dialog Notification -->
    <v-dialog v-model="dialogVisible" persistent max-width="500px">
      <v-card class="pa-4" color="pink-accent-1" dark>
                <v-card-title>
          Success
        </v-card-title>
        <v-card-text>
          <span>{{ alertMessage }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="dialogVisible = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <v-btn class="custom-button mx-5" @click="redirectToFacebookProfile(selectedPost)">
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
  max-width: 1400px;
}

.carousel-card {
  border-radius: 18px; /* Optional: Adds rounded corners */
  position: relative;
}

/* Darken the background overlay when the dialog is visible */
.v-dialog .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.8) !important; /* 80% opacity */
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;  /* Ensures it covers the entire width of the carousel */
  height: 100%; /* Ensures it covers the entire height of the carousel */
  background: #5c58580f; /* Semi-transparent black background */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above carousel content */
  pointer-events: none; /* Prevents the overlay from blocking carousel controls */
}


/* Adjust font sizes here */
.carousel-caption h1 {
  margin: 0;
  padding: 0;
  font-size: 4rem; /* Adjust as needed for headline */
  font-weight: bold; /* Optional: Make text bold for visibility */
}

.carousel-caption p {
  margin: 0;
  padding: 0;
  font-size: 1.4rem; /* Adjust as needed for paragraph text */
  font-weight: normal; /* Optional: Keep it normal */
}

.carousel-content {
  color: rgb(75, 38, 120);
  text-shadow: 0 0 2px rgb(255, 255, 255);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.discover-title {
  font-size: 1.8rem;
  color: #fdb095;
  font-weight: bold;
}

.discover-subtitle {
  font-size: 1.10rem;
  color: white;
}

.post-card {
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s ease;
  border: 1px solid #e8657f;
}

.post-card:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.post-image {
  border-bottom: 1px solid #efe8e8;
}

.view-button {
  font-size: 0.7rem;
  background-color: #ff1cc0;
  color: white;
  border-radius: 10px;
}

.view-button:hover {
  background-color: #7100b2;
}

.post-details {
  padding: 15px;
}

.post-details-2 {
  padding: 15px;
  margin-top: 20px;
}

.post-detail-header {
  display: flex;
  align-items: center;
  background-color: #4a0074;
}

.post-detail-card {
  max-width: 900px; /* Adjusted card width */
  width: 100%; /* Responsive width */
  height: 500px; /* Maintain aspect ratio */
  border: 3px solid #4a0074; /* Set border thickness and color */
}


.post-detail-image {
  margin-top: 20px;
  width: 100%; /* Responsive width */
  height: 350px; /* Adjusted height */
  object-fit:cover; /* Keeps image proportions while cropping excess */
  border-radius: 20px; /* Optional: Rounded corners */
}

.seller-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.search-bar {
  color: #ffffff; /* Dark text color */
  border-radius: 6%; /* Rounded corners */
  margin-top: 20px;
}

.sold-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent gray */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Ensures it is above other content */
}

.sold-text {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}

.close-btn {
  color: rgb(105, 53, 53);
  width: 5%;
  height: 35px;
}

.post-title {
  font-size: 1rem;
  font-weight: bold;
  color: #210440;
  margin-bottom: 15px;
}

.post-title-2 {
  margin-top: 20px;
  font-size: 1.3rem;
  font-weight: bold;
  color: #210440;
}

.post-type {
  font-size: 0.9rem;
  color: #000000;
  margin-top: 4px;
}

.post-description{
  color:#000000;
}

.post-price-box {
  padding: 4px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.post-price {
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
}

.custom-button {
  background-color: #5f0196;
  color: white;
  font-weight: bold;
}

.custom-button:hover {
  background-color: #29013a;
}

.text-color {
  color: #000000; /* Example: Dark Gray for Text */
}

.icon-color {
  font-size: 15px;
  color: hsl(0, 0%, 0%); /* Example: Bright Orange for Icons */
}

/* Optional: Set consistent spacing and alignment */
.post-description,
.post-price,
.post-location,
.post-time {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
}
.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}

.no-results-icon {
  width: 100px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 8px;
}

/* Style for the text */
.no-results-text {
  margin-top: 10px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: #ffffff; /* Grey darken-1 */
}
</style>
