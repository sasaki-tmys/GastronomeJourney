<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    storeId: String
})

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

const storeInfo = ref<StoreInfo[]>()
async function fechstoreInfoList() {
    try {
        const response = await axios.get('/testData/storeInfoList.json')
        storeInfo.value = response.data.filter((storeInfo: any) => storeInfo.id === props.storeId) || null
    } catch (error: any) {
    console.error('Error:', error)
}}

onMounted(() => {
    fechstoreInfoList()
})

</script>

<template>
    <v-container>
        <v-card v-for="store in storeInfo" :key="store.id">
            <v-card-title>{{ store.nameOfStore }}</v-card-title>
            <v-card-subtitle>{{ '訪問日：' + store.visitDate }}</v-card-subtitle>
            <v-card-subtitle>{{ '予算：' + store.totalAmount + '円' }}</v-card-subtitle>
            <v-card-item>
                <span>住所：</span><a :href="`https://www.google.com/maps/search/${store.address}`" target="_blank">{{ store.address }}</a>
            </v-card-item>
            <v-card-item>
                <span>{{ '注文内容' }}</span>
                <v-card-text v-html="store.contents" />
            </v-card-item>
            <v-carousel show-arrows="hover">
                <v-carousel-item v-for="poto, index in store.photos" :key="index" :src="poto" cover placeholder/>
            </v-carousel>
        </v-card>
    </v-container>
</template>

<style scoped>
.v-card {
    background-color: transparent !important;
}
</style>