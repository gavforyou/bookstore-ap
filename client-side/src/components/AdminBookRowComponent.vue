<template>
  <div>
    <div v-if="book && book.title" class="book-table-grid admin-book-row">
      <span class="table-cell cell-title">{{ book.title }}</span>
      <span class="table-cell cell-author">{{ book.author }}</span>
      <span class="table-cell">{{ book.publisher }}</span>
      <span class="table-cell">{{ book.year }}</span>
      <span class="table-cell">
        <button @click="showEditModal = true" class="save-btn">Edit</button>
      </span>
      <BookEditModalComponent
        v-if="showEditModal"
        :book="book"
        @close="showEditModal = false"
        @save="onUpdate"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
import BookEditModalComponent from './BookEditModalComponent.vue'
import DeleteConfirmModalComponent from './DeleteConfirmModalComponent.vue'
 
defineProps({
  book: { type: Object, required: true },
  onUpdate: { type: Function, required: true },
  onDelete: { type: Function, required: true }
})
 
const showEditModal = ref(false)
const showDeleteModal = ref(false)
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
.admin-book-row {
  border-bottom: 1px solid #eae1c5;
  margin-bottom: .2rem;
}
.table-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .98rem;
  padding-top: .22rem;
  padding-bottom: .22rem;
  line-height: 1.29;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
}
.cell-title, .cell-author {
  max-width: 180px;
}
.save-btn, .delete-btn {
  width: 82px;
  margin-left: 0;
  font-size: .97rem;
  border-radius: 10px;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  font-weight: 700;
  padding: .32rem 1.09rem;
  box-shadow: 0 2.3px 11px #eedcb0b2;
  border: 2px solid;
  background: #fff;
  transition: background .19s, color .19s, border-color .25s, box-shadow .2s;
}
 
.save-btn {
  color: #3778e6;
  border-color: #3778e6;
  background: #fff;
}
.save-btn:hover {
  background: #3778e6;
  color: #fffbe9;
  border-color: #3778e6;
  box-shadow: 0 3px 18px #3778e687;
}
.delete-btn {
  color: #d73d3d !important;
  border-color: #d73d3d !important;
}
.delete-btn:hover {
  background: #d73d3d !important;
  color: #fffbe9 !important;
  border-color: #d73d3d !important;
  box-shadow: 0 3px 18px #d73d3dc2;
}
.edit-header {
  display: flex;
  gap: .7rem;
  margin-bottom: .2rem;
}
.header-field {
  min-width: 120px;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: .97rem;
  font-weight: 600;
  color: #7a5c28;
  display: flex;
  align-items: center;
}
.admin-book-card input {
  padding: .4rem;
  border-radius: 5px;
  border: 1px solid #eee;
  width: 120px;
  font-size: .96rem;
}
.admin-book-card button {
  padding: .4rem .9rem;
  border: none;
  border-radius: 7px;
  background: #596cf0;
  color: white;
  cursor: pointer;
  transition: background .2s;
}
.admin-book-card button:hover {
  background: #344586;
}
.delete-btn {
  background: #d73d3d !important;
  color: #fffbe9 !important;
  font-weight: 600;
  padding: .6rem 1.3rem;
  margin-left: auto;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px #eae1c5;
}
.delete-btn:hover {
  background: #ab2929 !important;
}
.save-btn {
  background: #596cf0;
  color: #fffbe9;
  font-weight: 600;
  padding: .6rem 1.3rem;
  margin-left: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px #eae1c5;
  border: none;
  transition: background .2s;
}
.save-btn:hover {
  background: #344586;
}
.delete-btn {
  background: #d73d3d !important;
  color: #fffbe9 !important;
  font-weight: 600;
  padding: .6rem 1.3rem;
  margin-left: .7rem;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px #eae1c5;
}
.delete-btn:hover {
  background: #ab2929 !important;
}
</style>
