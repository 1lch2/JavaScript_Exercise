# CSRF
## 概念
CSRF（Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。

如:攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

## 攻击流程
1. 用户登录信任网站 A ，A网站存在CSRF漏洞
2. 验证通过后，用户的浏览器上会生成 A 的 cookie
3. 用户在未注销 A 网站的情况下，马上访问了 B 网站
4. B 网站发出访问 A 网站的请求
5. 在 B 网站上，浏览器带着从 A 网站处产生的 cookie 访问了 A
6. A 网站无法辨别请求来自何处，按照用户权限处理了请求，达成了攻击者目标

## 分类
### GET 型 CSRF
示例如下：
在不安全聊天室或论坛上的一张图片，它实际上是一个给你银行服务器发送提现的请求：
```html
<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```
当你打开含有了这张图片的 HTML 页面时，如果你之前已经登录了你的银行帐号并且 Cookie 仍然有效（还没有其它验证步骤），你银行里的钱很可能会被自动转走。

### POST 型 CSRF
这种类型的CSRF利用起来通常使用的是一个自动提交的表单，如：
```html
<form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script>
```

复制代码访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。

### 链接型的CSRF
需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如：
```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
重磅消息！！
</a>
```

## 防御方式
### 检查 Referer 字段
HTTP 头中有一个 Referer 字段，这个字段用以标明请求来源于哪个地址。通过在网站中校验请求的该字段，我们能知道请求是否是从本站发出的。我们可以拒绝一切非本站发出的请求，这样避免了 CSRF 的跨站特性。

### Token 验证
校验信息不通过 cookie 传递，在其他参数中增加随机加密串进行校验

### 验证码
强制用户必须与应用进行交互，才能完成最终请求。此种方式能很好的遏制 csrf，但是用户体验比较差。


## XSS 对比 CSRF
- 通常来说 CSRF 是由 XSS 实现的，CSRF 时常也被称为 XSRF（CSRF 实现的方式还可以是直接通过命令行发起请求等）。
- 本质上讲，XSS 是代码注入问题，CSRF 是 HTTP 问题。 XSS 是内容没有过滤导致浏览器将攻击者的输入当代码执行。CSRF 则是因为浏览器在发送 HTTP 请求时候自动带上 cookie，而一般网站的 session 都存在 cookie里面(Token验证可以避免)。
