<!-- Book Component - Display individual book card -->
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import api from "../api";
import { Notyf } from "notyf";

const props = defineProps({
    bookData: Object
});

const emit = defineEmits(["refresh"]);

const router = useRouter();
const notyf = new Notyf();
const { user } = useGlobalStore();

const isDeleting = ref(false);

function viewBook() {
    router.push({ path: `/book/${props.bookData._id}` });
}

function addToCart() {
    if (!user.token) {
        notyf.error("Please log in to add items to cart");
        router.push({ path: "/login" });
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === props.bookData._id);

    if (existingItem) {
        existingItem.cartQuantity += 1;
    } else {
        cart.push({
            ...props.bookData,
            cartQuantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    notyf.success("Added to cart!");
}

async function deleteBook() {
    if (!confirm("Are you sure you want to delete this book?")) return;

    isDeleting.value = true;
    try {
        await api.patch(`/books/${props.bookData._id}/archive`);
        notyf.success("Book archived successfully");
        emit("refresh");
    } catch (error) {
        notyf.error(error.response?.data?.message || "Error archiving book");
    } finally {
        isDeleting.value = false;
    }
}

function navigateToEdit() {
    // This would navigate to an edit page if you create one
    router.push({ path: `/editBook/${props.bookData._id}` });
}
</script>


<template>
    <div class="col-12 col-md-6 col-lg-4 col-xl-3 my-4">
        <div class="comic-card">
            <!-- Image Container -->
            <div class="comic-image-container" @click="viewBook" style="cursor: pointer;">
                <img
                    :src="bookData.imageUrl || `https://placehold.co/280x400/1a1a1a/FFD700?font=raleway&text=${encodeURIComponent(bookData.title)}`"
                    class="comic-image"
                    :alt="bookData.title"
                />
                <div class="comic-overlay">
                    <span class="view-label">CLICK TO VIEW</span>
                </div>
            </div>

            <!-- Card Info -->
            <div class="comic-info">
                <h4 class="comic-title">{{ bookData.title }}</h4>
                <p class="comic-author">{{ bookData.author }}</p>

                <div class="comic-details mb-3">
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">{{ bookData.category }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Price:</span>
                        <span class="detail-price">PHP {{ bookData.price.toFixed(2) }}</span>
                    </div>
                </div>

                <div v-if="bookData.quantity > 0" class="stock-badge in-stock">
                    ✓ In Stock ({{ bookData.quantity }})
                </div>
                <div v-else class="stock-badge out-of-stock">
                    OUT OF STOCK
                </div>

                <!-- Action Buttons -->
                <div class="comic-actions">
                    <button
                        class="action-btn btn-view"
                        @click="viewBook"
                    >
                        VIEW DETAILS
                    </button>
                    <button
                        v-if="bookData.quantity > 0"
                        class="action-btn btn-cart"
                        @click="addToCart"
                    >
                        ADD TO CART
                    </button>
                    <button
                        v-else
                        class="action-btn btn-disabled"
                        disabled
                    >
                        OUT OF STOCK
                    </button>
                </div>

                <!-- Admin Actions -->
                <div v-if="user.isAdmin" class="admin-actions">
                    <button
                        class="admin-btn edit-btn"
                        @click="navigateToEdit"
                    >
                        EDIT
                    </button>
                    <button
                        class="admin-btn delete-btn"
                        @click="deleteBook"
                        :disabled="isDeleting"
                    >
                        {{ isDeleting ? "DELETING..." : "DELETE" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comic-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    border: 2px solid #000;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.comic-card:hover {
    transform: translateY(-8px);
    box-shadow: 6px 12px 0px rgba(0, 0, 0, 0.3);
}

.comic-image-container {
    position: relative;
    overflow: hidden;
    background: #1a1a1a;
    flex: 1;
}

.comic-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}

.comic-card:hover .comic-image {
    transform: scale(1.05);
}

.comic-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.comic-card:hover .comic-overlay {
    opacity: 1;
}

.view-label {
    color: #FFD700;
    font-weight: 900;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.comic-info {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
}

.comic-title {
    font-weight: 900;
    font-size: 1.1rem;
    color: #000;
    text-transform: uppercase;
    margin: 0 0 8px 0;
    line-height: 1.2;
    letter-spacing: 0.5px;
}

.comic-author {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 15px 0;
    font-weight: 600;
}

.comic-details {
    border-top: 2px solid #f0f0f0;
    border-bottom: 2px solid #f0f0f0;
    padding: 12px 0;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 6px;
}

.detail-label {
    font-weight: bold;
    color: #000;
    text-transform: uppercase;
}

.detail-value {
    color: #666;
}

.detail-price {
    color: #FF1744;
    font-weight: 900;
    font-size: 1rem;
}

.stock-badge {
    padding: 8px 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    border: 2px solid #000;
    margin-bottom: 15px;
    letter-spacing: 0.5px;
}

.in-stock {
    background: #E8F5E9;
    color: #1B5E20;
    border-color: #4CAF50;
}

.out-of-stock {
    background: #FFEBEE;
    color: #C62828;
    border-color: #FF1744;
}

.comic-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.action-btn {
    padding: 10px;
    border: 2px solid #000;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
    border-radius: 0;
}

.btn-view {
    background: #fff;
    color: #000;
    border-color: #000;
}

.btn-view:hover {
    background: #000;
    color: #FFD700;
}

.btn-cart {
    background: linear-gradient(135deg, #FF1744 0%, #FF5252 100%);
    color: #fff;
    border-color: #FF1744;
}

.btn-cart:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 0px rgba(0, 0, 0, 0.2);
}

.btn-disabled {
    background: #ccc;
    color: #666;
    border-color: #999;
    cursor: not-allowed;
}

.admin-actions {
    display: flex;
    gap: 8px;
}

.admin-btn {
    flex: 1;
    padding: 8px;
    border: 2px solid #000;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0;
}

.edit-btn {
    background: #FFA500;
    color: #000;
    border-color: #000;
}

.edit-btn:hover {
    background: #FFB800;
    transform: translateY(-2px);
}

.delete-btn {
    background: #FF1744;
    color: #fff;
    border-color: #000;
}

.delete-btn:hover {
    background: #FF5252;
    transform: translateY(-2px);
}

.delete-btn:disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
}

@media (max-width: 576px) {
    .comic-card {
        flex-direction: row;
    }

    .comic-image-container {
        width: 150px;
        min-width: 150px;
        height: 200px;
    }

    .comic-info {
        padding: 15px;
    }

    .comic-title {
        font-size: 0.95rem;
    }

    .comic-author {
        font-size: 0.8rem;
    }
}
</style>
