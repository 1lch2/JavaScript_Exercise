# HTML - `<link>` 标签
规定了当前文档与外部资源的关系

## 用法
### 链接外部CSS
```html
<link href="main.css" rel="stylesheet">
```

href 属性设置外部资源的路径，并设置 rel 属性的值为 “stylesheet”(样式表)

### 网站图标
```html
<link rel="icon" href="favicon.ico">
```

对于 iOS 平台，显示图标需要一个特殊类型，如下所示：
```html
<link rel="apple-touch-icon-precomposed" sizes="114x114"
      href="apple-icon-114.png" type="image/png">
```

sizes 属性表示图标大小，type 属性包含了链接资源的 MIME 类型

## 关于 rel 属性的其他常见值
- `dns-prefetch`：浏览器会对href中的域名进行DNS解析并缓存，当再次请求该域名资源时，能省去查询IP的过程，从而减少时间损耗
- `prefetch/preload`：都是预先下载并缓存某个资源，不同的是prefetch可能会在浏览器忙时被忽略，而preload则一定会预先下载
- `preconnect`：正式发送http请求前预先执行DNS解析、TCP握手、TLS协商。通过消除往返延迟来节省时间
- `prerender`：浏览器不仅会加载资源，还会解析执行页面，并进行预渲染

## as 属性
属性仅在`<link>`元素设置了 `rel="preload"` 或者 `rel="prefetch"` 时才能使用。它规定了`<link>`元素加载的内容的类型。

对于内容的优先级、请求匹配、正确的内容安全策略的选择，以及正确的 Accept请求头的设置，这个属性是必需的。

## 预加载
将 rel 属性值设为 `"preload"` 时，会将 `<link>` 标签转换为预加载器，可以加载任何想预加载的资源。使用 preload 属性值时候需要指定 href 和 as 属性的值。

示例如下：
```html
<link rel="preload" href="style.css" as="style" />
<link rel="preload" href="main.js" as="script" />

<link rel="stylesheet" href="style.css" />
```

### 可以预加载的资源
as 属性值对应资源如下：
- audio: 音频文件, 一般在 `<audio>` 中指定.
- document: 用 `<frame>` 或 `<iframe>` 嵌入的页面.
- fetch: 需要用 fetch 或者 XHR 访问的资源, 比如 ArrayBuffer, WebAssembly/WASM 二进制文件, 或者 JSON.
- font: 字体文件.
- image: 图像文件.
- script: JS脚本.
- style: CSS.
- video: 视频文件，一般用在 `<video>` 中.

