import { defineStore } from 'pinia'
import { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 问诊记录的数据
    const consult = ref<PartialConsult>({})
    // 1.首页 记录问诊类型  type:  1找医生 2极速问诊 3开药问诊
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 2.问诊级别页面 记录选择医院级别=> 1三甲 0普通
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 3.选择科室页面  记录选择科室id
    const setDepId = (id: string) => {
      consult.value.depId = id
    }
    // 4.描述病情页面 记录病情 病情详细描述 患病时间 是否去医院就诊过 上传图片
    const setIllness = (
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 5.家庭档案页面 记录选择患者id
    const setPatient = (id: string) => {
      consult.value.patientId = id
    }
    // 6.设置优惠券ID
    const setCoupon = (id: string) => {
      consult.value.couponId = id
    }
    // 7.问诊订单创建成功后,清空问诊记录数据
    const clear = () => {
      consult.value = {}
    }

    return { consult, setType, setIllnessType, setDepId, setIllness, setPatient, clear, setCoupon }
  },
  {
    persist: true
  }
)
