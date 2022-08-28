# 引入CSS
第一个参数表示引入的资源的位置，第二个可选参数指定生效的媒体查询条件

```css
@import url;
@import url list-of-media-queries;
```

## 用法示例
```css
@import url("fineprint.css") print;
@import url("bluish.css") projection, tv;
@import 'custom.css';
@import url("chrome://communicator/skin/");
@import "common.css" screen, projection;
@import url('landscape.css') screen and (orientation:landscape);
```

## @import 和 `<link>` 的区别
- link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事务；@import属于CSS范畴，只能加载CSS。
- link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
- link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本（指IE5）的浏览器不支持。
- link支持使用Javascript控制DOM去改变样式；而@import不支持。

