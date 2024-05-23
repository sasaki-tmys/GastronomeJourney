<script setup lang="ts">
import StoreDetailView from '@/components/Store/StoreDetailView.vue'
import GlobalHeader from '@/components/Common/GlobalHeader.vue'

defineProps({
    storeId: {
        type: String,
        required: true
    }
})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <StoreDetailView :store-id="storeId" />
    </v-main>
</template>