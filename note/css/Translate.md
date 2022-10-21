# translate 属性/方法
CSS 属性 translate 允许单独声明平移变换，并独立于 transform 属性。

原本的 `translate()` 函数需要在 transform 属性中使用。

## 在 transform 属性中使用
translate() 在水平和/或垂直方向上重新定位元素。示例如下：
```css
/* Single <length-percentage> values */
transform: translate(200px);
transform: translate(50%);

/* Double <length-percentage> values */
transform: translate(100px, 200px);
transform: translate(100px, 50%);
transform: translate(30%, 200px);
transform: translate(30%, 50%);
```

只提供一个参数时，代表对**水平方向**上的平移；两个参数时，分别对应水平和垂直。


## 性能
使用 translate 时可以让GPU参与绘制，相比于 `position: relative` 只能做到最小 1 像素的位移，translate 可以移动更小的单位。

如果要对元素做平移，应该尽量使用 translate 而不是 relative
