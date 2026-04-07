<!-- script is for all the JS related codes -->
<script>

  // To be able to add a component into another component, in the script block, import the component 
  // The name of the component is the name of the file by default.
  // Add export default {} to be able to add the imported component in the root component.
  // import BannerComponent from './components/BannerComponent.vue';
  import NavbarComponent from './components/NavbarComponent.vue';
  import { useGlobalStore } from './stores/global';
  import { onBeforeMount } from 'vue';




  /* ACTIVITY SOLUTION START */
  // import HomePage from './pages/HomePage.vue';
  // import CoursesPage from './pages/CoursesPage.vue';
  // import NewsPage from './pages/NewsPage.vue';
  // import RegisterPage from './pages/RegisterPage.vue';
  // import LoginPage from './pages/LoginPage.vue';
  /* ACTIVITY SOLUTION END */

  export default {
    components: {
      // BannerComponent,
      NavbarComponent,
      /* ACTIVITY SOLUTION START */
      // HomePage,
      // CoursesPage,
      // NewsPage,
      // RegisterPage,
      // LoginPage
      /* ACTIVITY SOLUTION END */
    },
    setup() {

      // Open the store and bring our the getUserDetails() function.
      const { getUserDetails } = useGlobalStore();

      onBeforeMount(() => {
        // Invoke the getUserDetails() and pass the user email from localStorage.
        // This will help in maintaining the user's identity globally even when the page/component loads.
        getUserDetails(localStorage.getItem("token"));
      })

    }

  }


</script>

<!-- template is for all HTML related codes -->
<template>
  
  <NavbarComponent />
  <!-- Banner Component can be rendered in the page after it was imported as its own HTML-like tag. -->
  <!-- <HomePage />
  <CoursesPage />
  <NewsPage />
  <RegisterPage />
  <LoginPage /> -->


  <!-- <router-view /> is a Vue Router component that is used to display the component associated with the current defined routed. -->
  <router-view />


</template>


<!-- style is for all CSS related codes. -->
<style scoped>

</style>
