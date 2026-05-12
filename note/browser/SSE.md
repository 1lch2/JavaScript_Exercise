# Server-Sent Events (SSE)

> 基于 HTTP 协议的服务器向客户端单向推送技术，常用于流式数据传输场景

## 概念介绍

### 是什么

**Server-Sent Events (SSE)** 是一种基于 HTTP 协议的服务器向客户端**单向推送**数据的技术。服务器通过一个持久化的 HTTP 连接，以 `text/event-stream` 媒体类型持续向客户端发送事件流。

与传统的请求-响应模式不同，SSE 允许服务器在有新数据时主动推送，客户端无需反复轮询。

### 为什么选择 SSE

- **基于 HTTP 协议**：天然兼容现有的 Web 基础设施（代理、负载均衡、防火墙），无需像 WebSocket 那样进行协议升级
- **自动重连**：`EventSource` API 内置断线重连机制，连接断开后自动尝试重新连接
- **断线续传**：通过 `id` 和 `Last-Event-ID` 机制，重连后可以从上次断开的位置继续接收事件
- **实现简单**：服务端只需按特定格式输出文本，客户端使用原生 `EventSource` API 即可
- **轻量级**：相比 WebSocket 的双向连接，SSE 只维护单向通道，资源消耗更低

### 应用场景

- **AI 流式输出**：ChatGPT、Claude 等大模型的流式响应，逐字返回生成内容
- **实时通知推送**：消息通知、系统告警、邮件到达提醒
- **实时数据看板**：股票行情、监控数据、日志流
- **进度更新**：文件上传/下载进度、任务执行状态

## 协议格式

SSE 的数据格式基于纯文本，每条消息由以下字段组成，消息之间以**双换行符 `\n\n`** 分隔。

### Content-Type

```
Content-Type: text/event-stream
```

### 字段说明

| 字段 | 说明 | 出现次数 |
|------|------|----------|
| `data` | 消息数据，多行会用 `\n` 拼接 | 可多次 |
| `event` | 自定义事件类型，默认为 `message` | 最多 1 次 |
| `id` | 事件 ID，赋值到 `EventSource.lastEventId` | 最多 1 次 |
| `retry` | 重连间隔，单位毫秒 | 最多 1 次 |
| `:` | 注释行，常用于心跳保活 | 可多次 |

### 完整示例

```
: heartbeat\n
\n
event: message\n
id: 1\n
data: Hello World\n
\n
event: update\n
id: 2\n
retry: 10000\n
data: {"name":"Alice","score":95}\n
data: 多行数据会合并为一条\n
\n
```

### 各字段详解

#### data 字段

最常用的字段，包含消息的实际内容。一条消息可以包含多个 `data` 行，客户端接收到的 `event.data` 会用换行符拼接。

```
data: 第一行内容\n
data: 第二行内容\n
\n
```

客户端接收结果：`第一行内容\n第二行内容`

#### event 字段

指定事件类型。如果不设置，默认为 `message` 事件。客户端需要使用 `addEventListener` 监听自定义事件。

```
event: userLogin\n
data: {"user": "alice"}\n
\n
```

#### id 字段

设置事件 ID。该值会被赋给 `EventSource.lastEventId`。当连接断开重连时，客户端会自动在请求头中携带 `Last-Event-ID`，服务端可据此判断从哪个位置恢复数据。

```
id: 1001\n
data: 某条消息\n
\n
```

#### retry 字段

指定客户端断线后重新连接的等待时间，单位为毫秒。如果服务端未设置该字段，默认重连间隔约为 3 秒。

```
retry: 5000\n
data: hello\n
\n
```

#### 注释行

以 `:` 开头的行是注释，客户端会直接忽略。注释行不包含实际数据，常用于**心跳保活**，防止连接因空闲超时而被关闭。

```
: ping\n
\n
```

## 客户端 API（EventSource）

### 基本用法

```javascript
// 创建 SSE 连接（默认 GET 请求）
const eventSource = new EventSource('/api/stream');

// 监听默认 message 事件
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('收到数据:', data);
  console.log('事件 ID:', event.lastEventId);
};

// 监听自定义事件
eventSource.addEventListener('userLogin', (event) => {
  const data = JSON.parse(event.data);
  console.log('用户登录:', data);
});

// 错误处理
eventSource.onerror = (event) => {
  if (eventSource.readyState === EventSource.CONNECTING) {
    console.log('连接断开，正在重连...');
  } else if (eventSource.readyState === EventSource.CLOSED) {
    console.log('连接已关闭');
  }
};

// 关闭连接
eventSource.close();
```

