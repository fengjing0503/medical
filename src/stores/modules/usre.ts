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
  // 默认存储所有数据,以store的ID作为存储的key
  // {
  //   persist: true
  // }
  // 自定义存储的key,指定存储那些数据
  {
    persist: {
      key: 'cp-user',
      paths: ['user']
    }
  }
)
