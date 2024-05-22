<script setup lang="ts">
import StoreFormView from '@/components/StoreFormView/StoreForm.vue'
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/parts/GlobalHeader.vue'


const route = useRoute()
const isEdit = ref<boolean>(false)
const storeId = ref('')

function isStoreEdit() {
    if (window.location.pathname !== '/addstore') {
        isEdit.value = true
    } else {
        isEdit.value = false
    }
}

function getStoreId() {
    storeId.value = route.params.storeId ? route.params.storeId.toString() : ''
}

onBeforeMount(() => {
    isStoreEdit()
    getStoreId()

})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <StoreFormView :isEdit="isEdit" :storeId="storeId" />
    </v-main>
</template>