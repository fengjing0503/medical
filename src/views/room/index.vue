<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
// 导入socket.io插件
import { io, type Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType, OrderType } from '@/enums/index'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consult'
import { provide } from 'vue'
// 初始化创建ws长连接
let socket: Socket //存储socket实例
const list = ref<Message[]>([]) //聊天列表
const store = useUserStore()
const route = useRoute()
const initScoket = () => {
  // 建立连接
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  socket.on('connect', () => {
    console.log('浏览器ws服务器建立连接成功')
  })
  socket.on('error', () => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
  // 1 接收ws服务器给浏览器(患者端)发送默认数据
  // 聊天历史记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    console.log('建立连接后,默认返回数据', data)
    // 准备转换常规消息列表
    const result: Message[] = []
    data.forEach((item) => {
      // 1.发送消息的时间,放入到result中
      result.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: { content: item.createTime }
      })
      // 2.把items的消息放入到result中
      result.push(...item.items)
    })
    list.value.push(...result)
  })
  // 2 接收医生回复消息
  // 接收消息
  socket.on('receiveChatMsg', async (msg) => {
    list.value.push(msg)
    // 每次dom更新后滚动到聊天列表最底部
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
  // 3.接收订单变化消息,更新订单状态
  socket.on('statusChange', () => {
    getOrderDetail()
  })
}
onMounted(() => {
  initScoket() //组件挂载建立链接
  getOrderDetail() //获取订单详情
})
onUnmounted(() => {
  socket.close() //组件销毁关闭连接
})

// 发送文字消息
const consult = ref<ConsultOrderItem>() //订单详情
const getOrderDetail = async () => {
  const { data } = await getConsultOrderDetail(route.query.orderId as string)
  console.log('订单详情:', data)

  consult.value = data
}
const sendText = (text: string) => {
  // 发送消息
  console.log('文字消息内容:', text)
  // 发送信息需要数据：发送人、收消息人、消息类型、消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id, // 发送人
    to: consult.value?.docInfo?.id, // 收消息人
    msgType: MsgType.MsgText, // 消息类型
    msg: { content: text } // 消息内容
  })
}
//发送图片消息
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 注入订单详情数据
provide('consultt', consult)
// 评价成功，修改评价消息状态和数据，切换卡片展示
const completeEva = (score: number) => {
  // 获取评价信息数据
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    // 更新分数
    item.msg.evaluateDoc = { score }
    // 更新类型为已评价
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 1. 问诊状态-->
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <!-- 2. 问诊聊天列表消息 -->
    <room-message :list="list" />
    <!-- 3. 底部操作栏：发消息 -->
    <room-action
      @send-image="sendImage"
      @send-text="sendText"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
