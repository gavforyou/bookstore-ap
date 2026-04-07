<!-- Shopping Cart Page -->
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";
import api from "../api";

const notyf = new Notyf();
const router = useRouter();
const { user } = useGlobalStore();

const cart = reactive({ items: [] });
const shippingAddress = ref("");
const paymentMethod = ref("credit_card");
const isProcessing = ref(false);

onBeforeMount(() => {
    loadCart();
});

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    cart.items = savedCart ? JSON.parse(savedCart) : [];
}

function removeItem(index) {
    cart.items.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart.items));
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(index);
    } else if (newQuantity <= cart.items[index].quantity) {
        cart.items[index].cartQuantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart.items));
    } else {
        notyf.error("Insufficient stock");
    }
}

const totalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.cartQuantity), 0).toFixed(2);
};

async function proceedToCheckout() {
    if (!user.token) {
        notyf.error("Please log in to checkout");
        router.push({ path: "/login" });
        return;
    }

    if (cart.items.length === 0) {
        notyf.error("Your cart is empty");
        return;
    }

    if (!shippingAddress.value) {
        notyf.error("Please enter shipping address");
        return;
    }

    isProcessing.value = true;

    try {
        const order = {
            books: cart.items.map(item => ({
                bookId: item._id,
                title: item.title,
                quantity: item.cartQuantity,
                price: item.price
            })),
            shippingAddress: shippingAddress.value,
            paymentMethod: paymentMethod.value
        };

        const response = await api.post("/orders", order);

        if (response.status === 201) {
            notyf.success("Order placed successfully!");
            localStorage.removeItem("cart");
            router.push({ path: "/orders" });
        }
    } catch (error) {
        console.error(error);
        notyf.error(error.response?.data?.message || "Error placing order");
    } finally {
        isProcessing.value = false;
    }
}
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Shopping Cart</h1>

        <div v-if="cart.items.length === 0" class="alert alert-info text-center">
            Your cart is empty. <router-link to="/books">Continue shopping</router-link>
        </div>

        <div v-else class="row">
            <div class="col-lg-8">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cart.items" :key="item._id">
                                <td>
                                    <strong>{{ item.title }}</strong><br />
                                    <small class="text-muted">{{ item.author }}</small>
                                </td>
                                <td>PHP {{ item.price.toFixed(2) }}</td>
                                <td>
                                    <div class="input-group" style="max-width: 100px">
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="updateQuantity(index, item.cartQuantity - 1)"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            class="form-control form-control-sm text-center"
                                            :value="item.cartQuantity"
                                            @input="updateQuantity(index, parseInt($event.target.value))"
                                            min="1"
                                        />
                                        <button
                                            class="btn btn-sm btn-outline-secondary"
                                            @click="updateQuantity(index, item.cartQuantity + 1)"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td>PHP {{ (item.price * item.cartQuantity).toFixed(2) }}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger" @click="removeItem(index)">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order Summary</h5>

                        <div class="mb-3">
                            <label class="form-label">Shipping Address</label>
                            <textarea
                                class="form-control"
                                v-model="shippingAddress"
                                rows="4"
                                placeholder="Enter your shipping address"
                            ></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Payment Method</label>
                            <select class="form-select" v-model="paymentMethod">
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="online_banking">Online Banking</option>
                                <option value="cash_on_delivery">Cash on Delivery</option>
                            </select>
                        </div>

                        <hr />

                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>PHP {{ totalPrice() }}</span>
                        </div>

                        <div class="d-flex justify-content-between mb-3">
                            <strong>Total:</strong>
                            <strong>PHP {{ totalPrice() }}</strong>
                        </div>

                        <button
                            class="btn btn-primary w-100"
                            @click="proceedToCheckout"
                            :disabled="isProcessing"
                        >
                            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                            {{ isProcessing ? "Processing..." : "Place Order" }}
                        </button>

                        <router-link to="/books" class="btn btn-secondary w-100 mt-2">
                            Continue Shopping
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
