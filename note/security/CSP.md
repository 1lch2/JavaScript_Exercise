# Content Security Policy
内容安全策略 (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等。

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
- child-src **(已废弃)** CSP Level 3 中已废弃，现代浏览器使用 worker-src 和 frame-src 分别控制。
- connect-src 可发起连接的地址 (通过 XHR, WebSockets 或 EventSource)。
- font-src 字体来源。譬如，要使用 Google web fonts 则需要添加 `font-src https://themes.googleusercontent.com` 规则。
- form-action `<form> `标签可提交的地址。
- frame-src 限制 frame 的嵌入源（替代 child-src 的部分功能）。
- img-src 指定图片来源。
- manifest-src 限制 Web App Manifest 的来源。
- media-src 限制音视频资源的来源。
- style-src 限制样式文件的来源。
- worker-src 限制 worker 脚本的来源（替代 child-src 的部分功能）。
- script-src **(面试重点)** 限制 JavaScript 脚本的来源，是防御 XSS 的核心指令。常用值：
  - `'self'` - 只允许同源脚本
  - `'unsafe-inline'` - 允许内联脚本（不安全，不推荐）
  - `'unsafe-eval'` - 允许 eval() 等动态代码执行（不安全）
  - `'nonce-random'` - 允许指定 nonce 值的内联脚本
  - `'sha256-hash'` - 允许指定 hash 值的内联脚本


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

### nonce 和 hash 的用法（面试重点）
对于必须使用的内联脚本或样式，可以使用 nonce 或 hash 来允许特定的内联内容：

**使用 nonce：**
服务器生成随机 nonce 值并添加到 CSP 策略中：
```http
Content-Security-Policy: script-src 'nonce-r4nd0m123'
```

HTML 中需要添加相同的 nonce 属性：
```html
<script nonce="r4nd0m123">
  console.log('This is allowed');
</script>
```

**使用 hash：**
计算内联脚本的 hash 值并添加到策略中：
```http
Content-Security-Policy: script-src 'sha256-abc123...'
```

**面试考点**：
- 使用 `'unsafe-inline'` 不安全，应使用 nonce 或 hash
- nonce 必须每次请求随机生成
- hash 适用于静态不变的内联脚本

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

## CSP 报告机制

### Report-Only 模式（面试重点）
CSP 可以以仅报告模式运行，不阻止资源加载，只发送违规报告：
```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'
```

使用场景：
- 在应用 CSP 前，先在仅报告模式下测试策略
- 逐步收紧策略而不影响用户体验

### 报告 URI
```http
Content-Security-Policy: default-src 'self'; report-uri https://report.example.com/csp-reports
```

当发生 CSP 违规时，浏览器会向指定的 URI 发送 JSON 格式的报告：
```json
{
  "csp-report": {
    "document-uri": "https://example.com/page",
    "referrer": "",
    "blocked-uri": "https://evil.com/script.js",
    "violated-directive": "script-src",
    "original-policy": "default-src 'self'"
  }
}
```

## CSP 绕过技术（面试重点）

### 常见绕过方式
即使配置了 CSP，在以下情况仍可能被绕过：

1. **同源 JSONP 绕过**
```http
Content-Security-Policy: script-src 'self'
```
如果网站存在 JSONP 接口，攻击者可以利用 JSONP 回调执行恶意代码：
```html
<script src="/api/jsonp?callback=alert(document.cookie)"></script>
```

2. **AngularJS 等模板引擎绕过**
```http
Content-Security-Policy: script-src 'self' 'unsafe-eval'
```
AngularJS 使用 `unsafe-eval`，攻击者可利用模板注入：
```html
<div ng-app ng-csp>{{constructor.constructor('alert(1)')()}}</div>
```

3. **文件上传 + 文件包含**
如果网站允许上传文件到同源目录，攻击者可上传恶意 HTML/JS 文件并调用：
```http
Content-Security-Policy: script-src 'self'
```
攻击者上传包含脚本的文件到 `/uploads/evil.html`，然后诱导用户访问。

4. **iframe srcdoc 绕过**
```html
<iframe srcdoc="<script>alert(1)</script>"></iframe>
```
某些浏览器实现中，srcdoc 可能绕过 CSP 限制。

5. **浏览器预加载机制**
利用 `<link rel="prefetch">` 或 `<link rel="dns-prefetch">` 绕过某些 CSP 实现。

**面试回答要点**：
- CSP 不能完全防止 XSS，只是增加攻击难度
- 必须配合输入过滤和输出编码
- 避免使用 `unsafe-inline` 和 `unsafe-eval`
- 注意同源服务的安全性

## CSP 的局限性

### CSP 无法防御的攻击
1. **数据嗅探**：CSP 不能防止中间人攻击，需要配合 HSTS
2. **同源攻击**：无法防止同源域内的恶意脚本
3. **浏览器扩展**：浏览器插件可能绕过 CSP
4. **HTML 注入**：CSP 不限制 HTML 标签本身的注入

### CSP 配置不当的问题
- **过于宽松的策略**：如 `script-src *` 或包含 `unsafe-inline`
- **依赖白名单域名**：白名单域名可能存在 JSONP 等风险接口
- **忽略 `object-src`**：Flash 等插件可能成为攻击向量

**最佳实践**：
- 最小权限原则，限制越严格越好
- 默认拒绝，逐步放行需要的资源
- 定期审查和更新 CSP 策略

## 浏览器兼容性（面试考点）

### 旧版浏览器支持
- **IE 10-11**：使用 `X-Content-Security-Policy` 头
- **旧版 Safari**：使用 `X-WebKit-CSP` 头
- **现代浏览器**：使用标准的 `Content-Security-Policy` 头

### 推荐做法
为了兼容旧版浏览器，可以同时设置多个头：
```http
Content-Security-Policy: default-src 'self'
X-Content-Security-Policy: default-src 'self'
X-WebKit-CSP: default-src 'self'
```

**注意**：现代浏览器会优先使用 `Content-Security-Policy`，忽略其他头。

## CSP 面试速记要点

### 面试常见问题及答案
1. **CSP 是什么？有什么作用？**
   - 内容安全策略，用于减少 XSS 风险
   - 限制资源加载来源，检测并阻止恶意内容

2. **CSP 如何设置？**
   - HTTP 响应头：`Content-Security-Policy: 策略`
   - HTML meta 标签：`<meta http-equiv="Content-Security-Policy" content="策略">`

3. **`script-src` 常用值有哪些？**
   - `'self'`、`'unsafe-inline'`、`'unsafe-eval'`、`'nonce-xxx'`、`'sha256-xxx'`

4. **CSP 能完全防止 XSS 吗？**
   - **不能！** 只能增加攻击难度
   - 同源 JSONP、文件上传、模板注入等仍可绕过
   - 必须配合输入过滤和输出编码

5. **如何避免内联脚本？**
   - 使用 nonce 或 hash
   - 将脚本移到外部文件
   - 避免使用 `'unsafe-inline'`

6. **CSP 配置的最佳实践？**
   - `default-src 'self'` 作为基础
   - 最小权限原则
   - 使用 Report-Only 模式测试
   - 避免 `unsafe-inline` 和 `unsafe-eval`
