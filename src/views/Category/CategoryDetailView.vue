<script setup lang="ts">
import CategoryDetails from '@/components/Category/CategoryDetailView.vue'
import GlobalHeader from '@/components/Common/GlobalHeader.vue'

const props = defineProps({
    categoryId: { type: String, required: true }
})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <CategoryDetails :category-id="props.categoryId" />
    </v-main>
</template>
