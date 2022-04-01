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