# Next.js 相对于传统方案的区别

相比于传统的React框架组合，NextJS的最大特点是转向 SSR

## 路由模式

经典的 React + React Router 中需要手动维护一个路由表，例如：

```jsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
```

path和组件的对应关系需要手动绑定。

在NextJS中则是按照页面组件在目录中的嵌套布局对应path，例如：

```
└─ app/
    ├── page.tsx
    ├── analyze/
    │   └── page.tsx
    ├── layout.tsx
    └── globals.css
```

path和组件对应为：

- `/` : `app/page.tsx`
- `/analyze` : `app/analyze/page.tsx`

在同目录下的 layout.tsx 会被该目录下的所有页面共享，且跳转时布局不会重新渲染。

## 数据获取改为从服务端读取

传统方式中需要在前端发起请求，获取到数据后将数据set到对应字段，例如：

```jsx
// components/UserList.tsx
"use client";
import { useQuery } from "@tanstack/react-query";

export function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

而在NextJS中，服务端组件写成 `async` 可以直接在服务端读取数据而不需要额外的API层，例如：

```jsx
// app/users/page.tsx
// 这是一个服务端组件，代码不在浏览器运行
export default async function Page() {
  // 1. 直接请求第三方 API 或数据库
  const res = await fetch('https://api.example.com/users');
  const users: User[] = await res.json();

  // 2. 数据直接渲染成 HTML 发给浏览器
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 数据管理从手动管理状态变为 server action

传统场景下，如果要向服务器提交数据，需要管理输入状态并实现 onSubmit。

```jsx
const [name, setName] = useState("");
const handleSubmit = async () => {
  await fetch("/api/create-user", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  // 然后手动通知 TanStack Query 刷新缓存
  queryClient.invalidateQueries(["users"]);
};
```

在 NextJS 中使用 server action提交表单

```jsx
// app/users/page.tsx
import { revalidatePath } from 'next/cache';

export default function Page() {
  async function createUser(formData: FormData) {
    'use server'; // 声明这是一个在服务器运行的函数
    const name = formData.get('name');
    await db.user.create({ data: { name } });

    // 自动通知框架：用户列表页面的数据过期了，刷新它
    revalidatePath('/users');
  }

  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">创建用户</button>
    </form>
  );
}
```

关于 Server Function，详见[这篇笔记](./Server_Functions.md)
