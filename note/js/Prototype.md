# JavaScript基础 - 原型

表格引用自MDN，[对象模型的细节 - JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)

基于类（Java）和基于原型（JavaScript）的对象系统的比较
|基于类的（Java） | 基于原型的（JavaScript） |
|-------------|-------------------------|
| 类和实例是不同的事物。| 所有对象均为实例。|
| 通过类定义来定义类；通过构造器方法来实例化类。| 通过构造器函数来定义和创建一组对象。|
| 通过 new 操作符创建单个对象。| 相同。|
| 通过类定义来定义现存类的子类，从而构建对象的层级结构。| 指定一个对象作为原型并且与构造函数一起构建对象的层级结构  |
| 遵循类链继承属性。 | 遵循原型链继承属性。 |
| 类定义指定类的所有实例的所有属性。无法在运行时动态添加属性。 | 构造器函数或原型指定实例的初始属性集。允许动态地向单个的对象或者整个对象集中添加或移除属性。|

对于`__proto__`，`prototype`，`constructor`三种属性，其中`prototype`是**函数独有的**，但由于函数也是一种对象，所以也有`__proto__`和`constructor`属性。

## `__proto__`
`__proto__`在ES标准中的名字是`[[Prototype]]`，只是chrome浏览器将其实现命名为带双下划线的这个名字而已。

可以通过如下代码检查浏览器是否支持这个属性：
```js
Object.getPrototypeOf({__proto__: null}) === null
```

`__proto__`是从一个对象指向它的**原型对象**，作用是当访问对象的属性时，如果没有在当前对象找到，就会沿着这条原型链向上寻找，直到找到原型链顶端的null。

## `prototype`
`prototype`是函数所独有的，它从一个函数指向一个对象。它的含义是函数的原型对象，也就是这个函数（其实所有函数都可以作为构造函数）所创建的实例的原型对象。

prototype属性的作用就是让该函数所实例化的对象们都可以找到公用的属性和方法.

举例：
```js
function F() {}
let f = new F();
```
对于由构造函数`F()`构造出来的对象`f`，以下代码是成立的：
```js
f.__proto__ === F.prototype; // true
```

> 注意：对于 `Function` 函数，由它使用`new`操作符创建的对象是一个函数，但同时也是一个对象，因此以下表达式的结果为 true。
> ```js
> let f = new Function();
> f.__proto__ == Function.prototype; // true
> ```

通过修改构造函数的原型对象，可以实现从另一个构造函数继承属性和方法。举例如下:
```js
function A(id) {
}

// 为A添加方法
A.prototype.hi = function() {
  console.log("hi");
}

function B() {
}

B.prototype = new A(); // 将A的实例覆盖B的原型对象

let a = new A();
let b = new B();
a.hi(); // hi
b.hi(); // hi
```

## `constructor`
constructor属性也是对象才拥有的，它是从一个对象指向一个函数，含义就是指向该对象的构造函数。

每个对象都有构造函数。Function这个对象比较特殊，它的构造函数就是它自己（因为Function可以看成是一个函数，也可以是一个对象）

所有函数（此时看成对象了）最终的构造函数都指向Function。

## 总结
| | `__proto__`| prototype| constructor|
|-|----------|----------|------------|
| 含义 | 指向它的原型对象 | 函数的原型对象 | 指向该对象的构造函数 |
| 指向 | 对象->对象 | 函数->对象 | 对象->函数|
| 对象拥有 | ✓   |       | ✓      |
| 函数拥有 | ✓   |   ✓   | ✓      |

## `instanceof`
`instanceof`操作符用于检查一个对象是否属于某个特定的 class。同时，它还考虑了继承。用法如下：
```js
result = variable instanceof constructor;
```
或者：
```js
obj instanceof Class
```
如果 obj 隶属于 Class 类（或 Class 类的衍生类），则返回 true。

## 小技巧
### 获取变量类型
利用如下方法判断变量的精确类型。
```js
Object.prototype.toString.call(variable);
```

```js
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call('hi') // "[object String]"
Object.prototype.toString.call({a:'hi'}) // "[object Object]"
Object.prototype.toString.call([1,'a']) // "[object Array]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(() => {}) // "[object Function]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(Symbol(1)) // "[object Symbol]"
```

利用如上原理，可以自己封装一个判断变量类型的函数。以下代码来自MDN.
```js
function type(obj, fullClass) {
  // get toPrototypeString() of obj (handles all types)
  // Early JS environments return '[object Object]' for null, so it's best to directly check for it.
  if (fullClass) {
    return (obj === null) ? "[object Null]" : Object.prototype.toString.call(obj);
  }
  if (obj == null) {
    return (obj + "").toLowerCase();
  } // implicit toString() conversion

  var deepType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  if (deepType === "generatorfunction") {
    return "function";
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/) ? deepType :
    (typeof obj === "object" || typeof obj === "function") ? "object" : typeof obj;
}
```

### 获得对象的精确类型
```js
// 构造函数
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

let node = new TreeNode(0);
// 获得构造函数的名称
let typeofNode = node.constructor.name; // 'TreeNode'
```