### readyState 状态

`EventSource.readyState` 表示连接状态，有三个常量：

| 常量 | 值 | 说明 |
|------|---|------|
| `EventSource.CONNECTING` | 0 | 正在连接或断线重连中 |
| `EventSource.OPEN` | 1 | 连接已建立，正在接收数据 |
| `EventSource.CLOSED` | 2 | 连接已关闭（调用 `close()`） |

### EventSource 的局限

原生 `EventSource` 存在以下限制：

- **仅支持 GET 请求**：无法发送 POST 请求或携带请求体（body）
- **无法自定义请求头**：不能设置 `Authorization` 等认证头
- **仅支持文本数据**：无法传输二进制数据

这些限制在与需要 POST 请求的 API（如大模型接口）交互时尤为突出，需要使用替代方案。

## 服务端实现

### Node.js + Express

```javascript
const express = require('express');
const app = express();

app.get('/events', (req, res) => {
  // 设置 SSE 必需的响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let id = 0;

  // 定时发送事件
  const interval = setInterval(() => {
    const data = { message: 'Hello', timestamp: new Date().toISOString() };
    res.write(`id: ${id++}\n`);
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  // 心跳保活
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // 客户端断开时清理资源
  req.on('close', () => {
    clearInterval(interval);
    clearInterval(heartbeat);
    res.end();
  });
});

app.listen(3000);
```

### Python + FastAPI

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json
from datetime import datetime

app = FastAPI()

async def event_generator():
    """SSE 事件生成器"""
    id = 0
    while True:
        data = {
            "message": "Hello",
            "timestamp": datetime.now().isoformat()
        }
        yield f"id: {id}\n"
        yield f"event: message\n"
        yield f"data: {json.dumps(data)}\n\n"
        id += 1
        await asyncio.sleep(1)

@app.get("/events")
async def sse_endpoint():
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )
```

### Next.js App Router

```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { prompt } = await request.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = ['你', '好', '，', '世', '界'];
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        await new Promise((r) => setTimeout(r, 100));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## 服务端推送方案对比

### Polling / Long Polling / SSE / WebSocket

| 对比项 | Polling | Long Polling | SSE | WebSocket |
|--------|---------|-------------|-----|-----------|
| 通信方向 | 客户端 → 服务端 | 客户端 → 服务端 | 服务端 → 客户端 | 全双工（双向） |
| 协议 | HTTP | HTTP | HTTP | ws / wss |
| 实时性 | 低 | 中 | 高 | 最高 |
| 实现复杂度 | 低 | 低 | 低 | 中高 |
| 自动重连 | 无 | 无 | 内置支持 | 需自行实现 |
| 二进制支持 | 无 | 无 | 无 | 支持 |
| 浏览器兼容 | 全部 | 全部 | 除 IE 外主流 | 主流全支持 |

### 如何选择

- **只需要服务端推送**：选择 SSE，实现简单，自动重连
- **需要双向实时通信**：选择 WebSocket，如聊天室、多人协同编辑
- **兼容性要求高或实时性低**：选择 Polling
- **大模型流式输出**：选择 SSE（事实上的标准做法）

## 进阶话题

### 使用 Fetch 替代 EventSource

由于原生 `EventSource` 仅支持 GET 请求，实际开发中常使用 `fetch` API 配合 `ReadableStream` 手动解析 SSE 流，以支持 POST 请求和自定义请求头。

