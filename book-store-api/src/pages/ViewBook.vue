<!-- View Book Details Page -->
<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "../stores/global";
import api from "../api";
import { Notyf } from "notyf";

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const { user } = useGlobalStore();

const book = ref(null);
const quantity = ref(1);
const loading = ref(true);
const error = ref(null);

async function fetchBook() {
    try {
        const { data } = await api.get(`/books/${route.params.id}`);
        book.value = data;
        loading.value = false;
    } catch (err) {
        error.value = "Book not found";
        loading.value = false;
    }
}

async function addToCart() {
    if (!user.token) {
        notyf.error("Please log in to add items to cart");
        router.push({ path: "/login" });
        return;
    }

    if (quantity.value > book.value.quantity) {
        notyf.error("Insufficient stock");
        return;
    }

    try {
        await api.post("/cart", {
            bookId: book.value._id,
            quantity: parseInt(quantity.value)
        });
        notyf.success("Added to cart!");
    } catch (err) {
        notyf.error(err.response?.data?.message || "Failed to add to cart");
    }
}

onBeforeMount(() => {
    fetchBook();
});
</script>

<template>
    <div class="container my-5">
        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-else-if="book" class="row">
            <div class="col-md-6">
                <img
                    :src="book.imageUrl || `https://placehold.co/500x600/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(book.title)}`"
                    class="img-fluid"
                    :alt="book.title"
                />
            </div>
            <div class="col-md-6">
                <h1>{{ book.title }}</h1>
                <p class="text-muted mb-3">
                    <strong>Author:</strong> {{ book.author }}
                </p>
                <p class="mb-3">
                    <strong>Category:</strong> {{ book.category }}
                </p>
                <p v-if="book.publisher" class="mb-3">
                    <strong>Publisher:</strong> {{ book.publisher }}
                </p>
                <p v-if="book.publicationYear" class="mb-3">
                    <strong>Year:</strong> {{ book.publicationYear }}
                </p>
                <p class="mb-3">
                    <strong>ISBN:</strong> {{ book.isbn }}
                </p>

                <h3 class="text-primary mb-3">PHP {{ book.price.toFixed(2) }}</h3>

                <p class="mb-4">
                    {{ book.description }}
                </p>

                <div v-if="book.quantity > 0" class="mb-3">
                    <label class="form-label">Quantity:</label>
                    <div class="input-group" style="max-width: 150px">
                        <button class="btn btn-outline-secondary" type="button" @click="quantity = Math.max(1, quantity - 1)">
                            -
                        </button>
                        <input type="number" class="form-control text-center" v-model.number="quantity" min="1" :max="book.quantity" />
                        <button class="btn btn-outline-secondary" type="button" @click="quantity = Math.min(book.quantity, quantity + 1)">
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <button v-if="book.quantity > 0" class="btn btn-primary btn-lg" @click="addToCart">
                        Add to Cart
                    </button>
                    <button v-else class="btn btn-danger btn-lg" disabled>
                        Out of Stock
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
