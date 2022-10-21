# 事件委托
## 背景
在 JavaScript 中，页面中事件处理程序的数量与页面整体性能直接相关。原因有很多。首先，每个函数都是对象，都占用内存空间，对象越多，性能越差。其次，为指定事件处理
程序所需访问 DOM 的次数会先期造成整个页面交互的延迟。

## 原理
利用事件冒泡，可以只使用一个事件处理程序来管理一种类型的事件。例如，click 事件冒泡到 document。这意味着可以为整个页面指定一个 onclick 事件处理程序，而不用为每个可点击元素分别指定事件处理程序。

比如有以下 HTML：
```html
<ul id="myLinks"> 
 <li id="goSomewhere">Go somewhere</li> 
 <li id="doSomething">Do something</li> 
 <li id="sayHi">Say hi</li> 
</ul>
```

这里的 HTML 包含 3 个列表项，在被点击时应该执行某个操作。对此，通常的做法是像这样指定 3 个事件处理程序：
```js
let item1 = document.getElementById("goSomewhere"); 
let item2 = document.getElementById("doSomething"); 
let item3 = document.getElementById("sayHi"); 

item1.addEventListener("click", (event) => { 
 location.href = "http:// www.wrox.com"; 
}); 
item2.addEventListener("click", (event) => { 
 document.title = "I changed the document's title"; 
}); 
item3.addEventListener("click", (event) => { 
 console.log("hi"); 
}); 
```

如果对页面中所有需要使用 onclick 事件处理程序的元素都如法炮制，结果就会出现大片雷同的只为指定事件处理程序的代码。使用事件委托，只要给所有元素共同的祖先节点添加一个事件处理程序，就可以解决问题。

比如：
```js
let list = document.getElementById("myLinks"); 
list.addEventListener("click", (event) => { 
 let target = event.target; 
 switch(target.id) { 
    case "doSomething": 
        document.title = "I changed the document's title"; 
        break; 
    case "goSomewhere": 
        location.href = "http:// www.wrox.com"; 
        break; 
    case "sayHi": 
        console.log("hi"); 
        break; 
    } 
}); 
```

## 优势
- document 对象随时可用，任何时候都可以给它添加事件处理程序（不用等待 DOMContentLoaded 或 load 事件）。这意味着只要页面渲染出可点击的元素，就可以无延迟地起作用。
- 节省花在设置页面事件处理程序上的时间。只指定一个事件处理程序既可以节省 DOM 引用，也可以节省时间。
- 减少整个页面所需的内存，提升整体性能。

## 使用场景
最适合使用事件委托的事件包括：click、mousedown、mouseup、keydown 和 keypress。

mouseover 和 mouseout 事件冒泡，但很难适当处理，且经常需要计算元素位置。
