<template>
  <div v-if="userStore.isAdmin" class="admin-dashboard">
    <h2>Book Admin Dashboard</h2>
    <div class="admin-section">
      <h3>Add Book</h3>
      <form @submit.prevent="addBook" class="add-book-form">
        <div class="form-col">
          <label for="title">Title:</label>
          <input id="title" v-model="newBook.title" placeholder="Title" required />
        </div>
        <div class="form-col">
          <label for="author">Author:</label>
          <input id="author" v-model="newBook.author" placeholder="Author" required />
        </div>
        <div class="form-col">
          <label for="publisher">Publisher:</label>
          <input id="publisher" v-model="newBook.publisher" placeholder="Publisher" required />
        </div>
        <div class="form-col">
          <label for="year">Year:</label>
          <input id="year" v-model="newBook.year" placeholder="Year" required />
        </div>
        <div class="form-actions">
          <button type="submit">Add Book</button>
        </div>
      </form>
    </div>
    <div class="admin-section">
      <h3>Edit / Delete Books</h3>
<div class="book-table-grid book-table-header">
  <span>Title</span>
  <span>Author</span>
  <span>Publisher</span>
  <span>Year</span>
  <span></span>
</div>
      <div>
        <AdminBookRowComponent
          v-for="book in books"
          :key="book._id"
          :book="book"
          :onUpdate="updateBook"
          :onDelete="() => deleteBook(book._id)"
        />
      </div>
    </div>
  </div>
  <div v-else class="admin-dashboard">
    <h2>Admin Only</h2>
    <p>You do not have access to this page.</p>
  </div>
</template>
 
<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import AdminBookRowComponent from '../components/AdminBookRowComponent.vue'
 
const books = ref([])
const userStore = useUserStore()
const newBook = reactive({
  title: '',
  author: '',
  description: '',
  publisher: '',
  year: ''
})
 
