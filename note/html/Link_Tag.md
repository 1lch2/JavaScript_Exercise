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

### 预加载
```html
<link rel="preload" href="myFont.woff2" as="font"
      type="font/woff2" crossorigin="anonymous">
```

## 关于 rel 属性的其他常见值
- `dns-prefetch`：浏览器会对href中的域名进行DNS解析并缓存，当再次请求该域名资源时，能省去查询IP的过程，从而减少时间损耗
- `prefetch/preload`：都是预先下载并缓存某个资源，不同的是prefetch可能会在浏览器忙时被忽略，而preload则一定会预先下载
- `preconnect`：正式发送http请求前预先执行DNS解析、TCP握手、TLS协商。通过消除往返延迟来节省时间
- `prerender`：浏览器不仅会加载资源，还会解析执行页面，并进行预渲染

