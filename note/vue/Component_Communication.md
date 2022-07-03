# Vue 组件通信
## Vue 3
- props
- $emit
- expose / ref
- $attrs
- v-model
- provide / inject
- Vuex
- mitt

### props
适用于父子组件通信

TODO:

### EventBus （$emit / $on） 
适用于 父子、隔代、兄弟组件通信

这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件。

### provide/inject


### Vuex
Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

### mitt.js 
适用于任意组件通信

Vue3 中移除了 $on，$off等方法，所以 EventBus 不再使用，相应的替换方案就是 mitt.js

mitt 的用法和 EventEmitter 类似，通过 on 方法添加事件，off 方法移除，clear 清空所有。
```js
import mitt from 'mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```
