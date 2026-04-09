<template>
<nav class="navbar">
  <div class="nav-left">
    <router-link to="/" class="nav-link">Home</router-link>
  </div>
  <div class="nav-right">
    <router-link to="/books" class="nav-link">Books</router-link>
    <router-link v-if="userStore.isAdmin" to="/dashboard" class="nav-link">My Dashboard</router-link>
    <router-link v-if="userStore.isAdmin" to="/orders" class="nav-link">Orders</router-link>
    <router-link v-if="!userStore.isAuthenticated" to="/login" class="nav-link">Login</router-link>
    <router-link v-if="!userStore.isAuthenticated" to="/register" class="nav-link">Register</router-link>
    <button
      v-if="userStore.isAuthenticated"
      class="nav-link logout-btn"
      @click="logout"
      style="background:none;border:none;padding:0;cursor:pointer"
    >Logout</button>
  </div>
</nav>
</template>
 
<script setup>
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
 
function logout() {
  userStore.setToken('')
  userStore.setAdmin(false)
  router.push('/login')
}
</script>
 
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #596cf0;
  padding: 1rem;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 2px 10px #ccc8;
}
.nav-left {
  display: flex;
  align-items: center;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.15rem;
  transition: color .2s;
}
.nav-link:hover {
  color: #f9ee73;
}
 
.logout-btn {
  background: none;
  border: none;
  color: #fff;
  font-weight: 500;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  transition: color .2s;
  outline: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
}
.logout-btn:hover {
  color: #ff3860;
}
</style>
 