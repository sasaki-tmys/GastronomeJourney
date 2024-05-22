<script setup lang="ts">
import router from '@/router'
import { ref, onMounted, computed } from 'vue'
import PostMenu from '@/components/parts/MenuList.vue'
import { getDatabase, ref as dbRef, get } from 'firebase/database'

const db = getDatabase()

interface Category {
    id: string
    category_name: string
    category_img: string
    img_name: string
}
const isLogined = computed(() => localStorage.getItem('isLoggedIn'))
const categoryList = ref<Category[]>()
const clickCategory = (id: any) => {
    router.push(`/category/${id}`)
}

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
                category_img: rawData[key].category_img,
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

onMounted(() => {
    fetchCategoryList()
})

</script>

<template>
    <v-container>
        <div>
            <v-row v-if="categoryList">
                <v-col cols="12" md="6" v-for="category in categoryList" :key="category.id">
                    <v-card @click="clickCategory(category.id)" hover>
                        <v-img
                        :src="category.category_img"
                        height="250px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ category.category_name }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
            <PostMenu DisplayContents="Home" :isLogined="Boolean(isLogined)" />
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

