# XMLHttpRequest

## 发送跨域的 POST 请求
场景：要使用 XMLHttpRequest 对象 POST 请求不在同一域名下的一个站点，即：跨域请求，请求数据格式为JSON。

需要使用 `setRequestHeader()` 方法设置 Content-Type 为`application/json` 。设置完这个自定义的HTTP Headers后，发现原本可以跨域POST请求失效了。调试对应的服务端代码，发现POST请求变成了OPTIONS请求。

这与CORS（Cross-Origin Resource Sharing，跨站资源共享）策略有关，设置Content-Type后，CORS简单请求变为Preflighted 请求。在Preflighted 请求中，XMLHttpRequest对象会首先发送OPTIONS嗅探，以验证是否有对指定站点的访问权限。

## XHR 跨域请求分类
XHR对象对于HTTP跨域请求有三种：简单请求、Preflighted 请求、Preflighted 认证请求。

简单请求不需要发送OPTIONS嗅探请求，但只能按发送简单的GET、HEAD或POST请求，且不能自定义HTTP Headers。

Preflighted 请求和认证请求，XHR会首先发送一个OPTIONS嗅探请求，然后XHR会根据OPTIONS请求返回的 Access-Control-* 等头信息判断是否有对指定站点的访问权限，并最终决定是否发送实际请求信息。

### 简单请求
使用简单请求进行跨域访问时，XMLHttpRequest对象会直接将实际请求发送给服务器。简单请求具有如下特点：
- 只能使用GET、HEAD、POST方法。
- 使用POST方法向服务器发送数据时，Content-Type **只能** 使用`application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain` 编码格式。
- 请求时不能使用自定义的 HTTP Headers

### Preflighted 请求
Preflighted 请求与简单请求不同，Preflighted 请求首先会向服务器发送一个 Options 请求，以验证是否对指定服务有访问权限，之后再发送实际的请求。Preflighted 请求具有以下特点：
- 除GET、HEAD、POST方法外，XHR都会使用Preflighted 请求。
- 使用POST方法向服务器发送数据时，Content-Type 使用`application/x-www-form-urlencoded`、`multipart/form-data` 或 `text/plain` 之外编码格式也会使用 Preflighted 请求。
- 使用了自定义的 HTTP Headers后，也会使用 Preflighted 请求。

常见情况为发送JSON数据与服务器交互，示例如下：
```js
var xhr = new XMLHttpRequest();
var url = 'http://itbilu.other/resources/post-json/';
var body = {name:'IT笔录'};

xhr.open('POST', url, true);
xhr.setRequestHeader('X-ITBILU', 'itbilu.com');
xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        console.log(xhr.responseText);
    }
};
xhr.send(JSON.stringify(body)); 
```

服务器第一次收到的Options请求头如下：
```http
OPTIONS /resources/post-json/ HTTP/1.1
Host: itbilu.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2,da;q=0.2
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Origin: http://itbilu.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-ITBILU
```
在上面的请示头中：Access-Control-Request-Method 告诉服务器接下来的实际请求是一个POST请求。

Access-Control-Request-Headers告诉服务器接下来实际请求将包含一个自定义的请求头 X-ITBILU 。


对该Options请求的响应头如下：
```http
HTTP/1.1 200 OK
Date: Tue, 22 SEP 2015 22:23:55 GMT
Server: Nginx/1.8.0 
Access-Control-Allow-Origin: http://itbilu.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-ITBILU
Access-Control-Max-Age: 1728000
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

在上面的响应头中：Access-Control-Request-Method 告诉请求对象（XHR），服务允许使用POST、GET、OPTIONS方法访问资源。

Access-Control-Request-Headers告诉请求对象，服务器允许包含自定义请求头X-ITBILU。

而最后一个响应头Access-Control-Max-Age告诉请求对象验证有效时长，在接下来的1728000秒（20天）不用再发送OPTIONS请求验证合法性。

在XHR对象发送OPTIONS请求并验证完以上头信息后，才最终发送了实际的POST请求。


## Reference
- [为什么XMLHttpRequest的POST请求会变OPTIONS请求](https://itbilu.com/javascript/js/VkiXuUcC.html)
