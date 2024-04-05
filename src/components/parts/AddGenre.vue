<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const BaseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL

interface Category {
    id: string
    category_name: string
    category_image: string
}

const categoryList = ref<Category[]>()

const genreName = ref('')
const categoryId = ref()

const addGenreData = reactive(
    {
        name: '',
        category_id: ''
    }
)
const onSubmit = () => {
    addGenreData.name = genreName.value
    addGenreData.category_id = categoryId.value
    console.log(addGenreData)
    postgenre()
}

async function postgenre() {
    try {
        await axios.post(BaseURL + '/genres', addGenreData)
        router.go(-1)
    } catch(error: any) {
        console.log(error)
    }
}

async function fetchCategory() {
    try {
        const response = await axios.get(BaseURL + '/categories')
        categoryList.value = response.data.categories
    } catch(error: any) {
        console.log(error)
    }
}

onMounted(() => {
    fetchCategory()
})

</script>

<template>
    <v-container>
        <v-form @submit.prevent="onSubmit">
            <v-select :items="categoryList" item-title="category_name" item-value="id" v-model="categoryId" variant="outlined" placeholder="catetory" />
            <v-text-field v-model="genreName" variant="outlined" placeholder="genre Name"/>
            <v-btn class="mt-2" type="submit" block>Submit</v-btn>
        </v-form>
    </v-container>
</template>