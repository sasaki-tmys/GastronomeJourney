<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { getStorage, uploadBytesResumable, getDownloadURL, deleteObject, ref as firebaseref } from "firebase/storage"
import { getDatabase, set, update, get, child, push, remove } from 'firebase/database'
import { ref as dbRef } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'

const props = defineProps({
    isEdit: Boolean,
    storeId: String
})
interface Category {
    id: string,
    category_name: string
    category_image: string,
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
const initialValue = ({
    nameOfStore: '',
    visitDate: new Date,
    selectCategory: null,
    selectGenre: null,
    address: '',
    totalAmount: null,
    contents: 
`### たべたもの
- 

### のんだもの
- 

### その他
- `
})
const db = getDatabase()
const storage = getStorage()
const router = useRouter()

/**
 * リアクティブ変数
 */

// 初期フォーカス位置の指定
const initialFocus = ref()
const categoryList = ref<Category[]>()
const genreList = ref<Genre[]>([])
const filterGenreList = ref<Genre[]>([])
const inputImage = ref([])
const imageUrls = ref<string[]>([])
const addStoreData = reactive({
    nameOfStore: '',
    category: '',
    genre: '',
    visitDate: '',
    address: '',
    totalAmount: 0,
    contents: '',
    photos: '',
})

const files = ref<FileList>()

/**
 * メソッド
 */

const schema = yup.object({
    nameOfStore: yup.string().required('店名は必須です。'),
    address: yup.string().required('住所は必須です。'),
    totalAmount: yup.string().required('金額は必須です。'),
    selectCategory: yup.string().required('カテゴリーは必須です。'),
    selectGenre: yup.string().required('ジャンルは必須です。'),
})

const { errors, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: initialValue
})

const { value: nameOfStore } = useField<string>('nameOfStore')
const { value: visitDate } = useField<Date>('visitDate')
const { value: selectCategory } = useField<string>('selectCategory')
const { value: selectGenre } = useField<string|null>('selectGenre')
const { value: address } = useField<string>('address')
const { value: totalAmount } = useField<number>('totalAmount')
const { value: contents } = useField<string>('contents')

// 日付を yyyy-MM-dd 形式にフォーマットする関数
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
        files.value = input.files;
        imageUrls.value = [];
        const fileReaders = Array.from(files.value).map((file) => {
            if (file.type.startsWith('image/')) {
                return new Promise<void>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (event.target?.result) {
                            imageUrls.value.push(event.target.result as string);
                        }
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
        });

        Promise.all(fileReaders).then(() => {
            console.log('files.value', files.value);
            console.log('imageUrls.value', imageUrls.value);
        });
    }
}

const formattedDate = computed({
    get() {
        return visitDate.value ? formatDate(visitDate.value) : '';
    },
    set(newDate: string) {
        visitDate.value = new Date(newDate);
    }
})

const onSubmit = handleSubmit(async (values) => {
    addStoreData.nameOfStore = values.nameOfStore
    addStoreData.category = values.selectCategory ? values.selectCategory : ''
    addStoreData.genre = values.selectGenre ? values.selectGenre : ''
    addStoreData.visitDate = formattedDate.value
    addStoreData.address = values.address
    addStoreData.totalAmount = values.totalAmount ? values.totalAmount : 0
    addStoreData.contents = values.contents
    console.log(addStoreData)
    if (props.isEdit) {
        updateStore()
    } else {
        await addImg()
        postStore()
    }
})

/**
 * 非同期メソッド
 */

// 画像をアップロードするメソッド
async function addImg() {
    try {
        const urls = await uploadImages(files.value)
        addStoreData.photos = urls
        console.log("ファイルがアップロードされ、データが更新されました")
    } catch (error) {
        console.error("アップロード中にエラーが発生しました", error)
    }
}

// 画像を並列でアップロードするメソッド
async function uploadImages(files: FileList | undefined): Promise<string> {
    if (files === undefined) {
        return ''
    } else {
        const uploadPromises = Array.from(files).map(async (file) => {
            const id = uuidv4()
            const storageRef = firebaseref(storage, `images/stores/${id}`)
            const uploadTask = await uploadBytesResumable(storageRef, file)
            const url = await getDownloadURL(uploadTask.ref)
            return url
        })

        const urls = await Promise.all(uploadPromises)
        return urls.join(',')
    }
}

/**
 * APIリクエスト
 */
async function fetchCategoryList() {
    const categoriesRef = dbRef(db, 'categories')
    try {
        const snapshot = await get(categoriesRef)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            // rawDataをCategoryインターフェースの配列に変換
            const categories: Category[] = Object.keys(rawData).map((key) => ({
                id: key,
                category_name: rawData[key].category_name,
                category_image: rawData[key].category_image,
                img_name: rawData[key].img_name
            }))
            categoryList.value = categories
            console.log('カテゴリデータの取得が完了しました。')
        } else {
            console.log('カテゴリデータが見つかりません。')
            categoryList.value = []
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}
async function fetchGenreList() {
    const genresRef = dbRef(db, 'genres')
    try {
        const snapshot = await get(genresRef)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            // rawDataをCategoryインターフェースの配列に変換
            const genres: Genre[] = Object.keys(rawData).map((key) => ({
                id: key,
                name: rawData[key].name,
                category_id: rawData[key].category_id
            }))
            genreList.value = genres
            filterGenreList.value = genres
            console.log('ジャンルデータの取得が完了しました。')
        } else {
            console.log('ジャンルデータが見つかりません。')
            genreList.value = []
        }
    } catch (error) {
        console.error('Error fetching genres:', error)
    }
}

