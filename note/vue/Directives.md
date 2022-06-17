# Vue - 基础指令
## v-text
更新元素的 textContent，即向所在节点渲染文本内容。相比较与`{{}}`语法，v-text会直接替换掉节点内的文本，而插值语法不会。

以下两种写法等价
```html
<span v-text="msg"></span>
<!-- same as -->
<span>{{msg}}</span>
```

## v-html
更新元素的 innerHTML。

示例:
```html
<p v-html="rawHtml"></p>
```
```js
data() {
    return {
        rawHtml: "<span style='color: red'>This should be red.</span>"
    };
}
```

渲染结果为
```html
<p><span style="color: red">This should be red.</span></p>
```

### 注意
v-html 容易引发XSS漏洞，应该尽量避免使用。

## v-if
按条件渲染一个区块，当表达式为 true 时才渲染

```html
<h1 v-if="awesome">Vue is awesome!</h1>
```

也可以使用 v-else 添加区块，当表达式为 false 时渲染。v-else 区块必须紧跟在 v-if 后，否则无法识别。

### 特性：
- v-if 具有懒加载特性，只有当某个元素第一次变成 true 时才会渲染
- v-if 和 v-for 同时存在与某个元素上时，v-if 的优先级更高

## v-show
v-show 也可以用于条件渲染元素，但 v-show 会在DOM中保留元素，而 v-if 不会。

相当于 `v-show="false"` 的元素被设置了 `visibility: hidden`，而 `v-if="false"` 的元素被设置了 `display: none`。

v-show 不论初始情况为 false 还是 true，都会被渲染

## v-for
基于原始数据多次渲染元素或者模板块（`<template>`）

### 用法
指令必须使用类似`for-in`循环式的语法为迭代的元素提供别名，示例如下：
```html
<div v-for="item in items">
  {{ item.text }}
</div>
```

或者为索引指定别名（可以类比JS的`forEach`方法中传入的回调函数的参数）
```html
<div v-for="(item, index) in items"></div>

也可以用来遍历对象属性
<div v-for="(value, key) in object"></div>
<div v-for="(value, name, index) in object"></div>
```

### 注意
### 与 v-if 的优先级问题
v-for 和 v-if 共存时，由于**v-if优先级更高**，导致v-if无法访问到v-for作用域内的变量，如下所示
```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

解决方法是在外新包装一层 `<template>` 再在其上使用 v-for：
```html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### 默认的原地更新问题
v-for 默认使用就地复用策略，列表数据修改的时候，会根据key值去判断某个值是否修改，如果修改，则重新渲染这一项，否则复用之前的元素。

TODO:

## v-on
给元素绑定事件监听器。

事件类型由参数来指定。表达式可以是一个方法名，一个内联声明，如果有修饰符则可省略。

当用于普通元素，只监听 原生 DOM 事件。当用于自定义元素组件，则监听子组件触发的自定义事件。如下所示

```html
<!-- 方法处理函数 -->
<button v-on:click="doThis"></button>

<!-- 动态事件 -->
<button v-on:[event]="doThis"></button>

<!-- 内联声明 -->
<button v-on:click="doThat('hello', $event)"></button>

<!-- 缩写 -->
<button @click="doThis"></button>

<!-- 使用缩写的动态事件 -->
<button @[event]="doThis"></button>

<!-- 停止传播 -->
<button @click.stop="doThis"></button>

<!-- 阻止默认事件 -->
<button @click.prevent="doThis"></button>

<!-- 不带表达式地阻止默认事件 -->
<form @submit.prevent></form>

<!-- 链式调用修饰符 -->
<button @click.stop.prevent="doThis"></button>

<!-- 按键用于 keyAlias 修饰符-->
<input @keyup.enter="onEnter" />

<!-- 点击事件将最多触发一次 -->
<button v-on:click.once="doThis"></button>

<!-- 对象语法 -->
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
```

### 修饰符
在事件声明的末尾可以增加修饰符来定制更细致的事件监听，修饰符如下：
- .stop ——调用 event.stopPropagation()。
- .prevent ——调用 event.preventDefault()。
- .capture ——在捕获模式添加事件监听器。
- .self ——只有事件从元素本身发出才触发处理函数。
- .{keyAlias} ——只在某些按键下触发处理函数。
- .once ——最多触发一次处理函数。
- .left ——只在鼠标左键事件触发处理函数。
- .right ——只在鼠标右键事件触发处理函数。
- .middle ——只在鼠标中键事件触发处理函数。
- .passive ——通过 { passive: true } 附加一个 DOM 事件。


## v-bind
TODO

## v-model
TODO
