<!-- Book Search Component -->
<script setup>
import { ref } from "vue";

defineProps({
    searchTerm: String,
    categories: Array,
    selectedCategory: String
});

defineEmits(["update:searchTerm", "update:selectedCategory"]);

const showFilters = ref(false);
</script>

<template>
    <div class="row mb-4">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="input-group mb-3">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search by title or author..."
                            :value="searchTerm"
                            @input="$emit('update:searchTerm', $event.target.value)"
                        />
                        <button
                            class="btn btn-outline-secondary"
                            type="button"
                            @click="showFilters = !showFilters"
                        >
                            <i class="bi bi-funnel"></i> Filters
                        </button>
                    </div>

                    <div v-if="showFilters" class="row g-3">
                        <div class="col-12 col-md-6">
                            <label class="form-label">Category</label>
                            <select
                                class="form-select"
                                :value="selectedCategory"
                                @change="$emit('update:selectedCategory', $event.target.value)"
                            >
                                <option value="">All Categories</option>
                                <option v-for="category in categories" :key="category" :value="category">
                                    {{ category }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div v-if="searchTerm || selectedCategory" class="mt-3">
                        <small class="text-muted">
                            Filters active:
                            <span v-if="searchTerm" class="badge bg-primary">Search: {{ searchTerm }}</span>
                            <span v-if="selectedCategory" class="badge bg-primary">Category: {{ selectedCategory }}</span>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
