<script setup lang="ts">
import CategoryDetails from '@/components/CategoryDetailView/CategoryDetailView.vue'

const props = defineProps({
    categoryId: { type: String, required: true }
})
</script>

<template>
    <v-main>
        <CategoryDetails :categoryId="props.categoryId" />
    </v-main>
</template>
