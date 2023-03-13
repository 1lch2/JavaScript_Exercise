# Content Security Policy
内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS (en-US)) 和数据注入攻击等。

CSP 通过告诉浏览器一系列规则，严格规定页面中哪些资源允许有哪些来源， 不在指定范围内的统统拒绝。

## 安全威胁场景
CSP 的主要目标是减少和报告 XSS 攻击，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，因为浏览器信任其内容来源，即使有的时候这些脚本并非来自于它本该来的地方。

关于XSS攻击，参考[这篇笔记](XSS.md)

## 使用CSP
- 服务器添加 `Content-Security-Policy` 响应头来指定规则
- HTML 中添加 标签来指定 `Content-Security-Policy` 规则

### 在HTTP header中添加
示例如下：
```http
Content-Security-Policy: <policy-directive>; <policy-directive>…
```

有以下常见指令：
- base-uri 限制可出现在页面 <base> 标签中的链接。
- child-src 列出可用于 worker 及以 frame 形式嵌入的链接。 譬如: `child-src https://youtube.com` 表示只能从 Youtube 嵌入视频资源。
- connect-src 可发起连接的地址 (通过 XHR, WebSockets 或 EventSource)。
- font-src 字体来源。譬如，要使用 Google web fonts 则需要添加 `font-src https://themes.googleusercontent.com` 规则。
- form-action `<form> `标签可提交的地址。
- img-src 指定图片来源。
- media-src 限制音视频资源的来源。
- style-src 限制样式文件的来源。


还有种特殊的指令 default-src，如果指定了它的值，则相当于改变了这些未指定的指令的默认值。可以理解为，上面 img-src 如果没指定，本来其默认值是 *，可以加载所有来源的图片，但设置 default-src 后，默认值就成了 default-src 指定的值。

常见的做法会设置 `default-src 'self'`，这样所有资源都被限制在了和页面同域下。如果此时想要加载从 CDN 来的图片，将图片来源单独添加上即可。

```http
Content-Security-Policy: default-src 'self'; img-src https://cdn.example.com
```

### 在HTML中添加
CSP指令的值和在HTTP header中时一样，一般使用 `<meta>` 标签添加CSP，示例如下
```html
<head>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://unpkg.com">
    <title>CSP Test</title>
</head>
<body>
    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
</body>
```

这里指定了脚本来源只能是`https://unpkg.com`

## 常见用例
所有内容均来自站点的同一个源 (不包括其子域名)
```http
Content-Security-Policy: default-src 'self'
```


允许内容来自信任的域名及其子域名 (域名不必须与 CSP 设置所在的域名相同)
```http
Content-Security-Policy: default-src 'self' *.trusted.com
```


允许网页应用的用户在他们自己的内容中包含来自任何源的图片，但是限制音频或视频需从信任的资源提供者 (获得)，所有脚本必须从特定主机服务器获取可信的代码。
```http
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

各种内容默认仅允许同源获取，但存在如下例外：
- 图片可以从任何地方加载 (注意 "*" 通配符)。
- 多媒体文件仅允许从 media1.com 和 media2.com 加载 (不允许从这些站点的子域名)。
- 可运行脚本仅允许来自于 userscripts.example.com。


网站的所有内容都要通过 SSL 方式获取，以避免攻击者窃听用户发出的请求。
```http
Content-Security-Policy: default-src https://onlinebanking.jumbobank.com
```
