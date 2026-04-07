<script setup>
import { ref, onBeforeMount } from "vue";
import api from "../api";
import BookComponent from "./BookComponent.vue";

const books = ref([]);
const loading = ref(true);

async function fetchBooks() {
    try {
        const { data } = await api.get("/books");
        books.value = data.slice(0, 8);
        loading.value = false;
    } catch (err) {
        console.error("Failed to fetch books:", err);
        loading.value = false;
    }
}

function handleRefresh() {
    fetchBooks();
}

onBeforeMount(() => {
    fetchBooks();
});
</script>

<template>
    <div class="highlights-section">
        <div class="container">
            <h2 class="highlights-title">Featured Books</h2>
            
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div v-else class="row g-4">
                <BookComponent
                    v-for="book in books"
                    :key="book._id"
                    :bookData="book"
                    @refresh="handleRefresh"
                />
            </div>
        </div>
    </div>
</template>
