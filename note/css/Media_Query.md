# CSS - 媒体查询
媒体查询提供了一种应用 CSS 的方法，仅在浏览器和设备的环境与你指定的规则相匹配的时候 CSS 才会真的被应用

## 基础
查询语法如下所示：
```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
```
它由以下部分组成：
- 媒体类型：告诉浏览器这段代码是用在什么类型的媒体上的（例如印刷品或者屏幕）；
- 媒体表达式：被包含的 CSS 生效所需的规则；
- 一组 CSS 规则，会在测试通过且媒体类型正确的时候应用。

### 媒体类型
可指定的类型有四种
- all：默认类型，适用于所有设备。
- print：适用于在打印预览模式下在屏幕上查看的分页材料和文档
- screen：主要用于屏幕
- speech：主要用于语音合成器

### 媒体特征规则
最常见的情景是根据屏幕宽高指定不同设备使用的CSS样式，如下例适配了iPhone 6的屏幕：
```css
@media screen and (min-width: 414px) {
    body {
      background-color: blue;
    }
}
```

除了宽高以外，还有朝向（orientation）和悬浮（hover）。

如下例，当设备处于横向时引用CSS样式：
```css
@media (orientation: landscape) {
    body {
        color: rebeccapurple;
    }
}
```

下例检测用户是否可以将指针悬浮在元素上，借此判断是否为触摸屏设备：
```css
@media (hover: hover) {
    body {
        color: rebeccapurple;
    }
}
```

除了单一规则，也可以使用逻辑判断来指定跟复杂的规则
- 与：使用`and`连接规则

    body 的文字只会在视口至少为 400 像素宽，且设备横放时变为蓝色。
    ```css
    @media screen and (min-width: 400px) and (orientation: landscape) {
        body {
        color: blue;
        }
    }
    ```
- 或：使用逗号：`,` 来分隔不同规则

    文本会在窗口至少为 400 像素宽的时候或者设备处于横放状态的时候变为蓝色
    ```css
    @media screen and (min-width: 400px), screen and (orientation: landscape) {
        body {
            color: blue;
        }
    }
    ```
- 非：使用`not`来对规则取反

    文本只会在朝向为竖着的时候变成蓝色
    ```css
    @media not all and (orientation: landscape) {
        body {
            color: blue;
        }
    }
    ```
