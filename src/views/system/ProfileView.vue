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
const { savedProducts, removeProduct } = useSavedProductsStore();
const router = useRouter();
const userProfile = ref({});
const showPostForm = ref(false);
const activeTab = ref('posts');
const posts = ref([]);
const userEmail = ref('');

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
    const email = user.email; // Store the email

    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image, preferred_location, preferred_time")
      .eq("user_id", userId)
      .single();

// Handle errors
if (profileError) {
  console.error("Error fetching profile:", profileError);
  return;
}

userEmail.value = email;
// Handle errors
if (profileError) {
  console.error("Error fetching profile:", profileError);
  return;
}

userEmail.value = email;

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


const newPost = ref({
  item_name: "",
  description: "",
  price: "",
  type: "",
  location: "",
  time: "",
  image: null,
});

const showSuccessDialog = ref(false);  // Controls the visibility of the success dialog
const successMessage = ref('');  // The message to display in the success dialog

// Submit New Post
const submitPost = async () => {
  try {
    const userId = authUser.userData.id;

    if (newPost.value.image && newPost.value.image instanceof File) {
      const userFolder = `user_${userId}`;
      const filePath = `${userFolder}/${newPost.value.image.name}`;

      // Upload the image to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('post-images')
        .upload(filePath, newPost.value.image);

      if (uploadError) throw new Error(uploadError.message);

      newPost.value.image = filePath;
    } else {
      newPost.value.image = null;
    }

    // Insert the new post into the posts table
    const { error } = await supabase.from('posts').insert([{
      ...newPost.value,
      user_id: userId,
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

    // Set success message and show the dialog
    successMessage.value = 'Item successfully posted!';
    showSuccessDialog.value = true;

    // Optionally refresh posts here
    posts.value = await refreshPosts();
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

const showEditSuccessDialog = ref(false);  // Controls success dialog visibility
const editSuccessMessage = ref(''); // Message for the success dialog

// Function to delete a post
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

// Function to edit a post
const editPost = (post) => {
  // Pre-fill the modal with post data
  editedPost.value = { ...post };
  showEditModal.value = true;
};

// Submit edited post
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

    // Close the modal and show success dialog
    showEditModal.value = false;
    editSuccessMessage.value = 'Post edited successfully!';
    showEditSuccessDialog.value = true; // Show success dialog

    // Refresh posts
    posts.value = await refreshPosts();
    console.log('Post edited successfully!');
  } catch (error) {
    console.error('Error editing post:', error.message);
  }
};
const markAsSold = async (postId) => {
  try {
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
      .eq('user_id', userId)
      .single();

    if (updateError) {
      console.error("Error marking post as sold:", updateError.message);
      return;
    }

    // Update the local posts list
    posts.value = posts.value.map(post =>
      post.id === postId ? { ...post, is_sold: true } : post
    );

    // Update savedProducts list (sync with DB)
    savedProductsStore.savedProducts = savedProductsStore.savedProducts.map(post =>
      post.id === postId ? { ...post, is_sold: true } : post
    );

    // Re-sort the posts after marking as sold
    posts.value = posts.value.sort((a, b) => {
      if (a.is_sold && !b.is_sold) return 1;
      if (!a.is_sold && b.is_sold) return -1;
      return 0;
    });

    console.log("Post marked as sold:", updatedPost);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

const unmarkAsSold = async (postId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("No active user session found.");
      return;
    }
    const userId = user.id;

    // Unmark the post as sold in the database
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ is_sold: false })
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (updateError) {
      console.error("Error unmarking post as sold:", updateError.message);
      return;
    }

    // Update the local posts list
    posts.value = posts.value.map(post =>
      post.id === postId ? { ...post, is_sold: false } : post
    );

    // Update savedProducts list (sync with DB)
    savedProductsStore.savedProducts = savedProductsStore.savedProducts.map(post =>
      post.id === postId ? { ...post, is_sold: false } : post
    );

    // Re-sort the posts after unmarking as sold
    posts.value = posts.value.sort((a, b) => {
      if (a.is_sold && !b.is_sold) return 1;
      if (!a.is_sold && b.is_sold) return -1;
      return 0;
    });

    console.log("Post unmarked as sold:", updatedPost);
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

const redirectToFacebookProfile = (post) => {
  if (post.fb_link) {
    window.open(post.fb_link, '_blank');
  } else {
    alert('Facebook profile link is not available for this user.');
  }
};

</script>


<template>
  <v-responsive>
    <v-app>
      <!-- Top Navbar -->
      <Navbar />

      <v-container fluid class="page-layout">
  <SidebarNav :class="{ 'sidebar-closed': !drawerVisible, 'sidebar-open': drawerVisible }" v-model:drawer="drawerVisible" />
  <v-main :class="{ 'main-content-expanded': !drawerVisible, 'main-content': drawerVisible }">
    <!-- Content -->
    <v-container class="profile-container pb-15 d-flex justify-center align-center">
  <!-- Profile Section -->
  <v-row justify="center" align="center" class="w-100">
    <!-- Profile Image Section -->
    <v-col cols="12" md="3" class="d-flex justify-center mb-2">
      <v-avatar size="200" class="profile-avatar">
        <template v-if="userProfile?.profile_image">
          <img :src="userProfile.profile_image" />
        </template>
        <template v-else>
          <span class="initials">
            {{ getInitials(userProfile.first_name + ' ' + userProfile.last_name || "Unknown User") }}
          </span>
        </template>
      </v-avatar>
    </v-col>
    <v-col cols="12" md="5" class="d-flex justify-center align-center">
  <div class="profile-details text-center theme--dark">
    <!-- User Name -->
    <h2 class="mb-2" style="color: white;">{{ userProfile.first_name + ' ' + userProfile.last_name || "Unknown User" }}</h2>
    <!-- User Email -->
    <p class="mb-2" style="color: white;">{{ userEmail || "Email not available" }}</p>
  </div>
</v-col>
  </v-row>
</v-container>

          <v-divider :thickness="1.5" class="border-opacity-100" color="white"></v-divider>
<!-- Tabs Section -->
<v-tabs 
  v-model="activeTab" 
  grow 
  class="mb-4 small-tabs white-tabs"
>
  <v-tab value="posts" prepend-icon="mdi-grid">Posts</v-tab>
  <v-tab value="saved" prepend-icon="mdi-bookmark">Saved</v-tab>
</v-tabs>

          <div v-if="activeTab === 'posts'">
            <v-row class="pt-8 pb-12">
  <v-col v-for="post in posts" :key="post.post_id" cols="12" md="3">
    <v-card :class="{ 'sold-overlay pt-12': post.is_sold }" class="card">
      <v-img :src="post.image" aspect-ratio="1.5" class="card-image"></v-img>
      <v-card-title class="card-title">{{ post.item_name }}</v-card-title>
      <v-card-subtitle class="card-price">₱{{ post.price }}</v-card-subtitle>
      <v-card-text class="card-content">
        <p class="card-description">{{ post.description }}</p>
        <p><strong>Type:</strong> {{ post.type }}</p>
        <p v-if="post.is_sold" class="sold-out-text">Sold Out</p>
      </v-card-text>

      <v-card-actions class="card-actions">
        <v-menu offset-y transition="slide-y-reverse-transition" bottom>
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-if="!post.is_sold" @click="editPost(post)">
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
        <v-btn v-if="post.is_sold" @click="unmarkAsSold(post.id)" color="orange">
          Set as Available
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</v-row>

    <!-- Edit Post Modal -->
    <v-dialog v-model="showEditModal" persistent max-width="600px">
      <v-card class="pa-4" rounded="xl" style="border: 4px solid #210440;" color="purple-darken-4">
        <v-card-title>Edit Post</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedPost.item_name" label="Item Name" variant="outlined" rounded="lg"></v-text-field>
          <v-textarea v-model="editedPost.description" label="Description" variant="outlined" rounded="lg"></v-textarea>
          <v-text-field v-model="editedPost.price" label="Price" type="number" variant="outlined" rounded="lg"></v-text-field>
          <v-text-field v-model="editedPost.type" label="Type" variant="outlined" rounded="lg"></v-text-field>
          <v-file-input v-model="editedPost.image" label="Upload Image" accept="image/*" variant="outlined" rounded="lg"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showEditModal = false" color="red">Cancel</v-btn>
          <v-btn @click="submitEditPost" color="green-lighten-1">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog for Editing Post -->
    <v-dialog v-model="showEditSuccessDialog" max-width="500px">
      <v-card class="pa-4" color="pink-accent-1" dark>
        <v-card-title>
          Success
        </v-card-title>
        <v-card-text>
          <span>{{ editSuccessMessage }}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="showEditSuccessDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>

<div v-else="activeTab === 'saved'">
  
  <!-- Display message if no saved items -->
  <p v-if="savedProducts.length === 0" class="text-center">You have no saved items.</p>
<!-- Saved Tab Template -->
<v-container class="post-section mt-5 pb-12" v-else>
  <v-row justify="start" dense>
    <v-col v-for="(post, index) in savedProducts" :key="index" cols="10" sm="6" md="3">
      <v-card class="post-card1 position-relative">

        <!-- Sold Overlay -->
        <div v-if="post.is_sold" class="sold-overlay1">
          <div class="sold-text1">SOLD OUT</div>
        </div>

        <!-- Image Section -->
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
      <v-card-title class="post-detail-header d-flex align-center">
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
              <v-btn class="custom-button mx-2" @click="toggleSave(selectedPost)">
                <v-icon left>mdi-bookmark-outline</v-icon>
                {{ isSaved(selectedPost) ? "Unsave" : "Save" }}
              </v-btn>
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

</div>

        </v-main>
      </v-container>

      <v-bottom-navigation app class="position-fixed fixed-bottom">
  <v-tooltip :location="'top'" :origin="'center'" no-click-animation>
    <template v-slot:activator="{ props }">
      <v-btn 
        v-bind="props" 
        @click="togglePostForm" 
        class="custom-post-btn"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <div>Create a Post</div>
  </v-tooltip>
</v-bottom-navigation>

    <!-- Post Form (Floating Form) -->
    <v-dialog v-model="showPostForm" max-width="500px" persistent>
      <v-card class="pa-4" rounded="xl" style="border: 4px solid #210440;" color="purple-darken-4">
        <v-btn icon @click="togglePostForm" class="ml-auto hover-btn">
          <v-icon class="hover-icon">mdi-close</v-icon>
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
            <v-btn type="submit" color="deep-purple-accent-2" class="mt-4" elevation="2" block rounded="lg">
              Post
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="500px">
      <v-card class="pa-4" color="pink-accent-1" dark>
        <v-card-title>
          Success
        </v-card-title>
        <v-card-text>
          <span>{{ successMessage }}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="showSuccessDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.page-layout {
  display: flex;
  overflow-y: auto;
  padding-inline: 80px;
  background-color: #210440;
}

.main-content {
  transition: margin-left 0.5s ease; /* Smooth transition */
}

.main-content-expanded {
  transition: margin-left 0.5s ease;
}

.card {
  height:100%;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s ease;
  border: 1.5px solid #B43E8F;
  margin-bottom: 5px;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  border-radius: 8px;
  margin-top: 15px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #210440;
}

.card-price {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
}

.card-description {
  color: #000000;
  margin-bottom: 8px;
}

.card-actions {
  display:inline-table;
  justify-content: space-between;
  align-items: center;
  padding-top: 0px;
}

.hover-icon {
  color: black; /* Default color */
  transition: color 0.3s ease; /* Smooth transition */
}

.hover-icon:hover {
  color: white; /* Color on hover */
}

.hover-btn:hover {
  background-color: #210440; /* Replace with your desired hover color */
  transition: background-color 0.3s ease; /* Smooth transition effect */
}

.custom-card {
  border-radius: 16px;
}

.close-btn {
  color: rgb(105, 53, 53);
  width: 5%;
  height: 35px;
}

.sold-out-text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: 700;
  color: rgb(1, 0, 0);
  text-transform: uppercase;
  text-align: center;
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
  margin-left: 100px;
}

.sold-overlay {
opacity: 0.5;
}

.profile-avatar img {
  object-fit: cover; /* This ensures the image is properly cropped to fill the space without stretching */
  width: 100%;       /* Make the image fill the container */
  height: 100%;      /* Make the image fill the container */
}

.post-description,
.post-price,
.post-location,
.post-time {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
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
  margin-top: 25px;
  width: 100%; /* Responsive width */
  height: 350px; /* Adjusted height */
  object-fit:cover; /* Keeps image proportions while cropping excess */
  border-radius: 20px; /* Optional: Rounded corners */
}

.post-card1:hover {
  transform: scale(1.03);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.post-card1 {
  border-radius: 10px;
  height: 22rem;
  overflow: hidden;
  transition: 0.3s ease;
  margin: 5px;
  border: 2px solid #B43E8F;
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
/* Overlay for Sold Out */
.sold-overlay1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent gray */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above the card content */
}

/* Overlay text style */
.sold-text1 {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}

/* Post Details Section */
.post-details {
  padding: 15px;
}

.post-details-2 {
  padding: 15px;
  margin-top: 25px;
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

.post-description{
  color:#000000; 
}

.post-type {
  font-size: 0.9rem;
  color: #000000;
  margin-top: 4px;
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

.text-color {
  color: #000000; /* Example: Dark Gray for Text */
}

.icon-color {
  font-size: 15px;
  color: hsl(0, 0%, 0%); /* Example: Bright Orange for Icons */
}

/* Button Styling */
.custom-button {
  background-color: #5f0196;
  color: white;
  font-weight: bold;
}

.custom-button:hover {
  background-color: #3700b3;
}

.position-fixed {
  background-color: #210440; /* Dark purple background for the navigation */
}

.custom-post-btn {
  background-color: #B43E8F !important; /* Vibrant pink for the mdi-plus button */
  color: white !important; /* White icon color */
  width: 56px; /* Standard floating action button size */
  height: 56px;
}

.custom-post-btn:hover {
  background-color: #9c357a !important; /* Slightly darker shade on hover */
}

.custom-post-btn .v-icon {
  font-size: 24px; /* Adjust icon size if necessary */
}

.white-tabs {
  background-color: #210440; /* Set tabs background to white */
  border-radius: 8px; /* Optional: Rounded corners */
}

.white-tabs .v-tab {
  color: #ffff; /* Set tab text to black for contrast */
  font-weight: bold; /* Optional: Make text bold */
}
</style>
