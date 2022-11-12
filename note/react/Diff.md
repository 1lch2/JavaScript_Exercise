# React - diff 策略
这套对比新旧虚拟DOM的算法称之为 reconciliation

## 前提
1. DOM 节点跨层级的移动操作特别少，可以忽略不计。
2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

以上三种前提分别对应三种 diff 策略：tree diff、component diff、element diff

## tree diff
同级比较

React通过 updateDepth 对 虚拟 DOM 树进行层级控制。同一层在对比的过程中，如果发现节点不存在时，会直接删除整个树而不继续比较。

当出现节点跨层级移动时，并不会出现移动操作，而是原根节点的树被整个重新创建，这是一种影响 React 性能的操作，因此 React 官方建议不要进行 DOM 节点跨层级的操作。

## component diff
组件比较

React对于组件的策略有两种方式，相同类型的组件，和不同类型的组件：
- 同种类型组件：按照层级比较继续比较虚拟DOM树即可。

    特殊的情况：当组件A如果变化为组件B的时候，可能虚拟DOM并没有任何变化，所以用户可以通过`shouldComponentUpdate()` 来判断是否需要更新，判断是否计算

- 不同类型组件：React会直接判定该组件为 dirty component（脏组件），无论结构是否相似，只要判断为脏组件就会直接**替换整个组件的所有节点**


## element diff
节点比较

对于同一层级的一子自节点，通过唯一的key进行比较

当所有节点处以同一层级时，React 提供了三种节点操作：插入（INSERT_MARKUP）、移动（MOVE_EXISTING）、删除（REMOVE_NODE）

### INSERT_MARKUP
新的 component 类型不在旧集合里， 即是全新的节点，需要对新节点执行插入操作。

如：C 不在集合A、B中需要插入

### MOVE_EXISTING
在旧集合有新 component 类型，且element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点

如：当组件D在集合 A、B、C、D中，且集合更新时，D没有发生更新，只是位置发生了改变，如：A、D、B、C，D的位置有4变换到了2
如果是传统的diff，会让旧集合的第二个B和新集合的D做比较，删除第二个B，在插入D
React中的diff并不会这么做，而是通过key来进行直接移动

## REMOVE_NODE
旧 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者旧 component 不在新集合里的，也需要执行删除操作。

如： 组件D在集合 A、B、C、D中，如果集合变成了 新的集合A、B、C，D就需要删除
如果D的节点发生改变，不能复用和更新，此时会删除旧的D，再创建新的
