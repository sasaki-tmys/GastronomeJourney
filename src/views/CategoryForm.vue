<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import CategoryForm from '@/components/parts/CategoryForm.vue'
import GlobalHeader from '@/components/parts/GlobalHeader.vue'


const route = useRoute()
const isEdit = ref<boolean>(false)
const categoryId = ref('')

function isCategoryEdit() {
    if (window.location.pathname !== '/addcategory') {
        isEdit.value = true
    } else {
        isEdit.value = false
    }
}

function getCategoryId() {
    categoryId.value = route.params.categoryId ? route.params.categoryId.toString() : ''
}

onBeforeMount(() => {
    isCategoryEdit()
    getCategoryId()

})
</script>

<template>
    <v-main>
        <GlobalHeader />
        <CategoryForm :isEdit="isEdit" :categoryId="categoryId" />
    </v-main>
</template>