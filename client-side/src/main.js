import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded pages
const Home = () => import('./pages/Home.vue')
const Books = () => import('./pages/Books.vue')
const Login = () => import('./pages/Login.vue')
const Register = () => import('./pages/Register.vue')   
const Order = () => import('./pages/Order.vue')        
const MyDashboard = () => import('./pages/MyDashboard.vue') 

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/books', name: 'books', component: Books },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/orders', name: 'orders', component: Order },
  { path: '/dashboard', name: 'dashboard', component: MyDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

app.use(createPinia()) 
app.use(router)

app.mount('#app')
