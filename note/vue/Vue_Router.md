# vue-router
## 概要
对于 Vue 这类渐进式前端开发框架，为了构建 SPA（单页面应用），需要引入前端路由系统，这也就是 Vue-Router 存在的意义。前端路由的核心，就在于改变视图的同时不会向后端发出请求。

## 模式
### hash
即地址栏 URL 中的 # 符号（hashtag）。例如 `http://www.abc.com/#/hello`，hash 的值为 `#/hello`。它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

实现原理：

利用 `window.location.hash` 变量获取到当前 URL 的 hash，然后为 `hashchange` 事件添加事件监听。示例如下：
```html
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <!-- 定义路由 -->
        <li><a href="#/home">home</a></li>
        <li><a href="#/about">about</a></li>

        <!-- 渲染路由对应的 UI -->
        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
let routerView = routeView
window.addEventListener('hashchange', ()=>{
    let hash = location.hash;
    routerView.innerHTML = hash
})

// 页面第一次加载完不会触发 hashchange
// 因而用load事件来监听hash值，再将视图渲染成对应的内容
window.addEventListener('DOMContentLoaded', ()=>{
    if(!location.hash){//如果不存在hash值，那么重定向到#/
        location.hash="/"
    }else{//如果存在hash值，那就渲染对应UI
        let hash = location.hash;
        routerView.innerHTML = hash
    }
})
</script>
</html>
```

### history
利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。（需要特定浏览器支持）这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。

示例如下：
```html
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <li><a href='/home'>home</a></li>
        <li><a href='/about'>about</a></li>

        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
let routerView = routeView
window.addEventListener('DOMContentLoaded', onLoad)
window.addEventListener('popstate', ()=>{
    routerView.innerHTML = location.pathname
});

function onLoad() {
    routerView.innerHTML = location.pathname
    var linkList = document.querySelectorAll('a[href]');

    // 拦截 <a> 的默认点击行为
    linkList.forEach(el => el.addEventListener('click', function (e) {
        e.preventDefault()
        history.pushState(null, '', el.getAttribute('href'))
        routerView.innerHTML = location.pathname
    }))
}
</script>
</html>
```