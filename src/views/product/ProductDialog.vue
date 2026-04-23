<!-- 产品编辑对话框：新增或编辑产品的表单弹窗 -->
<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <!-- 产品名称 -->
    <el-form-item label="产品名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入产品名称" />
    </el-form-item>

    <!-- 产品代码（新增时显示） -->
    <el-form-item label="产品代码" prop="code" v-if="!isEdit">
      <el-input v-model="formData.code" placeholder="请输入产品代码" />
    </el-form-item>

    <!-- 所属策略类型选择（编辑时禁用） -->
    <el-form-item label="策略类型" prop="strategyTypeId">
      <el-select
        v-model="formData.strategyTypeId"
        placeholder="请选择策略类型"
        style="width: 100%"
        :disabled="isEdit"
      >
        <el-option
          v-for="st in strategyTypes"
          :key="st.id"
          :label="st.name"
          :value="st.id"
        />
      </el-select>
    </el-form-item>

    <!-- 风险等级选择 -->
    <el-form-item label="风险等级" prop="riskLevel">
      <el-select
        v-model="formData.riskLevel"
        placeholder="请选择风险等级"
        style="width: 100%"
      >
        <el-option label="低风险" value="低风险" />
        <el-option label="中低风险" value="中低风险" />
        <el-option label="中等风险" value="中等风险" />
        <el-option label="中高风险" value="中高风险" />
        <el-option label="高风险" value="高风险" />
      </el-select>
    </el-form-item>

    <!-- 年化收益率（百分比） -->
    <el-form-item label="年化收益率(%)" prop="annualReturn">
      <el-input-number
        v-model="formData.annualReturn"
        :min="0"
        :max="100"
        :precision="2"
        :step="0.01"
        placeholder="请输入年化收益率"
        style="width: 100%"
      />
    </el-form-item>

    <!-- 波动率（百分比） -->
    <el-form-item label="波动率(%)" prop="volatility">
      <el-input-number
        v-model="formData.volatility"
        :min="0"
        :max="100"
        :precision="2"
        :step="0.01"
        placeholder="请输入波动率"
        style="width: 100%"
      />
    </el-form-item>

    <!-- 夏普比率 -->
    <el-form-item label="夏普比率" prop="sharpeRatio">
      <el-input-number
        v-model="formData.sharpeRatio"
        :precision="2"
        :step="0.01"
        placeholder="请输入夏普比率"
        style="width: 100%"
      />
    </el-form-item>

    <!-- 最大回撤（百分比） -->
    <el-form-item label="最大回撤(%)" prop="maxDrawdown">
      <el-input-number
        v-model="formData.maxDrawdown"
        :min="0"
        :max="100"
        :precision="2"
        :step="0.01"
        placeholder="请输入最大回撤"
        style="width: 100%"
      />
    </el-form-item>

    <!-- 基金经理 -->
    <el-form-item label="基金经理">
      <el-input v-model="formData.fundManager" placeholder="请输入基金经理" />
    </el-form-item>

    <!-- 基金规模（亿元） -->
    <el-form-item label="基金规模(亿)">
      <el-input-number
        v-model="formData.fundScale"
        :min="0"
        :precision="2"
        :step="0.01"
        placeholder="请输入基金规模"
        style="width: 100%"
      />
    </el-form-item>

    <!-- 成立日期 -->
    <el-form-item label="成立日期">
      <el-date-picker
        v-model="formData.inceptionDate"
        type="date"
        placeholder="请选择成立日期"
        style="width: 100%"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <!-- 产品状态开关 -->
    <el-form-item label="状态" prop="isActive">
      <el-switch
        v-model="formData.isActive"
        active-text="激活"
        inactive-text="停用"
      />
    </el-form-item>

    <!-- 描述信息 -->
    <el-form-item label="描述">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="3"
        placeholder="请输入描述"
      />
    </el-form-item>

    <!-- 排序号 -->
    <el-form-item label="排序">
      <el-input-number
        v-model="formData.sortOrder"
        :min="0"
        :step="1"
      />
    </el-form-item>
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { useStrategyTypeStore } from '@/stores/strategy-type'
import type { ProductDTO } from '@/types/product'

// 组件属性和事件定义
interface Props {
  visible: boolean                  // 是否显示对话框
  modelValue: Partial<ProductDTO>   // 表单数据（v-model）
  title: string                     // 对话框标题
  isEdit: boolean                   // 是否编辑模式
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<ProductDTO>): void
  (e: 'confirm'): void  // 确认提交事件
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const strategyTypeStore = useStrategyTypeStore()

// 对话框显示状态的双向绑定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 表单数据的双向绑定
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 策略类型列表
const strategyTypes = computed(() => strategyTypeStore.strategyTypes)

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入产品代码', trigger: 'blur' },
  ],
  strategyTypeId: [
    { required: true, message: '请选择策略类型', trigger: 'change' },
  ],
  riskLevel: [
    { required: true, message: '请选择风险等级', trigger: 'change' },
  ],
  annualReturn: [
    { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur' },
  ],
  volatility: [
    { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur' },
  ],
  maxDrawdown: [
    { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数值', trigger: 'blur' },
  ],
}

// 页面挂载时加载策略类型数据
onMounted(() => {
  if (strategyTypes.value.length === 0) {
    strategyTypeStore.loadStrategyTypes()
  }
})

// 触发确认事件
const handleConfirm = () => {
  emit('confirm')
}
</script>
