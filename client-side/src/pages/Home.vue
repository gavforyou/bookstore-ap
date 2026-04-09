<template>
  <section class="landing">
    <h1>Welcome to Bookstore!</h1>
    <p>Your online source for books. Browse, buy, and manage your collection.</p>
    <router-link v-if="!isAuthenticated" class="cta" to="/login">Login / Register</router-link>
    <router-link v-else class="cta" to="/books">Browse Books</router-link>
  </section>
</template>
 
<script setup>
import { useUserStore } from './stores/user'
const userStore = useUserStore()
const isAuthenticated = userStore.isAuthenticated
</script>
 
<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  min-height: 70vh;
}
.landing h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.landing p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.cta {
  padding: 0.75rem 2rem;
  background: #596cf0;
  color: #fff;
  border-radius: 24px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background .2s;
}
.cta:hover {
  background: #3849a3;
}
</style>
