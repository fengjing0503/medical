import { createApp } from 'vue'
import pinia from '@/stores'
import App from './App.vue'
import router from './router'

// 导入全局样式
import '@/styles/main.scss'

// vant需要单独引入的样式
import 'vant/es/toast/style'

// 注册图标
import 'virtual:svg-icons-register'

// 创建vue根实例
const app = createApp(App)

// 注册pinia和路由router
app.use(pinia)
app.use(router)

//挂载渲染app根组件
app.mount('#app')
