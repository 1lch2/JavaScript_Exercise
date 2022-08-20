# React - setState

## 用法
```js
setState(updater[, callback])
```

setState() 将对组件 state 的更改**排入队列**，并通知 React 需要使用更新后的 state 重新渲染此组件及其子组件。

将 setState() 视为请求而不是立即更新组件的命令。为了更好的感知性能，React 会**延迟调用**它，然后通过一次传递更新多个组件。

若需要强制 DOM 更新同步应用，你可以使用 flushSync 来包装它，用法如下所示：
```jsx
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```
> flushSync 会对性能产生很大影响。尽量少用。


### updater 函数作为参数
updater 函数中接收的 state 和 props 都保证为最新。updater 的返回值会与 state 进行浅合并。假设需要使用 props 来更新 state，示例如下：
```jsx
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

### 对象作为参数
stateChange 会将传入的对象浅层合并到新的 state 中。

这种形式的 setState() 也是异步的，并且在同一周期内会对多个 setState 进行批处理。例如，如果在同一周期内多次设置商品数量增加，则相当于：
```jsx
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

后调用的 setState() 将覆盖同一周期内先调用 setState 的值，因此商品数仅增加一次。


## 异步？同步？
情况分析：
1. setState只在合成事件和钩子函数中是“异步”的，在原生事件和setTimeout 中都是同步的。

2. setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。

3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时setState多个不同的值，在更新时会对其进行合并批量更新。

### setState 后 马上使用 state
应使用 componentDidUpdate 或者 setState 的回调函数（`setState(updater, callback)`），这两种方式都可以保证在应用更新后触发。

### 后续状态依赖当前状态
应使用 updater 函数的形式代替：
```jsx
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

## 更新顺序
对于多个不同的 setState 操作，它们的顺序总能保证。

在 React 17 之前，只有在 React 事件 handler 中的的更新操作默认被合并批量更新。React 18之后所有的更新操作都默认合并批量更新。

不管在同一个 React 事件 handler 中调用多少个 setState，都只会在事件结束时候产生一次重新渲染。

在 React 17之前，如果在事件 handler 之外调用多个 setState ，则每个 setState 会立刻执行，例如在AJAX响应中调用等。下例中每个 setState 会立刻调用，每次都会触发重新渲染
```js
promise.then(() => {
  // We're not in an event handler, so these are flushed separately.
  this.setState({a: true}); // Re-renders with {a: true, b: false }
  this.setState({b: true}); // Re-renders with {a: true, b: true }
  this.props.setParentState(); // Re-renders the parent
});
```

React 17之前，为了避免重复渲染，可以使用 `ReactDOM.unstable_batchedUpdates` 来手动合并，如下所示：
```js
promise.then(() => {
  // Forces batching
  ReactDOM.unstable_batchedUpdates(() => {
    this.setState({a: true}); // Doesn't re-render yet
    this.setState({b: true}); // Doesn't re-render yet
    this.props.setParentState(); // Doesn't re-render yet
  });
  // When we exit unstable_batchedUpdates, re-renders once
});
```


## 参考
- [Does React keep the order for state updates?](https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973)
- [React.Component - setState](https://react.docschina.org/docs/react-component.html#setstate)
