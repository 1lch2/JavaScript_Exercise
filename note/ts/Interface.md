# TypeScript 接口
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
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey
```

> 类型别名也有类似的拓展操作：
> ```ts
> type Animal = {
>   name: string
> }
> 
> type Bear = Animal & { 
>   honey: boolean 
> }
> ```


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

> 类型别名不能用这种重复声明的方式来拓展


