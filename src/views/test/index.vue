<template>
  <div>
    <h1>测试页面</h1>
    <svg aria-hidden="true">
      <!-- #icon-文件夹名称-图片名称 -->
      <use href="#icon-login-eye-off" />
    </svg>
    <cp-icon name="home-docs"></cp-icon>
    <ul>
      <li>{{ store.user }}</li>
      <li @click="set">点击</li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
const store = useUserStore()
const set = () => {
  store.setUser({
    id: '1',
    mobile: '1',
    account: '1',
    avatar: '1',
    token: '1'
  })
}
</script>

<style scoped></style>
