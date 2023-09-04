<script setup lang="ts">
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import type { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'
import { getConsultOrderList } from '@/api/consult'
//  接受获取订单类型数据
const props = defineProps<{ type: ConsultType }>()
// 列表数据
const list = ref<ConsultOrderItem[]>([])
// 请求的分页参数
const params = ref<ConsultOrderListParams>({
  type: props.type, //订单类型
  current: 1, //当前请求第几页,默认第一
  pageSize: 10 //每页多少数据
})

const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  // 异步更新数据
  const { data } = await getConsultOrderList(params.value)
  list.value.push(...data.rows)

  loading.value = false // 加载状态结束

  if (list.value.length === data.total) {
    finished.value = true //数据全部加载完成
  } else {
    params.value.current++
  }
}

const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 订单列表 -->
      <consult-item @on-delete="onDelete" v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
