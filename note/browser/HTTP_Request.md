# HTTP 请求
## GET
使用 GET 的请求应该只用于获取数据。

## POST
POST 方法 发送数据给服务器。请求主体的类型由 Content-Type 首部指定。

**与 PUT 的区别**：
PUT 方法是幂等的：连续调用一次或者多次的效果相同

## PUT
PUT 请求方法使用请求中的负载创建或者替换目标资源。

## DELETE
DELETE 请求方法用于删除指定的资源。

如果 DELETE 方法成功执行，那么可能会有以下几种状态码：

- 状态码 202 (Accepted) 表示请求的操作可能会成功执行，但是尚未开始执行。
- 状态码 204 (No Content) 表示操作已执行，但是无进一步的相关信息。
- 状态码 200 (OK) 表示操作已执行，并且响应中提供了相关状态的描述信息。

## OPTIONS
### 定义
HTTP 的 OPTIONS 方法 用于获取目的资源所支持的通信选项。客户端可以对特定的 URL 使用 OPTIONS 方法，也可以对整站（通过将 URL 设置为“*”）使用该方法。

### 用途
#### 检测服务器所支持的请求方法
可以使用 OPTIONS 方法对服务器发起请求，以检测服务器支持哪些 HTTP 方法：

```shell
curl -X OPTIONS http://example.org -i
```
响应报文包含一个 `Allow` 首部字段，该字段的值表明了服务器支持的所有 HTTP 方法：

```http
HTTP/1.1 200 OK
Allow: OPTIONS, GET, HEAD, POST
Cache-Control: max-age=604800
Date: Thu, 13 Oct 2016 11:45:00 GMT
Expires: Thu, 20 Oct 2016 11:45:00 GMT
Server: EOS (lax004/2813)
x-ec-custom-error: 1
Content-Length: 0
```

#### CORS 中的预检请求(preflight request)
使用 OPTIONS 方法发起一个预检请求，以检测实际请求是否可以被服务器所接受。

预检请求报文中的 `Access-Control-Request-Method` 首部字段告知服务器实际请求所使用的 HTTP 方法；`Access-Control-Request-Headers` 首部字段告知服务器实际请求所携带的自定义首部字段。服务器基于从预检请求获得的信息来判断，是否接受接下来的实际请求。请求示例如下：
```http
OPTIONS /resources/post-here/ HTTP/1.1
Host: bar.other
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

服务器所返回的 `Access-Control-Allow-Methods` 首部字段将所有允许的请求方法告知客户端。该首部字段与 Allow 类似，但只能用于涉及到 CORS 的场景中。响应示例如下：
```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

## HEAD
### 定义
HEAD 方法 请求资源的头部信息，并且这些头部与 HTTP GET 方法请求时返回的一致。

### 用途
该请求方法的一个使用场景是在下载一个大文件前先获取其大小再决定是否要下载，以此可以节约带宽资源。

HEAD 方法的响应不应包含响应正文。即使包含了正文也必须忽略掉.

## PATCH
### 定义
PATCH 方法 用于对资源进行部分修改。

### 用途
在 HTTP 协议中， PUT 方法已经被用来表示对资源进行整体覆盖， 而 POST 方法则没有对标准的补丁格式的提供支持。不同于 PUT 方法，而与 POST 方法类似，PATCH 方法是非幂等的，这就意味着连续多个的相同请求会产生不同的效果。

要判断一台服务器是否支持  PATCH 方法，那么就看它是否将其添加到了响应首部 Allow 或者 Access-Control-Allow-Methods（在跨域访问的场合，CORS）的方法列表中 。

请求示例：
```http
PATCH /file.txt HTTP/1.1
Host: www.example.com
Content-Type: application/example
If-Match: "e0023aa4e"
Content-Length: 100

[description of changes]
```

响应示例：
204 状态码表示这是一个操作成功的响应，因为响应中不带有消息主体。
```http
HTTP/1.1 204 No Content
Content-Location: /file.txt
ETag: "e0023aa4f"
```

## CONNECT
### 定义
CONNECT 方法可以开启一个客户端与所请求资源之间的双向沟通的通道。它可以用来创建隧道（tunnel）。

### 用途
CONNECT 可以用来访问采用了 SSL (HTTPS) 协议的站点。客户端要求代理服务器将 TCP 连接作为通往目的主机隧道。之后该服务器会代替客户端与目的主机建立连接。连接建立好之后，代理服务器会面向客户端发送或接收 TCP 消息流。


## TRACE
### 定义
TRACE 方法 实现沿通向目标资源的路径的消息环回（loop-back）测试 ，提供了一种实用的 debug 机制。

请求的最终接收者应当原样反射（reflect）它接收到的消息
