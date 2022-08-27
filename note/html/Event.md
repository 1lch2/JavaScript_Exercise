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
event 对象是传给事件回调的唯一参数，不管用是 DOM0 还是 DOM2 方式绑定的。

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

#### target 和 currentTarget
在事件回调内部， this 对象始终等于 currentTarget，而 target 只包含事件的实际目标。

当事件冒泡到外部时，currentTarget 会随之变化，而 target 不会，示例如下：
```html
<div id="middle">
    <div id="inner">
    </div>
</div>
```

```js
let callback = function(event) {
    console.log("currentTarget: " + event.currentTarget.id);
    console.log("target: " + event.target.id);
}
document.getElementById("middle").addEventListener("click", callback);
document.getElementById("inner").addEventListener("click", callback);

// 点击内部的 `div#inner` 后，输出如下：
// currentTarget: inner
// target: inner

// currentTarget: middle
// target: inner
```

## 常见事件
DOM3 Events 定义了如下事件类型。
- 用户界面事件(UIEvent): 涉及与 BOM 交互的通用浏览器事件。
- 焦点事件(FocusEvent): 在元素获得和失去焦点时触发。
- 鼠标事件(MouseEvent): 使用鼠标在页面上执行某些操作时触发。
- 滚轮事件(WheelEvent): 使用鼠标滚轮(或类似设备)时触发。
- 输入事件(InputEvent): 向文档中输入文本时触发。
- 键盘事件(KeyboardEvent): 使用键盘在页面上执行某些操作时触发
- 合成事件(CompositionEvent): 在使用某种 IME(Input Method Editor，输入法编辑器)输入字符时触发。

### 用户界面事件
#### load
在 window 对象上，load 事件会在整个页面(包括所有外部资源如图片、JavaScript 文件和 CSS 文件)加载完成后触发。

用法参见[加载事件](../browser/Load_Event.md)

#### unload
与 load 事件相对的是 unload 事件，unload 事件会在文档卸载完成后触发。

unload 事件一般是 在从一个页面导航到另一个页面时触发，最常用于清理引用，以避免内存泄漏。用法同 load 事件


#### resize
当浏览器窗口被缩放到新高度或宽度时，会触发 resize 事件。这个事件在 window 上触发，因此 可以通过 window 上添加事件监听回调，或者为`<body>`元素添加 `onresize` 属性来指定事件处理程序。

```js
window.addEventListener("resize", (event) => {
    console.log("Resized");
});
```


#### scroll
scroll 事件发生在 window 上，反映的是页面中相应元素的变化。

### 焦点事件
当焦点从页面中的一个元素移到另一个元素上时，会依次发生如下事件。 
1. focuscout 在失去焦点的元素上触发。
2. focusin 在获得焦点的元素上触发。
3. blur 在失去焦点的元素上触发。
4. DOMFocusOut 在失去焦点的元素上触发。
5. focus 在获得焦点的元素上触发。
6. DOMFocusIn 在获得焦点的元素上触发。 

其中，blur、DOMFocusOut 和 focusout 的事件目标是失去焦点的元素，而focus、DOMFocusIn 和 focusin 的事件目标是获得焦点的元素。

### 鼠标和滚轮事件
#### click
在用户单击鼠标主键(通常是左键)或按键盘回车键时触发。这主要是基于无障碍的考虑，让键盘和鼠标都可以触发 onclick 事件处理程序。

对于一次点击，以下事件会按顺序触发
1. mousedown
2. mouseup
3. click

click 事件触发的前提是 mousedown 事件触发后，紧接着又在同一个元素上触发了 mouseup 事件。如果 mousedown 和 mouseup 中的任意一个事件被取消，那么 click 事件就不会触发。

#### dbclick
鼠标双击事件，以下时间会按顺序触发。

1. mousedown 
2. mouseup 
3. click
4. mousedown 
5. mouseup 
6. click
7. dblclick

#### 触摸屏上的鼠标事件
对于触摸屏设备（iOS 和 Android）有以下不同点：
1. 不支持 dblclick 事件。双击浏览器窗口可以放大，但没有办法覆盖这个行为。
2. 单指点触屏幕上的可点击元素会触发 mousemove 事件。
   1. 如果操作会导致内容变化，则不会再触发其他事件。
   2. 如果屏幕上没有变化，则会相继触发 mousedown、mouseup 和 click 事件。
   3. 点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素(如链接)或指定了 onclick 事件处理程序的元素。
3. mousemove 事件也会触发 mouseover 和 mouseout 事件。
4. 双指点触屏幕并滑动导致页面滚动时会触发 mousewheel 和 scroll 事件。

### 键盘与输入事件
键盘事件包含 3 个事件:
- keydown，用户按下键盘上某个键时触发，而且持续按住会重复触发。 
- keypress，用户按下键盘上某个键并产生字符时触发，而且持续按住会重复触发。Esc 键也会触发这个事件。
  - DOM3 Events 废弃了 keypress 事件，而推荐 textInput 事件。
-  keyup，用户释放键盘上某个键时触发。

对于 keydown 和 keyup 事件，event 对象的 keyCode 属性中会保存一个键码，对应键盘上特定 的一个键。示例如下：
```js
let textbox = document.getElementById("myText");
textbox.addEventListener("keyup", (event) => {
    console.log(event.keyCode);
});
```

#### textInput
DOM3 Events 规范增加了一个名为 textInput 的事件，其在字符被输入到可编辑区域时触发。

作为对 keypress 的替代，textInput 事件的行为有些不一样。

一个区别是 keypress 会在任何可以获得焦点的元素上触发，而 textInput 只在可编辑区域上触发。

另一个区别是 textInput 只在有新字符被插入时才会触发，而 keypress 对任何可能影响文本的键都会触发(包括退格键)。

### 合成事件
合成事件是 DOM3 Events 中新增的，用于处理通常使用 IME 输入时的复杂输入序列
