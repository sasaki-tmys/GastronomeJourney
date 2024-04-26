<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, reactive } from 'vue'
import { getStorage, uploadBytesResumable, getDownloadURL, ref as firebaseref } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
    isEdit: Boolean,
    storeId: String
})

interface Category {
    id: string
    category_name: string
    category_img: string
    img_name: string
}
interface Genre {
    id: string
    name: string
    category_id: string
}

/**
 * 変数
 */

const customToolbars = {
        bold: true, // 太字
        header: true, // 見出し
        ol: true, // 番号付きリスト
        ul: true, // 番号なしリスト
        fullscreen: true, // フルスクリーン
        htmlcode: true, // HTMLコード表示
        preview: true,
    }

const storage = getStorage()
const router = useRouter()

/**
 * リアクティブ変数
 */

// 初期フォーカス位置の指定
const initialFocus = ref()

const visitDate = ref(new Date)
const nameOfStore = ref('')
const address = ref('')
const totalAmount = ref()
const contents = ref(
`### たべたもの
- 

### のんだもの
- 

### その他
- `
)
const categoryList = ref<Category[]>()
const selectCategory = ref()
const genreList = ref<Genre[]>([])
const filterGenreList = ref<Genre[]>([])
const selectGenre = ref()
const inputImage = ref([])
const imageUrls = ref<string[]>([])
const addStoreData = reactive({
    category: 0,
    genre: 0,
    visitDate: '',
    nameOfStore: '',
    address: '',
    totalAmount: 0,
    contents: '',
    photos: '',
})
const files = ref<FileList>()

/**
 * メソッド
 */

function onFileSelected(e: any) {
    files.value = e.target.files as FileList
    if (files.value) {
        imageUrls.value = []
        for (const file of files.value) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        imageUrls.value.push(e.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
    }
}

async function onSubmit() {
    addStoreData.nameOfStore = nameOfStore.value
    addStoreData.category = selectCategory.value
    addStoreData.genre = selectGenre.value
    addStoreData.visitDate = visitDate.value.toString()
    addStoreData.address = address.value
    addStoreData.totalAmount = totalAmount.value
    addStoreData.contents = contents.value
    await addImg()
    console.log(addStoreData)
    if (props.isEdit) {
        updateStore()
    } else {
        postStore()
    }
}

/**
 * 非同期メソッド
 */

async function addImg() {
    try {
        const urls = await uploadImages(files.value)
        addStoreData.photos = urls
        console.log("ファイルがアップロードされ、データが更新されました")
    } catch (error) {
        console.error("アップロード中にエラーが発生しました", error)
    }
}
async function uploadImages(files: FileList | undefined) {
    const urls = [];
    if (files === undefined) {
        return ''
    } else {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                const id = uuidv4();
                const storageRef = firebaseref(storage, `images/stores/${id}`);
                const uploadTask = await uploadBytesResumable(storageRef, file);
                const url = await getDownloadURL(uploadTask.ref);
                urls.push(url);
            }
        }
        return urls.join(',')
    }
}

/**
 * APIリクエスト
 */
// カテゴリーの取得
async function fechCategoryList() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + '/categories/')
        categoryList.value = response.data.categories
    } catch (error: any) {
    console.error('Error:', error)
}}
// ジャンルの取得
async function fechGenreList() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + '/genres/')
        genreList.value = response.data
        filterGenreList.value = response.data
        
    } catch (error: any) {
    console.error('Error:', error)
}}
// 店舗情報の取得
async function getStore() {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/${props.storeId}`)
        nameOfStore.value = response.data.nameOfStore
        selectCategory.value = response.data.category
        visitDate.value = response.data.visitDate
        address.value = response.data.address
        totalAmount.value = response.data.totalAmount
        contents.value = response.data.contents
        genreList.value = await axios.get(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/genres/category/${response.data.category}`)
        selectGenre.value = response.data.genre
        console.log(response.data)
    } catch(error: any) {
        console.log(error)
    } 
}
// 店舗情報の登録
async function postStore() {
    try {
        await axios.post(import.meta.env.VITE_APP_BACKEND_BASE_URL + '/stores', addStoreData)
        router.go(-1)
        
    } catch(error: any) {
        console.log(error)
    }
}
// 店舗情報の更新
async function updateStore() {
    try {
        await axios.put(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/${props.storeId}`, addStoreData)
        router.go(-1)
        
    } catch(error: any) {
        console.log(error)
    }
}
// 店舗情報の削除
async function deleteStore() {
    try {
        await axios.delete(import.meta.env.VITE_APP_BACKEND_BASE_URL + `/stores/${props.storeId}`)
        router.push(`/category/${selectCategory.value}`)
        
    } catch(error: any) {
        console.log(error)
    }
}

/**
 * watchメソッド
 */

watch(selectCategory, () => {
    selectGenre.value = null
    filterGenreList.value = genreList.value.filter((genre: any) => genre.category_id === selectCategory.value) || null
})
watch(inputImage, () => {
    if (imageUrls.value) {
        imageUrls.value = []
    }
})

/**
 * ライフサイクル
 */

onMounted(() => {
    fechCategoryList()
    fechGenreList()
    initialFocus.value.focus()
    if(props.isEdit) {
        getStore()
    }
})

</script>

<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-text-field type="text" placeholder="店名" variant="outlined" v-model="nameOfStore" ref="initialFocus" />
            <v-text-field type="date" placeholder="訪問日" variant="outlined" v-model="visitDate" />
            <v-select :class="{readonly: props.isEdit}" :items="categoryList" item-title="category_name" item-value="id" variant="outlined" placeholder="カテゴリー" v-model="selectCategory" />
            <v-select :class="{readonly: props.isEdit}" :items="filterGenreList" item-title="name" item-value="id" variant="outlined" placeholder="ジャンル" v-model="selectGenre" />
            <v-text-field type="text" placeholder="住所" variant="outlined" v-model="address" />
            <v-text-field type="number" placeholder="金額" variant="outlined" v-model="totalAmount" />
            <div class="editor">
                <v-no-ssr>
                    <mavon-editor :toolbars="customToolbars" :subfield="false" defaultOpen="edit" class="contents" v-model="contents" language="en" :boxShadow="false" />
                </v-no-ssr>
            </div>
            <v-file-input label="写真" @change="onFileSelected" accept="image/*" prepend-icon="mdi-camera" variant="outlined" multiple v-model="inputImage" />
            <!-- 選択された複数の画像のプレビューを表示する -->
            <v-carousel  v-if="imageUrls.length" class="image-preview" show-arrows="hover" >
                <v-carousel-item v-for="(url, index) in imageUrls" :key="index" :src="url" contain />
            </v-carousel>
            <v-btn class="mt-10" type="submit" variant="outlined" :text="isEdit ? '編集する' : '投稿する'" />
            <v-btn v-if="isEdit" class="mt-10 ml-10" variant="outlined" text="削除する" @click="deleteStore()" />
        </v-form>
    </v-container>
</template>

<style scoped>
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
.readonly {
    pointer-events: none;
}
</style>