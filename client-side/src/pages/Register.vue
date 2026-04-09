<template>
  <div class="register-page">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="firstName" type="text" placeholder="First Name" required />
      <input v-model="lastName" type="text" placeholder="Last Name" required />
      <input v-model="age" type="number" placeholder="Age" required min="1" />
      <input v-model="mobile" type="text" placeholder="Mobile Number" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        :class="{ 'danger': passwordMismatch && password }"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        :class="{ 'danger': passwordMismatch && confirmPassword }"
        required
      />
      <div v-if="passwordMismatch && password" class="danger-text">Passwords do not match.</div>
      <button
        type="submit"
        :disabled="passwordMismatch"
        :class="{ 'danger-button': passwordMismatch }"
      >Register</button>
    </form>
    <div class="alt-link">
      <router-link to="/login">Already have an account? Login</router-link>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
 
const firstName = ref('')
const lastName = ref('')
const age = ref('')
const mobile = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
 
const passwordMismatch = computed(() => password.value !== confirmPassword.value)
const userStore = useUserStore()
const router = useRouter()
 
const register = async () => {
  if (passwordMismatch.value) {
    return
  }
  try {
    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      age: Number(age.value),
      address: mobile.value,
      email: email.value,
      password: password.value
    }
    const response = await api.post('/users/register', payload)
    userStore.setToken(response.data.token)
    userStore.setAdmin(response.data.isAdmin)
    router.push('/books')
  } catch (err) {
    let msg = 'Registration failed'
    if (err.response && err.response.data && err.response.data.message) {
      msg = err.response.data.message
    } else if (err.response && err.response.status === 409) {
      msg = 'Email already registered'
    } else if (err.response && err.response.status === 400) {
      msg = 'Invalid input: Please check all fields.'
    }
    alert(msg)
  }
}
</script>
 
<style scoped>
.register-page {
  max-width: 340px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ccc8;
}
.register-page h2 {
  margin-bottom: 1.2rem;
}
.register-page input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 7px;
  border: 1px solid #eee;
  font-size: 1rem;
}
.register-page button {
  width: 100%;
  padding: .7rem;
  background: #596cf0;
  border: none;
  color: #fff;
  border-radius: 7px;
  font-size: 1.05rem;
  transition: background .2s;
}
.register-page button:hover {
  background: #344586;
}
.alt-link {
  margin-top: 1.2rem;
  text-align: center;
}
.danger {
  border-color: #ff3860 !important;
  background: #ffeaea;
}
.danger-text {
  color: #ff3860;
  font-size: 1rem;
  margin-bottom: .8rem;
}
.danger {
  border-color: #ff3860 !important;
  background: #ffeaea;
}
.danger-text {
  color: #ff3860;
  font-size: 1rem;
  margin-bottom: .8rem;
}
 
.danger-button {
  background: #ff3860 !important;
  color: #fff !important;
  border: none;
}
</style>
