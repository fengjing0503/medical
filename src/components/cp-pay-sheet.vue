<script setup lang="ts">
import { getConsultOrderPayUrl } from '@/api/consult'
import { showFailToast, showLoadingToast } from 'vant'
import { ref } from 'vue'
const { orderId, show, payCallback } = defineProps<{
  orderId: string
  actualPayment?: number
  onClose?: () => void
  show: boolean
  payCallback?: string
}>()
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()
// 点击支付弹层中支付按钮,获取支付地址进行跳转支付
const paymentMethod = ref<0 | 1>() //支付方式
const pay = async () => {
  if (paymentMethod.value === undefined) return showFailToast('请选择支付方式')
  showLoadingToast('跳转支付中')
  const { data } = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value, //支付方式
    orderId: orderId, //订单ID
    payCallback: payCallback || 'http://localhost:5173/room' //支付成功跳回地址
  })
  window.location.href = data.payUrl
}
</script>

<template>
  <van-action-sheet
    :before-close="onClose"
    :closeable="false"
    :show="show"
    @update:show="emit('update:show', $event)"
    title="选择支付方式"
    :close-on-popstate="false"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment?.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button @click="pay" type="primary" round block>立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
// 支付弹层样式
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
