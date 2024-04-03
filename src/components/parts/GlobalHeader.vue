<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const drawer = ref(false)
const router = useRouter()


const items = ref([
    {
        title: 'ホーム',
        path: '/',
    },
    {
        title: '設定',
        path: '/settings',
    },
    {
        title: 'ログアウト',
        path: '/logout',
    },
])

const clickCategory = (path: string) => {
    router.push(path)
}

</script>

<template>
    <v-navigation-drawer v-model="drawer" location="bottom" temporary color="background" >
        <v-list v-for="item, index in items" :key="index">
            <v-list-item @click="clickCategory(item.path)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar color="background">
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