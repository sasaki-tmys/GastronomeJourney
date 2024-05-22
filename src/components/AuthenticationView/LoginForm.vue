
<script setup lang="ts">
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import router from '@/router/index'

const authStore = useAuthStore()
const visible = ref(false)

const passwordValidation = yup.string().test(
    'is-strong-password',
    'パスワードは少なくとも大文字、小文字、数字、特殊文字のうち3種類以上を含む必要があります',
    value => {
        if (!value) return false
        const regexes = [
            /[a-z]/,
            /[A-Z]/,
            /[0-9]/,
            /[!@#$%^&*(),.?":{}|<>]/,
        ]
        let matchCount = 0
        regexes.forEach(regex => {
        if (regex.test(value)) {
            matchCount += 1
        }
        })
        return matchCount >= 3
    }
)
const schema = yup.object({
    email: yup.string().email('有効なメールアドレスを入力してください').required('メールアドレスは必須です'),
    password: passwordValidation.required('パスワードは必須でっせ')
})

const { errors, handleSubmit } = useForm({
    validationSchema: schema,
})

const { value: password } = useField<string>('password')
const { value: email } = useField<string>('email')

const onSubmit = handleSubmit(async (values) => {
    const success = await authStore.login(values.email, values.password)
    if (success) {
        router.push('/')
    }
})
</script>

<template>
    <v-container>
        <v-img class="mx-auto mb-5" width="150px" height="150px" src="/logo.png"/>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="600" rounded="lg">
            <v-form @submit.prevent="onSubmit">
                <div class="pb-4">
                    <router-link to="/" >ログインせずに見る</router-link>
                </div>
                <!-- メールアドレスの入力欄 -->
                <div class="text-subtitle-1 text-medium-emphasis">メールアドレス</div>
                <v-text-field
                    density="compact"
                    placeholder="メールアドレス"
                    variant="outlined"
                    id="email"
                    type="email"
                    v-model="email"
                ></v-text-field>
                <span class="error" v-if="errors.email">{{ errors.email }}</span>
                <!-- パスワード入力欄 -->
                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">パスワード
                <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
                    パスワードを忘れただと？
                </a>
                </div>
                <v-text-field
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="!visible ? 'text' : 'password'"
                    density="compact"
                    placeholder="パスワード"
                    variant="outlined"
                    @click:append-inner="visible = !visible"
                    id="password"
                    v-model="password"
                ></v-text-field>
                <span class="error mb-3" v-if="errors.password">{{ errors.password }}</span>
                <v-divider></v-divider>
                <v-btn type="submit" :disabled="Object.keys(errors).length > 0" block class="button mt-8" color="blue" size="large" variant="tonal">login</v-btn>
            </v-form>
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
    </v-container>
</template>

<style scoped>
.error {
    color: red;
    font-size: 14px;
    margin-bottom: 12px;
}
</style>