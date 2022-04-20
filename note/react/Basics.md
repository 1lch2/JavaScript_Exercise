# React 基础 - 语法
## JSX
在JavaScript中嵌入HTML，将其作为元素处理，遇到多行的HTML需要使用括号包裹。

在嵌入的HTML中可以使用JS表达式，需要用大括号包裹表达式。
如下例所示：
```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

> 因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 camelCase（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。
> 例如，JSX 里的 HTML class 变成了 className，而 tabindex 则变为 tabIndex。

关于 HTML 的 class 属性，在React中应该参考下例：
```html
<div class="main"></div>
```
```jsx
const div = <div className="main"></div>
```


Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。以下代码等价：
```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```
```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

## 组件
React中有两种定义组件的方式，定义一个继承自 `React.Component` 的类，或者定义一个接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素的函数。

如下例所示，两种方式都定义了一个 React 组件

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

如何选择类组件和函数组件：当需要用到内部状态和生命周期时候应该选择类组件

## props

除了使用 HTML 标签，也可以使用 React 组件，当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象被称之为 “props”。如下例所示，Welcome 组件接受了从外部传入的一个键值对参数 `{"name": "Sara"}`，并在组件内部通过 `pros` 属性解析获取。

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

**组件无论是使用函数声明还是通过 class 声明，都决不能修改自身的 props。**



TODO: