<!-- 产品池展示页面：层级展示产品池数据，支持自动刷新 -->
<template>
  <div class="product-pool-container">
    <!-- 页面头部：标题和刷新控制 -->
    <div class="page-header">
      <h2>产品池展示</h2>
      <div class="header-actions">
        <!-- 自动刷新开关 -->
        <el-switch
          v-model="autoRefresh"
          active-text="自动刷新"
          inactive-text="手动刷新"
          @change="handleAutoRefreshChange"
        />
        <!-- 刷新间隔选择 -->
        <el-select
          v-model="refreshInterval"
          :disabled="!autoRefresh"
          style="width: 140px; margin-left: 10px"
          @change="handleIntervalChange"
        >
          <el-option label="30秒" :value="30" />
          <el-option label="1分钟" :value="60" />
          <el-option label="5分钟" :value="300" />
          <el-option label="10分钟" :value="600" />
        </el-select>
        <!-- 手动刷新按钮 -->
        <el-button type="primary" :icon="Refresh" @click="handleRefresh" :loading="loading">
          刷新
        </el-button>
      </div>
    </div>

    <!-- 骨架屏加载效果 -->
    <el-skeleton :loading="loading" :rows="5" animated>
      <template #default>
        <!-- 空数据提示 -->
        <div v-if="productPool.length === 0" class="empty-state">
          <el-empty description="暂无产品池数据" />
        </div>
        <!-- 产品池层级数据展示 -->
        <div v-else class="product-pool-content">
          <!-- 大分类层级 -->
          <div v-for="majorType in productPool" :key="majorType.configurationTypeId" class="major-type-section">
            <div class="section-title">
              <h3>{{ majorType.configurationTypeName }}</h3>
            </div>

            <!-- 子分类层级 -->
            <div v-if="majorType.children && majorType.children.length > 0" class="sub-types-container">
              <div
                v-for="subType in majorType.children"
                :key="subType.id"
                class="sub-type-section"
              >
                <div class="sub-type-header">
                  <h4>{{ subType.name }}</h4>
                </div>

                <!-- 业绩对标层级 -->
                <div v-if="subType.benchmarks && subType.benchmarks.length > 0" class="benchmarks-container">
                  <div
                    v-for="benchmark in subType.benchmarks"
                    :key="benchmark.id"
                    class="benchmark-section"
                  >
                    <div class="benchmark-header">
                      <span class="benchmark-name">{{ benchmark.name }}</span>
                    </div>

                    <!-- 策略类型层级 -->
                    <div v-if="benchmark.strategyTypes && benchmark.strategyTypes.length > 0" class="strategy-types-container">
                      <div
                        v-for="strategyType in benchmark.strategyTypes"
                        :key="strategyType.id"
                        class="strategy-type-section"
                      >
                        <div class="strategy-type-header">
                          <span class="strategy-type-name">{{ strategyType.name }}</span>
                          <span v-if="strategyType.description" class="strategy-type-desc">
                            {{ strategyType.description }}
                          </span>
                        </div>

                        <!-- 产品卡片网格 -->
                        <div v-if="strategyType.products && strategyType.products.length > 0" class="products-grid">
                          <div
                            v-for="product in strategyType.products"
                            :key="product.id"
                            class="product-card"
                          >
                            <div class="product-header">
                              <h5 class="product-name">{{ product.name }}</h5>
                              <el-tag :type="getRiskLevelType(product.riskLevel)" size="small">
                                {{ product.riskLevel }}
                              </el-tag>
                            </div>
                            <!-- 产品详细信息 -->
                            <div class="product-info">
                              <div class="info-item">
                                <span class="info-label">代码：</span>
                                <span class="info-value">{{ product.code }}</span>
                              </div>
                              <div v-if="product.annualReturn !== undefined" class="info-item">
                                <span class="info-label">年化收益：</span>
                                <span class="info-value">{{ formatPercent(product.annualReturn) }}</span>
                              </div>
                              <div v-if="product.volatility !== undefined" class="info-item">
                                <span class="info-label">波动率：</span>
                                <span class="info-value">{{ formatPercent(product.volatility) }}</span>
                              </div>
                              <div v-if="product.sharpeRatio !== undefined" class="info-item">
                                <span class="info-label">夏普比率：</span>
                                <span class="info-value">{{ formatNumber(product.sharpeRatio) }}</span>
                              </div>
                              <div v-if="product.maxDrawdown !== undefined" class="info-item">
                                <span class="info-label">最大回撤：</span>
                                <span class="info-value">{{ formatPercent(product.maxDrawdown) }}</span>
                              </div>
                              <div v-if="product.fundManager" class="info-item">
                                <span class="info-label">基金经理：</span>
                                <span class="info-value">{{ product.fundManager }}</span>
                              </div>
                              <div v-if="product.fundScale !== undefined" class="info-item">
                                <span class="info-label">基金规模：</span>
                                <span class="info-value">{{ formatNumber(product.fundScale) }} 亿</span>
                              </div>
                            </div>
                            <!-- 产品描述 -->
                            <div v-if="product.description" class="product-description">
                              {{ product.description }}
                            </div>
                          </div>
                        </div>
                        <div v-else class="empty-products">
                          <el-empty description="暂无产品" :image-size="60" />
                        </div>
                      </div>
                    </div>
                    <div v-else class="empty-strategy-types">
                      <el-empty description="暂无策略类型" :image-size="60" />
                    </div>
                  </div>
                </div>
                <div v-else class="empty-benchmarks">
                  <el-empty description="暂无业绩对标" :image-size="60" />
                </div>
              </div>
            </div>
            <div v-else class="empty-sub-types">
              <el-empty description="暂无子分类" :image-size="60" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { useProductPoolStore } from '@/stores/product-pool'
