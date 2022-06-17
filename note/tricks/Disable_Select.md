# 网页禁止选中
## CSS
给禁止选中的元素设置CSS属性 `user-select`。

如下代码可以阻止选中网页上的任何元素，如果设置为 `all` 则会在选中时全选。
```css
body {
    user-select: none;
}
```

## JS
给要阻止选中的元素添加事件监听。
```js
document.onselectstart = function() {
    return false;
}
```

也可以进一步判断元素的类型再针对性地禁止选中。
