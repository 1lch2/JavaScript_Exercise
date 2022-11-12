# React - Fiber
## 前情提要
### reconciliation（协调算法）
Fiber 算法是对 reconciliation 算法的一种重写，但是某些思想还是一样的：
- 不同组件类型一般认为会生成不同的树（DOM树），因此React不会对比而是倾向于直接替换
- 对列表元素的 diff 还是通过 key 来实现。列表元素的 key 应该稳定，可预测且独一无二

### reconciliation 对比 渲染
reconciliation 和渲染在 react 里是两部分，因为可能会将虚拟DOM通过 RN 渲染成 iOS 或者安卓的 View。协调器只负责计算树中的哪部分发生了变化，而渲染器利用这部分信息来更新渲染的app。

Fiber 算法重新实现了协调器（reconciler）

### 调度（scheduling）与任务（work）
要点如下：
- UI中的每次更新并不需要马上执行，这么做的话可能会很浪费，导致掉帧或者影响用户体验
- 不同种类的更新有不同优先级，比如动画更新就比从store中更新数据更需要尽快完成
- 基于推送的方法需要app（基本上就是写app的开发者）来决定如何调度任务。而基于拉取的方法需要框架（react）的聪明才智来替你决定

## Fiber 的设计思想
Fiber 算法的主要目标：
- 暂停任务并在之后返回任务
- 为不同种类的任务分配不同优先级
- 重用之前完成的任务结果
- 如果任务不在需要则中断它

### Fiber 节点
- 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
- 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

Fiber 节点属性如下所示
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```



TODO: