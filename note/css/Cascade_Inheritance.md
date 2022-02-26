# CSS基础 - 层叠与继承
## 层叠
当应用两条同级别的规则到一个元素的时候，写在后面的就是实际使用的规则。

## 优先级
参见：[CSS基础 - 优先级]("./../Specificity.md)

## 继承
不是所有的属性默认都是能继承父元素对应属性的。

存在默认继承的的属性一定是那些不会影响到页面布局的属性，可以分为如下几类：

- 字体相关：`font-family`、`font-style`、`font-size`、`font-weight` 等；
- 文本相关：`text-align`、`text-indent`、`text-decoration`、`text-shadow`、`letter-spacing`、`word-spacing`、`white-space`、`line-height``、color` 等；
- 列表相关：`list-style`、`list-style-image`、`list-style-type`、`list-style-position` 等；
- 其他属性：`visibility`、`cursor` 等；

对于其他默认不继承的属性也可以通过以下几个属性值来控制继承行为：

- `inherit`：继承父元素对应属性的计算值；
- `initial`：应用该属性的默认值，比如 `color` 的默认值是 #000；
- `unset`：如果属性是默认可以继承的，则取 `inherit` 的效果，否则同 `initial`；
- `revert`：效果等同于 `unset`，兼容性差。
