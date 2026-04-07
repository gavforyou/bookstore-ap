<!-- Add Book Page - Admin Only -->
<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { Notyf } from "notyf";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import api from "../api";

const notyf = new Notyf();
const router = useRouter();
const { user } = useGlobalStore();

const title = ref("");
const author = ref("");
const isbn = ref("");
const description = ref("");
const price = ref(0);
const quantity = ref(0);
const category = ref("");
const publisher = ref("");
const publicationYear = ref(new Date().getFullYear());
const imageUrl = ref("");
const isEnabled = ref(false);

async function handleSubmit() {
    const book = {
        title: title.value,
        author: author.value,
        isbn: isbn.value,
        description: description.value,
        price: price.value,
        quantity: quantity.value,
        category: category.value,
        publisher: publisher.value,
        publicationYear: publicationYear.value,
        imageUrl: imageUrl.value || null
    };

    try {
        const response = await api.post("/books", book);

        if (response.status === 201) {
            notyf.success(response.data.message);
            router.push({ path: "/books" });
        } else {
            notyf.error(response.data.message);
        }
    } catch (error) {
        if (error.response?.status === 409) {
            notyf.error(error.response.data.message);
        } else {
            console.error(error.response?.data?.message);
            notyf.error("Error adding book. Please contact administrator.");
        }
    }
}

watch([title, author, isbn, description, price, quantity, category], (currentValue) => {
    if (currentValue.every((input) => input !== "" && input !== 0)) {
        isEnabled.value = true;
    } else {
        isEnabled.value = false;
    }
});

onBeforeMount(() => {
    if (!user.token || !user.isAdmin) {
        router.push({ path: "/books" });
    }
});
</script>

<template>
    <div class="container my-5" style="max-width: 600px">
        <h1 class="text-center mb-4">Add New Book</h1>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="titleInput" class="form-label">Book Title</label>
                <input type="text" class="form-control" id="titleInput" v-model="title" placeholder="Enter book title" />
            </div>
            <div class="mb-3">
                <label for="authorInput" class="form-label">Author</label>
                <input type="text" class="form-control" id="authorInput" v-model="author" placeholder="Enter author name" />
            </div>
            <div class="mb-3">
                <label for="isbnInput" class="form-label">ISBN</label>
                <input type="text" class="form-control" id="isbnInput" v-model="isbn" placeholder="Enter ISBN" />
            </div>
            <div class="mb-3">
                <label for="descriptionInput" class="form-label">Description</label>
                <textarea
                    class="form-control"
                    id="descriptionInput"
                    v-model="description"
                    rows="4"
                    placeholder="Enter book description"
                ></textarea>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="priceInput" class="form-label">Price</label>
                    <input type="number" class="form-control" id="priceInput" v-model="price" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="quantityInput" class="form-label">Quantity</label>
                    <input type="number" class="form-control" id="quantityInput" v-model="quantity" placeholder="0" min="0" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="categoryInput" class="form-label">Category</label>
                    <input type="text" class="form-control" id="categoryInput" v-model="category" placeholder="Enter category" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="publisherInput" class="form-label">Publisher</label>
                    <input type="text" class="form-control" id="publisherInput" v-model="publisher" placeholder="Enter publisher" />
                </div>
            </div>
            <div class="mb-3">
                <label for="yearInput" class="form-label">Publication Year</label>
                <input type="number" class="form-control" id="yearInput" v-model="publicationYear" placeholder="YYYY" min="1900" max="2100" />
            </div>
            <div class="mb-3">
                <label for="imageInput" class="form-label">Book Cover Image URL (Optional)</label>
                <input type="url" class="form-control" id="imageInput" v-model="imageUrl" placeholder="https://example.com/image.jpg" />
                <small class="form-text text-muted">Paste a URL to a book cover image</small>
            </div>
            <button type="submit" class="btn btn-primary w-100" v-if="isEnabled">Add Book</button>
            <button type="submit" class="btn btn-danger w-100" disabled v-else>Add Book</button>
        </form>
    </div>
</template>
