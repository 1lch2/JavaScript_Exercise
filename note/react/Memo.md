# memo
关于 useMemo hook，参见[React Hooks](./Hook.md)

memo 函数的作用很简单，就是用来为props不变的组件跳过重渲染。

## 用法
```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

常见用法有直接包裹在一个函数组件外围，如下所示：
```jsx
const Conponent = memo(
    (props) => {
        return <div>hello, {props.name}</div>
    }
);
```

> 被memo包裹的组件在自身state发生变化时依旧会触发重新渲染

对 props 发生变化的判断标准是 `Obejct.is` ，对于基本类型，这个方法的表现类似`===`，对于对象，仅当两个对象来自同一个引用是才为 `true`，并不会判断对象的属性。

## 使用场景
### props 未变化时跳过重渲染
当一个组件的父组件发生重渲染时，react也会对这个子组件重新渲染，不管子组件的 props 是否有变化。使用 memo 函数包裹的组件在它的父组件触发重渲染时不会随着一起重新渲染，前提是它自己的 props 没有发生变化。示例如下：
```jsx
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

### 通过状态更新记忆后的组件
