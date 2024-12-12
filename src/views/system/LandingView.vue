<template>

    <!-- About Us Section -->
    <v-container fluid class="about py-5">
      <v-container class="py-5">
        <v-row align="center">
          <!-- Text Content -->
          <v-col cols="12" xl="7">
            <div>
              <h4 class="text-primary font-weight-bold">About Us</h4>
              <h1 class="display-5 mb-4 font-weight-bold">
                Meet our company, don’t miss the opportunity
              </h1>
              <p class="mb-4 text-secondary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum
                velit temporibus repudiandae ipsa, eaque perspiciatis cumque
                incidunt tenetur sequi reiciendis. Join us and discover
                something amazing!
              </p>
            </div>
          </v-col>
          <!-- Image Content -->
          <v-col cols="12" xl="5">
            <div class="position-relative overflow-hidden">
              <v-img
                src="img/about-2.png"
                alt="Main About Us Image"
                class="rounded w-100 shadow-lg"
              />
              <v-img
                src="img/about-3.png"
                alt="Overlay Image 1"
                max-width="120"
                max-height="120"
                class="position-absolute overlay-img overlay-img-1"
              />
              <v-img
                src="img/about-4.png"
                alt="Overlay Image 2"
                max-width="100"
                max-height="100"
                class="position-absolute overlay-img overlay-img-2"
              />
              <v-img
                src="img/about-5.jpg"
                alt="Bottom Image"
                class="rounded w-100 shadow-sm mt-3"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

      <!-- Features Section -->
      <v-container fluid class="feature pb-5">
        <v-container class="pb-5">
          <v-row justify="center" class="text-center pb-5">
            <v-col cols="12" lg="8">
              <div>
                <h4 class="text-primary">Our Features</h4>
                <h1 class="display-5 mb-4">Connecting businesses, ideas, and people for greater impact.</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur adipisci facilis cupiditate recusandae aperiam temporibus corporis itaque quis facere, numquam, ad culpa deserunt sint dolorem autem obcaecati, ipsam mollitia hic.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-row class="g-4">
            <v-col cols="12" md="6" xl="3" v-for="(feature, index) in features" :key="index">
              <div class="feature-item p-4">
                <div class="feature-icon p-4 mb-4">
                  <v-icon color="primary" large :size="48">{{ feature.icon }}</v-icon>
                </div>
                <h4>{{ feature.title }}</h4>
                <p class="mb-4">{{ feature.description }}</p>
                <v-btn color="primary" rounded>{{ feature.cta }}</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
  
      <!-- Team Section -->
      <div class="container-fluid team pb-5">
        <div class="container pb-5">
          <div class="text-center mx-auto pb-5 wow fadeInUp" style="max-width: 800px;">
            <h4 class="text-primary">Our Team</h4>
            <h1 class="display-5 mb-4">Meet Our Advisers</h1>
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div class="row g-4">
            <div
              v-for="(member, index) in teamMembers"
              :key="index"
              class="col-md-6 col-lg-6 col-xl-3 wow fadeInUp"
              :data-wow-delay="`${0.2 * (index + 1)}s`"
            >
              <div class="team-item shadow rounded">
                <div class="team-img">
                  <img :src="member.img" class="img-fluid rounded-top" :alt="member.name" />
                </div>
                <div class="team-title bg-light p-3 text-center">
                  <h4 class="mb-0">{{ member.name }}</h4>
                  <p class="mb-0 text-muted">{{ member.role }}</p>
                </div>
                <div class="team-icon d-flex justify-content-center p-3 bg-white">
                  <a
                    v-for="(link, platform) in member.social"
                    :key="platform"
                    class="btn btn-primary btn-sm-square rounded-circle me-3"
                    :href="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i :class="`fab fa-${platform}`"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Footer Section -->
      <footer class="container-fluid footer py-5 bg-dark text-white">
        <div class="container py-5 border-start-0 border-end-0">
          <div class="row g-5">
            <div class="col-md-6 col-lg-6 col-xl-4">
              <h4 class="text-white"><i class="fas fa-search-dollar me-3"></i>Stocker</h4>
              <p>Dolor amet sit justo amet elitr...</p>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-3">
              <h4 class="text-white mb-4">Contact Info</h4>
              <div v-for="(info, key) in contactInfo" :key="key" class="d-flex align-items-center mb-3">
                <i :class="info.icon + ' text-primary me-3'"></i>
                <p class="text-white mb-0">{{ info.text }}</p>
              </div>
              <div class="d-flex">
                <a
                  v-for="(link, platform) in socialLinks"
                  :key="platform"
                  class="btn btn-primary btn-sm-square rounded-circle me-3"
                  :href="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i :class="`fab fa-${platform}`"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  </template>
  
  <script>
  export default {
    data() {
      return {
        features: [
          { icon: "mdi-chart-line", title: "Global Management", description: "Lorem ipsum dolor sit amet...", cta: "Learn More" },
          { icon: "mdi-bank", title: "Corporate Banking", description: "Lorem ipsum dolor sit amet...", cta: "Learn More" },
          { icon: "mdi-file-document", title: "Asset Management", description: "Lorem ipsum dolor sit amet...", cta: "Learn More" },
          { icon: "mdi-hand-coin", title: "Investment Bank", description: "Lorem ipsum dolor sit amet...", cta: "Learn More" },
        ],
        teamMembers: [
          {
            name: "Danielle Irish May Martinez",
            role: "Web Developer",
            img: "img/team-1.jpg",
            social: { facebook: "https://www.facebook.com/danielle.irish.may", linkedin: "", instagram: "https://www.instagram.com/izzdimme/" },
          },
          {
            name: "Janine T. Cosares",
            role: "System Analyst",
            img: "img/team-3.jpg",
            social: { facebook: "https://www.facebook.com/janine.tiu.cosares", linkedin: "https://www.linkedin.com/in/janine-cosares-505588312/", instagram: "https://www.instagram.com/juhneenrl/" },
          },
          {
            name: "Leslie Mae Pelletero",
            role: "Web Developer",
            img: "img/team-4.jpg",
            social: { facebook: "https://www.facebook.com/leigh550", linkedin: "", instagram: "https://www.instagram.com/_lesleighh/" },
          },
        ],
        contactInfo: [
          { icon: "fas fa-map-marker-alt", text: "123 Street New York, USA" },
          { icon: "fas fa-envelope", text: "info@example.com" },
          { icon: "fa fa-phone-alt", text: "(+012) 3456 7890" },
          { icon: "fab fa-firefox-browser", text: "Yoursite@ex.com" },
        ],
        socialLinks: {
          facebook: "#",
          twitter: "#",
          instagram: "#",
          linkedin: "#",
        },
      };
    },
  };
  </script>
  
  <style>
  /* General Settings */
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background-color: #fff;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: bold;
}

