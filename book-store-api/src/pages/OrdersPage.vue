<!-- User Orders Page -->
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";
import api from "../api";

const notyf = new Notyf();
const router = useRouter();
const { user } = useGlobalStore();

const orders = reactive({ data: [] });
const loading = ref(true);
const selectedOrder = ref(null);
const showModal = ref(false);

onBeforeMount(() => {
    if (!user.token) {
        router.push({ path: "/login" });
        return;
    }
    fetchUserOrders();
});

async function fetchUserOrders() {
    try {
        const { data } = await api.get("/orders/user/my-orders");
        orders.data = Array.isArray(data) ? data : [];
        loading.value = false;
    } catch (error) {
        console.error("Error fetching orders:", error);
        loading.value = false;
    }
}

function viewOrderDetails(order) {
    selectedOrder.value = order;
    showModal.value = true;
}

async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
        await api.patch(`/orders/${orderId}/cancel`);
        notyf.success("Order cancelled successfully");
        showModal.value = false;
        await fetchUserOrders();
    } catch (error) {
        notyf.error(error.response?.data?.message || "Error cancelling order");
    }
}

function getStatusBadgeClass(status) {
    const classes = {
        pending: "bg-warning",
        confirmed: "bg-info",
        shipped: "bg-primary",
        delivered: "bg-success",
        cancelled: "bg-danger"
    };
    return classes[status] || "bg-secondary";
}
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">My Orders</h1>

        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else-if="orders.data.length === 0" class="alert alert-info text-center">
            No orders yet. <router-link to="/books">Start shopping</router-link>
        </div>

        <div v-else class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders.data" :key="order._id">
                        <td><small>{{ order._id.substring(0, 8) }}...</small></td>
                        <td>{{ new Date(order.orderDate).toLocaleDateString() }}</td>
                        <td>
                            <strong>PHP {{ order.totalPrice.toFixed(2) }}</strong>
                        </td>
                        <td>
                            <span :class="['badge', getStatusBadgeClass(order.status)]">
                                {{ order.status.toUpperCase() }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" @click="viewOrderDetails(order)">
                                View Details
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal for Order Details -->
        <div v-if="showModal" class="modal show d-block" style="background-color: rgba(0, 0, 0, 0.5)">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order Details</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                    </div>
                    <div class="modal-body" v-if="selectedOrder">
                        <div class="mb-3">
                            <strong>Order ID:</strong> {{ selectedOrder._id }}
                        </div>
                        <div class="mb-3">
                            <strong>Status:</strong>
                            <span :class="['badge', getStatusBadgeClass(selectedOrder.status)]">
                                {{ selectedOrder.status.toUpperCase() }}
                            </span>
                        </div>
                        <div class="mb-3">
                            <strong>Order Date:</strong> {{ new Date(selectedOrder.orderDate).toLocaleString() }}
                        </div>

                        <h6 class="mt-4 mb-3">Items:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Book Title</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in selectedOrder.books" :key="item._id">
                                        <td>{{ item.title }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td>PHP {{ item.price.toFixed(2) }}</td>
                                        <td>PHP {{ item.subtotal.toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mb-3 mt-3">
                            <strong>Shipping Address:</strong>
                            <p>{{ selectedOrder.shippingAddress }}</p>
                        </div>

                        <div class="mb-3">
                            <strong>Payment Method:</strong> {{ selectedOrder.paymentMethod.replace(/_/g, " ").toUpperCase() }}
                        </div>

                        <div class="border-top pt-3 mt-3">
                            <strong>Total: PHP {{ selectedOrder.totalPrice.toFixed(2) }}</strong>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            v-if="selectedOrder?.status === 'pending'"
                            class="btn btn-danger"
                            @click="cancelOrder(selectedOrder._id)"
                        >
                            Cancel Order
                        </button>
                        <button type="button" class="btn btn-secondary" @click="showModal = false">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