async function fetchFilterGenreList(genre: string) {
    const genresRef = dbRef(db, `genres/${genre}`)
    try {
        const snapshot = await get(genresRef)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            genreList.value = rawData
            selectGenre.value = genre
            console.log('ジャンルデータを取得しました。')
        } else {
            console.log('ジャンルデータが見つかりません。')
            genreList.value = []
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}

// 店舗情報の取得
async function getStore() {
    const storesRef = dbRef(db, `stores/${props.storeId}`)
    try {
        const snapshot = await get(storesRef)
        const data = snapshot.val()
        console.log(data)
        if (snapshot.exists()) {
            nameOfStore.value = data.nameOfStore
            selectCategory.value = data.category
            formattedDate.value = data.visitDate
            address.value = data.address
            totalAmount.value = data.totalAmount
            contents.value = data.contents
            fetchFilterGenreList(data.genre)
            selectGenre.value = data.genre
            imageUrls.value = data.photos.split(',')
            addStoreData.photos = data.photos
            console.log('店舗情報を取得しました。')
        } else {
            console.log('店舗情報が見つかりません。')
        }
    } catch (error) {
        console.error('Error fetching stores:', error)
    }
}
// 店舗情報の登録
async function postStore() {
    try {
        const storeRef = dbRef(db, 'stores')
        // Firebaseのキーを自動生成して使用する場合
        const newPostKey = push(child(storeRef, 'stores')).key
        await set(dbRef(db, `stores/${newPostKey}`), addStoreData)
        router.go(-1)
    } catch (error) {
        console.log(error)
    }
}

// 店舗情報の更新
async function updateStore() {
    try {
        const storeRef = dbRef(db, `stores/${props.storeId}`)
        await update(storeRef, addStoreData)
        router.go(-1)
    } catch (error) {
        console.log(error)
    }
}

// 店舗情報の削除
async function deleteStore() {
    try {
        // ストア情報を取得
        const storeRef = dbRef(db, `stores/${props.storeId}`)
        const snapshot = await get(storeRef)
        if (snapshot.exists()) {
            const storeData = snapshot.val()
            const imageUrls = storeData.photos.split(',')
            // データベースからストア情報を削除
            await remove(storeRef)

            // Firebase Storageから画像を削除
            if (Array.isArray(imageUrls)) {
                for (let index = 0; index < imageUrls.length; index++) {
                    const imageRef = firebaseref(storage, imageUrls[index])
                    await deleteObject(imageRef)
                    console.log(`Image at ${imageUrls[index]} deleted successfully`)
                }
            } else {
                const imageRef = firebaseref(storage, imageUrls)
                console.log('storeData.photos', imageRef)
                await deleteObject(imageRef)
                console.log(`Image at ${imageUrls} deleted successfully`)
            }

            console.log(`Store with ID ${props.storeId} deleted successfully`)
            router.push('/')
        } else {
            console.log("No store data available to delete")
        }
    } catch (error) {
        console.error('Error deleting store and image:', error)
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
        files.value = undefined
    }
})

/**
 * ライフサイクル
 */

onMounted(() => {
    fetchCategoryList()
    fetchGenreList()
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
            <div class="error" v-if="errors.nameOfStore">{{ errors.nameOfStore }}</div>
            <v-text-field type="date" placeholder="訪問日" variant="outlined" v-model="formattedDate" />
            <v-select :class="{readonly: props.isEdit}" :items="categoryList" item-title="category_name" item-value="id" variant="outlined" placeholder="カテゴリー" v-model="selectCategory" />
            <div class="error" v-if="errors.selectCategory">{{ errors.selectCategory }}</div>
            <v-select :class="{readonly: props.isEdit}" :items="filterGenreList" item-title="name" item-value="id" variant="outlined" placeholder="ジャンル" v-model="selectGenre" />
            <div class="error" v-if="errors.selectGenre">{{ errors.selectGenre }}</div>
            <v-text-field type="text" placeholder="住所" variant="outlined" v-model="address" />
            <div class="error" v-if="errors.address">{{ errors.address }}</div>
            <v-text-field type="number" placeholder="金額" variant="outlined" v-model="totalAmount" />
            <div class="error" v-if="errors.totalAmount">{{ errors.totalAmount }}</div>
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
            <v-btn class="mt-10" type="submit" :disabled="Object.keys(errors).length > 0" variant="outlined" :text="isEdit ? '編集する' : '投稿する'" />
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
.error {
    color: red;
    font-size: 14px;
    margin-bottom: 12px;
}
</style>