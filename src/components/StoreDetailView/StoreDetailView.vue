<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PostMenu from '@/components/parts/MenuList.vue'
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
    photos: string
}

const storeInfo = reactive({} as StoreInfo)
const photoList = ref<string[]>([])
async function fechstoreInfo() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/${props.storeId}`)
        Object.assign(storeInfo, response.data)
        photoList.value = storeInfo.photos.split(',')
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
                <div class="editor">
                <v-no-ssr>
                    <mavon-editor :toolbarsFlag="false" defaultOpen="preview" :subfield="false" class="contents" v-model="storeInfo.contents" language="en" :boxShadow="false" />
                </v-no-ssr>
                </div> 
            </v-card-item>
            <v-carousel  v-if="photoList.length" class="image-preview" show-arrows="hover" hide-delimiters>
                <v-carousel-item v-for="url, index in photoList" :key="index" :src="url" contain />
            </v-carousel>
        </v-card>
        <PostMenu DisplayContents="Edit" :StoreId="storeId" />
    </v-container>
</template>

<style scoped>
.v-card {
    background-color: transparent !important;
}
.v-card-subtitle {
    padding-top: 10px;
}
.editor {
    padding-bottom: 20px;
}
:deep(.contents div) {
    background-color: #263238 !important;
}
:deep(.content-input-wrapper div) {
    background-color: #263238 !important;
}
:deep(.auto-textarea-input) {
    color: aliceblue !important;
}
:deep(.v-note-wrapper) {
    color: aliceblue !important;
}
</style>