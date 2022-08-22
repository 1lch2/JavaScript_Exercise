# CSS - transition
`transition` CSS 属性是 transition-property，transition-duration，transition-timing-function 和 transition-delay 的一个简写属性。

CSS transitions 提供了一种在更改 CSS 属性时控制动画速度的方法。其可以让属性变化成为一个持续一段时间的过程，而不是立即生效的。比如，将一个元素的颜色从白色改为黑色，通常这个改变是立即生效的，使用 CSS transitions 后该元素的颜色将逐渐从白色变为黑色，按照一定的曲线速率变化。这个过程可以自定义。

通常将两个状态之间的过渡称为隐式过渡（implicit transitions），因为开始与结束之间的状态由浏览器决定。

## 基础用法
格式：`属性名 持续时间 时间函数 延迟`

```css
/* property name | duration | timing function | delay */
transition: margin-right 4s ease-in-out 1s;
```

也可以用逗号分隔多个属性的样式
```css
/* Apply to 2 properties */
transition: margin-right 4s, color 1s;
```

属性名设置为 `all` 时对所有发生变化的属性生效
```css
/* Apply to all changed properties */
transition: all 0.5s ease-out;
```

## 属性
### transition-property
指定哪个或哪些 CSS 属性用于过渡。只有指定的属性才会在过渡中发生动画，其它属性仍如通常那样瞬间变化。

默认值为 `all`

### transition-duration
指定过渡的时长。或者为所有属性指定一个值，或者指定多个值，为每个属性指定不同的时长。

### transition-timing-function
指定一个函数，定义属性值怎么变化。缓动函数 Timing functions 定义属性如何计算。多数 timing functions 由四点定义一个 bezier 曲线。

时间函数速查表：[Easing functions cheat sheet](https://easings.net/)

### transition-delay
指定延迟，即属性开始变化时与过渡开始发生时之间的时长。

## 监听事件
当过渡完成时触发一个事件，在符合标准的浏览器下，这个事件是 transitionend
```js
el.addEventListener("transitionend", updateTransition, true);
```

## 与 animation 区别
transition 强调过渡，触发需要事件。

animation 是动画，不需要事件触发，可以设置时间自动执行，且可以循环，并且可以设置多个关键帧（`@keyframe`）
