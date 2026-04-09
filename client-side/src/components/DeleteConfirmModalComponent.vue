<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <h3>Delete Book</h3>
      <div class="modal-message">
        Are you sure you want to delete this book?
      </div>
      <div class="modal-actions">
        <button class="delete-btn" @click="$emit('confirm')">Delete</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>
 
<script setup>
defineEmits(['confirm', 'close'])
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
.modal-message {
  font-size: 1.08rem;
  color: #632f16;
  margin-bottom: 1.2rem;
  text-align: center;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  justify-content: flex-end;
}
.delete-btn {
  background: #d73d3d !important;
  color: #fffbe9 !important;
  font-weight: 600;
  padding: .6rem 1.3rem;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px #eae1c5;
  border: none;
  transition: background .2s;
}
.delete-btn:hover {
  background: #ab2929 !important;
}
</style>