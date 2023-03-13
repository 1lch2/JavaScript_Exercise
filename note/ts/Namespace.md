# TS 命名空间
命名空间可以帮助我们避免命名冲突，将相关的代码组织在一起。在命名空间内部，可以定义任意变量，但仅能在命名空间下可见。如果要使命名空间内的变量全局可见，需要使用 export 关键字导出。

示例如下：
```ts
namespace Utils {
  export interface IPerson {
    name: string;
    age: number;
  }

  const data = {};
}
```
命名空间内部没有导出的变量仍然保持对外不可见，类似 Java 类中的 private 和 protected 关键字的效果。

## 多文件命名空间
一个命名空间的实现可以跨多个不同的文件，为了让编译器知道引用关系，需要使用引用标签来告诉编译器引用的文件，示例如下：


```ts
// util1.ts

namespace Util {
    export interface Tool1 {
        ...
    }
}

// util2.ts
// 下面这行三个斜杠的就是引用标签

/// <reference path="util1.ts">
namespace Util {
    export interface Tool2 {
        ...
    }
}
```

编译时使用 `--outFile` 选项来将多个文件编译成一个 JS 文件。

## 别名
```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```

