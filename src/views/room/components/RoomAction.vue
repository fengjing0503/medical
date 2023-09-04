<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/api/consult'
import type { Image } from '@/types/consult'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
// 1.发送文字消息
const text = ref('')
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()
// 把输入的聊天文字传给父组件
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}

// 2.是否禁用输入
defineProps<{
  disabled: boolean
}>()

// 3.发送图片信息
const sendImage: UploaderAfterRead = async (data) => {
  /**
   * 点击上传图标触发
   * 1.调用上传api函数,上传选择的图片
   * 2.上传成功后获取到URL,字传父传递图片
   * 2.父组件获取到图片,使用scoket.emit发送图片给医生
   */
  if (Array.isArray(data)) return //排除多图上传情况
  if (!data.file) return //排除不存在的情况
  const t = showLoadingToast({
    message: '正在上传',
    duration: 0 // 设置为0不会自动关闭
  })
  const { data: img } = await uploadImage(data.file)
  console.log('上传图片:', img)
  // 关闭提示
  t.close()
  emit('send-image', img)
}
</script>

<template>
  <div class="room-action">
    <!-- 输入框 -->
    <van-field
      :disabled="disabled"
      v-model="text"
      @keyup.enter="sendText"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
    ></van-field>
    <!-- 图片上传 -->
    <van-uploader :after-read="sendImage" :disabled="disabled" :preview-image="false">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