p {
  margin: 0;
  color: #777;
  font-size: 16px;
  line-height: 1.6;
}

/* Navbar Styling */
.navbar {
  background: white;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar .logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #0EBE6A;
}

.navbar .logo i {
  font-size: 28px;
  margin-right: 8px;
}

.navbar button {
  background: #0EBE6A;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.navbar button:hover {
  background: #099d56;
}

/* Hero Section */
.hero-section {
  background: url('/path/to/your/hero-image.jpg') center/cover no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Dark overlay */
  z-index: 0;
}

.hero-section * {
  z-index: 1;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.hero-section p {
  font-size: 18px;
  margin-bottom: 30px;
}

.hero-section .buttons {
  display: flex;
  gap: 15px;
}

.hero-section .buttons button {
  background: #0EBE6A;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.hero-section .buttons button:hover {
  background: #099d56;
}

/* About Us Section */
.about-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 10%;
  background-color: #fff;
}

.about-section .text {
  max-width: 50%;
}

.about-section .text h2 {
  color: #0EBE6A;
  font-size: 24px;
  margin-bottom: 20px;
}

.about-section .text h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.about-section .text p {
  margin-bottom: 20px;
}

.about-section img {
  max-width: 45%;
  border-radius: 15px;
  object-fit: cover;
}

/* Floating Button */
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0EBE6A;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.floating-btn:hover {
  transform: scale(1.1);
}

  .overlay-img-1 {
    top: -15px;
    right: -15px;
    opacity: 0.7;
  }
  .overlay-img-2 {
    top: -20px;
    left: 10px;
    transform: rotate(90deg);
    opacity: 0.9;
  }
  .feature-icon {
    border-radius: 50%;
    background-color: #f0f0f0;
  }
  .team-item {
    transition: transform 0.3s ease-in-out;
  }
  .team-item:hover {
    transform: translateY(-10px);
  }
  .footer {
    background-color: #333;
    color: #fff;
  }
  </style>  