# JavaScript基础 - BOM
Browser Object Model, a.k.a. BOM。

BOM 提供了与网页无关的浏览器功能对象

主要关注 5 个对象：
- window
- location
- navigator
- screen
- history


## window
BOM 的核心是 window 对象，表示浏览器的实例。window 对象在浏览器中有两重身份，一个是 ECMAScript 中的 Global 对象，另一个就是浏览器窗口的 JavaScript 接口。

**`document`是`window`对象的属性**

### global 作用域
所有通过`var`声明的全局变量和函数都会变成 window 对象的属性和方法。

### top 窗口关系
top 对象始终指向最上层(最外层)窗口，即浏览器窗口本身。而 parent 对象则始终指向当前窗口的父窗口。

### 导航与打开新窗口
window.open()方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。

### 定时器
**`setTimeout`**：用于指定在**一定时间后**执行某些代码

**`setInterval()`**：用于指定**每隔一段时间**执行某些代码。

### name 属性
这个属性用来获取/设置窗口的名称。可以在跳转页面时，跨域传递信息，新的页面可以获取到跳转前页面通过 target 属性传递给 name 属性的值，用法如下：

页面一：
```html
<a href="./nextpage.html" target="hello world">
```

跳转后的页面二：
```js
console.log(window.name); // hello world
```

除此之外也可以使用 `window.open(url, windowName)` 方法起到一样的效果，第二个参数对应 `<a>` 元素的 target 属性。

## location
location 是最有用的 BOM 对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能。 这个对象独特的地方在于，它既是 window 的属性，也是 document 的属性。

### 重新加载
通过 location.reload() 方法可以重新加载页面

`location.reload()` : 重新加载（有可能会从缓存中加载）
`location.reload(true)`： 重新加载（从服务器重新加载）

## navigator
主要用来获取浏览器的属性，区分浏览器类型.

## history
保存着用户上网的历史记录，从窗口被打开的那一刻算起