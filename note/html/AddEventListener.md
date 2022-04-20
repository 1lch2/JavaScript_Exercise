# 为标签添加事件监听器

页面上有以下标签
```html
<ul id="list">
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
```

## 动态添加标签
若想要往`<ul>`中动态添加`<li>`，代码如下
```js
var container = document.getElementById('list');
for (var i = 0; i < 3; i++) {
    var item = document.createElement('li');
    item.innerText = i + 1;
    container.appendChild(item);
}
```

## 向标签添加事件监听
```js
for (var i = 0; i < 3; i++) {
    var ndItem = document.createElement('li');
    ndItem.innerText = i + 1;
    
    // EventListener 里面默认的 this 指向当前节点
    ndItem.addEventListener('click', function () {
        alert(this.innerText);
    });
    ndContainer.appendChild(ndItem);
}
```

`addEventListener` 方法会将方法的 this 指向监听的 DOM 元素，在 class 中的实例方法需要额外使用 bind 绑定 this 才能访问到想要的 this。如下例所示：

```js
class Clicker {
  constructor(element) {
    this.count = 0;
    this.elem = element;
    this.elem.addEventListener('click', this.click);
    
    // logs Clicker { count:0, elem: button#thing} as expected
    console.log(this);
  }

  click() {
    // logs <button id="thing">...</button> as unexpected...
    console.log(this);
    this.count++;
  }
}

var thing = document.getElementById('thing');
var instance = new Clicker(thing);
```

若想让 `click()` 方法使用正确的this，则需要在构造方法中为 `this.click` 这个方法引用单独绑定 this，如下例所示
```js
this.elem.addEventListener('click', this.click.bind(this));
```