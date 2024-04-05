<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, reactive } from 'vue'

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

const router = useRouter()

const visitDate = ref('2024-04-05')
const nameOfStore = ref('')
const address = ref('')
const totalAmount = ref()
const contents = ref('')

const categoryList = ref<Category[]>()
const selectCategory = ref()
const genreList = ref<Genre[]>([])
const filterGenreList = ref<Genre[]>([])
const selectGenre = ref()

const imageUrls = ref<string[]>([])

const addArticleData = reactive({
    category: 0,
    genre: 0,
    visitDate: '',
    nameOfStore: '',
    address: '',
    totalAmount: 0,
    contents: '',
    photos: '',
})


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
    addArticleData.nameOfStore = nameOfStore.value
    addArticleData.category = selectCategory.value
    addArticleData.genre = selectGenre.value
    addArticleData.visitDate = visitDate.value
    addArticleData.address = address.value
    addArticleData.totalAmount = totalAmount.value
    addArticleData.contents = contents.value
    addArticleData.photos = ''
    postArticle()
}

async function postArticle() {
    try {
        await axios.post(import.meta.env.VITE_APP_BACKEND_BASE_URL + '/stores', addArticleData)
        router.go(-1)
        
    } catch(error: any) {
        console.log(error)
    }
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
            <v-text-field type="text" placeholder="店名" variant="outlined" v-model="nameOfStore" />
            <v-select :items="categoryList" item-title="categoryName" item-value="id" variant="outlined" placeholder="カテゴリー" v-model="selectCategory" ></v-select>
            <v-select :items="filterGenreList" item-title="genreName" item-value="id" variant="outlined" placeholder="ジャンル" v-model="selectGenre" ></v-select>
            <v-text-field type="text" placeholder="住所" variant="outlined" v-model="address" />
            <v-text-field type="number" placeholder="金額" variant="outlined" v-model="totalAmount" />
            <v-textarea type="text" placeholder="食べたもの" variant="outlined" v-model="contents" />
            <v-file-input label="写真" @change="onFileSelected" accept="image/*" prepend-icon="mdi-camera" variant="outlined" multiple />
            <!-- 選択された複数の画像のプレビューを表示するように修正 -->
            <v-carousel  v-if="imageUrls.length" class="image-preview" show-arrows="hover" >
                <v-carousel-item v-for="(url, index) in imageUrls" :key="index" :src="url" contain />
            </v-carousel>
            <v-btn type="submit" variant="outlined">投稿する</v-btn>
        </v-form>
    </v-container>
</template>