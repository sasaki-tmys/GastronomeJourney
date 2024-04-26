
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router';
const store = useAuthStore()

const visible = ref(false)

const userData = reactive({
    name: '',
    email: '',
    password: '',
    accountName:  '@Ematoron',
    avatar:  import.meta.env.VITE_USER_AVATAR,
    background:  import.meta.env.VITE_USER_BACKGROUND,
    address:  '北海道札幌市中央区',
    useStartDate:  '2019年9月',
    contents:  'Whispering wisdom to the digital realm, echoing insights across the vast cyber expanse, Whispering wisdom to the digital realm, echoing insights across the vast cyber expanse, Whispering wisdom to the digital realm, echoing insights across the vast cyber expanse',
    currentFollow:  '1,100',
    currentFollower:  '100',
    postCounts:  '10',
})

const onSubmit = () => {
    const success = store.login(userData)

    if(success) {
            router.push('/')
        } else {
            // ログイン失敗
            alert("ログインに失敗しました。");
        }
}

</script>

<template>
    <v-container>
        <div class="login">

<v-img
    class="mx-auto mb-5"
    width="180px"
    height="180px"
    src="src/assets/logo.png"
></v-img>

<v-card
    class="mx-auto pa-12 pb-8"
    elevation="8"
    max-width="600"
    rounded="lg"
>
<!-- <div>
    <v-btn rounded variant="outlined" prepend-icon="">Googleアカウントでログイン</v-btn>
</div> -->
    <!-- ユーザー名入力欄 -->
    <div class="pt-10 text-subtitle-1 text-medium-emphasis">ユーザー名</div>
    <v-text-field
        density="compact"
        placeholder="ユーザー名"
        variant="outlined"
        id="name"
        autocomplete="off"
        v-model="userData.name"
    ></v-text-field>

    <!-- メールアドレス入力欄 -->
    <div class="text-subtitle-1 text-medium-emphasis">メールアドレス</div>
    <v-text-field
    density="compact"
    placeholder="メールアドレス"
    variant="outlined"
    id="email"
    autocomplete="off"
    v-model="userData.email"
    ></v-text-field>

    <!-- パスワード入力欄 -->
    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
    パスワード
    <a
        class="text-caption text-decoration-none text-blue"
        href="#"
        rel="noopener noreferrer"
        target="_blank"
    >
        Forgot login password?</a>
    </div>

    <v-text-field
    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
    :type="!visible ? 'text' : 'password'"
    density="compact"
    placeholder="パスワード"
    variant="outlined"
    @click:append-inner="visible = !visible"
    id="password"
    autocomplete="off"
    v-model="userData.password"
    ></v-text-field>

    <v-card
    class="mb-12"
    color="surface-variant"
    variant="tonal"
    >
    <v-card-text class="text-medium-emphasis text-caption">
        テキストレイアウト
    </v-card-text>
    </v-card>

    <v-btn
    block
    class="button mb-8"
    color="blue"
    size="large"
    variant="tonal"
    @click="onSubmit"
    >
    Log In
    </v-btn>

    <v-card-text class="text-center">
    <router-link 
        to="/sginup"
        class="text-blue text-decoration-none"
        rel="noopener noreferrer">
        Sign up now
        <v-icon icon="mdi-chevron-right"></v-icon>
    </router-link>
    </v-card-text>
</v-card>
</div>
    </v-container>
</template>
