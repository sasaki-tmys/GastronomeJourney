<script setup lang="ts">
/**
 * import
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
/**
 * props
 */

/**
 * emit
 */

/**
 * リアクティブ
 */
const drawer = ref<boolean>(false)
const items = ref([
    {
        title: 'ホーム',
        path: '/',
    },
    {
        title: '設定',
        path: '/settings',
    }
])
/**
 * 変数
 */
const router = useRouter()
const authStore = useAuthStore()
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
// ログアウト処理
async function logout() {
    const success = await authStore.logout()
    if (success) {
        router.push('/login')
    }
}
// アイテムクリック動作
const clickItem = (path: string) => {
    router.push(path)
}
/**
 * ライフサイクル
 */
</script>

<template>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary color="background" >
        <v-list v-for="item, index in items" :key="index">
            <v-list-item @click="clickItem(item.path)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list v-if="isLogined">
            <v-list-item @click="logout()">
                <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar color="background" >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
        <v-app-bar-title @click="router.push('/')" class="app-bar-title">Gastronome Journey</v-app-bar-title>
    </v-app-bar>
</template>

<style scoped>
.app-bar-title {
    cursor: pointer;
    user-select: none;
}
</style>