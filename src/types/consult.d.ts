import { ConsultType, ConsultTime } from '@/enums'

// 文章类型
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

// 文章内容类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number //总页数
  total: number //数据总条数
  rows: KnowledgeList //当前页返回数据
}

// // 文章列表查询参数
// export type KnowledgeParams = {
//   type: KnowledgeType
//   current: number
//   pageSize: number
// }

// 通用的分页查询参数
export type PageParams = {
  current: number
  pageSize: number
}

// 文章列表查询参数，复用PageParams
export type KnowledgeParams = PageParams & {
  type: KnowledgeType
}

// 医生卡片
export type Doctor = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string
  depName: string
  positionalTitles: string
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number
  score: number
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注的类型
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'

// 问诊
// 图片列表
export type Image = {
  id: string
  url: string
}
// 问诊记录=> 极速问诊参数
export type Consult = {
  type: ConsultType // 问诊类型：1找医生 2极速问诊 3开药问诊
  illnessType: 0 | 1 // 问诊级别：0普通  1三甲
  depId: string // 问诊科室id
  illnessDesc: string // 病情描述
  illnessTime: ConsultTime // 患病时间：1一周内2一月内3半年内4半年以上
  consultFlag: 0 | 1 // 是否问诊过：0未问诊1问诊过
  pictures: Image[] // 病例信息-图片集合
  patientId: string // 患者id
  couponId: string // 优惠卷id
}

// 问诊记录-全部可选
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型
export type PartialConsult = Partial<Consult>

// 获取科室数据
// 科室
export type SubDep = {
  id: string
  name: string
}
// 一级科室
export type TopDep = SubDep & {
  child: SubDep[]
}

// 病情描述全部必填
export type ConsultIllness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>

// 问诊订单预支付请求参数
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单预支付返回数据
export type ConsultOrderPreData = {
  pointDeduction: number
  couponDeduction: number
  couponId: string
  payment: number // 应付
  couponId: number
  actualPayment: number // 实付
}

// 问诊订单详情类型
export type ConsultOrderItem = Consult & {
  id: string
  createTime: string
  docInfo?: Doctor
  patientInfo: Patient
  orderNo: string
  statusValue: string
  typeValue: string
  status: OrderType
  countdown: number
  prescriptionId?: string
  evaluateId: number
  payment: number
  couponDeduction: number
  pointDeduction: number
  actualPayment: number
}

// 问诊记录订单列表
// 根据通用分页类型定义
// api参数类型
export type ConsultOrderListParams = PageParams & {
  type: ConsultType
}
// api返回data类型
export type ConsultOrderPage = PageData<ConsultOrderItem[]>

// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
  createTime: string
  docInfo?: Doctor
  patientInfo: Patient
  orderNo: string
  statusValue: string
  typeValue: string
  status: OrderType
  countdown: number
  prescriptionId?: string
  evaluateId: number
  payment: number
  couponDeduction: number
  pointDeduction: number
  actualPayment: number
}
