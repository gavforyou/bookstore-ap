
<script setup>

    import { ref, onBeforeMount, watch } from 'vue';
    import { useGlobalStore } from '../stores/global';

    const { user } = useGlobalStore();

    const email = ref("");

</script>


<template>

    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
             <router-link :to="{ name: 'Home'}" class="navbar-brand text-dark fw-bold">📚 BookStore</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="navbar-nav ms-auto">
                <router-link :to="{ name: 'Books' }" class="nav-link">Books</router-link>
                <!-- Cart Icon -->
                <router-link :to="{ path: '/cart' }" class="nav-link" v-if="user.email">
                    🛒 Cart
                </router-link>
                <!-- Orders Link -->
                <router-link :to="{ path: '/orders' }" class="nav-link" v-if="user.email">Orders</router-link>
                <!-- Admin Links -->
                <router-link :to="{ path: '/addBook' }" class="nav-link" v-if="user.email && user.isAdmin">Add Book</router-link>
                <!-- Auth Links -->
                <router-link :to="{ name: 'Register' }" class="nav-link"  v-if="!user.email" >Register</router-link>
                <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!user.email">Login</router-link>
                <router-link :to="{ name: 'Logout' }" class="nav-link" v-else>Logout</router-link>
            </div>
            </div>
        </div>
    </nav>

</template>
