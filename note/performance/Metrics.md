# 前端性能指标

> 本文档介绍前端性能监控中的核心指标，帮助理解和优化页面加载体验。

## FP (First Paint) - 首次渲染

**定义**：FP 表示页面开始渲染的时间点，是用户能看到页面内容的第一个像素的时间点。

**特点**：
- 反映页面的**白屏时间**
- 在 FP 时间点之前，用户看到的是没有任何内容的白色屏幕
- 通常比 FCP 更早出现

**参考值**：
- **优秀**：小于 1 秒
- **糟糕**：大于 2.5 秒

## FCP (First Contentful Paint) - 首次内容渲染

**定义**：FCP 表示从用户首次导航至网页到页面上任意一部分内容呈现在屏幕上的时间。这里的"内容"包括文本、图像（包括背景图像）、元素或非白色元素。

**特点**：
- 比 FP 更符合用户体验，因为 FCP 表示用户能看到**有意义内容**的时间
- FCP 包括上一个网页的所有卸载时间、连接设置时间、重定向时间和首字节时间（TTFB）
- 通常比 FP 晚

**参考值**：
- **优秀**：小于 1.8 秒
- **糟糕**：大于 3.0 秒

## LCP (Largest Contentful Paint) - 最大内容绘制

**定义**：LCP 表示页面上最大、最重要的可视内容（如大图、主标题等）加载完成的时间。

**特点**：
- **直接影响**用户对页面加载速度的感知
- 是评估页面加载质量的**核心指标**
- 通常比 FCP 晚，因为 LCP 关注的是页面上最大的内容元素

**参考值**：
- **优秀**：小于 2.5 秒
- **糟糕**：大于 4.0 秒

## 指标对比总结

| 指标 | 定义 | 用户感知 | 优化重点 |
|------|------|----------|----------|
| **FP** | 页面开始渲染时间 | 白屏结束，有颜色变化 | 减少阻塞渲染 |
| **FCP** | 首个有意义内容出现时间 | "页面开始加载" | 优化关键内容加载 |
| **LCP** | 最大内容元素加载完成时间 | "主要内容加载完成" | 优化核心内容加载 |

## 与 DOM 事件的时间关系

### 关键事件时间线

```
浏览器解析流程：
1. DNS 解析 → TCP 连接 → TLS 握手 → TTFB (首字节时间)
   ↓
2. HTML 下载与解析
   ↓
3. DOMContentLoaded (DOM 树构建完成)
   ↓
4. 资源加载 (CSS, JS, 图片等)
   ↓
5. Load (所有资源加载完成)
   ↓
6. FP (首次渲染 - 第一个像素)
   ↓
7. FCP (首次内容渲染 - 有意义内容)
   ↓
8. LCP (最大内容渲染 - 主要内容)
```

### DOMContentLoaded 与性能指标的关系

**DOMContentLoaded (DCL)**：
- **定义**：HTML 文档被完全加载和解析完成之后触发，无需等待样式表、图像等子资源加载
- **与 FP/FCP 的关系**：
  - DCL 通常**早于** FP 和 FCP
  - DCL 标志着 DOM 树构建完成，可以执行 JavaScript
  - FP 和 FCP 需要等待**渲染树构建**和**首次绘制**

**Load 事件**：
- **定义**：页面所有资源（包括图片、CSS、JS）都加载完成后触发
- **与性能指标的关系**：
  - Load 通常**晚于** LCP
  - LCP 关注的是**可视内容**的加载，Load 关注的是**所有资源**

### 实际时间线示例

```
时间轴 (ms)：
0ms    - 用户发起导航
300ms  - TTFB (首字节返回)
500ms  - DOMContentLoaded (DOM 解析完成)
600ms  - FP (首次渲染)
800ms  - FCP (首次内容渲染)
1200ms - LCP (最大内容渲染)
1500ms - Load (所有资源完成)
```

## React 中的性能指标

### React 渲染阶段与指标关系

**传统客户端渲染 (CSR)**：
```javascript
// React 17/18 客户端渲染流程
// 1. HTML 下载 (空的 div#root)
// 2. JS 下载 + 解析
// 3. React 执行 (此时可能触发 DCL)
// 4. React 水合 (Hydration) - 重新执行组件渲染
// 5. FCP/LCP 可能延迟到水合完成后
```

