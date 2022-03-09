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
A网页是http://w1.example.com/a.html，B网页是http://w2.example.com/b.html，那么只要设置相同的`document.domain`，两个网页就可以共享Cookie。
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