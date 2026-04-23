# 产品池管理系统 - 前端

基于 Vue 3 + TypeScript + Vite 的产品池管理系统前端项目，用于管理配置类型、业绩对标、策略类型和产品的层级关系。

## 项目结构

```
product-pool-frontend/
├── src/
│   ├── api/                 # API 接口定义
│   │   ├── configuration-type.ts
│   │   ├── benchmark.ts
│   │   ├── strategy-type.ts
│   │   ├── product.ts
│   │   └── product-pool.ts
│   ├── assets/               # 静态资源
│   │   └── styles/
│   │       └── global.css
│   ├── components/            # 通用组件
│   │   ├── common/
│   │   │   ├── Loading.vue
│   │   │   ├── Dialog.vue
│   │   │   ├── Table.vue
│   │   │   └── FormDialog.vue
│   │   └── Layout.vue
│   ├── composables/          # 组合式函数
│   │   ├── useLoading.ts
│   │   ├── useMessage.ts
│   │   └── useConfirm.ts
│   ├── router/               # 路由配置
│   │   └── index.ts
│   ├── stores/               # Pinia 状态管理
│   │   ├── configuration-type.ts
│   │   ├── benchmark.ts
│   │   ├── strategy-type.ts
│   │   ├── product.ts
│   │   └── product-pool.ts
│   ├── types/                # TypeScript 类型定义
│   │   ├── configuration-type.ts
│   │   ├── benchmark.ts
│   │   ├── strategy-type.ts
│   │   ├── product.ts
│   │   └── product-pool.ts
│   ├── utils/                # 工具函数
│   │   └── request.ts
│   ├── views/                # 页面组件
│   │   ├── configuration-type/
│   │   ├── benchmark/
│   │   ├── strategy-type/
│   │   ├── product/
│   │   ├── product-pool/
│   │   └── NotFound.vue
│   ├── App.vue
│   └── main.ts
├── public/                   # 公共静态资源
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 技术栈

- **Vue 3.5+** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI 组件库
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由
- **Axios** - HTTP 客户端

## 功能特性

### 管理功能
- 配置类型管理（大分类、小分类）
- 业绩对标管理
- 策略类型管理
- 产品列表管理（含分页）
- 产品池平铺式展示

### 交互功能
- 数据的 CRUD 操作
- 树形结构展示
- 排序功能
- 数据自动刷新（轮询）
- 响应式布局
- 表单验证
- 统一异常处理
- 统一响应格式

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 安装依赖

```bash
npm install
```

### 开发模式启动

```bash
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建后的文件输出到 `dist` 目录

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
# 运行 ESLint
npm run lint

# 运行 Prettier 格式化
npm run format
```

## 环境变量

创建 `.env` 文件配置环境变量：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080

# 请求超时时间（毫秒）
VITE_API_TIMEOUT=10000

# 是否启用 Mock 数据
VITE_USE_MOCK=false
```

## API 接口

### 基础响应格式
所有 API 接口返回统一的响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1234567890
}
```

### 主要接口
- `GET /api/v1/configuration-types` - 配置类型
- `GET /api/v1/benchmarks` - 业绩对标
- `GET /api/v1/strategy-types` - 策略类型
- `GET /api/v1/products` - 产品列表（分页）
- `GET /api/v1/product-pool` - 产品池完整数据

详细 API 文档请参考后端项目的 Swagger/OpenAPI 文档。

## 开发指南

### 前端开发规范
- 使用 Composition API + TypeScript
- 组件使用 `<script setup>` 语法
- 统一使用 `useXXX` composable 进行逻辑复用
- API 调用统一使用 Pinia Store
- 样式使用 scoped CSS
- 使用 ESLint 和 Prettier 进行代码检查和格式化

### 组件使用示例

```vue
<template>
  <div>
    <el-button @click="handleClick">点击</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from '@/composables/useMessage'

const { success } = useMessage()

const handleClick = () => {
  success('操作成功')
}
</script>
```

### Store 使用示例

```typescript
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()

// 加载数据
await productStore.loadProducts()

// 获取数据
const products = productStore.products

// 创建数据
await productStore.create({ name: '新产品', ... })
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证
MIT

## 相关文档
- [部署文档](../openspec/changes/product-pool-display-page/DEPLOYMENT.md)
- [后端项目](../product-pool-backend)
