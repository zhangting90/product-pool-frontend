<template>
  <div class="table-container">
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
      <slot name="selection" v-if="selection">
        <el-table-column type="selection" width="55" />
      </slot>
      <slot name="index" v-if="showIndex">
        <el-table-column
          type="index"
          label="序号"
          width="60"
          :index="indexMethod"
        />
      </slot>
      <slot></slot>
    </el-table>

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

interface Props {
  data: any[]
  loading?: boolean
  selection?: boolean
  showIndex?: boolean
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  rowKey?: string | ((row: any) => string)
  emptyText?: string
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
  height?: string | number
  maxHeight?: string | number
  pagination?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
  paginationBackground?: boolean
}

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
  paginationBackground: true,
})

const emit = defineEmits<Emits>()

const tableData = computed(() => props.data)

const indexMethod = (index: number) => {
  return index + 1 + (props.currentPage - 1) * props.pageSize
}

const handleSortChange = (sort: { column: any; prop: string; order: string }) => {
  emit('sort-change', sort)
}

const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowDblclick = (row: any, column: any, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
}

const handleCurrentPageChange = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<style scoped>
.table-container {
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
