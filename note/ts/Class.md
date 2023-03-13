# TS class

TS 的 class 基本继承自 ES6，但是多了很多 TS 专属的类型控制和访问控制。

## 成员可见性

典中典之 public，private，protected。

```ts
class Greeter {
  private x = 0;

  protected getName() {
    return "hi";
  }

  public greet() {
    console.log("hi!");
  }
}
```

public，private 的行为与 Java 无异，protected 的表现略有不同。

protected 关键字声明的成员，在子类中可以被暴露，只需要不写 protected 即可。

```ts
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

另外，在多重继承中，子类的子类无法访问到父类的 protected 成员，也就是说访问权限**不会**随着继承关系一直继承下去。

```ts
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10; // ❌
    // Property 'x' is protected and only accessible through an instance of class 'Derived2'. This is an instance of class 'Base'.
  }
}
```

> TS 的 private 和 JS 中用 `#` 标记的静态变量不一样，TS 的私有变量只是编译期的，而 JS 的 #号私有变量是真私有，不能通过其他方法公开
>
> ```js
> class Dog {
>   #barkAmount = 0;
>   personality = "happy";
>
>   constructor() {}
> }
> ```

## 静态变量

和 Java 一样，静态变量是类的成员而不是实例的成员，一般用来写工具类。

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
```

static 也可以配合成员访问控制那几个关键字使用，和 Java 里一样。

### 特殊的静态变量名

由于 class 本身是 `Function`，可以使用 new 关键词，某些静态变量关键字不能使用。

这些变量名有 name, length, call

### 静态块

类似在 Java 中的静态块，用来初始化类的**私有**成员

```ts
class Foo {
  static #count = 0;

  get count() {
    return Foo.#count;
  }

  static {
    try {
      const lastInstances = loadLastInstances();
      Foo.#count += lastInstances.length;
    } catch {}
  }
}
```

## 泛型类

和 Java 基本一样

```ts
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!"); // Box<string>
```

注意泛型类型参数不能为 static ，跟 Java 一样，TS 的泛型也有类型抹除机制

## this

> TypeScript is basically JavaScript so still shit. -- Someone on Youtube

表现跟 JS 里一样，所以处理方式也和 JS 一样。比如 class 里的方法直接用箭头函数之类的。

使用箭头函数避免 this 问题也有代价：

- 每个类的实例会保存一份定义的函数，造成占用更多内存
- 在衍生类中不能用 super 访问到父类的方法，因为在原型链上没有访问的入口

### this 参数

TS 中，函数的 this 参数用于声明 this 的类型，这个 this 参数必须位于第一位。这样可以限制调用函数时 this 的类型，编译到 JS 后会被抹除，示例如下：

```ts
function sayHello(this: void, x: number) {
  // this: void：表示在函数体内不允许使用this
}
```

编译后：

```ts
function sayHello(x: number) {
    ...
}
```

靠着 this 参数的这个特点，可以在不用箭头函数的情况下保证 this 指向的正确性：

```ts
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();

c.getName(); // OK

const g = c.getName;
console.log(g()); // ❌ Error, would crash
```

这种办法的代价刚好与箭头函数相反：

- 还是有可能错误地调用方法
- 一次只能定义一个函数而不是一整个类

### 基于 this 的类型守卫

用 `this is Type` 作为返回类型的注释，结合 if 语句的类型收缩可以将对象的类型收缩到指定的 `Type`，示例如下：

```ts
// TODO:
```


