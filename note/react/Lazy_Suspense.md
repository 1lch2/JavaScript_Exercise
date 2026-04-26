# React 按需加载

`React.lazy()` 方法可以在组件第一次渲染之前延迟加载组件的代码

用法如下：

```jsx
import { lazy } from "react";

const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
```

> 注意：不能在组件内部声明lazy组件：
>
> ```jsx
> import { lazy } from "react";
>
> function Editor() {
>   // 🔴 Bad: 这将导致在重新渲染时重置所有状态
>   const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
>   // ...
> }
> ```
>
> 必须在模块顶层声明，如下所示：
>
> ```jsx
> import { lazy } from "react";
>
> // ✅ Good: 将 lazy 组件声明在组件外部
> const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
>
> function Editor() {
>   // ...
> }
> ```

## 配合 Suspense 实现懒加载组件

如下所示，当 `MarkdownPreview` 组件加载完成之前都会一直使用 Loading 组件展示。

```jsx
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

对于Suspense，它的 children 中只要有一个没有加载完成，它会一直展示 fallback 直到所有子组件加载完成为止

Suspense 可以嵌套多个，如下所示：

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

加载序列将会是：

1. 如果 Biography 没有加载完成，BigSpinner 会显示在整个内容区域的位置。
2. 一旦 Biography 加载完成，BigSpinner 会被内容替换。
3. 如果 Albums 没有加载完成，AlbumsGlimmer 会显示在 Albums 和它的父级 Panel 的位置。
4. 最后，一旦 Albums 加载完成，它会替换 AlbumsGlimmer。

## 配合 `use` 支持 Suspense

use 是 React 近年引入的一个非常特殊的 API（在 React 18.3+ 以及 React 19 中正式化）。

它的作用是：在渲染时读取异步资源（比如 Promise）的值。

```jsx
import { use } from "react";

function Message({ messagePromise }) {
  // use 会读取 Promise 的内容
  // 如果 Promise 还没完成，这里会“挂起”当前的渲染，激活最近的 Suspense
  const content = use(messagePromise);
  return <p>{content}</p>;
}
```

## 在 useEffect 中获取数据导致 Suspense 无法干涉

经典的 useEffect 中fetch数据的场景：

```jsx
function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 渲染已经完成了！
    // 此时才开始 fetch，React 无法回溯去触发 Suspense
    fetchData().then((d) => setData(d));
  }, []);

  if (!data) return <Loading />; // 你必须手动处理 loading
  return <div>{data.name}</div>;
}
```

在 useEffect 里获取数据时，组件已经完成了渲染（挂载到了页面上）。而 Suspense 工作的时机是渲染中，因此无法触发 Suspense。

| 场景                  | 是否激活 Suspense | 原因                                                 |
| --------------------- | ----------------- | ---------------------------------------------------- |
| React.lazy()          | ✅ 是             | React 内部实现了代码加载时的挂起逻辑。               |
| use(Promise)          | ✅ 是             | use 专门设计用于在渲染阶段与 Suspense 通信。         |
| 框架（Next.js/Relay） | ✅ 是             | 它们封装了底层的 Data Fetching，会自动抛出 Promise。 |
| useEffect + fetch     | ❌ 否             | Fetch 发生在渲染之后，Suspense 已经错过了捕获时机。  |
| onClick + fetch       | ❌ 否             | 属于交互逻辑，不是渲染逻辑。                         |

## 利用 Suspense 实现自动补全时的加载状态场景

```jsx
import { Suspense, useState } from "react";
import SearchResults from "./SearchResults.js";

export default function App() {
  const [query, setQuery] = useState("");
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

每次输入内容在加载时显示 Loading。

```jsx
import { use } from "react";
import { fetchData } from "./data.js";

export default function SearchResults({ query }) {
  if (query === "") {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return (
      <p>
        No matches for <i>"{query}"</i>
      </p>
    );
  }
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```
