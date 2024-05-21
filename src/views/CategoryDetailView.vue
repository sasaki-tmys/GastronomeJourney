<script setup lang="ts">
import CategoryDetails from '@/components/CategoryDetailView/CategoryDetailView.vue'
import GlobalHeader from '@/components/parts/GlobalHeader.vue'

const props = defineProps({
    categoryId: { type: String, required: true }
})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <CategoryDetails :categoryId="props.categoryId" />
    </v-main>
</template>
