<!-- Books Listing Page -->
<script>
import { ref, reactive, onBeforeMount, watch } from 'vue';
import api from '../api.js';
import BookComponent from '../components/BookComponent.vue';
import BookSearch from '../components/BookSearch.vue';
import AdminBooksView from '../components/AdminBooksView.vue';
import { useGlobalStore } from '../stores/global.js';

export default {
    components: {
        BookComponent,
        BookSearch,
        AdminBooksView
    },
    setup() {
        const { user } = useGlobalStore();
        const books = reactive({ data: [] });
        const filteredBooks = reactive({ data: [] });
        const searchTerm = ref("");
        const selectedCategory = ref("");
        const categories = reactive({ data: [] });

        watch([user], async () => {
            if (user.isLoading === false) {
                await fetchBooks();
                await fetchCategories();
            }
        }, { immediate: true });

        watch([searchTerm, selectedCategory], () => {
            filterBooks();
        });

        async function fetchBooks() {
            try {
                const endpoint = user.isAdmin ? '/books/all' : '/books';
                let { data } = await api.get(endpoint);
                books.data = Array.isArray(data) ? data : [];
                filterBooks();
            } catch (error) {
                console.error('Error fetching books:', error);
                books.data = [];
            }
        }

        async function fetchCategories() {
            try {
                let { data } = await api.get('/books');
                const uniqueCategories = [...new Set(data.map(book => book.category))];
                categories.data = uniqueCategories;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }

        function filterBooks() {
            let filtered = books.data;

            if (searchTerm.value) {
                filtered = filtered.filter(book =>
                    book.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchTerm.value.toLowerCase())
                );
            }

            if (selectedCategory.value) {
                filtered = filtered.filter(book => book.category === selectedCategory.value);
            }

            filteredBooks.data = filtered;
        }

        return {
            books,
            filteredBooks,
            user,
            searchTerm,
            selectedCategory,
            categories,
            fetchBooks
        };
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="mb-4">
            <span class="section-label">Comics</span>
            <h1 class="text-center mb-4">Find Your Series</h1>
        </div>

        <BookSearch
            v-model:searchTerm="searchTerm"
            v-model:selectedCategory="selectedCategory"
            :categories="categories.data"
        />

        <AdminBooksView v-if="user.isAdmin" @refresh="fetchBooks" />

        <div v-if="filteredBooks.data.length > 0" class="row">
            <BookComponent
                v-for="book in filteredBooks.data"
                :key="book._id"
                :bookData="book"
                @refresh="fetchBooks"
            />
        </div>
        <div v-else class="alert alert-info text-center">
            No books found. Try adjusting your search criteria.
        </div>
    </div>
</template>
