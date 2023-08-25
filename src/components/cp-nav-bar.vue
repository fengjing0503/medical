<script setup lang="ts">
import router from '@/router'

// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
const onClickLeft = () => {
  //点击左侧返回
  if (history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

defineProps<{
  title: string
  rightText: string
}>()

const emit = defineEmits<{
  (e: 'click-right'): void
}>()
</script>

<template>
  <van-nav-bar
    left-arrow
    @click-left="onClickLeft"
    fixed
    :title="title"
    :right-text="rightText"
    @click-right="emit('click-right')"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
    }
  }
}
</style>
