import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// 导入路由配置
import routes from './routes'
// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 前置守卫 to 去哪, from 从哪儿来
router.beforeEach((to) => {
  // 动态添加title
  document.title = `在线问诊-${to.meta.title}`

  const store = useUserStore()
  // 如果没有 token ,同时不在白名单,跳转到登录页
  if (!store.user.token && !['/login'].includes(to.path)) return '/login'
})

// 导出路由实例
export default router
