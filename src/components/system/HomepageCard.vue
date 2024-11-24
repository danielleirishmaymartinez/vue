<script setup>
const onCardClick = (cardName) => {
  alert(`${cardName} clicked!`);
};
</script>

<template>
  <v-container class="custom-container">
    <v-card variant="outlined" class="main-card">
    </v-card>

    <v-container>
      <v-row class="custom-row">
        <!-- Card 1 -->
        <v-col cols="10" md="4">
          <v-card 
            class="mx-auto clickable-card" 
            max-width="500"
            @click="onCardClick('Card 1')"
          >
            <v-img
              class="align-end text-white"
              height="200"
              src=""
              cover
            >
              <v-card-title></v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
              Title
            </v-card-subtitle>

            <v-card-text>
              <div>Caption</div>
              <div>Caption</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text="View"></v-btn>
              <v-btn color="orange" text="Contact Seller"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Card 2 -->
        <v-col cols="10" md="4">
          <v-card 
            class="mx-auto clickable-card" 
            max-width="500"
            @click="onCardClick('Card 2')"
          >
            <v-img
              class="align-end text-white"
              height="200"
              src=""
              cover
            >
              <v-card-title></v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
              Title
            </v-card-subtitle>

            <v-card-text>
              <div>Caption</div>
              <div>Caption</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text="View"></v-btn>
              <v-btn color="orange" text="Contact Seller"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Card 3 -->
        <v-col cols="10" md="4">
          <v-card 
            class="mx-auto clickable-card" 
            max-width="500"
            @click="onCardClick('Card 3')"
          >
            <v-img
              class="align-end text-white"
              height="200"
              src=""
              cover
            >
              <v-card-title></v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
              Title
            </v-card-subtitle>

            <v-card-text>
              <div>Caption</div>
              <div>Caption</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text="View"></v-btn>
              <v-btn color="orange" text="Contact Seller"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Card 4 -->
        <v-col cols="10" md="4">
          <v-card 
            class="mx-auto clickable-card" 
            max-width="500"
            @click="onCardClick('Card 4')"
          >
            <v-img
              class="align-end text-white"
              height="200"
              src=""
              cover
            >
              <v-card-title></v-card-title>
            </v-img>

            <v-card-subtitle class="pt-4">
              Title
            </v-card-subtitle>

            <v-card-text>
              <div>Caption</div>
              <div>Caption</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text="View"></v-btn>
              <v-btn color="orange" text="Contact Seller"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.main-card {
  width: 105%;
  height: 400px;
}

.custom-container {
  margin-left: 20px; 
  margin-right: 20px; 
}

.blank-row {
  height: 50px;
}

.text-center {
  text-align: center;
}

.text-caption {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.clickable-card:hover {
  transform: scale(1.05); 
}

.v-card-title, .v-card-subtitle {
  font-weight: bold;
}
</style>
