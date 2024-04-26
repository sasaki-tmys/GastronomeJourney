<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    DisplayContents: String,
    CategoryId: String,
    StoreId: String
})

const router = useRouter()


const addItems = ref([
    { id: '1', icon: 'mdi-pencil-plus', title: '新規投稿', path: '/addstore'},
    { id: '2', icon: 'mdi-tag-plus', title: 'カテゴリー追加', path: '/addcategory'},
    { id: '3', icon: 'mdi-view-grid-plus', title: 'ジャンル追加', path: '/addgenre'}
])
const editCategory = ref([
    { id: '1', icon: 'mdi-tag-plus', title: 'カテゴリー編集', path: `/editcategory/${props.CategoryId}`}
])
const editStore = ref([
    { id: '1', icon: 'mdi-tag-plus', title: '店舗情報編集', path: `/editstore/${props.StoreId}`}
])

</script>

<template>
    <div>
        <v-menu location="start" class="menu">
            <template v-slot:activator="{ props }">
                <div class="menu-button" >
                    <v-btn icon="mdi-plus" v-bind="props" size="x-large" />
                </div>
            </template>
            <v-list v-if="DisplayContents == 'Home'">
                <v-list-item v-for="addItem in addItems" :key="addItem.id" @click="router.push(addItem.path)">
                    <div class="list-items">
                        <v-icon class="list-icon" :icon="addItem.icon" />
                        <v-list-item-title>{{ addItem.title }}</v-list-item-title>
                    </div>
                </v-list-item>
            </v-list>
            <v-list v-else-if="DisplayContents == 'Edit' && !props.StoreId">
                <v-list-item v-for="editItem in editCategory" :key="editItem.id" @click="router.push(editItem.path)">
                    <div class="list-items">
                        <v-icon class="list-icon" :icon="editItem.icon" />
                        <v-list-item-title>{{ editItem.title }}</v-list-item-title>
                    </div>
                </v-list-item>
            </v-list>
            <v-list v-else>
                <v-list-item v-for="editItem in editStore" :key="editItem.id" @click="router.push(editItem.path)">
                    <div class="list-items">
                        <v-icon class="list-icon" :icon="editItem.icon" />
                        <v-list-item-title>{{ editItem.title }}</v-list-item-title>
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