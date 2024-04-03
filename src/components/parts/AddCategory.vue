<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const categoryName = ref('')
const imageUrl = ref<any>()

const addCategoryDate = reactive(
    {
        id: '',
        categoryName: '',
        categoryImage: ''
    }
)

function onFileSelected(e: any) {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
        imageUrl.value = e.target ? e.target.result : ''
        }
        reader.readAsDataURL(file)
    }
}

const onSubmit = () => {
    addCategoryDate.id = '7'
    addCategoryDate.categoryName = categoryName.value
    addCategoryDate.categoryImage = ''
    console.log(addCategoryDate)
    postCategory()
}

async function postCategory() {
    try {
        await axios.post('/public/testData/categoryList.json', addCategoryDate)
        router.go(-1)
    } catch(error: any) {
        console.log(error)
    }
}

</script>

<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-text-field v-model="categoryName" variant="outlined" placeholder="Category Name"/>
            <!-- 画像アップロードの入力 -->
            <v-file-input
            label="Category Image"
            @change="onFileSelected"
            accept="image/*"
            prepend-icon="mdi-camera"
            outlined
            multiple
            />
            <!-- 選択された画像のプレビュー -->
            <div v-if="imageUrl" class="image-preview">
                <v-img :src="imageUrl" aspect-ratio="1.7"></v-img>
            </div>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
        </v-form>
    </v-container>
</template>