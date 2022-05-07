# 虚拟DOM
## 是什么
虚拟DOM是对真实的DOM的抽象，它的的本质是描述DOM的JS对象，带有`tag`，`props`和`children`三个属性。

如下方的HTML，对应的虚拟DOM可以表示为这样的JS对象。
```html
<div id="container">
    <main>Main</main>
    <aside class="left">Side nav</aside>
</div>
```
```js
var virtualDomElement = {
    tag: "div",
    props: {
        id: "container"
    },
    children: [
        {
            tag: "main",
            props: {},
            children: ["Main"]
        },
        {
            tag: "aside",
            props: {
                className: "left"
            },
            children: ["Side nav"]
        }
    ]
}
```

## 为什么
在前端性能优化的一个秘诀就是尽可能少地操作DOM，不仅仅是DOM相对较慢，更因为频繁变动DOM会造成浏览器的回流或者重绘（参见[回流与重绘](../browser/Reflow_Repaint.md)）。

因此我们需要这一层抽象，在patch过程中尽可能地一次性将差异更新到DOM中，这样保证了DOM不会出现性能很差的情况。

## 怎么搞
### 虚拟DOM元素构造函数
```js
/**
 * Element virdual-dom 对象定义
 * @param {String} tagName - dom 元素名称
 * @param {Object} props - dom 属性
 * @param {Array<Element|String>} - 子节点
 */
function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children

    // dom 元素的 key 值，用作唯一标识符
    if(props.key){
       this.key = props.key
    }

    var count = 0
    children.forEach(function (child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            // children 是文本节点
            children[i] = '' + child
        }
        count++
    })
    // 子元素个数
    this.count = count
}

function createElement(tagName, props, children) {
    return new Element(tagName, props, children);
}

module.exports = createElement;
```

### 将虚拟DOM渲染成真实DOM
```js
/**
 * render 将virdual-dom 对象渲染为实际 DOM 元素
 */
Element.prototype.render = function () {
    var el = document.createElement(this.tagName);
    var props = this.props;
    // 设置节点的DOM属性
    for (var propName in props) {
        var propValue = props[propName];
        el.setAttribute(propName, propValue);
    }

    var children = this.children || [];
    children.forEach(function (child) {
        var childEl;
        if (child instanceof Element) {
            // 如果子节点也是虚拟DOM，递归构建DOM节点
            child.render()；
        } else {
            // 如果是字符串，只构建文本节点
            document.createTextNode(child);
        }
        el.appendChild(childEl);
    })
    return el;
} 
```
通过以上 `render()` 方法构造真实DOM节点后，将建好的节点添加到`body`元素上

```js
elRoot = el.render();
document.body.appendChild(elRoot); 
```

### 比较DOM树差异（diff算法）
diff 算法用来比较两棵 虚拟DOM 树的差异，如果需要两棵树的完全比较，那么 diff 算法的时间复杂度为 $O(n^3)$ 。

但是在前端当中，你很少会跨越层级地移动 DOM 元素，所以 Virtual DOM 只会对同一个层级的元素进行对比，这样复杂度可以降到 $O(n)$。

#### 深度优先遍历虚拟DOM树，记录差异
每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。

DOM 操作导致的差异类型包括以下几种：
- 节点替换：节点改变了，例如将上面的 div 换成 h1;
- 顺序互换：移动、删除、新增子节点，例如上面 div 的子节点，把 p 和 ul 顺序互换；
- 属性更改：修改了节点的属性，例如把上面 li 的 class 样式类删除；
- 文本改变：改变文本节点的文本内容，例如将上面 p 节点的文本内容更改为 “Real Dom”；

以上差异在代码中定义如下：
```js
var patch = {
    REPLACE: 0, // 替换原先的节点
    REORDER: 1, // 重新排序
    PROPS: 2, // 修改了节点的属性
    TEXT: 3 // 文本内容改变 
}
```

```js
// diff 函数，对比两棵树
function diff(oldTree, newTree) {
  var index = 0; // 当前节点的标志
  var patches = {}; // 用来记录每个节点差异的对象
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
  var currentPatch = [];

  // 文本节点
  if (typeof (oldNode) === "string" && typeof (newNode) === "string") {
    // 文本内容发生改变
    if (newNode !== oldNode) {
      currentPatch.push({ type: patch.TEXT, content: newNode });
    }
  } else if (newNode != null && 
            oldNode.tagName === newNode.tagName && 
            oldNode.key === newNode.key) {
    // 节点相同，比较属性
    var propsPatches = diffProps(oldNode, newNode);
    if (propsPatches) {
      currentPatch.push({ type: patch.PROPS, props: propsPatches });
    }
    // 比较子节点，如果子节点有'ignore'属性，则不需要比较
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )；
    }
  } else if(newNode !== null){
    // 新节点和旧节点不同，用 replace 替换
    currentPatch.push({ type: patch.REPLACE, node: newNode });
  }

  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
} 
```

#### 对原有的DOM树进行操作

TODO: