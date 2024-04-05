<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const dialog = ref(false)

const menuItems = ref([
    { id: '1', icon: 'mdi-pencil-plus', title: '新規投稿', path: '/articlecreate'},
    { id: '2', icon: 'mdi-tag-plus', title: 'カテゴリー追加', path: '/addCategory'},
    { id: '3', icon: 'mdi-view-grid-plus', title: 'ジャンル追加', path: '/addGenre'}
])

</script>

<template>
    <div>
        <v-menu location="start" class="menu">
            <template v-slot:activator="{ props }">
                <div class="menu-button" >
                    <v-btn @click="dialog = true" icon="mdi-plus" v-bind="props" size="x-large" />
                </div>
            </template>
            <v-list>
                <v-list-item v-for="menuItem in menuItems" :key="menuItem.id" @click="router.push(menuItem.path)">
                    <div class="list-items">
                        <v-icon class="list-icon" :icon="menuItem.icon" />
                        <v-list-item-title>{{ menuItem.title }}</v-list-item-title>
                    </div>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<style scoped>
.menu-button {
    position: fixed;
    right: 0;
    bottom: 0;
    text-align: end;
    padding: 30px;
}
.v-list {
    /* background-color: transparent !important; */
    margin-right: 10px;
    margin-bottom: 20px;
}
.list-icon {
    /* background-color: transparent !important; */
}
.list-items {
    display: flex;
    align-items: center;
    gap: 10px;
    color: contrast(var(--background-color));
}
</style>