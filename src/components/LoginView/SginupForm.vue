
<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const agreement = ref(false)
const privacydialog = ref(false)
const servicedialog = ref(false)
const isValid = ref(false)
const isLoading = ref(false)
const visible = ref(false)
const rules = {
    email: (v: string) => !!(v || '').match(/@/) || 'Please enter a valid email',
    length: (len: any) => (v: any) => (v || '').length >= len || `Invalid character length, required ${len}`,
    password: (v: string) => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
        'パスワードは、大文字、数字、特殊文字を含む必要があります。',
    required: (v: any) => !!v || 'This field is required',
    }
</script>

<template>
    <v-container>
        <div class="sginup">
        <v-img
        class="mx-auto my-6"
        width="180"
        height="180"
        src="src/assets/ssk_image_icon2.png"
        ></v-img>
    
    <v-card
    class="mx-auto pa-12 pb-8"
    max-width="600"
    elevation="8"
    >
    
    <v-form
        ref="form"
        v-model="isValid"
    >
        <!-- ユーザー名入力欄 -->
        <div class="text-subtitle-1 text-medium-emphasis">ユーザー名</div>
        <v-text-field
            density="compact"
            placeholder="ユーザー名"
            variant="outlined"
            id="name"
            autocomplete="off"
            v-model="name"
        ></v-text-field>

        <!-- メールアドレスの入力欄 -->
        <div class="text-subtitle-1 text-medium-emphasis">メールアドレス</div>
        <v-text-field
            density="compact"
            placeholder="メールアドレス"
            variant="outlined"
            id="email"
            autocomplete="off"
            type="email"
            v-model="email"
            :rules="[rules.email]"
        ></v-text-field>

        <!-- パスワード入力欄 -->
        <div class="text-subtitle-1 text-medium-emphasis">パスワード</div>
        <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="!visible ? 'text' : 'password'"
            density="compact"
            placeholder="パスワード"
            variant="outlined"
            @click:append-inner="visible = !visible"
            id="password"
            autocomplete="off"
            v-model="password"
            :rules="[rules.password, rules.length(6)]"
        ></v-text-field>

        <v-checkbox
        v-model="agreement"
        :rules="[rules.required]"
        color="deep-purple"
        >
        <template v-slot:label>
            I agree to the&nbsp;
            <a
            href="#"
            @click.stop.prevent="servicedialog = true"
            >Terms of Service</a>
            &nbsp;and&nbsp;
            <a
            href="#"
            @click.stop.prevent="privacydialog = true"
            >Privacy Policy</a>*
        </template>
        </v-checkbox>
    </v-form>
    
    <v-divider></v-divider>
    
    <v-card-actions>
        <v-btn
        :disabled="!isValid"
        :loading="isLoading"
        block
        class="button mb-8"
        color="blue"
        size="large"
        variant="tonal"
        >
        登録
        </v-btn>
    </v-card-actions>

    <!-- 規約等の確認画面 -->
    <v-dialog
        v-model="servicedialog"
        max-width="400"
        persistent
    >
        <v-card>
        <v-card-title class="text-h5 bg-grey-lighten-3">
            Terms of Service
        </v-card-title>
        <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn
            variant="text"
            @click="agreement = false, servicedialog = false"
            >
            No
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
            color="deep-purple"
            variant="tonal"
            @click="agreement = true, servicedialog = false"
            >
            Yes
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="privacydialog"
        max-width="400"
        persistent
    >
        <v-card>
        <v-card-title class="text-h5 bg-grey-lighten-3">
            Privacy Policy
        </v-card-title>
        <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn
            variant="text"
            @click="agreement = false, privacydialog = false"
            >
            No
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
            color="deep-purple"
            variant="tonal"
            @click="agreement = true, privacydialog = false"
            >
            Yes
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>

    <v-card-text class="text-center">
        <router-link 
            to="/login"
            class="text-blue text-decoration-none"
            rel="noopener noreferrer">
            <v-icon icon="mdi-chevron-left"></v-icon>
            Log in
        </router-link>
    </v-card-text>
    </v-card>
    </div>
    </v-container>
</template>
