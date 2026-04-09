<template>
  <div v-if="book && book.title" class="book-card">
    <h3 class="book-title">{{ book.title }}</h3>
    <div class="book-meta">
      <div class="book-detail"><span class="detail-label">Author:</span> <span>{{ book.author }}</span></div>
      <div class="book-detail"><span class="detail-label">Publisher:</span> <span>{{ book.publisher }}</span></div>
      <div class="book-detail"><span class="detail-label">Year:</span> <span>{{ book.year }}</span></div>
    </div>
    <button v-if="userStore.isAuthenticated && !userStore.isAdmin" @click="onBuy" class="buy-btn">
      <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" style="vertical-align:middle;margin-right:5px;"><path fill="currentColor" d="M7 18c0 .828.672 2 1.5 2s1.5-1.172 1.5-2-.672-2-1.5-2-1.5 1.172-1.5 2zm10.293-1.707l-1.086-1.514a1.992 1.992 0 0 0-3.414 0l-1.086 1.514C10.398 17.481 9.986 18 10 18c.014 0 .398-.519.293-1.707zm-8.393-2.109l1.064-6.132C10.147 7.833 10.566 7 12 7c1.434 0 1.853.833 1.036 1.052l1.064 6.132c.092.537-.195.938-.741.938h-2.698c-.546 0-.833-.401-.741-.938zM21 6.466C20.852 4.076 11.961 2 12 2s-8.852 2.076-9 4.466c-.151 2.431-.171 2.622.335 6.096l1.296 6.202C4.782 19.738 5.737 21 7.5 21c1.51 0 2.482-1.309 2.445-1.438C9.367 22.203 11 22.68 12 22.68c1 0 2.633-.477 2.055-3.118C14.018 19.691 14.99 21 16.5 21c1.763 0 2.718-1.262 3.167-3.237l1.296-6.202c.506-3.474.486-3.665.335-6.095z"/></svg>
      Buy
    </button>
  </div>
</template>
 
<script setup>
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
defineProps({
  book: { type: Object, required: true },
  onBuy: { type: Function, required: true }
})
</script>
 
<style scoped>
.book-card {
  flex: 1 1 260px;
  border-radius: 14px;
  border: 1.5px solid #ccb09c;
  padding: 2rem 2.2rem 1.6rem;
  background: #ecd6b0;
  box-shadow: 0 6px 28px #61677c22, 0 2px 12px #96784918;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow .18s, transform .17s;
  margin-bottom: 2rem;
  margin-top: 1.2rem;
}
.book-card:hover {
  box-shadow: 0 10px 32px #96825639, 0 4px 14px #c4a67240;
  transform: translateY(-2px) scale(1.02);
}
.book-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.42rem;
  font-weight: 800;
  color: #453826;
  margin-bottom: 1.1rem;
  margin-top: 0;
  letter-spacing: .02em;
}
.book-meta {
  width: 100%;
  margin-bottom: 1.05rem;
  margin-top: .13rem;
}
.book-detail {
  font-size: 1.08rem;
  color: #4A3d23;
  margin-bottom: .32rem;
  margin-left: .2rem;
  display: flex;
}
.detail-label {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1.08rem;
  font-weight: 700;
  margin-right: .2rem;
  color: #836e55;
  min-width: 92px;
  display: inline-block;
}
.buy-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(92deg, #596cf0 80%, #80571b 120%);
  color: #fffbe9;
  border: none;
  border-radius: 18px;
  font-size: 1.03rem;
  font-weight: 700;
  padding: 0.63rem 1.45rem 0.63rem 1.12rem;
  box-shadow: 0 2px 12px #b68e5621;
  cursor: pointer;
  transition: background .16s, box-shadow .17s, transform .13s;
  outline: none;
  margin-top: .55rem;
  letter-spacing: .01em;
}
.buy-btn:hover {
  background: linear-gradient(98deg, #344586 83%, #bd9a5a 117%);
  color: #fff9e4;
  box-shadow: 0 4px 16px #7657053e;
  transform: scale(1.045);
}
 
@media (max-width: 600px) {
  .book-card {
    padding: 1.2rem .8rem .9rem .8rem;
    max-width: 100%;
  }
  .book-title {
    font-size: 1.14rem;
  }
  .detail-label, .book-detail {
    font-size: .98rem;
  }
}
</style>
BookEditModalComponent.vue
<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <h3>Edit Book</h3>
      <form @submit.prevent="onSave">
        <div class="modal-fields">
          <label>Title:</label>
          <input v-model="localBook.title" placeholder="Title" required />
          <label>Author:</label>
          <input v-model="localBook.author" placeholder="Author" required />
          <label>Publisher:</label>
          <input v-model="localBook.publisher" placeholder="Publisher" required />
          <label>Year:</label>
          <input v-model="localBook.year" placeholder="Year" required />
        </div>
        <div class="modal-actions">
          <button type="submit" class="save-btn">Save</button>
          <button type="button" class="delete-btn" @click="$emit('delete', localBook)">Delete</button>
          <button type="button" class="cancel-btn" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>
 
<script setup>
import { reactive, toRefs } from 'vue'
const props = defineProps({
  book: { type: Object, required: true }
})
const emits = defineEmits(['close', 'save'])
const localBook = reactive({ ...props.book })
 
function onSave() {
  emits('save', localBook)
  emits('close')
}
</script>
 
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(50, 38, 18, 0.17);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}
.modal-card {
  background: #fffdf7;
  border-radius: 14px;
  box-shadow: 0 4px 22px #c2b09049;
  padding: 2rem 2rem 1.3rem 2rem;
  min-width: 320px;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  justify-content: flex-end;
}
.save-btn {
  background: #3778e6;
  color: #fffbe9;
  border: 2px solid #3778e6;
  font-weight: 600;
  padding: .58rem 1.17rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px #eae1c5;
  border: none;
  transition: background .2s;
  margin-right: .5rem;
}
.save-btn:hover {
  background: #344586;
}
 
.delete-btn {
  background: #fff;
  color: #d73d3d;
  border: 2px solid #d73d3d;
  font-weight: 600;
  padding: .6rem 1.15rem;
  border-radius: 10px;
  transition: background .2s, color .2s, border-color .2s;
  margin-right: .5rem;
}
.delete-btn:hover {
  background: #d73d3d;
  color: #fffbe9;
}
 
.cancel-btn {
  background: #fff;
  color: #b68e56;
  border: 2px solid #b68e56;
  font-weight: 600;
  padding: .6rem 1.15rem;
  border-radius: 10px;
  transition: background .2s, color .2s, border-color .2s;
}
.cancel-btn:hover {
  background: #b68e56;
  color: #fffbe9;
}
</style>