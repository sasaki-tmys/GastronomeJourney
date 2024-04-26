<script setup lang="ts">
import StoreDetailView from '@/components/StoreDetailView/StoreDetailView.vue'

defineProps({
    storeId: String
})
</script>

<template>
    <v-main>
        <StoreDetailView :storeId="storeId" />
    </v-main>
</template>