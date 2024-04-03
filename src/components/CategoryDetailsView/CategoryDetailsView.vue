<script setup lang="ts">
import router from '@/router'
import { ref, reactive, onMounted, watch } from 'vue'
// import categoryList from '@/testData/categoryList.json'
// import genreList from '@/testData/genre.json'
// import storeInformation from '@/testData/storeInformation.json'
import axios from 'axios'

const props = defineProps({
    categoryId: {type: String, required: true}
})

// カテゴリー型定義
interface Category {
    id: string
    categoryName: string
    categoryImage: string
}

interface Genre {
    id: string
    genreName: string
    categoryId: string
}

// 店舗情報型定義
interface StoreInfo {
    id: string
    category: string
    genre: string
    visitDate: string
    nameOfStore: string
    address: string
    totalAmount: number
    contents: string
    photos: string[]
}

const categoryList = ref<Category[]>([])
const selectedCategory = ref<Category | null>(null)

const genreList = ref<Genre[]>([])
const selectedGenreList = ref<Genre[]>([])
const selectedGenre = ref()

const storeInfoList = ref<StoreInfo[]>()
const storeInfoAllList = ref<StoreInfo[]>()

// // IDに基づいてカテゴリーを抽出する関数
// const getCategoryById = (id: string) => {
//     selectedCategory.value = categoryList.value.find((category: any) => category.id === id) || null
// }
// // IDに基づいてジャンルを抽出する関数
// const getGenreById = (id: string) => {
//     selectedGenreList.value = genreList.value.filter((genre: any) => genre.categoryId === id) || null
    
// }
// // IDに基づいて店舗情報を抽出する関数
// const getStoreInfoById = (id: string) => {
//     selectedStoreInfos.value = storeInfoList.value.filter((storeInfo: any) => storeInfo.category === id) || null
// }

async function fechCategories() {
    try {
        const response = await axios.get('/testData/categoryList.json')
        selectedCategory.value = response.data.find((category: any) => category.id === props.categoryId) || null
    } catch (error: any) {
    console.error('Error:', error)
}}
async function fechGenres() {
    try {
        const response = await axios.get('/testData/genreList.json')
        selectedGenreList.value = response.data.filter((genre: any) => genre.categoryId === props.categoryId) || null
        selectedGenreList.value.unshift({ id: '0', genreName: '', categoryId: props.categoryId})
    } catch (error: any) {
    console.error('Error:', error)
}}
async function fechstoreInfos() {
    try {
        const response = await axios.get('/testData/storeInfoList.json')
        storeInfoAllList.value = response.data.filter((storeInfo: any) => storeInfo.category === props.categoryId) || null
        storeInfoList.value = storeInfoAllList.value
    } catch (error: any) {
    console.error('Error:', error)
}}

watch((selectedGenre), () => {
    if (selectedGenre.value !== '0') {
        storeInfoList.value = storeInfoAllList.value.filter((storeInfo: any) => storeInfo.genre === selectedGenre.value) || null
    } else {
        storeInfoList.value = storeInfoAllList.value
    }
})

onMounted(() => {
    fechCategories()
    fechGenres()
    fechstoreInfos()

    // getCategoryById(props.categoryId)
    // getGenreById(props.categoryId)
    // getStoreInfoById(props.categoryId)
})
</script>

<template>
    <v-container>
        <div>
            <v-row class="pt-5">
                <v-select variant="outlined" label="ジャンル選択" :items="selectedGenreList" item-value="id" item-title="genreName" v-model="selectedGenre"/>
            </v-row>
        </div>
        <div>
            <v-row>
                <v-col cols="12" md="4" v-for="stores in storeInfoList" :key="stores.id">
                    <v-card @click="router.push(`/store/${stores.id}/detail`)">
                        <v-img
                        src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                        height="200px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ stores.nameOfStore }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
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