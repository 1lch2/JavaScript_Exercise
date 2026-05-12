# NextJS - Server Functions

> Server Function 是 Next.js（App Router）中在服务端运行的异步函数，可以直接在客户端通过网络请求调用。当 Server Function 在表单 `action` 或 mutation 上下文中使用时，也称为 **Server Action**。

## 基本概念

### 定义

**Server Function** 是一个在服务端执行的异步函数，客户端通过 POST 请求调用它，因此必须是 `async` 函数。

**Server Action** 是 Server Function 在特定场景下的称呼——当它被用于表单提交和数据变更时。具体来说，当函数满足以下条件之一时，自动成为 Server Action：

- 通过 `<form>` 元素的 `action` 属性传递
- 通过 `<button>` 元素的 `formAction` 属性传递

两者的关系：Server Action 是 Server Function 的子集，Server Function 是更宽泛的概念。

```javascript
// 这是 Server Function（用于数据变更时也是 Server Action）
async function createPost(formData) {
  "use server";
  // 数据变更逻辑...
}
```

## 创建 Server Function

使用 `"use server"` 指令标记函数为 Server Function。有两种方式：文件级声明和内联声明。

### 文件级声明

在文件顶部添加 `"use server"`，该文件的所有导出函数都会成为 Server Function：

```javascript
// app/actions.js
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createPost(formData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const content = formData.get("content");

  await db.post.create({ data: { title, content } });
}

export async function deletePost(formData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id");
  await db.post.delete({ where: { id } });
}
```

### 内联声明

在 Server Component 中，可以在函数体内添加 `"use server"`：

```javascript
// app/page.js
export default function Page() {
  async function createPost(formData) {
    "use server";
    // 数据变更逻辑...
  }

  return <form action={createPost}>...</form>;
}
```

## 调用 Server Function

### 通过表单调用

React 扩展了 HTML `<form>` 元素，允许通过 `action` 属性调用 Server Function。表单提交时，函数自动接收 `FormData` 对象：

```javascript
// app/actions.js
"use server";

export async function createPost(formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  await savePost({ title, content });
}
```

```jsx
// app/ui/form.js
import { createPost } from "@/app/actions";

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">创建</button>
    </form>
  );
}
```

> **渐进增强**：Server Component 中的表单即使在 JavaScript 未加载或被禁用时也能提交。Client Component 中的表单会在 JavaScript 加载完成后自动处理提交。

### 通过事件处理器调用

在 Client Component 中，可以通过 `onClick` 等事件处理器调用 Server Function：

```jsx
"use client";

import { incrementLike } from "./actions";
import { useState } from "react";

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <>
      <p>总点赞数: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike();
          setLikes(updatedLikes);
        }}
      >
        点赞
      </button>
    </>
  );
}
```

### 通过 useEffect 调用

可以在 `useEffect` 中调用 Server Function，适用于组件挂载时自动触发的场景（如更新浏览量）：

```jsx
"use client";

import { incrementViews } from "./actions";
import { useState, useEffect, useTransition } from "react";

export default function ViewCount({ initialViews }) {
  const [views, setViews] = useState(initialViews);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews();
      setViews(updatedViews);
    });
  }, []);

  return <p>总浏览量: {views}</p>;
}
```

### 作为 props 传递

Server Function 可以作为 props 传递给 Client Component：

```jsx
// Server Component 中
<ClientComponent updateItemAction={updateItem} />
```

```jsx
// Client Component 中
"use client";

export default function ClientComponent({ updateItemAction }) {
  return <form action={updateItemAction}>{/* ... */}</form>;
}
```

## 在 Client Component 中使用

Client Component 不能直接定义 Server Function，但可以**导入**文件级声明的 Server Function：

```javascript
// app/actions.js
"use server";

export async function createPost() {
  // 服务端逻辑...
}
```

```jsx
// app/ui/button.js
"use client";

import { createPost } from "@/app/actions";

export function Button() {
  return <button formAction={createPost}>创建</button>;
}
```

## Server Function 的返回值

Server Function 的返回值会被序列化并发送到客户端。只返回 UI 需要的数据，不要返回原始数据库记录：

```javascript
"use server";

export async function createUser(data) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.create({ data });
  // 只返回必要字段
  return { id: user.id, name: user.name };
}
```

## 配合缓存操作

### 刷新数据

变更后刷新当前页面数据，使用 `refresh` 函数：

