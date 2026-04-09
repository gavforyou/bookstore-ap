<template>
  <div class="orders-list d-flex flex-column gap-3 mt-3">
    <template v-for="(order, idx) in orders" :key="order._id">
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex flex-wrap align-items-center justify-content-between mb-2">
            <div class="fw-bold">Order #{{ order._id }}</div>
          </div>
          <div>
            <div class="fw-semibold mb-1">Items:</div>
            <ul class="order-books mb-2 ps-3">
              <li v-for="book in order.books" :key="book.bookId || book._id">
                <span class="book-title">
                  {{ getBookTitle(book.bookId, book.title) }}
                </span>
                <span v-if="book.quantity">
                  &times; <span class="book-qty">{{ book.quantity }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div v-if="showUserId && order.userId" class="mt-2">
            <span class="small text-muted">Ordered by:</span>
            <span v-if="order.userId.firstName">
              {{ order.userId.firstName }} {{ order.userId.lastName }}
            </span>
            <span v-else>{{ order.userId }}</span>
            <br>
            <span class="small text-muted">User ID:</span>
            <span v-if="order.userId._id">{{ order.userId._id }}</span>
            <span v-else>{{ order.userId }}</span>
          </div>
        </div>
      </div>
      <hr v-if="idx !== orders.length - 1" class="my-2" />
    </template>
  </div>
  <!-- Order More button -->
  <div v-if="showOrderButton" class="text-center mt-4">
    <button class="btn btn-primary" @click="goToBooks">Order More</button>
  </div>
</template>
 
<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  orders: { type: Array, required: true },
  showUserId: { type: Boolean, default: false },
  showOrderButton: { type: Boolean, default: true }
});
 
const router = useRouter();
function goToBooks() {
  router.push("/books");
}
 
function formatOrderDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid date' : date.toLocaleDateString();
}
 
// This method attempts to extract the book title from props, provide additional lookup logic if needed.
function getBookTitle(bookId, fallbackTitle) {
  return fallbackTitle || bookId || 'Unknown Book';
}
</script>