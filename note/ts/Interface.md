# TypeScript 接口

Cheat sheet:
![img](../static/Interface_Cheatsheet.png)


## 语法

TS 接口类似 Java 的接口，也是一种类型声明，语法也几乎一样。

```ts
interface Point {
  x: number;
  y: number;
}
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
```

### 接口继承

和 Java 的语法一模一样。

```ts
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

> 类型别名也有类似的拓展操作：
>
> ```ts
> type Animal = {
>   name: string;
> };
>
> type Bear = Animal & {
>   honey: boolean;
> };
> ```

类似 Java 的接口，TS 接口也可以多重继承：

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {
  ...
}
```

### 接口合并

可以用一种看起来像重复声明的操作来拓展接口

```ts
interface Box {
  height: number;
  width: number;
}
interface Box {
  scale: number;
}
let box: Box = { height: 5, width: 6, scale: 10 };
```

这种方式不能给已经存在的属性名改类型，编译器会抛出错误。

如果合并了带函数的接口，那么可以起到方法重载的效果。

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// 等价于下方的写法
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

> 类型别名(`type`)不能用这种重复声明的方式来拓展

## 实现接口

两种办法，创建对应类型的对象，或者创建实现接口的类：

```ts
interface Person {
  hi(name: string): void;
  // 或者另一种写法
  // hi: (name: string) => void;
}

let Someone: Person = {
  hi(name) {
    console.log(`hi, ${name}`);
  },
};

class Someone implements Person {
  hi(name) {
    console.log(`hi, ${name}`);
  }
}
```

## 索引签名

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

上例的意思是，当 StringArray 使用 number 作为索引时，会返回一个 string。

只有`string`，`number`，`symbol`，模板字符串，以及由前面几类组合的联合类型才能作为索引的类型。

在使用**字符串索引签名**时，接口中的其他属性的类型，必须匹配索引签名标记的返回类型，示例如下：

```ts
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string; // ❌
  // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```

> 数字索引签名没有这个限制，官网文档甚至都没写清楚，但是类型检查不会骗人。

**同时使用**数字和字符串索引签名时，**数字索引签名**的返回值必须是**字符串索引签名返回值**的**子类型**。示例如下：

```ts
interface Dog extends Animal {}

interface Animal {
  [index: number]: Dog;
  [index: string]: Animal;
}
```

> 因为在 JS 中，当使用数字去索引对象时，实际上会先将数字转换为字符串，然后再使用字符串去索引对象。

这里 Dog 为 Animal 的子类型，因此声明合法。

## 调用签名

TS 接口中的调用签名用来描述函数类型。

```ts
interface Greeting {
  (name: string): void;
}

declare const greeting: Greeting;
greeting("john");
```

### 带其他属性的调用签名类型

和接口中定义函数不一样，接口中的函数是定义了对象中的一个属性，而调用签名可以把对应类型的对象作为函数，示例如下：

```ts
// 定义带调用签名的类型
interface Person {
  (name: string): void;
  age: number;
}

// 创建的对象可以作为函数使用。
// 这里不能用 let 声明
const a: Person = (name) => console.log(name);
a.age = 42;

a("someone"); // someone

// 也可以采用这种声明方式
let a = <Person>function (name) {
  console.log("hi" + name);
};
```

> 注意避坑：定义了调用签名以后，其他成员的名字**不能**和调用签名函数的参数重名，否则会出现诡异的 bug。
>
> ```ts
> interface Greeting {
>   (name: string): void;
>   name: string; // 这里和调用签名里的参数名重复了
>   age: number;
> }
>
> const greeting: Greeting = (name) => console.log("hi, " + name);
> greeting.name = "someone";
> greeting.age = 42;
>
> greeting("someone"); // ❌
> /*
>  TypeError: Cannot assign to read only property 'name' of function '(name) => console.log("hi" + name)'
> */
> ```

### 多个调用签名

如果一个接口声明了多个调用签名，相当于定义了函数重载。

```ts
interface Add {
  (x: string, y: string): string;
  (x: number, y: number): number;
}

let myAdd: Add = function (
  x: string | number,
  y: string | number
): string | number {
  if (typeof x === "string" && typeof y === "string") {
    return x + y;
  } else if (typeof x === "number" && typeof y === "number") {
    return x + y;
  }
};
```

不过一般并不需要这么写，而且变量的联合类型声明并不完全符合接口的设计

## 构造签名
JS中函数可以通过 `new` 关键字来创建对象，TS 中可以通过编写构造签名来定义构造函数。示例如下：
```ts
interface PersonConstructor {
  new (name: string): Person;
}

class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

let personConstructor: PersonConstructor = Person;
let person = new personConstructor("John");

// personConstructor.__proto__ === Person.__proto__
// true
```


TODO:
