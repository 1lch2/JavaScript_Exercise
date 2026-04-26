# Server Side Rendering

> 服务端渲染（SSR）的核心驱动力：**SEO 优化** + **首屏性能**。面试中围绕 SSR 的考察集中在渲染模式对比、Hydration、RSC、以及常见坑点。

## SSR 与 CSR 的核心区别

| 维度 | CSR（客户端渲染） | SSR（服务端渲染） |
|------|-------------------|-------------------|
| 首屏速度 | 慢（需下载 JS 再渲染） | 快（服务端直接返回 HTML） |
| SEO | 差（爬虫拿到空壳） | 好（完整 HTML 可索引） |
| TTFB | 低（静态文件直接返回） | 较高（服务端实时计算） |
| 服务器压力 | 低 | 高（每次请求都要渲染） |
| 交互体验 | 好（原生 SPA 体验） | 需 Hydration 接管后才可交互 |
| 开发复杂度 | 低 | 高（需兼容两端代码） |

> **面试答题要点**：不要只列对比表，要说明**为什么**。CSR 首屏慢是因为整个渲染链路是：下载 HTML → 下载 JS → 执行 JS → 渲染 DOM，用户看到白屏时间长。SSR 首屏快是因为服务端直接返回含内容的 HTML，但 TTFB 高是因为服务端需要执行渲染逻辑。

## Hydration（水合）

### 什么是 Hydration？

Hydration 是 SSR 的关键步骤：服务端返回静态 HTML 后，客户端加载 JS 并将 DOM 节点与 React 组件树重新关联，使页面变为可交互。

```
SSR 完整流程：
  服务端 renderToString() → HTML → 客户端下载 JS → Hydration → 可交互页面
```

> **Hydration 的代价**：客户端必须下载并重新执行与服务端相同的组件代码来重建组件树和绑定事件，这带来了额外的 JS bundle 开销和潜在的 mismatch 问题。

### Hydration Mismatch

当服务端生成的 HTML 与客户端期望的 HTML 不一致时，React 会报 Hydration Mismatch 错误。

**常见原因**：

| 原因 | 示例 |
|------|------|
| 使用浏览器 API | `window.innerWidth` 在服务端不存在 |
| 时间/随机值不一致 | `new Date().toLocaleString()` 两端时间不同 |
| 浏览器扩展修改 DOM | 翻译插件改了文本内容 |
| 无效 HTML 嵌套 | `<p>` 内嵌 `<div>`，浏览器自动修正 DOM |
| 客户端状态条件渲染 | `useState(localStorage.getItem('theme'))` 服务端无 localStorage |
| CSS-in-JS 类名不一致 | 服务端/客户端生成不同哈希类名 |

**解决方案**：

