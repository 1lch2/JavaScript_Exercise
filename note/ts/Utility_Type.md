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
type MyRecord = Record<'a' | 'b' | 'c', number>;
```

Record 通过映射创建新类型的特点，可以配合用来表示分类的联合类型，和对应每个分类的属性来创建类似map的结构，示例如下：
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

type PickPerson = Pick<Person, 'name' | 'age'>;
// type PickPerson = {
//   name: string;
//   age: number;
// }
```

## `Omit<Type, Keys>`

## `Exclude<Type, RemoveUnion>`

## `Extract<Type, MatchUnion>`

## `NonNullable<Type>`

## `ReturnType<Type>`

## `InstanceType<Type>`

## `ThisType<Type>`

TODO:
