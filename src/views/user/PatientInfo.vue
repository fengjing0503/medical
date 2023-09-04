<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getPatientList, addPatient, editPatinet, delPatinet } from '@/api/user'
import { type PatientList, type Patient } from '@/types/user'
import { showFailToast, showSuccessToast, showConfirmDialog } from 'vant'
import Validator from 'id-validator'
import { useRoute } from 'vue-router'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'

// 问诊-选择患者   路由有isSel=1是选择患者
const route = useRoute()
console.log('路由参数', route)
const isSel = computed(() => route.query.isSel === '1')
// 点击选中患者
const patientId = ref<string | undefined>() //需要存储选中的患者id
const selectPatient = (id: string | undefined) => {
  if (!isSel.value) return
  patientId.value = id
}
// 点击下一步进入支付页面
const store = useConsultStore()
const router = useRouter()
const next = () => {
  // 判断有没有选择患者
  if (!patientId.value) return showFailToast('请选择患者')
  // 存储选中患者ID
  store.setPatient(patientId.value)
  // 跳转支付页面
  router.push('/consult/pay')
}

// 家庭档案数据
const patientlist = ref<PatientList>([])
// 获取家庭档案
const getPatientInfo = async () => {
  const { data } = await getPatientList()
  console.log(data)
  patientlist.value = data
  // 当时选择患者页面,并且有患者信息=> 设置默认选中
  if (isSel.value && patientlist.value.length > 0) {
    // 有没有默认患者
    const defPatient = data.find((item) => item.defaultFlag === 1)
    if (defPatient) {
      patientId.value = defPatient.id //有默认患者设为默认选中
    } else {
      patientId.value = data[0].id //没有默认患者第一个选中
    }
  }
}
onMounted(() => {
  // 渲染页面
  getPatientInfo()
})
// 新增  显示隐藏
const show = ref(false)
// 打开新增|编辑页面
const showPopup = (item?: Patient) => {
  // 有数据传回
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    // 没有数据传回,清空表单
    patient.value = { ...defaultPatinet }
  }
  show.value = true
}
// 性别选项
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 默认选中的性别
// const gender = ref(1)

// 表单数据默认值
const defaultPatinet: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 新增患者表单数据
const patient = ref<Patient>({ ...defaultPatinet })

// 是否默认患者
const defaultFlag = ref(false)

// 监控defaultFlag的变化,把defaultFlag中的Boolean值转换成0|1
watch(defaultFlag, () => {
  patient.value.defaultFlag = defaultFlag.value ? 1 : 0
})
// 身份证校验插件
const validate = new Validator()
// 点击保存
const submit = async () => {
  // 表单校验
  if (!patient.value.name) return showFailToast('请输入姓名')
  if (!patient.value.idCard) return showFailToast('请输入身份证号码')
  if (!validate.isValid(patient.value.idCard)) return showFailToast('身份证格式有误')
  const { sex } = validate.getInfo(patient.value.idCard)
  if (sex != patient.value.gender) return showFailToast('性别和身份证不符')
  // 校验完成,发请求新增
  // 有id修改,没id添加
  patient.value.id ? await editPatinet(patient.value) : await addPatient(patient.value)
  // 关闭弹层
  show.value = false
  // 从新渲染页面
  getPatientInfo()
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
}
// 点击删除
const remove = () => {
  if (patient.value.id) {
    showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 的信息吗?`
    })
      .then(async () => {
        // on confirm
        await delPatinet(patient.value.id)
        showSuccessToast('删除成功')
        show.value = false
        getPatientInfo()
      })
      .catch(() => {
        // on cancel
      })
  }
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isSel ? '选择患者' : '家庭档案'" />
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="isSel">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>

    <div class="patient-list">
      <div
        @click="selectPatient(item.id)"
        v-for="item in patientlist"
        :key="item.id"
        class="patient-item"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}</span>
          <span>{{ item.gender === 0 ? '女' : '男' }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon @click="showPopup(item)" name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div @click="showPopup()" class="patient-add">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip" v-if="patientlist.length < 6">最多可添加 6 人</div>
    </div>

    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="isSel">
      <van-button @click="next" type="primary" round block>下一步</van-button>
    </div>

    <!-- 新增患者弹层 -->
    <van-popup position="right" v-model:show="show">
      <cp-nav-bar
        @click-right="submit"
        :back="() => (show = false)"
        :title="patient.id ? '编辑' : '新增'"
        right-text="保存"
      >
      </cp-nav-bar>
      <!-- 新增患者表单 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :options="options"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
        <van-action-bar v-if="patient.id">
          <van-action-bar-button @click="remove" type="danger" text="删除"></van-action-bar-button>
        </van-action-bar>
      </van-form>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .van-popup {
  width: 100%;
  height: 100%;
  padding-top: 46px;
}
.patient-page {
  padding: 46px 0 80px;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
