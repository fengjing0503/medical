import type { CodeType, User, UserInfo, PatientList, Patient } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request.post<User>('/login/password', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request.get<{ code: string }>('/code', { params: { mobile, type } })

// 验证码登录
export const loginByMobile = (mobile: string, code: string) =>
  request.post<User>('/login', { mobile, code })

// 获取个人信息
export const getUserInfo = () => request.get<UserInfo>('/patient/myUser')

// 获取家庭档案患者信息
export const getPatientList = () => request.get<PatientList>('/patient/mylist')

// 添加患者信息
export const addPatient = (patient: Patient) => request.post('/patient/add', patient)

// 编辑患者信息
export const editPatinet = (patient: Patient) => request.put('/patient/update', patient)

// 删除患者信息
export const delPatinet = (id: string | undefined) => request.delete(`patient/del/${id}`)

// 查询患者详情
export const getPatientDetail = (id: string | undefined) =>
  request.get<Patient>(`/patient/info/${id}`)
