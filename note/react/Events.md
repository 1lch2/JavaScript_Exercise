# React 事件

## React 事件对象



## focus

React 对于 focus，blur 事件的处理方式和原生 DOM 有所不同，原生 DOM 中这两个事件不会冒泡，参考 [focus，blur 事件](../html/Event.md#焦点事件)。而在 react 中，这两个事件会冒泡，而 react 底层并不是对 focusin，focusout 事件进行的监听，因此某些场合下会出现错误判断的情况。

## 场景

TODO：
