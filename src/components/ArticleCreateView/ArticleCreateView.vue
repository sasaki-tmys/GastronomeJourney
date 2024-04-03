<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'

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

const categoryList = ref<Category[]>()
const selectCategory = ref()
const genreList = ref<Genre[]>([])
const filterGenreList = ref<Genre[]>([])
const selectGenre = ref()

const imageUrls = ref<string[]>([])

// 複数のファイルを処理できるように変更
function onFileSelected(e: any) {
    // 複数ファイル対応のための変更
    const files = e.target.files
    if (files) {
        imageUrls.value = [] // 既存の画像URLをクリア
        Array.from(files).forEach((file: File) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        // 配列に追加
                        imageUrls.value.push(e.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            }
        })
    }
}

async function fechCategoryList() {
    try {
        const response = await axios.get('/testData/categoryList.json')
        categoryList.value = response.data
    } catch (error: any) {
    console.error('Error:', error)
}}
async function fechGenreList() {
    try {
        const response = await axios.get('/testData/genreList.json')
        genreList.value = response.data
        filterGenreList.value = response.data
        
    } catch (error: any) {
    console.error('Error:', error)
}}

const onSubmit = () => {
    alert('投稿ボタンが押下されました')
}

onMounted(() => {
    fechCategoryList()
    fechGenreList()
})

watch(selectCategory, () => {
    selectGenre.value = null
    filterGenreList.value = genreList.value.filter((genre: any) => genre.categoryId === selectCategory.value) || null
})
</script>

<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-text-field type="text" placeholder="店名" variant="outlined" />
            <v-select :items="categoryList" item-title="categoryName" item-value="id" variant="outlined" placeholder="カテゴリー" v-model="selectCategory" ></v-select>
            <v-select :items="filterGenreList" item-title="genreName" item-value="id" variant="outlined" placeholder="ジャンル" v-model="selectGenre" ></v-select>
            <v-text-field type="text" placeholder="住所" variant="outlined" />
            <v-text-field type="number" placeholder="金額" variant="outlined" />
            <v-textarea type="text" placeholder="食べたもの" variant="outlined" />
            <v-file-input label="写真" @change="onFileSelected" accept="image/*" prepend-icon="mdi-camera" variant="outlined" multiple />
            <!-- 選択された複数の画像のプレビューを表示するように修正 -->
            <v-carousel  v-if="imageUrls.length" class="image-preview" show-arrows="hover" >
                <v-carousel-item v-for="(url, index) in imageUrls" :key="index" :src="url" contain />
            </v-carousel>
            <v-btn type="submit" variant="outlined">投稿する</v-btn>
        </v-form>
    </v-container>
</template>