# DOM 元素 - Element 对象
## 概述
Element 是一个通用性非常强的基类，所有 Document 对象下的对象都继承自它。这个接口描述了所有相同种类的元素所普遍具有的方法和属性。

一些接口继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。例如，HTMLElement 接口是所有 HTML 元素的基本接口。

## 属性
Element 属性继承自 Node，并且扩展了 Node 的父接口 EventTarget

### attributes
返回一个与该元素相关的所有属性的**实时**集合 NamedNodeMap。NamedNodeMap 是一个对象，不能按照数组方式遍历。

返回的对象将目标元素的属性作为数字序号的值，以下标作为键名访问。访问到对应属性后，可以通过 name 和 value 两个属性访问到元素的属性名和值。

使用示例如下：
```html
<div id="target">
    <h1 href="http://google.com" class="link"></h1>
</div>
```
```js
const targetEle = document.querySelector("div#target h1");
let attrs = targetEle.attributes;

// 通过下标遍历所有属性
for(let i = 0; i < attrs.length; i++) {
    let currentAttr = attrs[i];
    console.log("Attribute name: " + currentAttr.name);
    console.log("Attribute value: " + currentAttr.value);
}

// 除了下标以外，也可以直接通过元素对应标签的属性名访问。
console.log("href name: " + currentAttr.href.name);
console.log("href value: " + currentAttr.href.value);
```

### classList


### className

### id

### tagName

### innerHTML

### outerHTML


## 方法
同样地，Element 的方法也继承自 Node，同时实现了 EventTarget

### addEventListener()


### dispatchEvent()


### getAttribute()

### getAttributeNames()

### setAttribute()

TODO: