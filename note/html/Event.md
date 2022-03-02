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
