<script setup>
import { ref, onMounted } from "vue";
import { useSavedProductsStore } from '@/stores/savedProducts';
import SidebarNav from "@/components/system/SidebarNav.vue";
import Navbar from "@/components/system/Navbar.vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { useAuthUserStore } from "@/stores/authUser.js";
import { supabase } from "@/utils/supabase.js"; // Import supabase client

// State
const { mobile } = useDisplay();
const drawerVisible = ref(!mobile.value);
const savedProductsStore = useSavedProductsStore(); // Access saved products store
const router = useRouter();
const userProfile = ref({});
const showPostForm = ref(false);
const activeTab = ref('posts');
const posts = ref([]);

// Get saved products from the store
const savedProducts = savedProductsStore.savedProducts;

// Access the Pinia store
const authUser = useAuthUserStore(); // Initialize the store
onMounted(async () => {
  console.log("Before fetching profile:", userProfile.value);

  try {
    // Fetch user data from auth
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("No active session found. Redirecting to login...");
      router.push("/login");
      return;
    }

    const userId = user.id;

    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image, bio, preferred_location, preferred_time")
      .eq("user_id", userId)
      .single();

    if (profileError) throw new Error(profileError.message);

    // If there's a profile image, fetch the signed URL
    if (profileData?.profile_image) {
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('profile-images')
        .createSignedUrl(profileData.profile_image, 60 * 60); // 1-hour expiration

      if (signedUrlError) {
        console.error("Error fetching signed URL for profile image:", signedUrlError.message);
      } else {
        profileData.profile_image = signedUrlData.signedUrl; // Update with signed URL
      }
    }

    userProfile.value = profileData || getDefaultProfile();
    
    // Fetch only posts belonging to the logged-in user (filtered by user_id)
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("id, item_name, price, description, location, time, type, image, is_sold")
      .eq("user_id", userId); // Ensure we fetch posts for the logged-in user only

    if (postError) throw new Error(postError.message);

    // Process posts and fetch signed URLs for each post image
    posts.value = await Promise.all(postData.map(async (post) => {
      if (post.image) {
        // Construct the path for the post image
        const { data: signedUrlData, error: signedUrlError } = await supabase
          .storage
          .from('post-images') // your bucket name
          .createSignedUrl(post.image, 60 * 60); // 1-hour expiration for signed URL

        if (signedUrlError) {
          console.error('Error fetching signed URL for post image:', signedUrlError.message);
        } else {
          post.image = signedUrlData.signedUrl; // Update the post image with the signed URL
        }
      }
      return post;
    }));

    // Sort posts with sold ones at the bottom
    posts.value = posts.value.sort((a, b) => {
      if (a.is_sold && !b.is_sold) return 1;  // Sold posts go to the bottom
      if (!a.is_sold && b.is_sold) return -1; // Unsold posts go to the top
      return 0; // No change for posts with the same `is_sold` status
    });

  } catch (err) {
    console.error("Unexpected error:", err);
  }
});


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

    // Check if an image is selected and ensure it's a valid File object
    if (newPost.value.image && newPost.value.image instanceof File) {
      const userFolder = `user_${userId}`; // Folder name for the user
      const filePath = `${userFolder}/${newPost.value.image.name}`; // Path inside the user’s folder

      // Upload the image to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('post-images')
        .upload(filePath, newPost.value.image);

      if (uploadError) throw new Error(uploadError.message);

      // Once the image is uploaded, update the post's image field with the file path
      newPost.value.image = filePath; // Update with the file path after successful upload
    } else {
      // Handle the case where no image is selected or file is invalid
      newPost.value.image = null; // Optionally set a default image or leave it null
    }

    // Insert the new post into the posts table
    const { error } = await supabase.from('posts').insert([{
      ...newPost.value,
      user_id: userId, // Ensure user_id is linked to the post
    }]);

    if (error) throw new Error(error.message);

    // Reset the form after successful submission
    newPost.value = {
      item_name: "",
      description: "",
      price: "",
      type: "",
      location: "",
      time: "",
      image: null,
    };

    // Close form and refresh posts
    togglePostForm();
    posts.value = await refreshPosts();
    console.log('Post created successfully!');
  } catch (error) {
    console.error('Error submitting post:', error.message);
  }
};

