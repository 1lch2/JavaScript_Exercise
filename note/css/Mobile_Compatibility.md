# 移动端适配方案

## 关于 viewport
viewport 即显示网页部分的区域。PC 端 viewport 即是浏览器窗口区域。

在移动端，为了让页面展示更多的内容，视窗的宽度默认不为设备的宽度，在移动端视窗有三个概念：布局视窗、视觉视窗、理想视窗。

- layout viewport：在浏览器窗口css的布局区域，布局视窗的宽度限制css布局的宽。

    为了能在移动设备上正常显示那些为pc端浏览器设计的网站，移动设备上的浏览器都会把自己默认的 viewport 设为 980px 或其他值，一般都比移动端浏览器可视区域大很多，所以就会出现浏览器出现横向滚动条的情况。

- visual viewport：用户通过屏幕看到的页面区域，通过缩放查看显示内容的区域。

    在移动端缩放不会改变布局视窗的宽度，当缩小的时候，屏幕覆盖的css像素变多，视觉视窗变大，当放大的时候，屏幕覆盖的css像素变少，视觉视窗变小。

- 理想视窗：一般来讲，这个视窗其实不是真是存在的，它对设备来说是一个最理想布局视窗尺寸。

    在用户不进行手动缩放的情况下，可以将页面理想地展示。那么所谓的理想宽度就是浏览器（屏幕）的宽度了。


在`<head>`中添加`<meta>`标签即可设置理想视窗，参考[<meta>标签](../html/Meta_Tag.md) 示例如下：
```html
<meta name="viewport" content="width=device-width, user-scalable=no,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
这里实际上是设置了理想视窗，将布局视窗的宽度设置成了理想视窗（浏览器/设备屏幕的宽度）。


## 常见适配方案
### CSS Media query
通过媒体查询的方式，编写适应不同分辨率设备的的css样式，具体参见[Media query](../css/Media_Query.md)

### 百分比布局
不固定宽度，使得在不同的分辨率下都能达到适配

**各个子元素或属性的百分比根据**
- width，height：相对于子元素的直接父元素
- margin，padding：在垂直方向和水平方向都是相对于**直接父亲元素的 width**，与父元素的height无关
- border-radius：相对于自身宽度，与父元素无关

参考 [长度和单位](../css/Values_Units.md)

### rem 方案
rem是一个只相对于浏览器的根元素（HTML元素）的 font-size 的来确定的单位。默认情况下，html元素的 font-size 为 12px

当页面的宽度发生变化时，只需要改变 font-size 的值，那么以rem为固定单位的元素的大小也会发生响应的变化。需要先动态设置html根元素的 font-size ,再计算出其他页面元素以rem为固定单位的值。

示例如下：
```html
<script type="text/javascript">
(function() {
    var deviceWidth = document.documentElement.clientWidth;
    deviceWidth = deviceWidth < 320 ? 320 : deviceWidth > 640 ? 640 : deviceWidth;
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
})();
</script>
```

### vw，vh 方案
100vw 对应100% 视窗宽度，vh同理
