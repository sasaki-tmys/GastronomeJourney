<script setup lang="ts">

const onSubmit = () => {
    alert('タップしたよね！！')
}
</script>
<template>
    <v-container>
        <v-btn @click="onSubmit">たっぷ！！ </v-btn>
    </v-container>
</template>