import type { ProductPoolVO } from '@/types/product-pool'

// 初始化产品池store
const productPoolStore = useProductPoolStore()

// 响应式状态
const productPool = ref<ProductPoolVO[]>([])
const loading = ref(false)
const autoRefresh = ref(false)
const refreshInterval = ref(60)
let timer: number | null = null

// 加载产品池数据
const loadProductPool = async () => {
  loading.value = true
  try {
    await productPoolStore.loadProductPool(true)
    productPool.value = productPoolStore.productPool
  } catch (error: any) {
    ElMessage.error(error.message || '加载产品池数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const handleRefresh = () => {
  loadProductPool()
}

// 处理自动刷新开关变化
const handleAutoRefreshChange = (enabled: boolean) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// 处理刷新间隔变化
const handleIntervalChange = () => {
  if (autoRefresh.value) {
    stopAutoRefresh()
    startAutoRefresh()
  }
}

// 启动自动刷新定时器
const startAutoRefresh = () => {
  if (timer) {
    clearInterval(timer)
  }
  timer = window.setInterval(() => {
    loadProductPool()
  }, refreshInterval.value * 1000)
}

// 停止自动刷新定时器
const stopAutoRefresh = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 格式化百分比
const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(2)}%`
}

// 格式化数字（保留两位小数）
const formatNumber = (value: number) => {
  return value.toFixed(2)
}

// 获取风险等级对应的标签类型
const getRiskLevelType = (riskLevel: string) => {
  const riskMap: Record<string, any> = {
    '低风险': 'success',
    '中低风险': '',
    '中等风险': 'warning',
    '中高风险': 'danger',
    '高风险': 'danger'
  }
  return riskMap[riskLevel] || 'info'
}

// 页面挂载时加载数据并恢复本地存储的刷新设置
onMounted(() => {
  loadProductPool()
  // 检查本地存储的自动刷新设置
  const savedAutoRefresh = localStorage.getItem('productPoolAutoRefresh')
  if (savedAutoRefresh) {
    autoRefresh.value = savedAutoRefresh === 'true'
  }
  const savedInterval = localStorage.getItem('productPoolRefreshInterval')
  if (savedInterval) {
    refreshInterval.value = parseInt(savedInterval)
  }
})

// 监听自动刷新和间隔变化，保存到本地存储
watch(autoRefresh, (value) => {
  localStorage.setItem('productPoolAutoRefresh', String(value))
})

watch(refreshInterval, (value) => {
  localStorage.setItem('productPoolRefreshInterval', String(value))
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
/* 产品池容器样式 */
.product-pool-container {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.empty-state {
  padding: 60px 0;
}

/* 产品池内容层级布局 */
.product-pool-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 大分类区域样式 */
.major-type-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

/* 子分类容器样式 */
.sub-types-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub-type-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.sub-type-header h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 业绩对标区域样式 */
.benchmarks-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.benchmark-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #667eea;
}

.benchmark-header {
  margin-bottom: 12px;
}

.benchmark-name {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
}

/* 策略类型网格布局 */
.strategy-types-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.strategy-type-section {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.strategy-type-header {
  margin-bottom: 12px;
}

.strategy-type-name {
  font-weight: 600;
  color: #333;
  margin-right: 8px;
}

.strategy-type-desc {
  color: #666;
  font-size: 14px;
}

/* 产品卡片网格布局 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* 产品卡片样式 */
.product-card {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

/* 产品卡片悬停效果 */
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.product-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 8px;
}

/* 产品信息列表样式 */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  font-size: 14px;
}

.info-label {
  color: #666;
  min-width: 80px;
}

.info-value {
  color: #333;
  font-weight: 500;
}

/* 产品描述样式 */
.product-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 空状态占位样式 */
.empty-products,
.empty-strategy-types,
.empty-benchmarks,
.empty-sub-types {
  padding: 20px 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .strategy-types-container {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
