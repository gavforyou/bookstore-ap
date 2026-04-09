<template>
  <div class="books-page">
    <div class="books-container">
      <h2 class="books-header">Books</h2>
      <button
        v-if="!userStore.isAdmin"
        class="nav-orders-btn"
        @click="router.push('/orders')"
        style="margin-bottom: 1.1rem; background: #596cf0; color: white; border-radius: 7px; padding: .6rem 1.2rem; border: none; cursor: pointer; font-weight: 600;"
      >
        View My Orders
      </button>
      <div class="books-list">
        <BookCardComponent
          v-for="book in books"
          :key="book._id"
          :book="book"
          :onBuy="() => orderBook(book)"
        />
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import api from '../api'
import BookCardComponent from '../components/BookCardComponent.vue'
import AdminBookRowComponent from '../components/AdminBookRowComponent.vue'
import { useRouter } from 'vue-router'
 
const books = ref([])
const userStore = useUserStore()
const router = useRouter()
const newBook = ref({
  title: '',
  author: '',
  publisher: '',
  year: ''
})
 
const addBook = async () => {
  try {
    await api.post('/books', { ...newBook.value }, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    Object.keys(newBook.value).forEach(key => newBook.value[key] = '')
    fetchBooks()
  } catch (err) {
    alert('Add failed')
  }
}
 
const updateBook = async (book) => {
  try {
    await api.put(`/books/${book._id}`, book, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    fetchBooks()
  } catch (err) {
    alert('Update failed')
  }
}
 
const deleteBook = async (id) => {
  try {
    await api.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    fetchBooks()
  } catch (err) {
    alert('Delete failed')
  }
}
 
const fetchBooks = async () => {
  try {
    const res = await api.get('/books', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    books.value = res.data
    console.log('Fetched books:', books.value)
  } catch (err) {
    alert('Failed to fetch books')
  }
}
 
const orderBook = async (book) => {
  console.log('Order Attempt for book:', book);
  if (!userStore.token) {
    alert('Please login to place order.')
    return
  }
  try {
    const orderPayload = {
      books: [{
        bookId: book._id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        year: book.year
      }],
      quantity: 1,
      status: 'Pending'
    }
    const orderRes = await api.post('/orders', orderPayload, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log('Order POST response:', orderRes)
    alert('Order placed!')
    router.push('/orders')
  } catch (err) {
    // Log error details for diagnostic
    console.log('Order error:', err?.response?.data || err)
    alert('Error placing order')
  }
}
 
onMounted(fetchBooks)
</script>
 
<style scoped>
.books-page {
  min-height: 100vh;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.6rem;
}
 
.books-container {
  background: rgba(255,255,255,0.98);
  border-radius: 16px;
  box-shadow: 0 8px 32px #80571b32, 0 2px 14px #596cf022;
  padding: 2.6rem 2.8rem 2.7rem;
  max-width: 730px;
  width: 96%;
  margin-bottom: 3.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
 
.books-header {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2.6rem;
  color: #80571b;
  font-weight: 900;
  text-align: center;
  margin-bottom: 2.55rem;
  margin-top: .5rem;
  letter-spacing: .09em;
}
 
.books-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;
  justify-content: center;
  padding: 0;
}
 
@media (max-width: 700px) {
  .books-container {
    padding: 1.3rem .6rem 1.2rem .6rem;
    max-width: 100%;
  }
  .books-header {
    font-size: 1.55rem;
    margin-bottom: 1.1rem;
  }
  .books-list {
    gap: .8rem;
  }
}
</style>