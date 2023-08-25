import type { CodeType, User } from '@/types/user'
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