const fetchBooks = async () => {
  if (!userStore.isAdmin) return
  try {
    const res = await api.get('/books', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    books.value = res.data.map(book => ({ ...book }))
  } catch (err) {
    books.value = []
  }
}
 
const addBook = async () => {
  try {
    // Backend may require both author and description fields.
    await api.post(
      '/books',
      {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        publisher: newBook.publisher,
        year: newBook.year
      },
      {
        headers: { Authorization: `Bearer ${userStore.token}` }
      }
    )
    Object.keys(newBook).forEach(key => newBook[key] = '')
    fetchBooks()
  } catch (err) {
    alert('Add failed')
  }
}
 
const updateBook = async (book) => {
  try {
    const { title, author, publisher, year, description } = book;
    await api.patch(`/books/${book._id}`, { title, author, publisher, year, description }, {
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
 
onMounted(fetchBooks)
</script>
 
<style scoped>
.book-table-grid {
  display: grid;
  grid-template-columns: 2.8fr 2fr 1.8fr 1.2fr 1.3fr;
  gap: .7rem;
  align-items: center;
  margin-bottom: .2rem;
  min-width: 100%;
}
.book-table-header {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: .99rem;
  font-weight: 600;
  color: #7a5c28;
}
 
.form-col {
  display: flex;
  flex-direction: column;
  margin-bottom: .5rem;
}
.form-col label {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1rem;
  margin-bottom: .16rem;
  font-weight: 600;
  color: #7a5c28;
}
.form-col input {
  padding: .47rem;
  border-radius: 8px;
  border: 1px solid #eaddc9;
  font-size: .98rem;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: .8rem;
}
.form-actions button {
  background: #b68e56;
  color: #fffbe9;
  font-size: 1.03rem;
  font-weight: 600;
  padding: .7rem 1.5rem;
  border: none;
  border-radius: 7px;
  box-shadow: 0 2px 6px #eae1c5;
  cursor: pointer;
  transition: background .2s;
}
.form-actions button:hover {
  background: #7a5c28;
}
.admin-dashboard {
  max-width: 720px;
  min-width: 320px;
  margin: 3.7rem auto 2.5rem auto;
  background: linear-gradient(135deg, #fffdf7 80%, #fcf6e0 100%);
  border-radius: 22px;
  box-shadow: 0 6px 34px #b68e5633, 0 1.5px 14px #7a5c2827;
  padding: 3rem 2.6rem 2.1rem 2.6rem;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
}
.admin-section {
  margin-bottom: 3.3rem;
}
.admin-section h3 {
  font-size: 1.22rem;
  color: #80571b;
  margin-bottom: 1.05rem;
  letter-spacing: .05em;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 700;
}
h2 {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2.1rem;
  color: #b68e56;
  letter-spacing: .03em;
}
.add-book-form {
  background: #fffbe9;
  border-radius: 16px;
  box-shadow: 0 5px 26px #eae1c592;
  padding: 2.45rem 2.25rem 2.07rem 2.25rem;
  margin-bottom: 3.1rem;
}
.form-col {
  display: flex;
  flex-direction: column;
  margin-bottom: .5rem;
}
.form-col label {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1.09rem;
  margin-bottom: .16rem;
  font-weight: 700;
  color: #82561d;
  letter-spacing: .02em;
}
.form-col input {
  padding: .6rem .8rem;
  border-radius: 9px;
  border: 1.5px solid #eadfb2;
  font-size: 1.12rem;
  background: #fcf6e0;
  color: #52371d;
  box-sizing: border-box;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  transition: border-color .2s;
}
.form-col input:focus {
  border-color: #b68e56;
  outline: none;
  box-shadow: 0 1px 9px #eedcb0b3;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.15rem;
}
.form-actions button {
  background: #a47834;
  color: #fffbe9;
  font-size: 1.07rem;
  font-weight: 700;
  padding: .72rem 1.5rem;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2.3px 13px #eedcb0b2;
  cursor: pointer;
  transition: background .2s, box-shadow .2s;
  letter-spacing: .025em;
}
.form-actions button:hover {
  background: #7a5c28;
  box-shadow: 0 3px 15px #eedcb0e0;
}
.book-table-grid {
  display: grid;
  grid-template-columns: 2.8fr 2fr 1.8fr 1.2fr 1.3fr;
  gap: .55rem;
  align-items: center;
  min-width: 100%;
  margin-bottom: .1rem;
  background: none;
}
 
.book-table-header {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1.13rem;
  font-weight: 800;
  color: #965c1d;
  padding: .5rem 0 .42rem 0;
  background: #fae8b6;
  border-radius: 7px;
}
 
.admin-section {
  margin-bottom: 3.5rem;
}
 
.admin-book-row {
  border-bottom: 1px solid #eedcb0;
  margin-bottom: 0;
  background: #fffdf8;
  transition: background .2s;
  border-radius: 6px;
  min-height: 2.5rem;
}
 
.admin-book-row:nth-child(even) {
  background: #f9f5ea;
}
 
.table-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.09rem;
  color: #52371d;
  padding: .62rem .18rem .62rem .18rem;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
}
.cell-title, .cell-author {
  max-width: 265px;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-weight: 600;
  color: #6e4922;
}
.save-btn, .delete-btn {
  width: 82px;
  margin-left: 0;
  font-size: .97rem;
  border-radius: 10px;
  margin-bottom: .07rem;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
}
 
.save-btn {
  background: linear-gradient(140deg, #5292f6 70%, #648aff 100%);
  color: #fffbe9;
  font-weight: 700;
  padding: .57rem 1.09rem;
  box-shadow: 0 2.3px 11px #a47834b2;
  border: none;
  transition: background .2s, box-shadow .2s;
  letter-spacing: .028em;
}
.save-btn:hover {
  background: #344586;
  box-shadow: 0 4px 18px #7a5c28c9;
}
.delete-btn {
  background: linear-gradient(140deg, #db2b2b 70%, #d73d3d 100%) !important;
  color: #fffbe9 !important;
  font-weight: 700;
  padding: .57rem 1.09rem;
  border-radius: 10px !important;
  box-shadow: 0 2.8px 13px #eedcb0b2;
  transition: background .2s, box-shadow .2s;
  letter-spacing: .028em;
}
.delete-btn:hover {
  background: #ab2929 !important;
  box-shadow: 0 4px 18px #7a5c28c9;
}
 
/* Grid aligned headers and fields */
.form-header, .form-row {
  display: flex;
  gap: .7rem;
}
.form-header .field-group, .form-row .field-group {
  min-width: 120px;
  display: flex;
  align-items: flex-end;
}
.form-header span {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: .97rem;
  font-weight: 600;
  color: #7a5c28;
  margin-bottom: .19rem;
}
/* Remove vestigial .admin-book-card styles */
</style>