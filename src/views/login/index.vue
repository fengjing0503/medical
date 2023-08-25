<template>
  <cp-nav-bar title="登陆" right-text="注册" @click-right="clickRight"></cp-nav-bar>
  <div class="login">
    <div class="login-head">
      <h3>{{ isPass ? '密码登陆' : '短信验证码登录' }}</h3>
      <a @click="isPass = !isPass" href="javascript:;">
        <span>{{ isPass ? '短信验证码登录' : '密码登陆' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form ref="form" @submit="login" autocomplete="off">
      <van-field
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="isShowPass ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-${isShowPass ? 'eye-on' : 'eye-off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field v-model="code" :rules="codeRules" v-else placeholder="短信验证码">
        <template #button>
          <span @click="send">{{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
// 表单校验
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showFailToast, showSuccessToast, type FormInstance } from 'vant'
// 接口
import { loginByPassword, sendMobileCode, loginByMobile } from '@/api/user'
// 导入用户store
import { useUserStore } from '@/stores/modules/usre'
// 导入router
import { useRoute, useRouter } from 'vue-router'

const clickRight = () => {
  console.log('点击了右边文字')
}

// 是否同意网站协议
const agree = ref(false)

// 点击眼睛按钮,动态切换密码显示隐藏
// 定义变量,根据变量控制显示隐藏
const isShowPass = ref()

// 手机号密码双向绑定
const mobile = ref('')
const password = ref('')

// 点击登陆
const store = useUserStore()
const router = useRouter()
const route = useRoute()
const login = async () => {
  if (!agree.value) return showFailToast('请勾选协议')
  // 登陆
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  // console.log(res)
  store.setUser(res.data)
  // 如果有会跳地址就进行回跳,没有就跳转个人中心
  router.push((route.query.returnUrl as string) || '/user')
  showSuccessToast('登陆成功')
}

// true密码登录 false验证码登录
const isPass = ref(true)

// 验证码双向绑定
const code = ref('')
// 点击获取验证码
const time = ref(0)
let timeId: number
const form = ref<FormInstance>()
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  // 发送请求
  const res = await sendMobileCode(mobile.value, 'login')
  console.log(res.data)
  showSuccessToast('发送成功')
  code.value = res.data.code
  time.value = 60
  // 倒计时开始
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  // 避免内存泄漏,组件销毁关闭定时器
  clearInterval(timeId)
})
</script>

<style lang="scss" scoped>
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
