<script>


  export default {
    // props property is from the Options API will allow components to have access to the props defined here.
    props: {
      // Define the individual props we need to pass to our child component
      // title: String,
      // tagline: String
      bannerProps: Object
    },
    mounted() {
      // Once the page has been mounted print the values of title and tagline in the console to confirm if it's not undefined or null.
      console.log(this.bannerProps.title);
      console.log(this.bannerProps.tagline);
    }
  }

</script>


<!-- When creating a new VueJS component, it must consist of 3 blocks, template, script and style. -->
<!-- When naming a component, it must consist of two words and preferably in PascalCase -->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->
<template>
  <div class="row mb-5 py-5" id="banner">
    <div class="col-md-10 p-5 ms-5">
      <h1 class="mb-3" id="banner-title">{{bannerProps.title}}</h1>
      <p class="mb-5" id="motto">{{bannerProps.tagline}}</p>
      <!-- ACTIVITY SOLUTION START -->
        <router-link class="btn btn-primary btn-lg rounded-pill px-3" :to="{ name: bannerProps.destination }">{{bannerProps.buttonLabel}} <i class="bi bi-arrow-right"></i></router-link>
        <!-- ACTIVITY SOLUTION END -->
    </div>
  </div>
</template>


<style scoped>
    h1 {
        font-family: 'Comic Sans MS', 'Arial Black', sans-serif;
        font-style: normal;
        font-weight: 900;
        font-size: 3.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    #banner {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%);
        position: relative;
    }

    #banner p {
        font-size: 1.3rem;
        font-weight: 600;
    }

    .btn-primary {
        background: linear-gradient(135deg, #FF1744 0%, #FF5252 100%) !important;
        border: 3px solid #000 !important;
        color: #fff !important;
        font-weight: bold;
        text-transform: uppercase;
        box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3) !important;
    }

    .btn-primary:hover {
        transform: translateY(-3px) !important;
        box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.4) !important;
    }
</style>