```javascript
"use server";

import { refresh } from "next/cache";

export async function updatePost(formData) {
  // 变更数据...
  await db.post.update(/* ... */);

  // 刷新客户端路由，UI 更新为最新状态
  refresh();
}
```

### 重新验证缓存

变更后重新验证缓存并展示更新数据，使用 `revalidatePath` 或 `revalidateTag`：

```javascript
"use server";

import { revalidatePath } from "next/cache";

export async function createPost(formData) {
  // 变更数据...
  await db.post.create(/* ... */);

  // 重新验证 /posts 路径的缓存
  revalidatePath("/posts");
}
```

### 变更后重定向

变更后将用户重定向到其他页面：

```javascript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData) {
  // 变更数据...
  await db.post.create(/* ... */);

  revalidatePath("/posts");
  redirect("/posts");
}
```

> **注意**：`redirect` 会抛出一个框架控制流异常，其后的代码不会执行。如果需要刷新数据，必须在 `redirect` 之前调用 `revalidatePath` 或 `revalidateTag`。

### 操作 Cookies

在 Server Action 中可以使用 `cookies` API 读写 Cookie：

```javascript
"use server";

import { cookies } from "next/headers";

export async function exampleAction() {
  const cookieStore = await cookies();

  // 读取
  cookieStore.get("name")?.value;

  // 设置
  cookieStore.set("name", "value");

  // 删除
  cookieStore.delete("name");
}
```

## 错误处理

### 预期错误（表单验证等）

使用 `useActionState` hook 处理预期错误。建议将错误建模为**返回值**，而非抛出异常：

```javascript
// app/actions.js
"use server";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");

  const res = await fetch("https://api.example.com/posts", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    return { message: "创建帖子失败" };
  }

  return { message: "success" };
}
```

```jsx
// app/ui/form.js
"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";

const initialState = { message: "" };

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      <input type="text" name="title" />
      <textarea name="content" />
      {state?.message && <p>{state.message}</p>}
      <button disabled={pending}>创建</button>
    </form>
  );
}
```

### 显示加载状态

`useActionState` 返回的第三个值 `pending` 表示 Server Function 是否正在执行：

```jsx
"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";
import { LoadingSpinner } from "@/app/ui/loading-spinner";

export function Button() {
  const [state, action, pending] = useActionState(createPost, false);

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : "创建帖子"}
    </button>
  );
}
```

### 非预期错误（异常）

非预期错误由 `error.js` 错误边界捕获，而非在 Server Function 内部处理：

```jsx
// app/dashboard/error.js
"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, unstable_retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>出现错误</h2>
      <button onClick={() => unstable_retry()}>重试</button>
    </div>
  );
}
```

## 安全性

Server Function 可通过直接 POST 请求访问，不仅限于应用 UI。**必须在每个 Server Function 内部验证身份认证和授权**：

```javascript
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createUser(data) {
  // 始终验证认证状态
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 验证输入数据
  if (!data.name || !data.email) {
    throw new Error("Invalid input");
  }

  const user = await db.user.create({ data });
  return { id: user.id, name: user.name };
}
```

安全要点：

- **认证与授权**：从 Cookie 或 Header 读取认证信息，不要将 token 作为函数参数接收
- **返回值控制**：只返回 UI 需要的数据，不要泄露原始数据库记录
- **输入验证**：始终验证客户端传入的数据

## 底层机制

- Server Function 底层使用 **POST** 方法发起网络请求
- 调用时 Next.js 可以在单次服务端往返中同时返回更新后的 UI 和新数据
- Server Function 按顺序逐个执行（当前实现细节，未来可能改变）
- 需要并行数据获取时，应使用 Server Component 中的数据获取或 Route Handler

## Server Function vs Route Handler

| 对比项       | Server Function              | Route Handler                |
| ------------ | ---------------------------- | ---------------------------- |
| 协议         | 仅 POST                      | GET/POST/PUT/DELETE/PATCH 等 |
| 用途         | 表单提交、数据变更           | API 端点、Webhook            |
| 调用方式     | 表单 action、事件处理器      | HTTP 请求                    |
| 返回值       | 序列化的 JS 对象             | Response 对象                |
| 渐进增强     | 支持（表单场景）             | 不适用                       |
| 文件位置     | 任意位置 + `use server`      | `app/api/*/route.js`         |
