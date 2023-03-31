# React 组件属性和事件

对于所有浏览器内置的组件（原生 DOM），React 都有一套通用的属性和事件处理机制。

## 普通组件（Common component）

以一个普通的 `<div>` 为例。

```html
<div className="wrapper">Some content</div>
```

对于此类普通组件，除了标准的 DOM 元素属性以外，react 支持以下属性：

- children
- dangerouslySetInnerHTML：包含 HTML 字符串的对象，形如：`{ __html: '<p>some html</p>' }`，会将 DOM 节点的`innerHTML`属性修改为传入的 HTML 字符串
- ref：从`useRef`或`createRef`获取的对象，或者是一个 ref 回调，参考[React Ref](./Ref.md)
- style：用 camelCase 表示的 CSS 对象。

TODO：
