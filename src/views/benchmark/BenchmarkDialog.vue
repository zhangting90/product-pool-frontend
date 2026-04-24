<!-- 业绩对标编辑对话框：新增或编辑业绩对标的表单弹窗 -->
<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @submit="handleConfirm"
  >
    <template #form>
      <!-- 业绩对标名称 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入业绩对标名称" />
      </el-form-item>

      <!-- 所属配置类型选择 -->
      <el-form-item label="配置类型" prop="configurationTypeId">
        <el-select
          v-model="formData.configurationTypeId"
          placeholder="请选择配置类型"
          style="width: 100%"
          :disabled="isEdit"
        >
          <el-option v-for="ct in configurationTypes" :key="ct.id" :label="ct.name" :value="ct.id" />
        </el-select>
      </el-form-item>

      <!-- 描述信息 -->
      <el-form-item label="描述">
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" />
      </el-form-item>

      <!-- 排序号 -->
      <el-form-item label="排序">
        <el-input-number v-model="formData.sortOrder" :min="0" :step="1" />
      </el-form-item>
    </template>
  </FormDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FormDialog from '@/components/common/FormDialog.vue'
import { useConfigurationTypeStore } from '@/stores/configuration-type'
import type { BenchmarkDTO } from '@/types/benchmark'

// 组件属性和事件定义
interface Props {
  visible: boolean // 是否显示对话框
  modelValue: Partial<BenchmarkDTO> // 表单数据（v-model）
  title: string // 对话框标题
  isEdit: boolean // 是否编辑模式
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<BenchmarkDTO>): void
  (e: 'confirm'): void // 确认提交事件
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const configurationTypeStore = useConfigurationTypeStore()

// 对话框显示状态的双向绑定
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 表单数据的双向绑定
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 配置类型列表（子分类）
const configurationTypes = computed(() => configurationTypeStore.subTypes)

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入业绩对标名称', trigger: 'blur' }],
  configurationTypeId: [{ required: true, message: '请选择配置类型', trigger: 'change' }]
}

// 页面挂载时加载所有配置类型数据
onMounted(() => {
  if (configurationTypes.value.length === 0) {
    configurationTypeStore.loadConfigurationTypes()
  }
})

// 触发确认事件，将FormDialog内部表单数据同步回父组件
const handleConfirm = (data: Record<string, any>) => {
  emit('update:modelValue', data as Partial<BenchmarkDTO>)
  emit('confirm')
}
</script>
