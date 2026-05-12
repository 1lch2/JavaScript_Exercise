# NextJS 的 App Router 和 Pages Router 对比

> Next.js 提供两套路由系统：**App Router**（基于 `app` 目录，v13.4+ 稳定）和 **Pages Router**（基于 `pages` 目录，最初的路由方案）。两者目前并行支持，但 App Router 是官方推荐的演进方向。

## App Router

### 定位与核心理念

App Router 是 Next.js 13.4 引入的新一代路由系统，基于 React 18 的 Server Components、Streaming SSR 和 Suspense 构建。核心理念是**将服务端逻辑作为默认**，客户端交互需要显式声明。

### 目录结构

```
app/
├── layout.js          # 根布局，所有页面共享
├── page.js            # 首页（/）
├── loading.js         # 加载状态（Suspense 边界）
├── error.js           # 错误边界（必须是 Client Component）
├── not-found.js       # 404 页面
├── template.js        # 模板（每次导航重新挂载）
├── globals.css        # 全局样式
├── dashboard/
│   ├── layout.js      # dashboard 布局
│   ├── page.js        # /dashboard
│   └── settings/
│       └── page.js    # /dashboard/settings
└── api/
    └── route.js       # API 路由（替代 pages/api/*）
```

### 路由定义

使用**文件夹**定义路由段，`page.js` 文件使该路由段对外可访问：

```javascript
// app/blog/[slug]/page.js
// 路由: /blog/:slug

export default async function BlogPost({ params }) {
  const { slug } = await params;
  return <article>Post: {slug}</article>;
}
```

### 数据获取

App Router 中 `getServerSideProps`、`getStaticProps`、`getInitialProps` 被移除，数据获取直接写在 Server Component 内：

```javascript
// 静态缓存（等价于 getStaticProps）
const res = await fetch("https://...", { cache: "force-cache" });

// 每次请求获取（等价于 getServerSideProps）
const res = await fetch("https://...", { cache: "no-store" });

// 定时重新验证（等价于 getStaticProps + revalidate）
const res = await fetch("https://...", { next: { revalidate: 10 } });
```

`getStaticPaths` 被 `generateStaticParams` 替代：

```javascript
// app/blog/[slug]/page.js
export async function generateStaticParams() {
  const posts = await fetch("https://...").then((res) => res.json());
  return posts.map((post) => ({ slug: post.slug }));
}
```

### 组件模型

- **默认是 Server Component**：无法使用 `useState`、`useEffect` 等客户端 API
- 需要交互能力时，使用 `'use client'` 指令显式声明为 Client Component

```tsx
// Client Component - 需要 'use client'
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const clickHandler = () => {
    setCount(count + 1);
  };
  return <button onClick={clickHandler}>{count}</button>;
}
```

### 特殊文件一览

| 文件              | 作用                   | 组件类型要求 |
| ----------------- | ---------------------- | ------------ |
| `page.js`         | 路由页面               | 默认 Server  |
| `layout.js`       | 布局（跨导航保持状态） | 默认 Server  |
| `loading.js`      | Suspense 加载 UI       | 默认 Server  |
| `error.js`        | 错误边界               | 必须 Client  |
| `not-found.js`    | 404 UI                 | 默认 Server  |
| `template.js`     | 模板（每次重新挂载）   | 默认 Server  |
| `route.js`        | API 路由               | Server only  |
| `global-error.js` | 根布局错误处理         | 必须 Client  |

## Pages Router

### 定位与核心理念

Pages Router 是 Next.js 最初的路由方案，基于 `pages` 目录，使用约定式的特殊导出函数（`getServerSideProps` 等）进行数据获取。仍在维护中，但新功能优先在 App Router 中实现。

### 目录结构

```
pages/
├── _app.js            # 全局应用入口（布局、全局样式）
├── _document.js       # 自定义 HTML 文档结构
├── index.js           # 首页（/）
├── about.js           # /about
├── blog/
│   ├── index.js       # /blog
│   └── [slug].js      # /blog/:slug
├── 404.js             # 404 页面
├── api/
│   ├── hello.js       # /api/hello
│   └── user/
│       └── [id].js    # /api/user/:id
└── _error.js          # 自定义错误页
```

### 路由定义

使用**文件名**直接映射路由：

```javascript
// pages/blog/[slug].js
// 路由: /blog/:slug

export default function BlogPost({ post }) {
  return <article>{post.title}</article>;
}
```

### 数据获取

通过特殊导出函数实现，有三种模式：

```javascript
// 服务端渲染 - 每次请求执行
export async function getServerSideProps(context) {
  const data = await fetchData();
  return { props: { data } };
}

// 静态生成 - 构建时执行
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data }, revalidate: 60 }; // ISR
}

// 动态路由静态路径
export async function getStaticPaths() {
  return { paths: [{ params: { slug: "post-1" } }], fallback: false };
}
```

### 组件模型

Pages Router 中的页面组件**默认是 Client Component**（实际上是"Universal Component"，既能在服务端渲染也能在客户端运行，但不具备 Server Component 的专属能力）。

### 特殊文件一览

