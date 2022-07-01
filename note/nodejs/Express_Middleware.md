# Express中间件
## 基础
Express中间件类似于AOP面向切面编程，都是需要经过一些步骤，不用去修改自己的代码，从此来拓展或处理一些功能

> AOP（Aspect Oriented Programming）面向切面编程
> 
> 将日志记录，性能统计、安全控制、事务处理、异常处理等代码从业务逻辑代码中划分出来，通过对这些行为的分离，希望可以将它们独立到非指导业务逻辑的方法中，进而改变这些行为的时候不影响业务逻辑的代码
> 
> 利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性同时提高了开发的效率和可维护性

在 Express 中，中间件是一个可以访问请求对象、响应对象和调用next方法的一个函数，示例如下
```js
// 路由方法本身也是中间件
// 第一个参数指定中间件生效的路由
app.get("/", function(req, res, next) {
  next(); // next 方法调用下一个中间件
});

// 也可以用下面的方法加载中间件，这时第一个路由参数是可选的
const logger = function(req, res, next) {
  console.log(req.url);
  next();
}
app.use(logger);
```

在中间件中可以执行以下任务：
- 执行任何代码
- 修改 request 或 response 响应对象（同一个生命周期）
- 结束请求响应周期
- 调用下一个中间件

**注意**：如果当前的中间件功能没有结束请求-响应周期，则必须调用next()将控制全传递给下一个中间件功能。否则，该请求将被挂起

## 中间件类型
Express 中有以下几类的中间件：
- 应用程序级别中间件
- 路由级别中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

### 应用程序级别中间件
用法示例如下

不关心请求路径
```js
app.use((req, res, next) => {
  console.log("Time", Date.now());
  next();
});
```

限定请求路径
```js
app.use('/user/:id',(req, res, next) => {
  console.log("Request Type", req.method); // GET
  next();
});
```

限定请求方法+请求路径（路由中间件）
```js
app.get('/user/:id',(req, res, next) => {	
  res.send('Hello World')
});
```

多个处理函数
```js
app.use(
  "/user/:id",
  (req, res, next) => {
    console.log("Request URL", req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log("Request Type", req.method);
    next();
  }
);
```

为同一个路径定义多个处理中间件
```js
app.get(
  "/user/:id",
  (req, res, next) => {
    console.log("ID", req.params.id);
    next();
  },
  (req, res, next) => {
    res.send("User Info");
    next();
  }
);

app.get("/user/:id", (req, res, next) => {
  console.log("123");
  // res.end(req.params.id);
});
```

### 路由级别中间件
创建单独的路由模块
```js
const express = require('express')

// 1. 创建路由实例
// 路由实例相当于一个 mini Express实例
const router = express.Router()

// 2. 配置路由
router.get('/user', (req, res) => {
  res.send('get /user')
})

router.post('/user/:id', (req, res) => {
  res.send(`post /user/${req.params.id}`)
})

// 3. 导出路由实例
// ES6: export default router
module.exports = router
```

在 app.js 中挂载
```js
const express = require("express");
const router = require('./router')

const app = express();
const port = 3000; // 默认3000

// 4. 挂载路由
app.use(router)
app.use('/api', router)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
```

### 错误处理中间件
错误处理中间件始终带有四个参数，且**必须提供四个参数**，即使不需要 next 也要指定它，否则，将会解释成常规中间件，并且无法处理错误。

匹配到了出现错误调用 `next(err)`，一般在所有中间件之后挂载错误处理中间件。示例如下：

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

如果将任何内容传递给该 next() 函数（`"route"`除外），Express都会将当前请求视为错误，并且将跳过所有剩余的非错误处理路由和中间件函数
```js
app.get("/todos", async (req, res, next) => {
  try {
    const db = await getDb();
    res.status(200).json(db.todos);
  } catch (err) {
    // 跳过所有剩余的无错误处理路由和中间函数
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("错误", err);
  res.status(500).json({
    error: err.message,
  });
});
```

下例为处理404，即没有匹配路由的情况，通常会在所有的路由之后配置处理 404 的内容
```js
app.use((req, res, next) => {
  res.status(404).send("404 Not Found.");
});
```

### 内置中间件
- `express.json()`： 解析Content-Type为application/json格式的请求体
- `express.urlencoded()`： 解析Content-Type 为application/x-www-form-urlencoded格式的请求体
- `express.raw()`： 解析Content-Type为application/octet-stream格式的请求体
- `express.text()`： 解析Content-Type为text/plain格式的请求体
- `express.static()`： 托管静态资源文件

## 结束响应
res对象上的方法可以将响应发送到客户端，并终止请求-响应周期。如果没有从路由处理程序调用这些方法，则客户端请求将被挂起。

|       方法       |                        描述                        |
|:----------------:|:--------------------------------------------------:|
| res.download()   | 提示要下载的文件                                   |
| res.end()        | 结束响应过程                                       |
| res.json()       | 发送JSON响应                                       |
| res.jsonp()      | 发送带有JSONP支持的JSON响应                        |
| res.redirect()   | 重定向请求                                         |
| res.render()     | 渲染视图模板                                       |
| res.send()       | 发送各种类型的响应                                 |
| res.sendFile()   | 将文件作为八位字节流发送                           |
| res.sendStatus() | 设置响应状态码，并将其字符串表示形式发送为响应正文 |


## Express 与 Koa 的区别
- express内置了许多中间件可供使用，而koa没有。
- express包含路由，视图渲染等特性，而koa只有http模块。
- express的中间件模型为线型，而koa的中间件模型为U型，也可称为洋葱模型构造中间件。
- express通过回调实现异步函数，在多个回调、多个中间件中写起来容易逻辑混乱。