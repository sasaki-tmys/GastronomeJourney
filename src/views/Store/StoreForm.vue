<script setup lang="ts">
import StoreFormView from '@/components/Store/StoreForm.vue'
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/Common/GlobalHeader.vue'


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
        <StoreFormView :is-edit="isEdit" :store-id="storeId" />
    </v-main>
</template>