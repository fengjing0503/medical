<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { useWindowSize } from '@vueuse/core'
import { getDoctorPage } from '@/api/consult'
import { onMounted, ref } from 'vue'
import type { DoctorList } from '@/types/consult'

const { width } = useWindowSize() //页面宽度

// 获取关注医生列表数据
const list = ref<DoctorList>([])
const getList = async () => {
  const { data } = await getDoctorPage({ current: 1, pageSize: 6 })
  console.log(data)
  list.value = data.rows
}
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe
        :width="(150 / 375) * width"
        class="my-swipe"
        indicator-color="white"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="item in list" :key="item.id">
          <!-- 单个医生的信息 -->
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  // height: 250px;
  padding-bottom: 20px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
