<script setup lang="ts">
import StoreDetailView from '@/components/StoreDetailView/StoreDetailView.vue'
import GlobalHeader from '@/components/parts/GlobalHeader.vue'

defineProps({
    storeId: String
})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <StoreDetailView :storeId="storeId" />
    </v-main>
</template>