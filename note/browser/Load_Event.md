# 页面加载事件
## DOMContentLoaded
DOMContentLoaded 是一个浏览器事件，当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。



## load
TODO:

## readystatechange


## beforeunload


## unload

## 页面加载事件发生顺序
1. 页面加载开始。发出加载资源的请求，加载未完成之前，不触发任何事件。
2. document 加载结束并解析，css等其他资源未加载完成。此时readyState 为 `'interactive'`，表明 document 已经 load 并解析完成，触发 readystatechange，然后触发 DOMContentLoaded(在大多数浏览器上的表现如此)。此时，加载完成且带有defer标记的脚本，会按顺序开始执行。
3. css、img等子资源加载完成之后，触发 `window.load` 事件
4. 点击关闭标签或者刷新时，会依次触发beforeunload、unload事件。
