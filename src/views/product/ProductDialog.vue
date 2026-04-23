<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <el-form-item label="产品名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入产品名称" />
    </el-form-item>

    <el-form-item label="产品代码" prop="code" v-if="!isEdit">
      <el-input v-model="formData.code" placeholder="请输入产品代码" />
    </el-form-item>

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

    <el-form-item label="夏普比率" prop="sharpeRatio">
      <el-input-number
        v-model="formData.sharpeRatio"
        :precision="2"
        :step="0.01"
        placeholder="请输入夏普比率"
        style="width: 100%"
      />
    </el-form-item>

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

    <el-form-item label="基金经理">
      <el-input v-model="formData.fundManager" placeholder="请输入基金经理" />
    </el-form-item>

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

    <el-form-item label="成立日期">
      <el-date-picker
        v-model="formData.inceptionDate"
        type="date"
        placeholder="请选择成立日期"
        style="width: 100%"
        value-format="YYYY-MM-DD"
      />
    </el-form-item>

    <el-form-item label="状态" prop="isActive">
      <el-switch
        v-model="formData.isActive"
        active-text="激活"
        inactive-text="停用"
      />
    </el-form-item>

    <el-form-item label="描述">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="3"
        placeholder="请输入描述"
      />
    </el-form-item>

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

interface Props {
  visible: boolean
  modelValue: Partial<ProductDTO>
  title: string
  isEdit: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<ProductDTO>): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const strategyTypeStore = useStrategyTypeStore()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const strategyTypes = computed(() => strategyTypeStore.strategyTypes)

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

onMounted(() => {
  if (strategyTypes.value.length === 0) {
    strategyTypeStore.loadStrategyTypes()
  }
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
