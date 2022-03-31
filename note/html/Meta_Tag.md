# HTML 基础 - `<meta>` 标签
## 含义
Meta标签提供关于HTML文档的元数据，这些内容不会展示在网页上，但是对机器是可读的，主要用于告知机器如何解析此文档。此外，也可以用来添加服务器发送到浏览器http头部内容。

## 属性
- charset：声明了文档的字符编码。如果使用了这个属性，其值必须是与 ASCII 大小写无关（ASCII case-insensitive）的"utf-8"。
- content：包含了 http-equiv 或 name 属性的值，具体取决于所使用的值。
- http-equiv：可选值如下：
  - content-type：如果使用这个属性，其值必须是`"text/html; charset=utf-8"`。
  - default-style：设置默认CSS样式名称
  - refresh：执行 content 里指定的刷新时间

## 常见属性
5 秒后刷新指定URL
```html
<meta http-equiv="refresh" content="5"; url=https://netlover.cn"/>
```

声明文档使用的字符编码，解决乱码问题
```html
<meta charset="UTF-8">
```

设置移动端设备显示，`width=device-width` 设置网页的宽度（viewport）和设备的宽度一样，这样横向就不会出现滚动条；后面的几个设置不允许用户手动缩放。
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
```

