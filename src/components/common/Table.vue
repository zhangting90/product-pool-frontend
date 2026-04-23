<!-- 通用表格组件：封装el-table和分页功能 -->
<template>
  <div class="table-container">
    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :row-key="rowKey"
      :empty-text="emptyText"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      v-loading="loading"
    >
      <!-- 多选列插槽 -->
      <slot name="selection" v-if="selection">
        <el-table-column type="selection" width="55" />
      </slot>
      <!-- 序号列插槽 -->
      <slot name="index" v-if="showIndex">
        <el-table-column type="index" label="序号" width="60" :index="indexMethod" />
      </slot>
      <!-- 默认插槽，用于自定义列 -->
      <slot></slot>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="pagination && total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        :background="paginationBackground"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 表格属性定义
interface Props {
  data: any[] // 表格数据
  loading?: boolean // 加载状态
  selection?: boolean // 是否显示多选列
  showIndex?: boolean // 是否显示序号列
  stripe?: boolean // 是否斑马纹
  border?: boolean // 是否显示边框
  size?: 'large' | 'default' | 'small' // 表格尺寸
  fit?: boolean // 列宽是否自动撑开
  showHeader?: boolean // 是否显示表头
  highlightCurrentRow?: boolean // 是否高亮当前行
  rowKey?: string | ((row: any) => string) // 行数据key
  emptyText?: string // 空数据提示文字
  defaultSort?: { prop: string; order: 'ascending' | 'descending' } // 默认排序
  height?: string | number // 固定高度
  maxHeight?: string | number // 最大高度
  pagination?: boolean // 是否显示分页
  total?: number // 总数据条数
  currentPage?: number // 当前页码
  pageSize?: number // 每页条数
  pageSizes?: number[] // 每页条数选项
  paginationLayout?: string // 分页布局
  paginationBackground?: boolean // 分页按钮背景色
}

// 表格事件定义
interface Emits {
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'sort-change', sort: { column: any; prop: string; order: string }): void
  (e: 'selection-change', selection: any[]): void
  (e: 'current-change', currentRow: any, oldCurrentRow: any): void
  (e: 'row-click', row: any, column: any, event: Event): void
  (e: 'row-dblclick', row: any, column: any, event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selection: false,
  showIndex: false,
  stripe: true,
  border: true,
  size: 'default',
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,
  emptyText: '暂无数据',
  pagination: false,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  paginationBackground: true
})

const emit = defineEmits<Emits>()

// 表格数据计算属性
const tableData = computed(() => props.data)

// 序号计算方法，结合分页偏移
const indexMethod = (index: number) => {
  return index + 1 + (props.currentPage - 1) * props.pageSize
}

// 排序变化事件
const handleSortChange = (sort: { column: any; prop: string; order: string }) => {
  emit('sort-change', sort)
}

// 多选变化事件
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

// 当前行变化事件
const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

// 行点击事件
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 行双击事件
const handleRowDblclick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

// 每页条数变化事件
const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
}

// 页码变化事件
const handleCurrentPageChange = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<style scoped>
.table-container {
  width: 100%;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
