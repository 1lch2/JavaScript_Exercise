# Redux
> redux 并不和 react 绑定，react-redux 是 react 官方的 redux 绑定库

## 核心概念
### store
store 构造了一个中心化的状态树，使用 Redux 后，所有对状态的修改都是对 store 的修改，不需要再通过 props 来层层传递状态。

### action
action 是改变 store 的唯一方式，具体指调用 dispatch 函数，传递一个 action，即一个JS对象，包括了动作的类型和要更新的数据。

```js
dispatch({ type: 'ADD_TODO', text: 'text' })
```

对于可复用的 action，可以使用 action-creator，即返回一个 action 的函数，示例如下：
```js
let nextTodoId = 0;
const addTodo = (text) => ({
    type: "ADD_TODO",
    id: nextTodoId++,
    text // 此处为 ES6 的对象属性名简洁表示法
});
```

使用了 action-creator 后，修改 store 变为如下操作：
```js
dispatch(addTodo('text'))
```

### reducer
reducer 是一个普通的函数，它接收两个参数：state 和 action，前者为 Store 中存储的那棵 JavaScript 对象状态树，后者即为在组件中 dispatch 的那个 Action。

> Redux 官方社区对 reducer 的约定是一个纯函数，即我们不能直接修改 state ，而是可以使用 {...} 等对象解构手段返回一个被修改后的新 state。

示例如下：
```js
reducer(state, action) {
  let newState = {...}
  // 对 state 进行操作
  return newState;
}
```

在 reducer 中，如果创建时给 `createStore` 提供了初始的 state，那么 reducer **必须**默认返回未修改的 state。如下所示：
```js
const reducers = (state, action) => {
  switch(action.type) {
    case ACTION_SET_PROJECT_TYPE: 
      return Object.assign({}, state, { count: action.count + 1 });
    default:
      return state;
  }
};
```

这是因为当 `createStore` 方法创建 store 时，会调用一个默认的 action 来获取初始的 state 值，这个 action 的值是 `"@@redux/init"`，如果没有提供 default 选项中返回 state 的操作，则对应的 state 会被修改为 `"@@redux/initY.l.a"` 这样的形式。

> 问题参考：[Init state issue with "@@redux/init" in Redux](https://stackoverflow.com/questions/43618737/init-state-issue-with-redux-init-in-redux)

> Redux 源码中的对应部分：[reduxjs/redux src/createStore.ts](https://github.com/reduxjs/redux/blob/8ad084251a5b3e4617157fc52795b6284e68bc1e/src/createStore.ts#L359)
> ```ts
> // When a store is created,
> // an "INIT" action is dispatched so that
> // every reducer returns their initial state.
> // This effectively populates the initial state tree.
> dispatch({ type: ActionTypes.INIT } as A)
> ```

## 用法示例

```js
import { createStore } from 'redux'

const reducer = (state = {count: 0}, action) => {
  switch (action.type){
    case 'INCREASE': return {count: state.count + 1};
    case 'DECREASE': return {count: state.count - 1};
    default: return state;
  }
}

const actions = {
  increase: () => ({type: 'INCREASE'}),
  decrease: () => ({type: 'DECREASE'})
}

const store = createStore(reducer);

store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch(actions.increase()) // {count: 1}
store.dispatch(actions.increase()) // {count: 2}
store.dispatch(actions.increase()) // {count: 3}
```

### createStore
`createStore()`用法如下：
```js
const store = createStore(reducer, [preloadedState], enhancer);
```

第二个参数是 store 的初始状态，如果没有传递，则 reducer 会使用定义时的默认值，即上方例子中的 `{ count: 0 }`。

### store.subscribe
直接使用`store.subscribe(listener)`会导致每次触发重新渲染时都执行一次，因此正确用法是，配合 useEffect 在首次渲染时订阅 store，通过返回 `unsubscribe` 方法来在组件卸载时取消订阅。示例如下：
```js
useEffect(() => {
  const unsubscribe = store.subscribe(listener);
  return unsubscribe;
}, []);
```

## react-redux
区别于 redux，redux 直接在组件中创建即可，而 react-redux 则是用 Provider 组件和 store 来对接，使用 connect 将组件和 react 连接起来

React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）。

UI 组件有以下几个特征：
- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用this.state这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API

容器组件的特征恰恰相反：
- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API

### connect
`connect()`用于从 UI 组件生成容器组件。connect 的两个参数分别定义了输入与输出逻辑，即外部的数据（即state对象）如何转换为 UI 组件的参数，和用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

用法如下：
```js
connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

#### mapStateToProps
mapStateToProps 作用是将 redux 中的 state 映射到 react 组件中的 props。mapStateToProps 执行后应该返回一个对象，里面的每一个键值对就是一个映射，示例如下：
```js
const mapStateToProps = (state) => {
    return {
        // 将 state 中的 bar 映射到组件 props 上的 foo 属性
        todos: getTodos(state.todos, state.type)
    }
}

// getTodos 用来计算 todos
const getTodos = (todos, type) => {
  switch(type) {
    case "ALL": 
      return todos;
    case "ACTIVE":
      return todos.filter(item => item.completed);
    default:
      throw new Error("Unknown type");
  }
}
```

mapStateToProps会订阅 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

mapStateToProps的第一个参数总是 state 对象，还可以使用第二个参数，代表容器组件的 props 对象。使用ownProps作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。
```jsx
// 容器组件的代码
<FilterLink filter="SHOW_ALL">
  All
</FilterLink>

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
```

connect方法可以省略 mapStateToProps 参数，那样的话，UI 组件就不会订阅Store，就是说 Store 的更新不会引起 UI 组件的更新。

#### mapDispatchToProps
mapDispatchToProps 用来建立 UI 组件的参数到store.dispatch方法的映射。它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

mapDispatchToProps作为函数，应该返回一个对象，该对象的每个键值对都是一个映射，定义了 UI 组件的参数怎样发出 Action。

示例如下：
```js
// action 组件中的定义
export function increment() {
    return { type: "increment" };
}

export function decrement() {
    return { type: "decrement" };
}
```

```js
// 在组件中导入 action
import { increment, decrement } from "../action/action";

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => { dispatch() },
    decrement: () => { dispatch({type: "decrement"}) }
  };
}
```

使用示例：
```jsx
<button onClick={()=>increment()}>Add</button>
```

### Provider
connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成 UI 组件的参数。

一种解决方法是将state对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将state传下去就很麻烦。

React-Redux 提供Provider组件，可以让容器组件拿到state。

一般将顶层组件包裹在 Provider 组件中，这样所有的组件都会在 react-redux 的控制之下，示例如下：
```jsx
let store = createStore(todoApp);

render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById("App")
)
```

子组件中：
```jsx
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    // ...
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
```

## 参考
- [redux与react-redux的区别](https://blog.csdn.net/GreyCastle/article/details/105510924)
- [Redux 入门教程](https://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)