```javascript
async function fetchSSE(url, options) {
  const { onMessage, onError, ...fetchOptions } = options;

  const response = await fetch(url, fetchOptions);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // 按双换行符分割消息
    const messages = buffer.split('\n\n');
    // 最后一个可能是不完整的消息，保留在 buffer 中
    buffer = messages.pop();

    for (const message of messages) {
      if (!message.trim()) continue;

      const lines = message.split('\n');
      const event = { data: '', event: 'message', id: '', retry: '' };

      for (const line of lines) {
        if (line.startsWith('data:')) {
          event.data += (event.data ? '\n' : '') + line.slice(5).trimStart();
        } else if (line.startsWith('event:')) {
          event.event = line.slice(6).trim();
        } else if (line.startsWith('id:')) {
          event.id = line.slice(3).trim();
        } else if (line.startsWith('retry:')) {
          event.retry = line.slice(6).trim();
        }
      }

      onMessage?.(event);
    }
  }
}

// 使用示例：支持 POST 请求
fetchSSE('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
  },
  body: JSON.stringify({ prompt: 'Hello' }),
  onMessage(event) {
    if (event.data === '[DONE]') return;
    console.log(JSON.parse(event.data));
  },
  onError(err) {
    console.error('SSE error:', err);
  },
});
```

### fetch-event-source 库

微软开源的 `@microsoft/fetch-event-source` 是一个基于 `fetch` 的 `EventSource` 替代方案，支持 POST 请求、自定义请求头、自动重连等功能。

```bash
npm install @microsoft/fetch-event-source
```

```javascript
import { fetchEventSource } from '@microsoft/fetch-event-source';

await fetchEventSource('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
  },
  body: JSON.stringify({ prompt: 'Hello' }),

  onopen(response) {
    if (response.ok) {
      console.log('连接建立成功');
    }
  },

  onmessage(event) {
    if (event.data === '[DONE]') return;
    const data = JSON.parse(event.data);
    console.log('收到:', data);
  },

  onerror(err) {
    console.error('连接错误:', err);
    // 抛出异常停止重连，返回其他值则继续重连
    throw err;
  },

  // 控制重连策略
  openWhenHidden: false,  // 页面不可见时不连接
});
```

### 生产环境注意事项

#### 心跳保活

长连接可能因空闲超时被代理或网关关闭。服务端应定期发送注释行作为心跳：

```javascript
// 每 30 秒发送一次心跳
const heartbeat = setInterval(() => {
  res.write(': heartbeat\n\n');
}, 30000);
```

#### Nginx 代理配置

默认情况下 Nginx 会缓冲响应，导致 SSE 消息延迟。需要关闭缓冲：

```nginx
location /events {
  proxy_pass http://backend;
  proxy_http_version 1.1;
  proxy_set_header Connection '';
  proxy_buffering off;               # 关闭缓冲
  proxy_cache off;                    # 关闭缓存
  chunked_transfer_encoding off;     # 关闭分块传输编码
}
```

#### 负载均衡

SSE 是长连接，如果使用多台服务器，需要确保同一客户端的请求始终路由到同一台服务器（粘性会话）。

#### 资源清理

服务端必须在客户端断开连接时清理定时器、数据库连接等资源，防止内存泄漏。

```javascript
req.on('close', () => {
  clearInterval(interval);
  clearInterval(heartbeat);
  // 清理其他资源
});
```

## 面试高频考点

### SSE 与 WebSocket 的本质区别

SSE 基于 HTTP 协议，是单向的（服务端 → 客户端），天然兼容现有的 Web 基础设施。WebSocket 是独立的协议（`ws://`），通过 HTTP 升级握手建立全双工连接，需要特殊支持。

### 为什么 SSE 适合 AI 流式输出

大模型的流式输出是典型的**服务端单向推送**场景：服务端逐 token 生成内容并推送，客户端只需接收和展示。SSE 实现简单、自动重连、基于 HTTP 天然兼容各种环境，是该场景的事实标准。

### EventSource 为什么默认 3 秒重连

这是 HTML 规范的默认行为。当连接断开时，浏览器会等待约 3 秒后自动重连。服务端可以通过 `retry` 字段覆盖这个间隔。

### Last-Event-ID 的作用

当 SSE 连接断开重连时，`EventSource` 会自动在请求头中携带 `Last-Event-ID`，值为最后收到的事件 ID。服务端据此判断客户端消费到哪个位置，从而实现断线续传，避免数据丢失。

### SSE 的局限性

- 仅支持文本数据，无法传输二进制
- 单向通信（服务端 → 客户端），客户端无法通过同一条连接发送数据
- HTTP/1.1 下浏览器对同一域名的并发连接数限制（通常 6 个）
- 原生 `EventSource` 仅支持 GET 请求，无法自定义请求头（需用 `fetch` 替代）
