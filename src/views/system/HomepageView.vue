<script setup>
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import { ref, onMounted } from "vue";
import supabase from "@/utils/supabase.js";
import { useDisplay } from "vuetify";

// Sidebar visibility
const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);

// Post data
const posts = ref([]);
const selectedPost = ref(null);
const isModalOpen = ref(false);

// Fetch posts from Supabase
async function fetchPosts() {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) {
    console.error("Error fetching posts:", error);
  } else {
    posts.value = data;
  }
}

// Open modal for post details
function openModal(post) {
  selectedPost.value = post;
  isModalOpen.value = true;
}

// Close modal
function closeModal() {
  isModalOpen.value = false;
  selectedPost.value = null;
}

// Fetch posts on load
onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <v-app>
    <Navbar />
    <v-container fluid class="d-flex">
      <SidebarNav v-model:drawer="drawerVisible" />
      <v-main>
        <!-- Banner -->
        <v-banner color="primary" dark class="mb-6">
          <template #avatar>
            <v-icon size="40">mdi-shopping</v-icon>
          </template>
          <v-banner-text>
            <h2 class="text-h5 mb-0">Welcome to STASH!</h2>
            <p>The ultimate trade and sell hub for Caraga State University.</p>
          </v-banner-text>
        </v-banner>

        <!-- Posts Grid -->
        <v-row dense>
          <v-col
            v-for="post in posts"
            :key="post.post_id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card :class="{ 'gray-filter': post.is_sold }">
              <v-img :src="post.image" alt="Post Image" height="200"></v-img>
              <v-card-title>{{ post.item_name }}</v-card-title>
              <v-card-subtitle>₱{{ post.price }}</v-card-subtitle>
              <v-card-actions>
                <v-btn color="primary" @click="openModal(post)">
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal for Post Details -->
        <v-dialog v-model="isModalOpen" max-width="500">
          <v-card>
            <v-img :src="selectedPost?.image" alt="Post Image" height="300"></v-img>
            <v-card-title>{{ selectedPost?.item_name }}</v-card-title>
            <v-card-subtitle>₱{{ selectedPost?.price }}</v-card-subtitle>
            <v-card-text>
              <p><strong>Description:</strong> {{ selectedPost?.description }}</p>
              <p><strong>Location:</strong> {{ selectedPost?.location }}</p>
              <p><strong>Time:</strong> {{ selectedPost?.time }}</p>
              <p><strong>Type:</strong> {{ selectedPost?.type }}</p>
              <p v-if="selectedPost?.is_sold" class="text-error">
                <strong>Status:</strong> Sold Out
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" text @click="closeModal">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped>
.gray-filter {
  filter: grayscale(100%);
}
</style>
