<script setup lang="ts">
/**
 * import
 */
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDatabase, set, get, push } from 'firebase/database'
import { ref as dbRef } from 'firebase/database'
import type { Category } from '@/types/models.d.ts'

/**
 * props
 */

/**
 * emit
 */

/**
 * リアクティブ
 */
const categoryList = ref<Category[]>()
const genreName = ref<string>('')
const categoryId = ref()
const addGenreData = reactive(
    {
        name: '',
        category_id: ''
    }
)
/**
 * 変数
 */
const router = useRouter()
const db = getDatabase()

/**
 * 変数(メソッド)
 */
const onSubmit = () => {
    addGenreData.name = genreName.value
    addGenreData.category_id = categoryId.value
    postGenre()
}
/**
 * watch
 */

/**
 * computed
 */

/**
 * メソッド
 */
// ジャンル情報の登録
async function postGenre() {
    const genresRef = dbRef(db, 'genres')
    try {
        // 新しいジャンルをデータベースに追加
        const newGenreRef = push(genresRef)
        await set(newGenreRef, addGenreData)
        console.log('ジャンルの登録が完了しました。')
        router.go(-1)
    } catch (error) {
        console.error('Error:', error)
    }
}
// カテゴリー情報の取得
async function fetchCategory() {
    const db = getDatabase()
    const categoriesRef = dbRef(db, 'categories')
    try {
        const snapshot = await get(categoriesRef)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            // rawDataをCategoryインターフェースの配列に変換
            const categories: Category[] = Object.keys(rawData).map((key) => ({
                id: key,
                category_name: rawData[key].category_name,
                category_img: rawData[key].category_image,
                img_name: rawData[key].img_name
            }))
            categoryList.value = categories
            console.log('カテゴリ情報の取得が完了しました。')
        } else {
            console.log('カテゴリ情報が見つかりません。')
            categoryList.value = []
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}
/**
 * ライフサイクル
 */

onMounted(() => {
    fetchCategory()
})

</script>

<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-select :items="categoryList" item-title="category_name" item-value="id" v-model="categoryId" variant="outlined" placeholder="catetory" />
            <v-text-field v-model="genreName" variant="outlined" placeholder="genre Name"/>
            <v-btn class="mt-2" type="submit" block text="Add Genre" />
        </v-form>
    </v-container>
</template>