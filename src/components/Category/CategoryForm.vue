<script setup lang="ts">
/**
 * import
 */
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage, uploadBytesResumable, getDownloadURL, ref as firebaseref } from "firebase/storage"
import { getDatabase, set, update, get, child, push } from 'firebase/database'
import { ref as dbRef } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'

/**
 * props
 */
const props = defineProps({
    isEdit: {
        type: Boolean,
        requred: true
    },
    categoryId: {
        type: String,
        required: false
    }
})
/**
 * emit
 */

/**
 * リアクティブ
 */
const file = ref<File>()
const categoryName = ref<string>('')
const imageUrl = ref()
const inputImage = ref<File>()
const addCategoryData = reactive(
    {
        category_name: '',
        category_img: '',
        img_name: ''
    }
)
/**
 * 変数
 */
const db = getDatabase()
const storage = getStorage()
const router = useRouter()
/**
 * 変数(メソッド)
 */

/**
 * watch
 */
watch(inputImage, () => {
    if (imageUrl.value) {
        imageUrl.value = undefined
    }
    
})

/**
 * computed
 */

/**
 * メソッド
 */
async function onSubmit() {
    addCategoryData.category_name = categoryName.value
    addCategoryData.img_name = inputImage.value ? inputImage.value.name : ''
    await addImg()
    console.log(addCategoryData)
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

// ファイルアップロードとカテゴリデータの更新を行うメソッド
async function addImg() {
    try {
        const url = await uploadImg(file.value)
        addCategoryData.category_img = url
        console.log("ファイルがアップロードされ、データが更新されました")
    } catch (error) {
        handleError(error)
    }
}

// ファイルをアップロードし、ダウンロードURLを取得するメソッド
async function uploadImg(file: File|undefined): Promise<string> {
    if (file === undefined) {
        return ''
    } else {
        const id = uuidv4()
        const storageRef = firebaseref(storage, `images/categories/${id}`)
        try {
            const uploadTask = await uploadBytesResumable(storageRef, file)
            const url = await getDownloadURL(uploadTask.ref)
            return url
        } catch (error) {
            handleError(error)
            return ''
        }
    }
}

// エラーハンドリングを行う共通メソッド
function handleError(error: any) {
    alert(JSON.stringify(error, null, 2))
    console.error("アップロード中にエラーが発生しました", error)
}
// カテゴリー情報登録
async function postCategory() {
    const categoriesRef = dbRef(db, 'categories')
    try {
        // Firebaseのキーを自動生成して使用する場合
        const newPostKey = push(child(categoriesRef, 'categories')).key
        await set(dbRef(db, 'categories/' + newPostKey), addCategoryData)
        console.log('カテゴリーの登録が完了しました。')
        router.go(-1)
    } catch (error) {
        alert(JSON.stringify(error, null, 2))
        console.error(error)
    }
}
// カテゴリー情報更新
async function updateCategory() {
    try {
        await update(dbRef(db, `categories/${props.categoryId}`), addCategoryData)
        console.log('カテゴリーの更新が完了しました。')
        router.go(-1)
    } catch (error) {
        console.error(error)
    }
}
// カテゴリー情報取得
async function getCategory() {
    const categoryRef = dbRef(db, `categories/${props.categoryId}`)
    try {
        const snapshot = await get(categoryRef)
        if (snapshot.exists()) {
            const data = snapshot.val()
            categoryName.value = data.category_name
            imageUrl.value = data.category_img
        } else {
            console.log('データがないよ〜')
        }
    } catch (error) {
        console.error(error)
    }
}

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