**问题**：
- **FCP 延迟**：需要等待 JS 下载和执行后才能看到内容
- **LCP 延迟**：如果 LCP 元素是 React 组件，需要等待水合完成
- **TTFB 到 FCP 时间长**：JS bundle 越大，延迟越明显

### React 18 的改进

**Server-Side Rendering (SSR)**：
```javascript
// SSR 渲染流程
// 1. 服务器生成 HTML (包含内容)
// 2. 浏览器立即接收 HTML
// 3. FP/FCP 可以在 HTML 解析时就发生
// 4. JS 下载 + React 水合 (Hydration)
// 5. LCP 通常在水合前就已完成
```

**优势**：
- **FP/FCP 提前**：服务器返回的 HTML 包含内容，无需等待 JS
- **LCP 优化**：如果 LCP 元素是静态 HTML，可能在水合前就已渲染

**React 18 Streaming SSR**：
```javascript
// 流式渲染流程
// 1. 服务器开始发送 HTML 流
// 2. 浏览器逐步解析并渲染 (FP/FCP 提前)
// 3. Suspense 边界可以分块加载
// 4. LCP 可能来自先到达的 HTML 片段
// 5. 水合也是渐进式的
```

### React 水合 (Hydration) 对性能的影响

**水合过程**：
```javascript
// 水合前：HTML 已渲染，但事件未绑定
<div id="root">
  <button>点击我</button> <!-- 无法点击 -->
</div>

// 水合后：React 附加事件监听器
// 此时可能阻塞主线程，影响 LCP
```

**水合问题**：
1. **水合阻塞**：大量组件同时水合可能阻塞主线程
2. **LCP 延迟**：如果 LCP 元素需要等待水合才能交互
3. **FCP 不受影响**：因为 HTML 已经存在

### React 性能优化策略

**1. 代码分割与懒加载**：
```javascript
// 优化 FCP/LCP
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyComponent /> {/* 不阻塞初始渲染 */}
    </Suspense>
  );
}
```

**2. 选择性水合 (React 18)**：
```javascript
// 优先水合关键组件
import { hydrateRoot } from 'react-dom/client';

// 只水合可见区域
hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

**3. React 服务器组件 (RSC)**：
```javascript
// RSC 在构建时渲染，无需水合
// 页面组件
async function Page() {
  const data = await fetchData(); // 服务器端执行
  return <div>{data.content}</div>; // 纯静态 HTML
}
// 结果：FCP/LCP 极快，无水合开销
```

### React 性能监控

**使用 Web Vitals 库**：
```javascript
import { getFCP, getLCP, getCLS } from 'web-vitals';

getFCP((metric) => {
  console.log('FCP:', metric.value);
  // 发送到监控平台
});

getLCP((metric) => {
  console.log('LCP:', metric.value);
  // LCP 优化重点
});
```

**React 18 Profiler**：
```javascript
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log(`${id} 渲染时间: ${actualDuration}ms`);
  // 识别渲染性能瓶颈
}

<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

## 性能优化建议

### 通用优化
1. **减少阻塞渲染的资源**（CSS、JS）
2. **图片优化**（懒加载、WebP、响应式）
3. **关键 CSS 内联**（提升 FCP）
4. **预加载关键资源**（`<link rel="preload">`）

### React 特定优化
1. **使用 SSR/SSG**（提升 FCP）
2. **代码分割**（减少初始 JS 体积）
3. **避免不必要的重渲染**（优化 LCP）
4. **React 18 并发特性**（Suspense, Transitions）
5. **考虑 React 服务器组件**（消除水合开销）

## 参考资料

- [Web Vitals - Google Developers](https://web.dev/vitals/)
- [Largest Contentful Paint (LCP) - web.dev](https://web.dev/lcp/)
- [MDN: DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)
- [React 18 Documentation](https://react.dev/blog/2022/03/29/react-v18)
- [Next.js Performance Optimization](https://nextjs.org/docs/optimization)