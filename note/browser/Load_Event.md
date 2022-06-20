# 页面加载事件
## DOMContentLoaded
DOMContentLoaded 是一个浏览器事件，当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。

对应jQuery中的`$(document).ready()`

### 用法
```js
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
});
```

## load
当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。


### 用法
以下两种方式等价
```js
window.onload = (event) => {
    console.log("load event");
};

window.addEventListener("load", (event) => {
    console.log("load event");
});
```

相比较与 `DOMContentLoaded` 事件，`load`事件仅在所有资源加载完毕时触发，而前者会在DOM解析完成后就触发。

若需要在加载时对CSS样式进行操作，应对 load 事件添加回调。示例如下。
```html
<style>
    .s1 {
        width: 0;
        height: 100px;
        transition: width 1s;
        background-color: black;
    }

    .s2 {
        width: 100px;
    }
</style>

<div id="a"></div>

<script>
    let div = document.getElementById("a");
    div.classList.add("s1");
    div.classList.add("s2");
</script>
```
上述HTML会在加载时显示一个黑色方块，而不是横向展开的动画。若想看到预期中的动画，则需要让宽度变化的样式在加载完成后添加到元素上，修改后的script如下：

```js
let div = document.getElementById("a");
div.classList.add("s1");
window.addEventListener("load", () => {
    div.classList.add("s2");
})
```

## readystatechange


## beforeunload


## unload

## 页面加载事件发生顺序
1. 页面加载开始。发出加载资源的请求，加载未完成之前，不触发任何事件。
2. document 加载结束并解析，css等其他资源未加载完成。此时readyState 为 `'interactive'`，表明 document 已经 load 并解析完成，触发 readystatechange，然后触发 DOMContentLoaded(在大多数浏览器上的表现如此)。此时，加载完成且带有defer标记的脚本，会按顺序开始执行。
3. css、img等子资源加载完成之后，触发 `window.load` 事件
4. 点击关闭标签或者刷新时，会依次触发beforeunload、unload事件。
