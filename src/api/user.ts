import type { CodeType, User } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request.post<any, User>('/login/password', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request.get<any, { code: string }>('/code', { params: { mobile, type } })

// 验证码登录
export const loginByMobile = (mobile: string, code: string) =>
  request.post<any, User>('/login', { mobile, code })
