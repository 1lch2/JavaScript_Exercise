# 客户端与服务端组件

对于传统React app来说，所有组件都是客户端组件。在NextJS中引入了服务端组件，可以在服务端获取数据并渲染部分UI。引入服务端组件以后，使用场景就需要做出区分，通常如下

在需要以下功能时使用客户端组件：

- 状态和事件处理程序。例如 onClick 、 onChange 。
- 生命周期逻辑。例如 useEffect 。
- 仅浏览器可用的 API。例如 localStorage 、 window 、 Navigator.geolocation 等。
- 自定义 Hook。

在需要以下情况时使用服务端组件：

- 从靠近数据源的数据库或 API 获取数据。
- 使用 API 密钥、令牌和其他机密信息，同时避免将其暴露给客户端。
- 减少发送到浏览器的 JavaScript 量。
- 提升首内容绘制（FCP），并逐步向客户端流式传输内容。

服务端和客户端组件混用示例：
`<Page>` 组件是一个服务器组件，它获取有关帖子的数据，并将其作为属性传递给处理客户端交互的 `<LikeButton> `

```tsx
import LikeButton from "@/app/ui/like-button";
import { getPost } from "@/lib/data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  );
}
```

```tsx
"use client";

import { useState } from "react";

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

## 工作原理

在服务器端，Next.js 使用 React 的 API 来编排渲染工作。渲染任务被拆分为多个部分，对应各个路由段（布局和页面）。

- 服务器组件被渲染成一种特殊的数据格式，称为 React 服务器组件负载（RSC Payload）。
  > RSC 负载是渲染后的 React 服务端组件树的紧凑二进制表示形式。React 在客户端使用它来更新浏览器的 DOM。RSC 负载包含：
  >
  > - 服务器组件的渲染结果
  > - 客户端组件应在此处渲染的位置及其 JavaScript 文件的引用
  > - 从服务器组件传递到客户端组件的任何属性
- 客户端组件和 RSC Payload 用于预渲染 HTML。

在客户端的工作顺序如下：

1. HTML 用于立即向用户展示该路由的快速非交互式预览。
2. RSC 负载用于协调客户端和服务器组件树。
3. JavaScript 用于水合客户端组件，使应用程序具备交互性。

TODO:
