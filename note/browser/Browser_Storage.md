# cookie, sessionStorage, localStorage

## cookie
### 概念
cookie 是服务器发送到用户浏览器并**保存在本地**的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于无状态的HTTP协议记录稳定的状态信息成为了可能。

cookie 大小限制在 **4KB** 左右

### 用途
- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

### 作用域
`Domain` 和 `Path` 标识定义了 Cookie 的作用域：即允许 Cookie 应该发送给哪些 URL。

#### Domain 属性
Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为 `origin`，不包含子域名。如果指定了Domain，则一般包含子域名。例如：如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中（如`developer.mozilla.org`）。

#### Path 属性
Path 标识指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 `%x2F` (`"/"`) 作为路径分隔符，子路径也会被匹配。

例如，设置 Path=/docs，则以下地址都会匹配：
```
/docs
/docs/Web/
/docs/Web/HTTP
```

#### SameSite 属性
SameSite Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

下面是例子：
```http
Set-Cookie: key=value; SameSite=Strict
```

SameSite 可以有下面三种值：
- None。浏览器会在同站请求、跨站请求下继续发送 cookies，不区分大小写。
- Strict。浏览器将只在访问相同站点时发送 cookie。（在原有 Cookies 的限制条件上的加强，如上文 “Cookie 的作用域” 所述）
- Lax。与 Strict 类似，但用户从外部站点导航至 URL 时（例如通过链接）除外。 在新版本浏览器中，为默认选项，Same-site cookies 将会为一些跨站子请求保留，如图片加载或者 frames 的调用，但只有当用户从外部站点导航到 URL 时才会发送。如 link 链接


### 使用
#### 添加 cookie
当服务器收到 HTTP 请求时，服务器可以在响应头里面添加一个 `Set-Cookie` 选项。
```http
Set-Cookie: <cookie名>=<cookie值>
```
对应的HTTP响应示例：
```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[页面内容]
```

浏览器收到响应后通常会保存下 Cookie，之后对该服务器每一次请求中都通过  Cookie 请求头部将 Cookie 信息发送给服务器。

之后，对该服务器发起的每一次新请求，浏览器都会将之前保存的Cookie信息通过 Cookie 请求头部再发送给服务器。请求示例如下：
```
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

#### 获取和设置 cookie
读取所有可从此位置访问的COOKIE:
```js
allCookies = document.cookie;
```
在上面的代码中，allCookies被赋值为一个字符串，该字符串包含所有的Cookie，每条cookie以"分号和空格(; )"分隔(即, key=value 键值对)。

写一个新 COOKIE
```js
document.cookie = "name=oeschger";
document.cookie = "favorite_food=tripe";
```
newCookie是一个键值对形式的字符串。需要注意的是，用这个方法**一次只能对一个cookie**进行设置或更新。

#### 生命周期
Cookie 的生命周期可以通过两种方式定义：
- 会话期 Cookie:

    最简单的 Cookie，浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效。
    
    会话期Cookie**不需要**指定过期时间（Expires）或者有效期（Max-Age）。
    
    需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期Cookie 也会被保留下来，就好像浏览器从来没有关闭一样，这会导致 Cookie 的生命周期无限期延长。

- 持久性 Cookie： 
    
    生命周期取决于过期时间（Expires）或有效期（Max-Age）指定的一段时间。例如：
    ```
    Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
    ```

cookie 的过期时间只和客户端有关

## localStorage & sessionStorage
两者均为浏览器端存储键值对信息的方式，不参与和服务器的通信。

### 共同点
1. 存储大小均为5M左右
2. 都有同源策略限制
3. 仅在客户端中保存，不参与和服务器的通信
4. 用法相同。示例如下

    ```js
    //sessionStorage用法相同
    localStorage.setItem("name",1);   // 以"x"为名字存储一个数值
    localStorage.getItem("name");     // 获取数值
    localStorage.key(i);              // 获取第i对的名字
    localStorage.removeItem("name");  // 获取该对的值
    localStorage.clear();             // 全部删除
    ```

### 不同点
1. 生命周期

    - localStorage：除非人为删除，数据会永久存在
    - sessionStorage：与存储数据的脚本所在的标签页的有效期是相同的。一旦窗口或者标签页被关闭，那么所有通过 sessionStorage 存储的数据也会被删除。

2. 作用域

    - localStorage: 在同一个浏览器内，同源文档之间共享 localStorage 数据，可以互相读取、覆盖。
    - sessionStorage: 与 localStorage 一样需要同一浏览器同源文档这一条件。不仅如此，sessionStorage 的作用域还被限定在了**窗口**中，也就是说，只有同一浏览器、同一窗口的同源文档才能共享数据。

## session
Session是在无状态的HTTP协议下，**服务端**记录用户状态时用于标识具体用户的机制。它是在服务端保存的用来跟踪用户的状态的数据结构，可以保存在文件、数据库或者集群中。

Session的运行依赖Session ID，而Session ID是存在 Cookie 中的。也就是说，如果浏览器禁用了Cookie,Session也会失效（但是可以通过其它方式实现，比如在url中传递Session ID,即sid=xxxx）。