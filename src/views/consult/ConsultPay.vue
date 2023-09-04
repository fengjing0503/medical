<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder } from '@/api/consult'
import { getPatientDetail } from '@/api/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { showFailToast, showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'

// 1.查询订单信息
const payInfo = ref<ConsultOrderPreData>()
const store = useConsultStore()
const router = useRouter()
const getPayInfo = async () => {
  try {
    const res = await getConsultOrderPre({
      type: store.consult.type,
      illnessType: store.consult.illnessType
    })
    console.log(res)
    payInfo.value = res.data
    // 设置默认优惠券
    store.setCoupon(payInfo.value.couponId)
  } catch (error) {
    // 访问支付页面,但是缺少问诊数据,返回首页
    showFailToast('缺少必要的问诊信息,请重新选择!')
    router.push('/home')
  }
}
// 2.患者信息
const patient = ref<Patient>()
const getPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  console.log(res)
  patient.value = res.data
}

onMounted(() => {
  getPayInfo()
  getPatient()
})

// 支付页面
const agree = ref(false) //支付协议
const show = ref(false)
const orderId = ref('') //订单ID
const submit = async () => {
  if (!agree.value) return showFailToast('请勾选协议')
  show.value = true
  const { data } = await createConsultOrder(store.consult)
  orderId.value = data.id
  store.clear() //订单创建成功,清除pinia中存储数据
}

// 生成订单后不可回退（点击浏览器回退按钮测试）
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
// 生成订单后不可关闭支付抽屉
const onClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = '' // 清空后才能跳转页面
      router.push('/user/consult')
      return true
    })
}

// // 点击支付弹层中支付按钮,获取支付地址进行跳转支付
// const pay = async () => {
//   if (paymentMethod.value === undefined) return showFailToast('请选择支付方式')
//   showLoadingToast('跳转支付中')
//   const { data } = await getConsultOrderPayUrl({
//     paymentMethod: paymentMethod.value, //支付方式
//     orderId: orderId.value, //订单ID
//     payCallback: 'http://localhost:5173/room' //支付成功跳回地址
//   })
//   window.location.href = data.payUrl
// }
</script>

<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 1. 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="`-¥${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 2. 患者信息  -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 3. 打开支付弹层并创建问诊订单 -->
    <van-submit-bar
      button-type="primary"
      :price="payInfo?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
    />
    <!-- 支付弹层 -->
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderId"
      :actualPayment="payInfo?.actualPayment"
      :onClose="onClose"
    ></cp-pay-sheet>
    <!-- <van-action-sheet
      :before-close="onClose"
      :closeable="false"
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo?.actualPayment.toFixed(2) }}</p>
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
    </van-action-sheet> -->
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
}
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
