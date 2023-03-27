# React 组件属性和事件

对于所有浏览器内置的组件（原生DOM），React 都有一套通用的属性和事件处理机制。

## 普通组件（Common component）
以一个普通的 `<div>` 为例。

```html
<div className="wrapper">Some content</div>
```

对于此类普通组件，除了标准的DOM元素属性以外，react 支持以下属性：
- children
- dangerouslySetInnerHTML：包含HTML字符串的对象，形如：`{ __html: '<p>some html</p>' }`，会将DOM节点的`innerHTML`属性修改为传入的HTML字符串
- ref：从`useRef`或`createRef`获取的对象，或者是一个ref回调，参考[React Ref](./Ref.md)
- style：用 camelCase 表示的CSS对象。



TODO：
