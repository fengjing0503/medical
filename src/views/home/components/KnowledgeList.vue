<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeType, KnowledgeParams, KnowledgeList } from '@/types/consult'
import { getKnowledgePage } from '@/api/consult'

// 列表数据
const list = ref<KnowledgeList>([])
// 列表加载状态 true:加载中 , false:加载完成
const loading = ref(false)
// 控制数据是否全部加载完成,false:还有数据,true:没数据了
const finished = ref(false)

// 接收需要查询的列表类型
const props = defineProps<{
  type: KnowledgeType
}>()

const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})

// 加载数据函数: 1.页面打开默认执行一次 2.每次滚动到底部执行
const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  const { data } = await getKnowledgePage(params.value)
  list.value.push(...data.rows)

  // 加载状态结束
  loading.value = false

  // 数据全部加载完成
  if (list.value.length === data.total) {
    finished.value = true
  } else {
    params.value.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
