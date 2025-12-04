# Axios

## 封装 axios

Axios 虽然功能强大，但直接裸用会有以下问题：

- 重复配置请求头、baseURL 等
- 错误处理逻辑散落在各处
- 请求加载状态管理繁琐
- 不方便统一添加认证 token
- 难以实现请求防抖、节流、重试等高级功能

### axios 实例

```js
import axios from "axios";

// 创建实例
const axios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true, // 跨域请求时是否携带凭证（cookies）
});

export default axios;
```

### 请求拦截器

```js
axios.interceptors.request.use(
  (config) => {
    // 处理逻辑
    return config;
  },
  (error) => {
    // 错误处理
    return Promise.reject(error);
  }
);
```

### 响应拦截器

```js
axios.interceptors.response.use(
  (response) => {
    // 成功响应处理
    return response.data;
  },
  (error) => {
    // 响应错误处理
    return Promise.reject(error);
  }
);
```

使用响应拦截器处理错误的例子：

```js
axios.interceptors.response.use(
  (response) => {
    // 成功响应处理
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回了错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权
          break;
        case 403:
          // 拒绝访问
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
      }
    } else if (error.request) {
      // 请求已发送但没收到响应（网络问题）
      console.log("网络异常，请检查网络连接");
    } else {
      // 请求配置出错
      console.log("请求配置错误:", error.message);
    }
  }
);
```
