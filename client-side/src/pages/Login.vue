

<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <div class="alt-link">
      <router-link to="/register">Need an account? Register</router-link>
    </div>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
 
const email = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()
 
const login = async () => {
  try {
    const response = await api.post('/users/login', { email: email.value, password: password.value })
    userStore.setToken(response.data.token)
    // Parran: Fetch profile to get isAdmin if not in response
    let isAdmin = response.data.isAdmin
    if (typeof isAdmin === 'undefined' && response.data.token) {
      try {
        const prof = await api.get('/users/profile')
        isAdmin = prof.data.isAdmin
      } catch {}
    }
    userStore.setAdmin(!!isAdmin)
    // Extra safeguard: ensure isAdmin is false for normal users
    if (!isAdmin) {
      userStore.setAdmin(false)
    }
    if (userStore.isAdmin) {
      router.push('/dashboard')
    } else {
      router.push('/books')
    }
  } catch (err) {
    alert('Login failed')
  }
}
</script>
 
<style scoped>
.login-page {
  max-width: 340px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ccc8;
}
.login-page h2 {
  margin-bottom: 1.2rem;
}
.login-page input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 7px;
  border: 1px solid #eee;
  font-size: 1rem;
}
.login-page button {
  width: 100%;
  padding: .7rem;
  background: #596cf0;
  border: none;
  color: #fff;
  border-radius: 7px;
  font-size: 1.05rem;
  transition: background .2s;
}
.login-page button:hover {
  background: #344586;
}
.alt-link {
  margin-top: 1.2rem;
  text-align: center;
}
</style>
