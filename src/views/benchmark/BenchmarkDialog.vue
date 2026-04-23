<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入业绩对标名称" />
    </el-form-item>

    <el-form-item label="代码" prop="code" v-if="!isEdit">
      <el-input v-model="formData.code" placeholder="请输入业绩对标代码" />
    </el-form-item>

    <el-form-item label="配置类型" prop="configurationTypeId">
      <el-select
        v-model="formData.configurationTypeId"
        placeholder="请选择配置类型"
        style="width: 100%"
        :disabled="isEdit"
      >
        <el-option
          v-for="ct in configurationTypes"
          :key="ct.id"
          :label="ct.name"
          :value="ct.id"
        />
      </el-select>
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
import { useConfigurationTypeStore } from '@/stores/configuration-type'
import type { BenchmarkDTO } from '@/types/benchmark'

interface Props {
  visible: boolean
  modelValue: Partial<BenchmarkDTO>
  title: string
  isEdit: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<BenchmarkDTO>): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const configurationTypeStore = useConfigurationTypeStore()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const configurationTypes = computed(() => configurationTypeStore.majorTypes)

const formRules = {
  name: [{ required: true, message: '请输入业绩对标名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入业绩对标代码', trigger: 'blur' }],
  configurationTypeId: [
    { required: true, message: '请选择配置类型', trigger: 'change' },
  ],
}

onMounted(() => {
  if (configurationTypes.value.length === 0) {
    configurationTypeStore.loadMajorTypes()
  }
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
