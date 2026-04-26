# Backend for Frontend

BFF是一种后端架构模式，核心思想是：
为不同的前端（Web / Mobile / 小程序等）分别提供定制化后端服务，而非让所有前端直接调用统一的通用后端 API。

## 一、核心概念

BFF 是面向特定前端场景的专属 API 适配层。

典型架构分层：

- Frontend（React / App）
- BFF 层（主要开发位置）
- 微服务 / 通用后端

## 二、设计动机

缺乏 BFF 层时，前端面临以下问题：

### 1. API 与 UI 需求不匹配

前端页面通常需要聚合的数据包括：

```js
{
  (userInfo, recentOrders, recommendations);
}
```

而后端仅暴露以下独立接口：

- `/user`
- `/orders`
- `/recommendations`

前端需自行处理：

```javascript
await Promise.all([...])
```

存在的问题：

- 多次网络请求，影响性能
- 数据拼装逻辑分散在前端，增加维护成本

### 2. 多端需求差异

| 端     | 需求特征            |
| ------ | ------------------- |
| Web    | 信息完整            |
| Mobile | 精简数据 + 分页     |
| 小程序 | 极简数据 + 快速加载 |

单一通用 API 难以兼顾多端差异化需求。

### 3. 前端需直接处理领域模型

例如：`order.items[].product.sku.price`

前端需直接处理复杂的领域模型嵌套结构，增加理解与维护成本。

## 三、BFF 的核心职责

### 1. 请求聚合（Aggregation）

```javascript
// BFF 层
app.get("/home", async (req, res) => {
  const [user, orders, recs] = await Promise.all([
    getUser(),
    getOrders(),
    getRecommendations(),
  ]);

  res.json({
    user,
    orders,
    recs,
  });
});
```

前端仅需单次请求：`await fetch('/bff/home')`

### 2. 数据裁剪与转换（Adapter）

原始后端返回：

```json
{
  "id": 1,
  "first_name": "Tom",
  "last_name": "Lee"
}
```

BFF 转换后返回：

```json
{
  "id": 1,
  "name": "Tom Lee"
}
```

降低前端数据解析复杂度。

### 3. 按端定制 API

- Web BFF: `GET /bff/web/home`
- Mobile BFF: `GET /bff/mobile/home`

支持按端定制：字段过滤、分页策略、加载逻辑。

## 四、与 API Gateway 的区别

BFF 与 API Gateway 职责不同，主要区别如下：

| 对比维度 | BFF                | API Gateway      |
| -------- | ------------------ | ---------------- |
| 服务对象 | 前端               | 所有客户端       |
| 核心作用 | 业务适配           | 通用基础能力     |
| 数据转换 | 支持               | 通常不支持       |
| 典型功能 | 聚合、裁剪、格式化 | 鉴权、限流、路由 |

定位差异：

- API Gateway：统一的入口网关
- BFF：面向前端的数据适配层

## 五、常见实现方式

基于 React + TypeScript 技术栈，常见实现方式包括：

### 1. Node.js BFF（主流方案）

```
apps/
  web-bff/
  mobile-bff/
```

技术栈：Express / Fastify，或使用 Next.js API Routes。

### 2. Next.js API Routes

```typescript
// app/api/home/route.ts
export async function GET() {
  const data = await fetchBackend();
  return Response.json(transform(data));
}
```

优势：

- 前后端同仓库管理（适合 monorepo）
- 与 React 生态天然契合

### 3. GraphQL

```graphql
query {
  user {
    name
  }
  orders {
    id
  }
}
```

同样属于"前端定制后端"的解决方案。

## 六、适用场景

BFF 并非适用于所有场景：

### 适用场景

- 多端项目（Web + App）
- 后端采用微服务架构
- 前端逻辑复杂（中后台系统 / 电商 / 数据看板）
- 团队前后端分离明显

### 不适用场景

- 小型项目
- API 结构简单
- 单一前端平台

## 七、与 React 开发模式的类比

可将 BFF 理解为服务端的 React hooks / data layer。

数据获取方式的转变：

- 前端方式：`useHomeData()`
- BFF 方式：`GET /bff/home`

数据聚合逻辑从前端迁移至 BFF 层。

## 八、推荐工程结构

Monorepo 架构下的目录结构示例：

```
apps/
  web/           # React 前端
  web-bff/       # BFF 服务 (Node)
services/
  user-service/
  order-service/
packages/
  shared-types/  # 类型共享
```

## 九、总结

BFF 的核心价值：降低前端复杂度，提升后端灵活性。
