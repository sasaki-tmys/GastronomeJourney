<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { getStorage, uploadBytesResumable, getDownloadURL, ref as firebaseref } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
    isEdit: Boolean,
    categoryId: String
})

const storage = getStorage()
const router = useRouter()

/**
 * 変数
 */

/**
 * リアクティブ変数
 */
const file = ref<File>()
const categoryName = ref('')
const imageUrl = ref()
const inputImage = ref()
const addCategoryDate = reactive(
    {
        category_name: '',
        category_img: '',
        img_name: ''
    }
)

/**
 * メソッド
 */
async function onSubmit() {
    addCategoryDate.category_name = categoryName.value
    addCategoryDate.img_name = inputImage.value[0].name
    await addImg()
    console.log(addCategoryDate)
    if (props.isEdit) {
        updateCategory()
    } else {
        postCategory()
    }
}
function onFileSelected(e: any) {
    file.value = e.target.files[0]
    if (file.value && file.value.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
        imageUrl.value = e.target ? e.target.result : ''
        }
        reader.readAsDataURL(file.value)
    }
}

/**
 * 非同期メソッド
 */

async function addImg() {
    try {
        const url = await uploadImg(file.value)
        addCategoryDate.category_img = url
        console.log("ファイルがアップロードされ、データが更新されました")
    } catch (error) {
        console.error("アップロード中にエラーが発生しました", error)
    }
}

async function uploadImg(file: any) {
    const id = uuidv4()
    const storageRef = firebaseref(storage, `images/categories/${id}`)
    const uploadTask = await uploadBytesResumable(storageRef, file)
    return getDownloadURL(uploadTask.ref)
}


/**
 * APIリクエスト
 */
async function postCategory() {
    try {
        await axios.post(import.meta.env.VITE_APP_BACKEND_BASE_URL + '/categories', addCategoryDate)
        console.log('カテゴリーの登録が完了しました。')
        router.go(-1)
    } catch(error: any) {
        console.log(error)
    }
}
async function updateCategory() {
    try {
        await axios.put(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/categories/${props.categoryId}`, addCategoryDate)
        console.log('カテゴリーの更新が完了しました。')
        router.go(-1)
    } catch(error: any) {
        console.log(error)
    }
}
async function getCategory() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/categories/${props.categoryId}`)
        categoryName.value = response.data.category_name
        imageUrl.value = response.data.category_img
    } catch(error: any) {
        console.log(error)
    }
}

/**
 * watchメソッド
 */
watch(inputImage, () => {
    if (imageUrl.value) {
        imageUrl.value = undefined
    }
    
})

/**
 * ライフサイクル
 */
onMounted(() => {
    if (props.isEdit) {
        getCategory()
    }
})
</script>
<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-text-field v-model="categoryName" variant="outlined" placeholder="Category Name"/>
            <!-- 画像アップロードの入力 -->
            <v-file-input
            label="Category Image"
            accept="image/*"
            prepend-icon="mdi-camera"
            @change="onFileSelected"
            outlined
            v-model="inputImage"
            />
            <!-- 選択された画像のプレビュー -->
            <div v-if="imageUrl" class="image-preview">
                <v-img :src="imageUrl" aspect-ratio="1.7" />
            </div>
            <v-btn class="mt-2" type="submit" block :text="isEdit ? '変更内容を保存しまっせ' : '追加しまっせ'" />
        </v-form>
    </v-container>
</template>