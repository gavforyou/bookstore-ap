<!-- ACTIVITY SOLUTION START -->
<script>
  import BannerComponent from '../components/BannerComponent.vue';
  import HighlightsComponent from '../components/HighlightsComponent.vue';

  export default {
    components: {
      BannerComponent,
      HighlightsComponent
    },
    data() {
      return {
        bannerProps: {
          title: "Comic Books Store",
          tagline: "Explore amazing western comics from the mid-2000s and beyond.",
          destination: "Books",
          buttonLabel: "Browse Our Comics"
        }
      }
    }
  }
</script>

<template>
  <div class="container-fluid">
    <BannerComponent :bannerProps=bannerProps  />
    <HighlightsComponent />
  </div>
</template>
<!-- ACTIVITY SOLUTION END -->
