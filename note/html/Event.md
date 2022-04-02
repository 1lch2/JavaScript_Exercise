# HTML基础 - 事件
JavaScript 与 HTML 的交互是通过事件实现的，事件代表文档或浏览器窗口中某个有意义的时刻。

事件流描述了页面接收事件的顺序。

## 事件冒泡
IE 事件流被称为事件冒泡。

事件被定义为从最具体的元素(文档树中最深的节点)开始触发，然后向上传播至没有那么具体的元素(文档)。
举例如下：
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Event Bubbling Example</title>
    </head>
    <body>
        <div id="myDiv">Click Me</div>
    </body>
</html>
```
点击`<div>`元素后，click事件按如下顺序发生：
1. `<div>`
2. `<body>`
3. `<html>`
4. `document`

现代浏览器中的事件会一直冒泡到 window 对象。

### 阻止事件冒泡
1. 给子级加 `event.stopPropagation()`
    ```js
    $("#div1").mousedown(function(e) {
        var e = event || window.event;
        event.stopPropagation();
    });
    ```

2. 在事件处理函数中返回 false
    ```js
    $("#div1").mousedown(function(event) {
        var e = e || window.event;
        return false;
    });
    ```

这两种方式的区别：
- `return false` 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。
- event.stopPropagation()则只阻止事件往上冒泡，不阻止事件本身。

3. `event.target == event.currentTarget`

让触发事件的元素等于绑定事件的元素，也可以阻止事件冒泡；


## 事件捕获
网景（Netscape Communicator）团队提出了另一种名为事件捕获的事件流。

这里的顺序和事件冒泡相反。如上例中的HTML，点击`<div>`后，事件发生顺序如下：
1. `document`
2. `<html> `
3. `<body>`
4. `<div>`

## `addEventListener`
```js
element.addEventListener(event, function, useCapture);
```

`useCapture`代表是否使用事件捕获，默认为`false`，即使用事件冒泡模型。


## 处理事件
### 添加事件回调
1. 以HTML属性形式指定
    ```html
    <input type="button" value="Click Me" onclick="console.log('Clicked')"/>
    ```
    
    或者传入其他地方定义的脚本
    ```html
    <input type="button" value="Click Me" onclick="showMessage()"/>
    ```
2. （DOM0方式）每个元素(包括 window 和 document)都有通常小写的事件处理程序属性，比如 onclick。只要把这个属性赋值为一个函数即可:
    事件处理程 序会在元素的作用域中运行，即 this 等于元素
    ```js
    let btn = document.getElementById("myBtn");
    btn.onclick = function() {
        console.log(this.id); // myBtn
    };
    ```
3. （DOM2方式）`addEventListener()` 和 `removeEventListener()`。
    它们接收 3 个参数:事件名、事件处理函 数和一个布尔值，true 表示在捕获阶段调用事件处理程序，false(默认值)表示在冒泡阶段调用事件处理程序。
    ```js
    let btn = document.getElementById("myBtn");
    btn.addEventListener("click", () => {
      console.log(this.id);
    }, false);
    ```

    通过 addEventListener()添加的事件处理程序只能使用 removeEventListener()并传入与添加时同样的参数来移除。
    ```js
    let btn = document.getElementById("myBtn");
    let handler = function() {
      console.log(this.id);
    };
    btn.addEventListener("click", handler, false);
    btn.removeEventListener("click", handler, false); 
    ```

### 事件对象
#### DOM事件对象
event 对象是传给事件处理程序的唯一参数。示例如下
```js
let btn = document.getElementById("myBtn");
btn.onclick = function(event) {
  console.log(event.type);  // "click"
};
btn.addEventListener("click", (event) => {
  console.log(event.type);  // "click"
}, false);
```

在通过 HTML 属性指定的事件处理程序中，同样可以使用变量 event 引用事件对象。
```html
<input type="button" value="Click Me" onclick="console.log(event.type)">
```

#### IE 事件对象
如果 事件处理程序是使用 DOM0 方式指定的，则 event 对象只是 window 对象的一个属性
```js
var btn = document.getElementById("myBtn");
    btn.onclick = function() {
    let event = window.event;
    console.log(event.type);  // "click"
};
```
