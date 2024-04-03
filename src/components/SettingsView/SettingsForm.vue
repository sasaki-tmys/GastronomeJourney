<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const categoryName = ref('')
// imageUrlを配列に変更
const imageUrls = ref<string[]>([])

const addCategoryData = reactive({
    id: '',
    categoryName: '',
    categoryImage: ''
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

const onSubmit = () => {
    addCategoryData.id = '7'
    addCategoryData.categoryName = categoryName.value
    addCategoryData.categoryImage = ''
    console.log(addCategoryData)
    postCategory()
}

async function postCategory() {
    try {
        await axios.post('/public/testData/categoryList.json', addCategoryData)
        router.go(-1)
    } catch (error: any) {
        console.log(error)
    }
}
</script>

<template>
    <v-container>
    <v-form @submit.prevent="onSubmit">
        <v-text-field v-model="categoryName" variant="outlined" placeholder="Category Name"/>

        <v-file-input
        label="Category Image"
        @change="onFileSelected"
        accept="image/*"
        prepend-icon="mdi-camera"
        outlined
        multiple
        />

        <!-- 選択された複数の画像のプレビューを表示するように修正 -->
        <v-carousel  v-if="imageUrls.length" class="image-preview" show-arrows="hover">
            <v-carousel-item v-for="(url, index) in imageUrls" :key="index" :src="url" contain/>
        </v-carousel>

        <v-btn class="mt-2" type="submit" block>Submit</v-btn>
    </v-form>
    </v-container>
</template>