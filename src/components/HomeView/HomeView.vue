<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
// import categoryTestData from '@/testData/categoryList.json'
import SettingsView from '@/components/SettingsView/SettingsView.vue'
import axios from 'axios'

interface Category {
    id: string
    categoryName: string
    categoryImage: string
}

const categoryList = ref<Category[]>()
const clickCategory = (id: any) => {
    router.push(`/category/${id}`)
}

async function fechCategories() {
    try {
        const response = await axios.get('/testData/categoryList.json')
        categoryList.value = response.data
    } catch (error: any) {
    console.error('Error:', error)
}}

onMounted(() => {
    fechCategories()
})

</script>

<template>
    <v-container>
        <div>
            <v-row>
                <v-col cols="12" md="6" v-for="category in categoryList" :key="category.id">
                    <v-card @click="clickCategory(category.id)" hover>
                        <v-img
                        :src="category.categoryImage"
                        height="250px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ category.categoryName }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
            <SettingsView />
        </div>
    </v-container>
</template>

<style scoped>
.categoryTitle {
    color: aqua;
    font-size: 24px;
    font-weight: 700;
}

</style>

