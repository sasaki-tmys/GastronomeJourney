<script setup lang="ts">
/**
 * import
 */
import { ref, reactive, onBeforeMount, computed } from 'vue'
import PostMenu from '@/components/Common/MenuList.vue'
import { getDatabase, get} from 'firebase/database'
import { ref as dbRef } from 'firebase/database'
import type {  Store } from '@/types/models.d.ts'
/**
 * props
 */

const props = defineProps({
    storeId: {
        type: String,
        required: true
    }
})
/**
 * emit
 */

/**
 * リアクティブ
 */
const storeInfo = reactive({} as Store)
const photoList = ref<string[]>([])
const formatAmount = ref<string>('')
/**
 * 変数
 */
const db = getDatabase()

/**
 * 変数(メソッド)
 */

/**
 * watch
 */

/**
 * computed
 */
const isLogined = computed(() => localStorage.getItem('isLoggedIn'))

/**
 * メソッド
 */
// 店舗情報の取得
async function fechstoreInfo() {
    const storesRef = dbRef(db, `stores/${props.storeId}`)
    try {
        const snapshot = await get(storesRef)
        const data = snapshot.val()
        if (snapshot.exists()) {
            Object.assign(storeInfo, data)
            photoList.value = storeInfo.photos.split(',')
            formatAmount.value = Number(storeInfo.totalAmount).toLocaleString()
            console.log('店舗情報を取得しました。')
        } else {
            console.log('店舗情報が見つかりません。')
        }
    } catch (error) {
        console.error('Error fetching stores:', error)
    }
}
/**
 * ライフサイクル
 */
onBeforeMount(() => {
    fechstoreInfo()
})

</script>

<template>
    <v-container>
        <v-card flat>
            <v-card-title>{{ storeInfo.nameOfStore }}</v-card-title>
            <v-card-subtitle>{{ '訪問日：' + storeInfo.visitDate }}</v-card-subtitle>
            <v-card-subtitle>{{ '予算：' + formatAmount + '円' }}</v-card-subtitle>
            <v-card-item>
                <span>住所：</span><a :href="`https://www.google.com/maps/search/${storeInfo.nameOfStore}`" target="_blank">{{ storeInfo.address }}</a>
            </v-card-item>
            <v-card-item>
                <div class="editor">
                    <mavon-editor :toolbarsFlag="false" defaultOpen="preview" :subfield="false" class="contents" v-model="storeInfo.contents" language="en" :boxShadow="false" />
                </div> 
            </v-card-item>
            <v-carousel  v-if="photoList.length" class="image-preview" show-arrows="hover" hide-delimiters>
                <v-carousel-item v-for="url, index in photoList" :key="index" :src="url" contain />
            </v-carousel>
        </v-card>
        <PostMenu v-if="isLogined" DisplayContents="Edit" :StoreId="storeId" />
    </v-container>
</template>

<style scoped>
.v-card {
    background-color: transparent !important;
}
.v-card-subtitle {
    padding-top: 10px;
}
.editor {
    padding-bottom: 20px;
}
:deep(.contents div) {
    background-color: #263238 !important;
}
:deep(.v-note-wrapper) {
    color: aliceblue !important;
}
</style>