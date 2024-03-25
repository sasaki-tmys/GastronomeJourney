<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

const categoryList = ref([
    { id: '1', title: '居酒屋', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', path: 'izakaya' },
    { id: '2', title: 'ラーメン', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', path: 'ramen' },
    { id: '3', title: '旅行', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', path: 'travel' }
])

</script>

<template>
    <v-container>
        <div>
            <v-row>
                <v-col cols="12" md="6" v-for="card in categoryList" :key="card.title">
                    <v-card @click="router.push('/')" hover>
                        <v-img
                        :src="card.src"
                        class="align-end"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="200px"
                        cover
                        >
                        <v-card-title class="categoryTitle">{{ card.title }}</v-card-title>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<style scoped>
.main-button
.button {
    justify-content: center;
}
.categoryTitle {
    color: aqua;
    font-size: 24px;
    font-weight: 700;
}

</style>

