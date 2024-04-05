<script setup lang="ts">
import router from '@/router'
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
    categoryId: {type: String, required: true}
})


interface Genre {
    id: string
    name: string
    category_id: string
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

const selectedGenreList = ref<Genre[]>([])
const selectedGenre = ref()

const storeInfoList = ref<StoreInfo[]>()
const storeInfoAllList = ref<StoreInfo[]>()

async function fechGenres() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL +`/genres/category/${props.categoryId}`)
        selectedGenreList.value = response.data.filter((genre: any) => genre.category_id == props.categoryId) || null
        selectedGenreList.value.unshift({ id: '0', name: '', category_id: props.categoryId})
    } catch (error: any) {
    console.error('Error:', error)
}}
async function fechstoreInfos() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/category/${props.categoryId}`)
        storeInfoAllList.value = response.data
        storeInfoList.value = storeInfoAllList.value
    } catch (error: any) {
    console.error('Error:', error)
}}

watch((selectedGenre), () => {
    if (selectedGenre.value !== '0') {
        storeInfoList.value = storeInfoAllList.value.filter((storeInfo: any) => storeInfo.genre == selectedGenre.value) || null
    } else {
        storeInfoList.value = storeInfoAllList.value
    }
})

onMounted(() => {
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
                <v-select variant="outlined" label="ジャンル選択" :items="selectedGenreList" item-value="id" item-title="name" v-model="selectedGenre"/>
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