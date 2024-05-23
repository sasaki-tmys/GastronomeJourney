<script setup lang="ts">
/**
 * import
 */
import router from '@/router'
import { ref, onMounted, watch, computed } from 'vue'
import PostMenu from '@/components/Common/MenuList.vue'
import { getDatabase, query, orderByChild, equalTo, get } from 'firebase/database'
import { ref as dbRef } from 'firebase/database'
import type { Genre, Store } from '@/types/models.d.ts'

/**
 * props
 */
const props = defineProps({
    categoryId: {type: String, required: true}
})

/**
 * emit
 */

/**
 * リアクティブ
 */

const genreList = ref<Genre[]>([])
const selectedGenreList = ref<Genre[]>([])
const selectedGenre = ref<string>('')
const storeInfoList = ref<Store[]>([])
const storeInfoAllList = ref<Store[]>([])
/**
 * 変数
 */
// firebaseのDB
const db = getDatabase()

/**
 * 変数(メソッド)
 */

/**
 * watch
 */
watch((selectedGenre), () => {
    if (selectedGenre.value !== '0') {
        storeInfoList.value = storeInfoAllList.value.filter((storeInfo: any) => storeInfo.genre == selectedGenre.value) || null
    } else {
        storeInfoList.value = storeInfoAllList.value
    }
})

/**
 * computed
 */
// ログイン状態の取得
const isLogined = computed(() => localStorage.getItem('isLoggedIn'))

/**
 * メソッド
 */
// ジャンル情報の取得
async function fetchGenreList() {
    const genresRef = dbRef(db, 'genres')
    const genresQuery = query(genresRef, orderByChild('category_id'), equalTo(props.categoryId));
    try {
        const snapshot = await get(genresQuery)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            // rawDataをCategoryインターフェースの配列に変換
            genreList.value = Object.keys(rawData).map((key) => ({
                id: key,
                name: rawData[key].name,
                category_id: rawData[key].category_id
            }))
            selectedGenreList.value = genreList.value
            console.log('ジャンル情報を取得しました。')
        } else {
            console.log('ジャンル情報が見つかりません。')
            genreList.value = []
        }
    } catch (error) {
        console.error('Error fetching genres:', error)
    }
}
// 
async function fetchStoreList() {
    const storesRef = dbRef(db, 'stores')
    const storesQuery = query(storesRef, orderByChild('category'), equalTo(props.categoryId));
    try {
        const snapshot = await get(storesQuery)
        if (snapshot.exists()) {
            const rawData = snapshot.val()
            // rawDataをCategoryインターフェースの配列に変換
            storeInfoAllList.value = Object.keys(rawData).map((key) => ({
                id: key,
                category: rawData[key].category,
                genre: rawData[key].genre,
                visitDate: rawData[key].visitDate,
                nameOfStore: rawData[key].nameOfStore,
                address: rawData[key].address,
                totalAmount: rawData[key].totalAmount,
                contents: rawData[key].contents,
                photos: rawData[key].photos.split(',')
            }))
            storeInfoList.value = storeInfoAllList.value
            console.log('店舗情報を取得しました。')
        } else {
            console.log('店舗情報が見つかりません。')
            genreList.value = []
        }
    } catch (error) {
        console.error('Error fetching stores:', error)
    }
}

/**
 * ライフサイクル
 */

onMounted(() => {
    fetchGenreList()
    fetchStoreList()
})
</script>

<template>
    <v-container>
        <div>
            <v-row class="pt-5">
                <v-select variant="outlined" label="ジャンル選択" :items="selectedGenreList" item-value="id" item-title="name" v-model="selectedGenre"/>
            </v-row>
        </div>
        <div>
            <v-row>
                <v-col cols="12" md="4" v-for="stores in storeInfoList" :key="stores.id">
                    <v-card @click="router.push(`/category/${props.categoryId}/store/${stores.id}/`)">
                        <v-img
                        :src="stores.photos[0]"
                        height="200px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ stores.nameOfStore }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
            <post-menu v-if="isLogined" DisplayContents="Edit" :category-id="categoryId" />
        </div>
    </v-container>
</template>

<style scoped>
.categoryTitle {
    color: aqua;
    font-size: 24px;
    font-weight: 700;
}
</style>