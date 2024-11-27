<script setup>
import { ref, onMounted } from "vue";
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { useAuthUserStore } from "@/stores/authUser.js";
import { supabase } from "@/utils/supabase.js"; // Import supabase client

// State
const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const router = useRouter();
const userProfile = ref({});
const showPostForm = ref(false);
const activeTab = ref(0);
const posts = ref([]);

// Access the Pinia store
const authUser = useAuthUserStore(); // Initialize the store

// Initialize session and fetch user profile & posts
onMounted(async () => {
  console.log("Before fetching profile:", userProfile.value);
  const isLoggedIn = await authUser.isAuthenticated(); // Use the store method
  if (!isLoggedIn) {
    console.error("No active session found. Redirecting to login...");
    router.push("/login");
    return;
  }

  try {
    // Get the current user's ID from the store
    const userId = authUser.userData.id;

    // Fetch user profile using user_id from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image, bio, preferred_location, preferred_time")
      .eq("user_id", userId) // Use userId from the store
      .limit(1); // Ensure only one row is returned

    if (profileError) throw new Error(profileError.message);

    // Set user profile or fallback to default profile if no data
    userProfile.value = profileData && profileData.length ? profileData[0] : getDefaultProfile();

    // Fetch user posts
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId); // Use userId from the store

    if (postError) throw new Error(postError.message);
    posts.value = postData;
  } catch (error) {
    console.error("Error:", error.message);
  }
});

// Default user profile if not found
const getDefaultProfile = () => ({
  first_name: "Unknown",
  last_name: "User",
  bio: "No bio available.",
  preferred_location: "Not specified",
  preferred_time: "Not specified",
  profile_image: "/default-avatar.jpg",
});

// Get user initials for avatar
const getInitials = (name) => {
  if (!name) return "??";
  const names = name.split(" ");
  return names.map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);
};

// Toggle Post Form visibility
const togglePostForm = () => (showPostForm.value = !showPostForm.value);

// Submit New Post
const newPost = ref({
  item_name: "",
  description: "",
  price: "",
  type: "",
  location: "",
  time: "",
  image: null,
});

const submitPost = async () => {
  try {
    const userId = authUser.userData.id; // Get userId from the store
    const { error } = await supabase.from("posts").insert([ 
      {
        ...newPost.value,
        user_id: userId, // Ensure user_id is linked to the post
      },
    ]);

    if (error) throw new Error(error.message);

    // Close form and refresh posts
    togglePostForm();
    posts.value = await refreshPosts();
    console.log("Post created successfully!");
  } catch (error) {
    console.error("Error submitting post:", error.message);
  }
};

// Refresh user posts
const refreshPosts = async () => {
  const userId = authUser.userData.id; // Get userId from the store
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId); // Refresh posts for current user

  if (error) throw new Error(error.message);
  return data;
};

// Logout function
const logout = async () => {
  try {
    await supabase.auth.signOut();
    authUser.$reset(); // Reset the store
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <!-- Top Navbar -->
      <Navbar />

      <v-container fluid class="d-flex">
        <!-- Sidebar Navigation -->
        <SidebarNav v-model:drawer="drawerVisible" />

        <!-- Main Content -->
        <v-main class="mt-10 pt-12">
          <v-container class="profile-container pb-11">
            <!-- Profile Section -->
            <v-row>
              <!-- Profile Image Section -->
              <v-col cols="12" md="4" class="d-flex justify-center align-center mb-4">
                <v-avatar size="200" class="profile-avatar">
                  <template v-if="userProfile?.profile_image">
                    <img :src="userProfile.profile_image" alt="pfp" />
                  </template>
                  <template v-else>
                    <span class="initials">
                      {{ getInitials(userProfile.first_name + ' ' + userProfile.last_name || "Unknown User") }}
                    </span>
                  </template>
                </v-avatar>
              </v-col>

              <!-- Profile Info Section -->
              <v-col cols="12" md="8">
                <div class="profile-details">
                  <!-- User Name -->
                  <br>
                  <h2 class="mb-2">{{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}</h2>
                  
                  <!-- User Bio -->
                  <p class="text-muted mb-4">{{ userProfile.bio || "No bio available." }}</p>

                  <!-- Preferred Locations -->
                  <div class="mb-3">
                    <br>
                    <strong>Preferred Locations:</strong> {{ userProfile.preferred_location || "Not specified" }}<br>
                    <strong>Available Times:</strong> {{ userProfile.preferred_time || "Not specified" }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-divider :thickness="1" class="border-opacity-50" color="black"></v-divider>

          <!-- Tabs Section -->
          <v-tabs v-model="activeTab" grow class="mb-4">
            <v-tab value="posts" prepend-icon="mdi-grid">Posts</v-tab>
            <v-tab value="saved" prepend-icon="mdi-bookmark">Saved</v-tab>
          </v-tabs>

          <!-- Tab Content -->
          <div v-if="activeTab === 'posts'">
            <!-- Posts Grid -->
            <v-row>
              <v-col v-for="post in posts" :key="post.post_id" cols="12" md="4">
                <v-card :class="{ 'sold-overlay': post.is_sold }">
                  <v-img :src="post.image" aspect-ratio="1.5"></v-img>
                  <v-card-title>{{ post.item_name }}</v-card-title>
                  <v-card-subtitle>₱{{ post.price }}</v-card-subtitle>
                  <v-card-text>
                    <p>{{ post.description }}</p>
                    <p><strong>Type:</strong> {{ post.type }}</p>
                    <p v-if="post.is_sold" class="text-danger">Sold Out</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      v-if="!post.is_sold"
                      @click="markAsSold(post.post_id)"
                      color="green"
                    >
                      Mark as Sold
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div v-else-if="activeTab === 'saved'">
            <v-row>
              <v-col cols="12">
                <p class="text-center">Saved items will appear here.</p>
              </v-col>
            </v-row>
          </div>
        </v-main>
      </v-container>

      <!-- Bottom Navigation with Plus Button -->
      <v-bottom-navigation app>
        <v-btn @click="togglePostForm" color="primary">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <!-- Post Form (Floating Form) -->
      <v-dialog v-model="showPostForm" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            Create New Post
            <v-btn icon @click="togglePostForm" class="ml-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitPost">
              <v-text-field
                v-model="newPost.item_name"
                label="Item Name"
                required
              ></v-text-field>
              <v-textarea
                v-model="newPost.description"
                label="Description"
                required
              ></v-textarea>
              <v-text-field
                v-model="newPost.price"
                label="Price"
                type="number"
                required
              ></v-text-field>
              <v-select
                v-model="newPost.type"
                :items="['For Sale', 'For Trade']"
                label="Type"
                required
              ></v-select>
              <v-file-input
                v-model="newPost.image"
                label="Product Image"
                required
              ></v-file-input>
              <v-btn type="submit" color="green">Post</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.profile-avatar {
  border: 5px solid #4caf50;
  background-color: #e0f2f1;
  font-size: 50px;
  font-weight: bold;
  color: #00695c;
  display: flex;
  justify-content: center;
  align-items: center;
}
.initials {
  text-transform: uppercase;
}
.sold-overlay {
  background: rgba(255, 255, 255, 0.607);
  position: relative;
  z-index: 1;
}
</style>
