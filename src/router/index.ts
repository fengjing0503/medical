import { createRouter, createWebHistory } from 'vue-router'
import Test from '@/views/test/index.vue'

// 路由配置
const routes = [{ path: '/test', component: Test }]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
// 导出路由实例
export default router
