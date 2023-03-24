# TS 工具类

## `Partial<Type>`

它可以将类型 Type 的所有属性都设置为可选。这个工具类型将返回一个表示给定类型的所有子集的类型。示例如下：

```ts
interface Todo {
  title: string;
  description: string;
}

// 第二个参数接受需要更新的属性，只需要传递需要更新的部分，而不需要更新每个属性
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

// 这里只更新了 description 属性
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Required<Type>`

和 Partial 相反，这个泛型把传入的类型属性都变为必选。

## `Readonly<Type>`

接收一个对象并把它的所有属性变为只读。类似手动给传入的 Type 或者对象的属性全部加上 readonly。

除了泛型，也有 [`readonly` 关键字](./Object_Type.md#readonly-属性) 可以起到类似效果

类似的有 [`ReadonlyArray<Type>`](./Generics.md#readonlyarray)

## `Record<Keys, Type>`

`Record<Keys, Type>` 是一个内置的泛型类，用来创建一个类型，其中包含指定的键和值类型。Keys 是一个**联合类型**，表示对象中所有可能的键；Type 表示对象中所有键对应的值的类型。

以下面的场景为例，假如需要创建如下类型：

```ts
type MyRecord = {
  a: number;
  b: number;
  c: number;
};
```

使用 Record 泛型创建方法如下：

```ts
type MyRecord = Record<"a" | "b" | "c", number>;
```

Record 通过映射创建新类型的特点，可以配合用来表示分类的联合类型，和对应每个分类的属性来创建类似 map 的结构，示例如下：

```ts
// 不同的导航页
type NavigationPages = "home" | "stickers" | "about" | "contact";

// 每个页面的属性
interface PageInfo {
  title: string;
  url: string;
  axTitle?: string;
}

// 利用 Record 的特点创建了包含每个页面属性的变量
const navigationInfo: Record<NavigationPages, PageInfo> = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" },
  stickers: { title: "Stickers", url: "/stickers/all" },
};
```

## `Pick<Type, Keys>`

用来从一个类型中挑选出一些成员，然后创建一个新的类型。Type 是要挑选成员的类型；Keys 是一个联合类型，表示要挑选的成员。

```ts
interface Person {
  name: string;
  age: number;
  address: string;
}

type PickPerson = Pick<Person, "name" | "age">;
// type PickPerson = {
//   name: string;
//   age: number;
// }
```

## `Omit<Type, Keys>`

从 Type 类型中移除 Keys 属性，返回一个新的类型。内部实现使用了 Exclude 来取 Keys。

```ts
interface XYZ {
  x: number;
  y: number;
  z: number;
}

type XY = Omit<XYZ, "z">; // { x: number; y: number }
```

## `Exclude<Type, RemoveUnion>`

从类型 Type 中剔除所有可以赋值给 RemoveUnion 的属性，然后构造一个新类型。

```ts
type ABC = "A" | "B" | "C";
type BC = Exclude<ABC, "A">; // 'B' | 'C'
```

> Exclude 用于在联合类型中剔除属性，而 Omit 用在对象或者接口上

```ts
interface XYZ {
  x: number;
  y: number;
  z: number;
}
type XY = Omit<XYZ, "z">; // { x: number; y: number }
```

## `Extract<Type, MatchUnion>`

从联合类型 Type 中提取所有可以赋值给 MatchUnion 的属性，然后构造一个新类型。

```ts
type ABC = "A" | "B" | "C";
type AB = Extract<ABC, "A" | "B">; // 'A' | 'B'
```

## `NonNullable<Type>`

从联合类型 Type 中移除 null 和 undefined 类型，然后构造一个新类型。

```ts
type NoNullType = NonNullable<string | number | null>;
// string | number
```

传入接口不会对接口有任何操作。

## `ReturnType<Type>`

该泛型提取特定函数的返回类型，示例如下：

```ts
const fn = (x: number): string => "a" + x;
type FnReturn = ReturnType<typeof fn>; // string
```

不过不能用这个泛型来处理泛型函数。

对于泛型函数，在 TS 4.7 中给出了解决办法，以下面的声明的函数为例，在 TypeScript 4.7 中，引入了一种名为“实例化表达式”的模式，可以在不调用泛型函数的情况下指定该函数的类型参数。

```ts
// 声明一个函数
declare function fn<T, U>(arg1: T, arg2: U): [T, U];

// 实例化泛型参数 T 和 U，这里并不需要真的实现函数 fn
const myFunc = fn<number, string>;

// 这里还可以直接用 typeof 操作符来获取泛型函数的类型参数
type fnReturnType = typeof fn<number, string>;
```

## `InstanceType<Type>`

用来从类或者构造函数中创造类型，由于 JS/TS 中的类也是函数，这个泛型的功能实际上是提取构造函数的实例类型。

```ts
class Person {
  constructor(name: string) {
    this.name = name;
  }
}

type Person = InstanceType<typeof Person>;
```

## `ThisType<Type>`

用于指定对象字面量中函数的 this 类型。在对象字面量中定义函数时，可以用 `ThisType<Type>` 来指定函数中 this 的类型。类似在函数参数声明中的 [this 参数](./Function.md#this)。

示例如下：

```ts
interface MyType {
  logError: (error: string) => void;
}

// 这里能让 myObject 的方法访问另一个接口中的方法，类似绑定了别的 this
const myObject: { myFunction: () => void } & ThisType<MyType> = {
  myFunction() {
    this.logError("Error: Something went wrong!");
  }
};
```
> 上面的例子只是为了类型检查，接口并没有实现
