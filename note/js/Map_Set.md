# JavaScript基础 - Map 和 Set
## Map
JS传统的对象`Object`本质上是键值对的集合，只能使用字符串当键，限制较大。

ES6提供的`Map`结构类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

### 使用
**构造Map对象**

Map可以接受个数组作为参数。该数组的成员是一个个表示键值对的数组。
```js
let emptyMap = new Map();
let map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
```

传入数组构造Map的过程实际上如下所示：
```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();
items.forEach(
  ([key, value]) => map.set(key, value)
);
```

也可以从Set和Map来构造新的Map
```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);

const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

**读写**


如果Map的键是基本类型，只要两个值严格相等就会被视为同一个键。
当键是引用类型时，只有传入同一个对象的引用，Map才会将其视为同一个键
```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

对同一个键多次赋值将会覆盖原本的值。


**Map实例的属性和方法**

1. size 属性
    
    返回Map结构的成员总数
    ```js
    const map = new Map();
    map.set('foo', true);
    map.set('bar', false);

    map.size // 2
    ```

2. Map.prototype.has(key)
    
    has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
    ```js
    const m = new Map();

    m.set('edition', 6);
    m.set(262, 'standard');
    m.set(undefined, 'nah');

    m.has('edition')     // true
    m.has('years')       // false
    m.has(262)           // true
    m.has(undefined)     // true
    ```

3. Map.prototype.delete(key)

    delete方法删除某个键，返回true。如果删除失败，返回false。
    ```js
    const m = new Map();
    m.set(undefined, 'nah');
    m.has(undefined)     // true

    m.delete(undefined)
    m.has(undefined)       // false
    ```

4. Map.prototype.clear()

    clear方法清除所有成员，没有返回值。

**遍历方法**

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历 Map 的所有成员。

**与其他结构互相转换**

1. Map 转数组

    使用扩展运算符（...）
    ```js
    const myMap = new Map()
    .set(true, 7)
    .set({foo: 3}, ['abc']);
    [...myMap]
    // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
    ```

2. 数组转Map

    将数组传入构造函数即可转换

3. Map 转对象

    若Map所有键都是字符串，则可以直接转为对象，否则键名会被转为字符串再作为对象的键名
    ```js
    function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
    }

    const myMap = new Map()
    .set('yes', true)
    .set('no', false);
    strMapToObj(myMap)
    // { yes: true, no: false }
    ```

4. 对象转Map

    使用`Object.entries`
    ```js
    let obj = {"a":1, "b":2};
    let map = new Map(Object.entries(obj));
    ```

    或者自己手动实现
    ```js
    function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
    }

    objToStrMap({yes: true, no: false})
    // Map {"yes" => true, "no" => false}
    ```

## Set
使用同Python的Set，在ES6引入，不包含重复值

### 使用

**构造**
Set构造函数可以接受数组或具有iterable接口的的数据结构作为参数。
构造时会自动去重
```js
let set = new Set();
let setFromArray = new Set([1,2,3,3,3]);
setFromArray.size; // 3
```

同理可以使用如下方法为数组去重
```js
[...new Set(array)]
```

**实例方法和属性**
添加值使用`add()`，添加时使用类似`===`的对比方法。对象总是视为不同的值。
```js
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```

Set的操作方法如下：
- Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。

`Array.from`方法可将Set转为数组，因此有了以下数组去重方法：
```js
Array.from(new Set([1,2,3,3,3])); // [1,2,3]
```

**遍历**
Set 结构的实例有四个遍历方法，可以用于遍历成员。

- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员

Set的遍历顺序等同插入顺序。
