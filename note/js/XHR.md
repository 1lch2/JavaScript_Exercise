# XMLHttpRequest

## 发送跨域的 POST 请求
场景：要使用 XMLHttpRequest 对象 POST 请求不在同一域名下的一个站点，即：跨域请求，请求数据格式为JSON。

需要使用 `setRequestHeader()` 方法设置 Content-Type 为`application/json` 。设置完这个自定义的HTTP Headers后，发现原本可以跨域POST请求失效了。调试对应的服务端代码，发现POST请求变成了OPTIONS请求。

这与CORS（Cross-Origin Resource Sharing，跨站资源共享）策略有关，设置Content-Type后，CORS简单请求变为Preflighted 请求。在Preflighted 请求中，XMLHttpRequest对象会首先发送OPTIONS嗅探，以验证是否有对指定站点的访问权限。

TODO:


## Reference
- [为什么XMLHttpRequest的POST请求会变OPTIONS请求](https://itbilu.com/javascript/js/VkiXuUcC.html)
