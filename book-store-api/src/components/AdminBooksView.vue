<!-- Admin View for Book Management -->
<script setup>
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";

const { user } = useGlobalStore();
const emit = defineEmits(["refresh"]);
</script>

<template>
    <div v-if="user.isAdmin" class="mb-4">
        <router-link to="/addBook" class="btn btn-success">
            <i class="bi bi-plus-circle"></i> Add New Book
        </router-link>
        <button class="btn btn-info ms-2" @click="$emit('refresh')">
            <i class="bi bi-arrow-clockwise"></i> Refresh
        </button>
    </div>
</template>
