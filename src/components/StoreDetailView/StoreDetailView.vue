<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    storeId: String
})

// 店舗情報型定義
interface StoreInfo {
    id: number
    category: number
    genre: number
    visitDate: string
    nameOfStore: string
    address: string
    totalAmount: number
    contents: string
    photos: string[]
}

const storeInfo = reactive({} as StoreInfo)

async function fechstoreInfo() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/${props.storeId}`)
        Object.assign(storeInfo,response.data)
        storeInfo.contents = response.data.contents.replace(/\n/g, '<br>')
        console.log(storeInfo)
    } catch (error: any) {
    console.error('Error:', error)
}}

onMounted(() => {
    fechstoreInfo()
})

</script>

<template>
    <v-container>
        <v-card flat>
            <v-card-title>{{ storeInfo.nameOfStore }}</v-card-title>
            <v-card-subtitle>{{ '訪問日：' + storeInfo.visitDate }}</v-card-subtitle>
            <v-card-subtitle>{{ '予算：' + storeInfo.totalAmount + '円' }}</v-card-subtitle>
            <v-card-item>
                <span>住所：</span><a :href="`https://www.google.com/maps/search/${storeInfo.nameOfStore}`" target="_blank">{{ storeInfo.address }}</a>
            </v-card-item>
            <v-card-item>
                <v-card-text v-html="storeInfo.contents" />
            </v-card-item>
            <v-carousel show-arrows="hover" v-if="storeInfo.photos">
                <v-carousel-item v-for="poto, index in storeInfo.photos" :key="index" :src="poto" cover placeholder/>
            </v-carousel>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-card {
    background-color: transparent !important;
}
</style>