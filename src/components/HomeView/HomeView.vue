<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'
import PostMenu from '@/components/parts/MenuList.vue'
import axios from 'axios'

interface Category {
    id: string
    category_name: string
    category_img: string
    img_name: string
}

const categoryList = ref<Category[]>()
const clickCategory = (id: any) => {
    router.push(`/category/${id}`)
}

async function fechCategories() {
    try {
        const response = await axios.get('http://localhost:3000/api/categories')
        categoryList.value = response.data.categories
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
            <v-row v-if="categoryList">
                <v-col cols="12" md="6" v-for="category in categoryList" :key="category.id">
                    <v-card @click="clickCategory(category.id)" hover>
                        <v-img
                        :src="category.category_img"
                        height="250px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ category.category_name }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
            <PostMenu DisplayContents="Home" />
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

