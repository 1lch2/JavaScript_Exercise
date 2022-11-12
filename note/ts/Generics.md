# 泛型
## 声明泛型接口
```ts
interface Box<T> {
    data: T
}
```

TS的泛型和Java类似，只在编译时才会具体到指定的类型。若在声明泛型时没有指定接口的属性，会出现以下情况。
```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, because y matches structure of x
```

泛型的类型参数没有指定具体类型时，默认为 `any`，在比较时就会变成和非泛型一样的情况。
```ts
let identity = function <T>(x: T): T {
  // ...
};
let reverse = function <U>(y: U): U {
  // ...
};
identity = reverse; // OK, because (x: any) => any matches (y: any) => any
```

## 类型别名
类型别名也可以写成泛型，如下所示：
```ts
type Box<Type> = {
  contents: Type;
};

// 对比接口
interface Box<Type> {
  contents: Type;
}
```

由于类型别名可以不仅仅作为对象类型，因此可以配合泛型写出各种工具类型，如下所示：
```ts
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
type OneOrManyOrNull<Type> = OneOrMany<Type> | null

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
```

## 常用泛型
### Array<> 和 type[]
`string[]`，`number[]` 相当于 `Array<string>`，`Array<number>`的简写，本质一样。

`Array<T>`接口如下：
```ts
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}
```

除了数组，常用的 Map，Set，Promise本质也是泛型：`Map<K, V>`, `Set<T>`, `Promise<T>`

### ReadonlyArray
ReadonlyArray 并没有构造函数（只是个类型），想构造只读数组应该使用泛型转换普通数组，示例如下：
```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

类似 `Array<T>` 的简写，ReadonlyArray 也有简写方式，即使用关键词 `readonly`，示例如下：
```ts
let values: readonly string[] = ["red", "green", "blue"];
```

## 泛型函数
### 限制参数类型
```ts
function print<T>(arg: T): T {
    console.log(arg);
    return arg;
}
```

使用时有两种方式，指定类型或者让TS自动推断
```ts
print<string>('hello')  // 定义 T 为 string
print('hello')  // TS 类型推断，自动推导类型为 string
```

### 避免重载

使用泛型函数可以减少使用函数重载的场景，不需要为不同参数类型重载函数，示例如下

```ts
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

### 拓展类型

类似Java，泛型的类型参数可以使用 `extends` 关键字拓展。举个例子，如果想获取函数参数上面的 `length` 属性，一般的泛型类型会报错，如下所示：
```ts
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // Property 'length' does not exist on type 'Type'.
  return arg;
}
```

这时，与其套一层又一层的类型判断，可以自定一个接口，再让类型参数继承接口，实现类型参数限制，示例如下：
```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

除了定义接口，也可以直接继承某个对象，限定作为参数的对象必须包含某些属性，示例如下：
```ts
function logger<T extends { name: string }>(arg: T) {
  console.log(arg.name);
}
```


### 处理多个参数
定义一个swap函数：
```ts
function swap(tuple) {
  return [tuple[1], tuple[0]];
}
```

显然这样完全没有限定类型，加上泛型可以实现对元组具体元素的类型控制，示例如下：
```ts
function swap<A, B>(tuple: [A, B]): [B, A] {
  return [tuple[1], tuple[0]];
}

let swapped = swap([100, "200"]); // [string, number]
```

### 处理函数副作用
定义一个请求接口的函数如下：
```ts
function get(url: string) {
  return fetch(url).then(res => res.json());
}

get("api/userinfo").then(res => console.log(res)); // res: any
```

这样在使用时TS无法推断 get 函数返回的 promise 解析后的数据类型。如果已经清楚要收到的数据类型，可以使用泛型配合自定义接口来让TS正确获取到 resolve 后的数据类型，示例如下：
```ts
interface UserInfo {
  name: string;
  uid: number
}

function get<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

get<UserInfo>("api/userinfo").then(res => console.log(res)); // res: UserInfo
```

## 泛型函数类型
用类型别名和接口分别实现如下：
```ts
type Print = <T>(arg: T) => T

const printFn: Print = function print(arg) {
    console.log(arg);
    return arg;
}
```

```ts
interface Iprint<T> {
    (arg: T): T
}

function print<T>(arg: T) {
    console.log(arg);
    return arg;
}

const myPrint: Iprint<number> = print;
```

TODO:
