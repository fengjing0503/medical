import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 全局变量  用户信息
    const user = ref({} as User)

    // 登录后存储用户信息
    const setUser = (userData: User) => {
      user.value = userData
    }
    // 退出登录删除用户信息
    const delUser = () => {
      user.value = {} as User
    }

    // 返回变量和方法
    return { user, setUser, delUser }
  },
  {
    persist: true
  }
)