const showEditModal = ref(false);  // Modal visibility
const editedPost = ref({
  id: null,
  item_name: '',
  description: '',
  price: '',
  type: '',
  image: null
});
const deletePost = async (postId, imagePath) => {
  try {
    // Delete the post from the database
    const { error: deletePostError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (deletePostError) throw new Error(deletePostError.message);

    // Now delete the image from Supabase Storage
    if (imagePath) {
      const { error: deleteImageError } = await supabase
        .storage
        .from('post-images')
        .remove([imagePath]);

      if (deleteImageError) throw new Error(deleteImageError.message);
    }

    console.log("Post and image deleted successfully!");
    // Refresh the posts after deletion
    posts.value = await refreshPosts();
  } catch (error) {
    console.error('Error deleting post:', error.message);
  }
};

const editPost = (post) => {
  // Pre-fill the modal with post data
  editedPost.value = { ...post };
  showEditModal.value = true;
};

const submitEditPost = async () => {
  try {
    // Handle image upload if it's a new image
    if (editedPost.value.image instanceof File) {
      const userId = authUser.userData.id;
      const filePath = `user_${userId}/${editedPost.value.image.name}`;
      const { data, error: uploadError } = await supabase
        .storage
        .from('post-images')
        .upload(filePath, editedPost.value.image);

      if (uploadError) throw new Error(uploadError.message);
      editedPost.value.image = filePath;
    }

    // Update the post in the database
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        item_name: editedPost.value.item_name,
        description: editedPost.value.description,
        price: editedPost.value.price,
        type: editedPost.value.type,
        image: editedPost.value.image,
      })
      .eq('id', editedPost.value.id);

    if (updateError) throw new Error(updateError.message);

    // Close the modal and refresh the posts list
    showEditModal.value = false;
    posts.value = await refreshPosts();
    console.log('Post edited successfully!');
  } catch (error) {
    console.error('Error editing post:', error.message);
  }
};
const markAsSold = async (postId) => {
  try {
    // Fetch the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("No active user session found.");
      return;
    }

    const userId = user.id;

    // Mark the post as sold in the database
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ is_sold: true })
      .eq('id', postId)
      .eq('user_id', userId) // Ensure the user is the owner of the post
      .single();

    if (updateError) {
      console.error("Error marking post as sold:", updateError.message);
      return;
    }

    // Update the local posts list
    posts.value = posts.value.map(post => 
      post.id === postId ? { ...post, is_sold: true } : post
    );

    // Re-sort the posts after marking as sold
    posts.value = posts.value.sort((a, b) => {
      if (a.is_sold && !b.is_sold) return 1;  // Sold posts go to the bottom
      if (!a.is_sold && b.is_sold) return -1; // Unsold posts go to the top
      return 0; // No change for posts with the same `is_sold` status
    });

    console.log("Post marked as sold:", updatedPost);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

const toggleSave = async (post) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();    const isPostSaved = savedProductsStore.savedProducts.some(
      (p) => p.item_name === post.item_name
    );

    if (isPostSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', user.id) // Use logged-in user's ID
        .eq('post_id', post.id);

      if (error) {
        console.error('Error unsaving post:', error);
        return;
      }

      savedProductsStore.removeProduct(post.item_name); // Update store
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert([{ user_id: user.id, post_id: post.id }]);

      if (error) {
        console.error('Error saving post:', error);
        return;
      }

      savedProductsStore.addProduct(post); // Update store
    }
  } catch (error) {
    console.error('Error toggling save:', error);
  }
};

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

// Fetch posts from the database, sorting by 'is_sold' so sold items are at the bottom
const refreshPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', authUser.userData.id)  // Assuming you're fetching posts for the logged-in user
    .order('is_sold', { ascending: true });  // Sold posts appear last

  if (error) {
    console.error('Error refreshing posts:', error.message);
  }
  return data;
};

const isSaved = (post) => 
  savedProductsStore.savedProducts.some((p) => p.item_name === post.item_name);

const selectedPost = ref(null);
const isDialogOpen = ref(false);

