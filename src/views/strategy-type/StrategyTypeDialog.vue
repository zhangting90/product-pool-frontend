<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入策略类型名称" />
    </el-form-item>

    <el-form-item label="业绩对标" prop="benchmarkId">
      <el-select
        v-model="formData.benchmarkId"
        placeholder="请选择业绩对标"
        style="width: 100%"
        :disabled="isEdit"
      >
        <el-option
          v-for="bm in benchmarks"
          :key="bm.id"
          :label="bm.name"
          :value="bm.id"
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
import { useBenchmarkStore } from '@/stores/benchmark'
import type { StrategyTypeDTO } from '@/types/strategy-type'

interface Props {
  visible: boolean
  modelValue: Partial<StrategyTypeDTO>
  title: string
  isEdit: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<StrategyTypeDTO>): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const benchmarkStore = useBenchmarkStore()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const benchmarks = computed(() => benchmarkStore.benchmarks)

const formRules = {
  name: [{ required: true, message: '请输入策略类型名称', trigger: 'blur' }],
  benchmarkId: [
    { required: true, message: '请选择业绩对标', trigger: 'change' },
  ],
}

onMounted(() => {
  if (benchmarks.value.length === 0) {
    benchmarkStore.loadBenchmarks()
  }
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
