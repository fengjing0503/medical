import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

// 创建vue根实例
const app = createApp(App)

// 注册pinia和路由router
app.use(pinia)
app.use(router)

//挂载渲染app根组件
app.mount('#app')
