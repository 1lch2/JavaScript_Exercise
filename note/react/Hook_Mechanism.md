# React Hook 机制
## Hook 调用顺序
以如下自定义的组件为例
```tsx
const Title = () => {
  const a = _useHook(0)
  const b = _useHook("Hello")
}
```

组件渲染时，React 会按顺序依次调用两个 hook ，但对于每个hook来说，并没有能区分他们的唯一标识，那么react是如何区分不同 hook 的？

答案是**链表**。

React 渲染时遇到第一个hook调用，创建第一个hook，并将其放置在 fiber 节点下。然后遇到第二个hook调用时，将其放置在链表中，位于第一个hook之后。这样每次重渲染时，react 都只需要遍历链表，无需额外的key来标记每个hook。

不过hook的调用顺序并非是编译时决定的，而是在**运行时**。


## 参考
- Designing React Hooks the Right Way - Fang Jin, Sagar Kale