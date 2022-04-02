# HTML & JS - DOM 操作
## `querySelector()`
`querySelector()` 方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配 项则返回 `null`。

示例如下：
```js
// 取得<body>元素
let body = document.querySelector("body");
// 取得 ID 为"myDiv"的元素
let myDiv = document.querySelector("#myDiv");
// 取得类名为"selected"的第一个元素
let selected = document.querySelector(".selected");
// 取得类名为"button"的图片
let img = document.body.querySelector("img.button");
```

在 Document 上使用 querySelector()方法时，会从文档元素开始搜索;

在 Element 上使用 querySelector()方法时，则只会**从当前元素的后代**中查询。

## `querySelectorAll()`
返回所有匹配的节点，结果为 NodeList 的静态实例，该结果是一个静态的“快照”，而非“实时”的查询。

若没有匹配到元素，则返回空的 NodeList 实例。

示例如下：
```js
let strongElements = document.querySelectorAll("p strong");
// 以下 3 个循环的效果一样
for (let strong of strongElements) {
    strong.className = "important";
}
for (let i = 0; i < strongElements.length; ++i) {
    strongElements.item(i).className = "important";
}
for (let i = 0; i < strongElements.length; ++i) {
    strongElements[i].className = "important";
}
```

## HTML5 新增方法
`getElementsByClassName()`，使用示例如下：
```js
// 取得所有类名中包含"username"和"current"元素
// 这两个类名的顺序无关紧要
let allCurrentUsernames = document.getElementsByClassName("username current");
// 取得 ID 为"myDiv"的元素子树中所有包含"selected"类的元素
let selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

## 设置样式
只要获得了有效 DOM 元素的引用，就可以通过 JavaScript 来设置样式。示例如下
```js
let myDiv = document.getElementById("myDiv");
// 设置背景颜色
myDiv.style.backgroundColor = "red";
// 修改大小
myDiv.style.width = "100px"; myDiv.style.height = "200px";
// 设置边框
myDiv.style.border = "1px solid black";
```