const viewPostDetails = (post) => {
  selectedPost.value = post;
  isDialogOpen.value = true;
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

      <v-container fluid class="d-flex page-layout">
        <!-- Sidebar Navigation -->
        <SidebarNav v-model:drawer="drawerVisible" />

        <!-- Main Content -->
        <v-main class="main-content scroll-hidden mt-10 pt-12">
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
                    <strong>Preferred Location:</strong> {{ userProfile.preferred_location || "Not specified" }}<br>
                    <strong>Available Time:</strong> {{ userProfile.preferred_time || "Not specified" }}
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

          <div v-if="activeTab === 'posts'">
  <v-row>
    <v-col v-for="post in posts" :key="post.post_id" cols="12" md="4">
      <v-card :class="{ 'sold-overlay': post.is_sold }">
  <v-img :src="post.image" aspect-ratio="1.5"></v-img>
  <v-card-title>{{ post.item_name }}</v-card-title>
  <v-card-subtitle>₱{{ post.price }}</v-card-subtitle>
  <v-card-text class="card-content">
    <p>{{ post.description }}</p>
    <p><strong>Type:</strong> {{ post.type }}</p>
    <!-- "Sold Out" text centered if the post is sold -->
    <p v-if="post.is_sold" class="sold-out-text">Sold</p>
  </v-card-text>

    <v-card-actions>
      <!-- Options Menu for Edit/Delete -->
      <v-menu v-if="!post.is_sold" offset-y transition="slide-y-reverse-transition" bottom>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="editPost(post)">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deletePost(post.id, post.image)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn v-if="!post.is_sold" @click="markAsSold(post.id)" color="green">
  Mark as Sold
</v-btn>

    </v-card-actions>
  </v-card>

  <!-- Sold Overlay -->
  <v-overlay v-if="post.is_sold" absolute z-index="1" class="sold-overlay">
    <v-row justify="center" align="center" class="sold-text">
      SOLD
    </v-row>
  </v-overlay>
</v-col>

  </v-row>

  <!-- Edit Post Modal -->
  <v-dialog v-model="showEditModal" persistent max-width="600px">
    <v-card>
      <v-card-title>Edit Post</v-card-title>
      <v-card-text>
        <v-text-field v-model="editedPost.item_name" label="Item Name"></v-text-field>
        <v-textarea v-model="editedPost.description" label="Description"></v-textarea>
        <v-text-field v-model="editedPost.price" label="Price" type="number"></v-text-field>
        <v-text-field v-model="editedPost.type" label="Type"></v-text-field>
        <v-file-input v-model="editedPost.image" label="Upload Image" accept="image/*"></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showEditModal = false" color="red">Cancel</v-btn>
        <v-btn @click="submitEditPost" color="green">Save Changes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>

<div v-else-if="activeTab === 'saved'">
  <!-- Display message if no saved items -->
  <p v-if="savedProducts.length === 0" class="text-center">You have no saved items.</p>

  <!-- Post Cards -->
  <v-container class="post-section mt-5" v-else>
    <v-row justify="start" dense>
      <v-col v-for="(post, index) in savedProducts" :key="index" cols="12" sm="6" md="4">
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
      <v-card-title class="post-detail-header">
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
            <div class="post-seller">
              <strong>Seller:</strong> {{ selectedPost?.first_name }} {{ selectedPost?.last_name }}
            </div>
            <div class="post-description">
              <h3>Description</h3>
              <p>{{ selectedPost?.description }}</p>
            </div>
            <div class="post-price">
              <h3>Price</h3>
              <p>₱{{ selectedPost?.price }}</p>
            </div>
            <div>
              <p><strong>Preferred Location:</strong> {{ selectedPost?.preferred_location }}</p>
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
</div>

        </v-main>
      </v-container>

<v-bottom-navigation app>
  <v-tooltip :location="'top'" :origin="'center'" no-click-animation>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" @click="togglePostForm" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <div>Create a Post</div>
  </v-tooltip>
</v-bottom-navigation>

      <!-- Post Form (Floating Form) -->  
      <v-dialog v-model="showPostForm" max-width="500px" persistent>
<v-card class="pa-4" rounded="xl">
          <v-btn icon @click="togglePostForm" class="ml-auto">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    <v-card-title>
      Create New Post
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitPost">
        <v-text-field
          v-model="newPost.item_name"
          label="Item Name"
          required
          variant="outlined"
          rounded="lg"
        ></v-text-field>
        <v-textarea
          v-model="newPost.description"
          label="Description"
          required
          variant="outlined"
          rounded="lg"
        ></v-textarea>
        <v-text-field
          v-model="newPost.price"
          label="Price"
          type="number"
          required
          variant="outlined"
          rounded="lg"
        ></v-text-field>
        <v-select
          v-model="newPost.type"
          :items="['For Sale', 'For Trade']"
          label="Type"
          required
          variant="outlined"
          rounded="lg"
        ></v-select>
        <v-file-input
          v-model="newPost.image"
          label="Product Image"
          accept="image/*"
          required
          variant="outlined"
          rounded="lg"
        ></v-file-input>
        <v-btn type="submit" color="green" class="mt-4" elevation="2" block rounded="lg">
          Post
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.page-layout {
  display: flex;
  height: 100vh; /* Full viewport height to match sidebar */
  overflow: hidden; /* Prevent parent container scrolling */
}

/* Hide scrollbar for main content */
.main-content::-webkit-scrollbar {
  display: none; /* For Webkit browsers */
}

.main-content {
  scrollbar-width: none; /* For Firefox */
}

.custom-card {
  border-radius: 16px;
}

.main-content {
  flex: 1;
  overflow-y: auto; /* Allow scrolling within the main content */
  padding: 20px;
}

.sold-out-text {
  position: absolute; 
  top: 30%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  font-size: 3.5rem; 
  font-weight:bolder; 
  color: rgba(14, 2, 2, 0.541); 
  text-transform: uppercase; 
  z-index: 1; 
}

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
opacity: 0.5;
}

.sold-text {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
}

.profile-avatar img {
  object-fit: cover; /* This ensures the image is properly cropped to fill the space without stretching */
  width: 100%;       /* Make the image fill the container */
  height: 100%;      /* Make the image fill the container */
}

</style>
