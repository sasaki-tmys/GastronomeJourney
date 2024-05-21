<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const drawer = ref(false)
const router = useRouter()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

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

const clickCategory = (path: string) => {
    router.push(path)
}
async function logout() {
    const success = await authStore.logout()
    if (success) {
        router.push('/login')
    }
}

</script>

<template>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary color="background" >
        <v-list v-for="item, index in items" :key="index">
            <v-list-item @click="clickCategory(item.path)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-list v-if="authStore.isLoggedIn">
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