```jsx
// 1. useEffect 延迟客户端逻辑（最常用）
function MyComponent() {
  const [width, setWidth] = useState(null);
  useEffect(() => {
    setWidth(window.innerWidth); // 仅客户端执行
  }, []);
  return width === null ? <div>加载中...</div> : <div>宽度: {width}</div>;
}

// 2. suppressHydrationWarning（仅抑制警告，不修复不匹配）
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>

// 3. Next.js dynamic + ssr: false（纯客户端组件）
const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

> **面试追问**：Hydration Mismatch 的后果是什么？文本不匹配 → React 警告并用客户端内容覆盖；结构不匹配 → React 可能丢弃服务端 DOM 重新渲染，造成性能浪费。

## SSR 常见坑点

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `window is not defined` | 服务端无浏览器环境 | `typeof window !== 'undefined'` 判断或 `useEffect` |
| Hydration mismatch | 两端渲染不一致 | 确保数据源一致，避免随机值 |
| 跨请求状态污染 | 单例共享状态泄露到下一个请求 | 每次请求创建独立 store/实例 |
| 内存泄漏 | 长期运行未清理 | 避免全局缓存无限增长 |
| CSS 闪烁（FOUC） | 样式加载时机问题 | 内联关键 CSS / CSS-in-JS |
| 第三方库不兼容 | 依赖浏览器 API | 动态 import 或条件引入 |

> **跨请求状态污染是面试常考的深入问题**：SSR 服务端是长期运行的 Node 进程，如果使用单例模式（如全局 Vuex store），上一个请求的数据可能泄露到下一个请求。解决方案是每次请求创建新的 store 实例。

## 渲染模式对比：SSR / SSG / ISR

### SSG（Static Site Generation）

构建时一次性生成静态 HTML 文件，运行时直接由 CDN 返回，无需实时渲染。

- **优势**：响应最快，TTFB 最优，服务器压力最低
- **劣势**：内容更新需重新构建部署，不适合频繁变化的数据
- **适用**：博客、文档、营销页等内容不频繁变化的页面

### ISR（Incremental Static Regeneration）

结合 SSG 的性能优势 + SSR 的更新能力。页面以静态方式返回，但按设定时间间隔后台自动重新生成。

- **核心策略**：**Stale-While-Revalidate**——用户请求先返回缓存的旧页面（stale），同时后台触发重新生成，下次请求拿到新页面
- **优势**：用户永远不会等待，服务器压力低，数据接近实时
- **适用**：电商商品页、新闻列表等内容偶尔更新的场景

```js
// Next.js Pages Router ISR
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data }, revalidate: 60 }; // 每 60 秒后台重新验证
}
```

### 综合对比

| 维度 | SSR | SSG | ISR |
|------|-----|-----|-----|
| 渲染时机 | 每次请求时 | 构建时 | 构建时 + 定时后台更新 |
| 响应速度 | 较慢 | 最快 | 快 |
| 数据实时性 | 最实时 | 构建时数据 | 接近实时 |
| 服务器压力 | 高 | 低 | 低 |
| SEO | 好 | 好 | 好 |
| 部署要求 | 需要 Node 服务器 | 可纯 CDN | 需要 Node 服务器 |

> **面试答题思路**：不要死背表，要会根据场景选择。比如面试官问"电商商品详情页用什么渲染模式？"——用 ISR，因为商品数据偶尔更新但需要高性能；"用户 dashboard 用什么？"——用 SSR，因为数据高度个性化且需要实时。

## React Server Components（RSC）

### RSC 与传统 SSR 的核心区别

这是 2025 年面试的新热点。**核心区别在于客户端如何处理服务端渲染结果**：

| 对比维度 | 传统 SSR | RSC |
|---------|----------|-----|
| 输出格式 | HTML 字符串 | 序列化 RSC Payload |
| 客户端行为 | Hydration（重执行 JS） | 解析 Payload（不重执行服务端 JS） |
| JS Bundle | 包含服务端组件代码 | **不包含**服务端组件代码 |
| 数据获取 | 在服务端渲染时获取 | 组件中直接 `async/await` |

```
传统 SSR：服务端 → renderToString() → HTML → 客户端 Hydration（重执行JS）→ 可交互
RSC：    服务端 → RSC Payload → 客户端解析重建 VDOM → 可交互（客户端组件仍需 Hydration）
```

> **面试一句话总结**：SSR 输出 HTML，客户端通过 Hydration "复活"页面；RSC 输出序列化 Payload，客户端解析后直接渲染，服务端组件的 JS **永不到达客户端**——这是从"服务端执行→客户端重执行"到"服务端执行→客户端直接用"的范式转变。

### `'use client'` 和 `'use server'`

- `'use client'`：标记为客户端组件，会打包进 bundle，负责交互（`onClick`、`useState` 等）
- `'use server'`：标记为服务端组件，不会打包进 bundle，可直接访问数据库/API

> **面试追问**：RSC 能用 `useState` 吗？不能，RSC 是纯服务端组件，状态和交互由 `'use client'` 组件负责。

## SSR 性能优化

| 策略 | 说明 |
|------|------|
| CDN 缓存 | 对 SSR 页面设置短期缓存，减少服务端重复渲染 |
| 流式渲染（Streaming SSR） | 配合 Suspense 逐步推送 HTML，降低 TTFB |
| 选择性 Hydration | React 18 优先 Hydration 用户正在交互的部分 |
| 页面级/组件级缓存 | 缓存 `renderToString` 结果，适合数据变化少的页面 |
| 边缘渲染（Edge SSR） | 在 CDN 边缘节点执行 SSR，降低网络延迟 |
| PPR（Partial Pre-rendering） | Next.js 14+ 特性，静态部分预渲染 + 动态部分流式渲染 |

> **Streaming SSR 面试要点**：传统 SSR 是 `renderToString` 一次性生成完整 HTML，必须等所有数据获取完才能返回。Streaming SSR 利用 React 18 Suspense，可以先返回页面骨架，数据就绪的部分逐步推送——用户更快看到内容，TTFB 显著降低。

## Next.js App Router 中的渲染策略

App Router 中不再使用 `getServerSideProps/getStaticProps`，渲染策略由**页面是否包含动态数据**自动决定：

| 场景 | 渲染模式 |
|------|----------|
| 纯静态 Server Component | 自动 SSG |
| 使用 `cookies()`/`headers()` | 自动 SSR |
| 设置 `export const revalidate = 60` | ISR |
| `generateStaticParams()` | 预渲染动态路由 |

```ts
// App Router ISR 示例
export const revalidate = 3600; // 每小时重新验证

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  return <PostList posts={posts} />;
}
```

## Resumability vs Hydration

Qwik 框架提出的 **Resumability（可恢复性）** 概念，是 Hydration 的替代方案：

- **Hydration 的问题**：客户端需要重新执行组件代码来"发现"事件绑定位置，代价高
- **Resumability 的思路**：服务端渲染时直接将事件处理器和状态序列化到 HTML 中，客户端只需"恢复"（resume）而非重新执行
- **面试对比**：Hydration = "服务端渲染后客户端重做一遍"；Resumability = "服务端渲染后客户端直接续接"

> 这个概念面试中偶尔出现，主要是考察对 Hydration 代价的理解深度，以及对新范式的前瞻性认识。