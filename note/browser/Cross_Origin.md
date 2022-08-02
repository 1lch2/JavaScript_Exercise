# 跨域请求

## 同源策略
### 定义
如果两个 URL 的 **协议**，**端口**，**域名** 都相同的话，则这两个 URL 是同源。

| URL                   | 结果 | 原因              |
|-----------------------|------|------------------|
| `http://store.company.com/dir2/other.html`        | 同源 | 只有路径不同                     |
| `http://store.company.com/dir/inner/another.html` | 同源 | 只有路径不同                     |
| `https://store.company.com/secure.html`           | 失败 | 协议不同                         |
| `http://store.company.com:81/dir/etc.html`        | 失败 | 端口不同 ( http:// 默认端口是80) |
| `http://news.company.com/dir/other.html`          | 失败 | 主机不同                         |

### 限制范围
1. Cookie、LocalStorage 和 IndexDB 无法读取。
2. DOM 无法获得。
3. AJAX 请求不能发送。

## 跨域的定义
跨域是指一个域下的文档或脚本试图去请求另一个域下的资源，这里跨域是广义的。

广义的跨域：

1. 资源跳转： `<a>`链接、重定向、表单提交
2. 资源嵌入： `<link>`、`<script>`、`<img>`、`<frame>`等dom标签，还有样式中`background:url()`、`@font-face()`等文件外链
3. 脚本请求： js发起的ajax请求、dom和js对象的跨域操作等

其实我们通常所说的跨域是狭义的，是由浏览器同源策略限制的一类请求场景。

## cookie
只有同源的网页才能共享 cookie.

两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置document.domain共享 Cookie。

举例:
A网页是 `http://w1.example.com/a.html` ，B网页是 `http://w2.example.com/b.html`，那么只要设置相同的`document.domain`，两个网页就可以共享Cookie。
```js
document.domain = 'example.com';
```

## ajax
有以下三种规避方法
- JSONP
- WebSocket
- CORS

### JSONP
JSONP, a.k.a. JSON with Padding。

网页通过添加一个`<script>`元素，向服务器请求JSON数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

1. 网页动态插入`<script>`元素，由它向跨源网址发出请求。
    ```js
    // 动态添加<script>元素
    function addScriptTag(src) {
      var script = document.createElement('script');
      script.setAttribute("type","text/javascript");
      script.src = src;
      document.body.appendChild(script);
    }

    // callback 参数用来指定回调函数的名字
    window.onload = function() {
      addScriptTag('http://example.com/ip?callback=foo');
    }

    function foo(data) {
      console.log(data);
    };
    ```

2. 服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。
    ```js
    foo({
        "ip": "8.8.8.8"
    });
    ```

3. 作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。

### WebSocket
- `ws://`：非加密
- `wss://`：加密

### CORS
Cross-Origin Resource Sharing，是跨源AJAX请求的根本解决方法。相比JSONP只能发GET请求，CORS允许任何类型的请求。

CORS使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器不同的域、协议或端口请求一个资源时，资源会发起一个跨域 HTTP 请求。

#### 服务器端
对于跨域请求，服务器需要设置响应头来允许请求跨域，常见请求头设置如下：

```http
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Headers: Authorization
Access-Control-Allow-Methods: POST, OPTIONS, GET
Access-Control-Allow-Origin: http://127.0.0.1:5500
Access-Control-Expose-Headers: Authorization
Access-Control-Max-Age: 86400
```

以上请求头解释如下：
- `Access-Control-Allow-Credentials`：允许跨域请求携带凭证，如cookies。在这项为 `true` 时，`Access-Control-Allow-Origin` 就不能设置为通配符`"*"`，而要指定允许的请求源
- `Access-Control-Allow-Headers`：用于 preflight 请求中，列出了将会在正式请求的 Access-Control-Request-Headers 字段中出现的首部信息。常见的简单header包括在其中不需要指定，但通常会用来携带 token的 `Authorization` 头不在其中，必须要在这里指定。
    - 注意：`Content-Type`虽然默认包括在内，但是不包括解析后值为`application/json`的情况，传递JSON数据时还是需要专门添加这一项
- `Access-Control-Allow-Methods`：将所有允许的请求方法告知客户端
- `Access-Control-Expose-Headers`：列出了哪些首部可以作为响应的一部分暴露给外部。前端发起携带token的求时需要指定这个 header
- `Access-Control-Max-Age`：表示 preflight request （预检请求）的返回结果（即 Access-Control-Allow-Methods 和Access-Control-Allow-Headers 提供的信息） 可以被缓存多久。

#### 客户端
对于 fetch API，在使用JWT，并将token存放在 localstorage的情况下，发起请求时需要指定跨域模式，并携带token。示例如下：
```js
fetch(url, {
  headers: {
    "Authorization": localStorage.getItem("token")
  },
  mode: "cors"
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
```
