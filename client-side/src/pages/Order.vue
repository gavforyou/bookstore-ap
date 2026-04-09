<template>
  <template v-if="!userStore.isAdmin">
    <div class="centered-overlay">
      <div class="global-card">
        <h2>Your Orders</h2>
        <div v-if="orders.length === 0">No orders found.</div>
        <OrderListComponent :orders="orders" :showUserId="false" :showOrderButton="true" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="admin-orders-centered">
      <div class="admin-orders-card">
        <h2>All Orders</h2>
        <div v-if="orders.length === 0">No orders found.</div>
        <div v-if="orders.length">
          <div v-for="(userOrders, userId) in groupByUserId(orders)" :key="userId" class="admin-user-block">
            <OrderListComponent :orders="userOrders" :showUserId="true" :showOrderButton="false" />
          </div>
        </div>
        <div v-else>No orders found.</div>
      </div>
    </div>
  </template>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import OrderListComponent from '../components/OrderListComponent.vue'
 
const orders = ref([])
const bookId = ref('')
const bookTitle = ref('')
const bookAuthor = ref('')
const quantity = ref('')
const userStore = useUserStore()
 
function groupByUserId(orderArr) {
  // Group orders by userId
  const grouped = {};
  for (const order of orderArr) {
    const uId = order.userId || 'Unknown';
    if (!grouped[uId]) grouped[uId] = [];
    grouped[uId].push(order);
  }
  return grouped;
}
 
const fetchOrders = async () => {
  if (!userStore.token) {
    orders.value = []
    return
  }
  try {
    let res
    if (userStore.isAdmin) {
      res = await api.get('/orders/all', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
    } else {
      res = await api.get('/orders', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
    }
    orders.value = res.data
  } catch (err) {
    orders.value = []
  }
}
 
const placeOrder = async () => {
  if (!userStore.token) {
    alert('Please login to place order.')
    return
  }
  if (!bookId.value || !bookTitle.value || !bookAuthor.value || !quantity.value) {
    alert('Please fill book info and quantity.')
    return
  }
  try {
    const orderPayload = {
      books: [{
        bookId: bookId.value,
        title: bookTitle.value,
        author: bookAuthor.value
      }],
      quantity: Number(quantity.value),
      status: 'Pending'
    }
    await api.post('/orders', orderPayload, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    alert('Order placed!')
    bookId.value = ''
    bookTitle.value = ''
    bookAuthor.value = ''
    quantity.value = ''
    fetchOrders()
  } catch (err) {
    alert('Order failed')
  }
}
 
onMounted(fetchOrders)
</script>