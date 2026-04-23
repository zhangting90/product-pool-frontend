<!-- 策略类型编辑对话框：新增或编辑策略类型的表单弹窗 -->
<template>
  <FormDialog
    v-model:visible="dialogVisible"
    v-model="formData"
    :title="title"
    :rules="formRules"
    @confirm="handleConfirm"
  >
    <!-- 策略类型名称 -->
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入策略类型名称" />
    </el-form-item>

    <!-- 所属业绩对标选择（编辑时禁用） -->
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
import { useBenchmarkStore } from '@/stores/benchmark'
import type { StrategyTypeDTO } from '@/types/strategy-type'

// 组件属性和事件定义
interface Props {
  visible: boolean                       // 是否显示对话框
  modelValue: Partial<StrategyTypeDTO>   // 表单数据（v-model）
  title: string                          // 对话框标题
  isEdit: boolean                        // 是否编辑模式
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: Partial<StrategyTypeDTO>): void
  (e: 'confirm'): void  // 确认提交事件
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const benchmarkStore = useBenchmarkStore()

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

// 业绩对标列表
const benchmarks = computed(() => benchmarkStore.benchmarks)

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入策略类型名称', trigger: 'blur' }],
  benchmarkId: [
    { required: true, message: '请选择业绩对标', trigger: 'change' },
  ],
}

// 页面挂载时加载业绩对标数据
onMounted(() => {
  if (benchmarks.value.length === 0) {
    benchmarkStore.loadBenchmarks()
  }
})

// 触发确认事件
const handleConfirm = () => {
  emit('confirm')
}
</script>
