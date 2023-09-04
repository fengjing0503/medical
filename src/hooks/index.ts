/**
 * 全局可复用自定义 hooks
 */
import { ref, onMounted } from 'vue'
import { followDoctor } from '@/api/consult'
import { showSuccessToast, showImagePreview } from 'vant'
import type { FollowType } from '@/types/consult'
import { getPrescriptionPic } from '@/api/consult'
import { getMedicalOrderDetail } from '@/api/medicine'
import type { OrderDetail } from '@/types/medicine'

//点关注
const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  // 点击执行回调函数
  const follow = async (doc: { id: string; likeFlag: 0 | 1 }) => {
    // 防止重复点击
    loading.value = true
    try {
      await followDoctor(doc.id, type)
      doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
      showSuccessToast('关注成功')
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}
// 查看处方
const useLookPre = () => {
  const showPrescription = async (id?: string) => {
    if (!id) return //排除undefined情况,限定类型
    const { data } = await getPrescriptionPic(id)
    showImagePreview([data.url]) //图片预览
  }
  return { showPrescription }
}

// 获取药品订单详情
const useMedicineDetail = (id: string) => {
  const order = ref<OrderDetail>()
  onMounted(async () => {
    const res = await getMedicalOrderDetail(id)
    order.value = res.data
    console.log(order.value)
  })
  return { order }
}
export { useFollow, useLookPre, useMedicineDetail }
