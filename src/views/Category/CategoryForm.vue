<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import CategoryForm from '@/components/Category/CategoryForm.vue'
import GlobalHeader from '@/components/Common/GlobalHeader.vue'

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
        <CategoryForm :is-edit="isEdit" :category-id="categoryId" />
    </v-main>
</template>