| 文件           | 作用                 |
| -------------- | -------------------- |
| `_app.js`      | 全局应用入口、布局   |
| `_document.js` | 自定义 HTML 文档结构 |
| `_error.js`    | 全局错误页           |
| `404.js`       | 404 页面             |

## 核心区别

### 1. 目录与路由

| 对比项   | App Router                           | Pages Router              |
| -------- | ------------------------------------ | ------------------------- |
| 根目录   | `app/`                               | `pages/`                  |
| 路由定义 | **文件夹** + `page.js`               | **文件名**直接映射        |
| 嵌套布局 | 原生支持，每层文件夹对应 `layout.js` | 仅通过 `_app.js` 全局布局 |
| 路由分组 | `(group)` 语法，不影响 URL           | 不支持                    |
| 并行路由 | `@slot` 语法                         | 不支持                    |
| 拦截路由 | `(..)folder` 语法                    | 不支持                    |

### 2. 数据获取

| 对比项     | App Router                                | Pages Router                    |
| ---------- | ----------------------------------------- | ------------------------------- |
| 方式       | 组件内 `async/await` + `fetch`            | 特殊导出函数                    |
| 服务端渲染 | `fetch(..., { cache: 'no-store' })`       | `getServerSideProps`            |
| 静态生成   | `fetch(..., { cache: 'force-cache' })`    | `getStaticProps`                |
| 增量再生   | `fetch(..., { next: { revalidate: N } })` | `getStaticProps` + `revalidate` |
| 动态路径   | `generateStaticParams`                    | `getStaticPaths`                |
| 位置       | **组件内部**（就近原则）                  | **页面级导出函数**              |

### 3. 组件模型

| 对比项         | App Router                   | Pages Router                   |
| -------------- | ---------------------------- | ------------------------------ |
| 默认类型       | **Server Component**         | Client Component               |
| 客户端交互     | 需 `'use client'` 声明       | 直接可用                       |
| Bundle 优化    | Server Component 不进 bundle | 全部进入 bundle                |
| 访问服务端资源 | 直接访问（数据库等）         | 仅在 `getServerSideProps` 等中 |

### 4. 布局与 UI 层级

App Router 的组件层级由内到外依次为：

```
layout.js → template.js → error.js → loading.js → not-found.js → page.js
```

- `layout.js`：跨导航保持状态，不重新挂载
- `template.js`：每次导航时重新挂载
- `loading.js`：基于 Suspense 的加载态
- `error.js`：基于 Error Boundary 的错误处理

Pages Router 没有这种细粒度的 UI 层级，所有逻辑集中在 `_app.js` 和页面组件中。

### 5. 内置 API 对应关系

| Pages Router         | App Router 替代                         |
| -------------------- | --------------------------------------- |
| `pages/_app.js`      | `app/layout.js`                         |
| `pages/_document.js` | `app/layout.js`（根布局）               |
| `pages/_error.js`    | `app/error.js`（每段）                  |
| `pages/404.js`       | `app/not-found.js`                      |
| `pages/api/*`        | `app/api/*/route.js`                    |
| `getServerSideProps` | 组件内 `fetch` + `cache: 'no-store'`    |
| `getStaticProps`     | 组件内 `fetch` + `cache: 'force-cache'` |
| `getStaticPaths`     | `generateStaticParams`                  |

### 6. Metadata 处理

| 对比项   | App Router                                | Pages Router                   |
| -------- | ----------------------------------------- | ------------------------------ |
| 方式     | `metadata` 对象 / `generateMetadata` 函数 | `<Head>` 组件                  |
| 类型安全 | 内置 TypeScript 支持                      | 需手动管理                     |
| 动态 SEO | `generateMetadata` 异步函数               | 在 `getServerSideProps` 中处理 |

```javascript
// App Router - metadata API
export const metadata = {
  title: "My Page",
  description: "Page description",
};

// 或动态生成
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return { title: post.title };
}
```

### 7. Streaming 与 Suspense

App Router 原生支持 React 18 的 Streaming SSR，可以逐步发送 HTML，配合 `loading.js` 实现即时反馈：

```javascript
// app/dashboard/page.js
// loading.js 会自动作为 Suspense fallback
export default async function Dashboard() {
  const data = await fetchData(); // 耗时操作
  return <DashboardUI data={data} />;
}
```

Pages Router 不支持 Streaming，必须等待所有数据就绪后才能发送 HTML。

## 选型建议

| 场景                       | 推荐             | 原因                        |
| -------------------------- | ---------------- | --------------------------- |
| 新项目                     | **App Router**   | 官方推荐方向，功能更丰富    |
| 需要嵌套布局、并行路由     | **App Router**   | Pages Router 不支持这些特性 |
| 需要 Server Components     | **App Router**   | 唯一支持方案                |
| 存量项目维护               | **Pages Router** | 迁移成本可控时再考虑迁移    |
| 团队对 React 18 新特性不熟 | 视情况而定       | App Router 学习曲线稍高     |

两者可以在同一项目中**渐进式共存**，`app` 和 `pages` 目录可以同时存在，逐步迁移。
