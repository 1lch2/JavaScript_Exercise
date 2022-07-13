# JS 模块
## CommonJS
### 概述
CommonJS规范特点如下：
- 每一个 js 文件都是一个单独的模块，可以称之为 module
- 该模块中，包含 CommonJS 规范的核心变量: exports、module.exports、require；
- exports 和 module.exports 可以负责对模块中的内容进行导出；
- require 函数可以导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；

### module
在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

每个模块内部，都有一个module对象，代表当前模块。它有以下属性。
- module.id 模块的识别符，通常是带有绝对路径的模块文件名。
- module.filename 模块的文件名，带有绝对路径。
- module.loaded 返回一个布尔值，表示模块是否已经完成加载。
- module.parent 返回一个对象，表示调用该模块的模块。
- module.children 返回一个数组，表示该模块要用到的其他模块。
- module.exports 表示模块对外输出的值。

### module.exports 和 exports变量
CommonJS规范规定，每个模块内部， `module` 变量代表当前模块。这个变量是一个对象，它的 `exports `属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。

使用示例如下：
```js
// logger.js
const logger = function(req) {
  console.log("Request URL: ", req.url);
}

// app.js
const logger = require("./logger");
logger({ url: "localhost:8080" });

// Request URL: localhost:8080
```

为了方便，Node为每个模块提供一个 `exports` 变量，指向 `module.exports` 。这等同在每个模块头部，有一行这样的命令。
```js
var exports = module.exports;
```

这样对外输出模块接口时候，可以直接向 `exports` 这个变量添加方法和属性。
```js
exports.hi = function() {
    console.log("hi");
}

// 等同于
module.exports.hi = function() {
    console.log("hi");
}
```

> **注意**：不能直接对 `exports` 变量赋值，这样会导致 `exports` 不再指向 `module.exports`

> 若同时使用了 `module.exports` 和 `exports`，则靠后的会生效。如果直接对 `exports` 赋值，则 exports 语句会失效，输出为 module.exports 导出的内容

> 如果一个模块的对外接口，就是一个单一的值，不能使用exports输出，只能使用module.exports输出。


### require
require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。如果没有发现指定模块，会报错。

require命令用于加载文件，后缀名默认为.js。下面两种方式等价
```js
var foo = require('foo');
//  等同于
var foo = require('foo.js');
```

根据参数的不同格式，require命令去不同路径寻找模块文件。
- 如果参数字符串以 `"/"` 开头，则表示加载的是一个位于绝对路径的模块文件。比如，`require('/home/marco/foo.js')` 将加载`/home/marco/foo.js`。
- 如果参数字符串以 `"./"` 开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，`require('./circle')`将加载当前脚本同一目录的`circle.js`。
- 如果参数字符串**不以** `"./"` 或 `"/"` 开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级`node_modules`目录的已安装模块（全局安装或局部安装）。

CommonJS 的模块就是对象，输入时必须查找对象属性。以下方加载 fs 模块为例。
```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。

若 module.exports 导出了多个方法或对象，但是并不需要全部导入，则必须将导入的部分对象用`{}`包裹起来，示例如下
```js
// ---- module.js ----
function a(){
  //...
}
function b() {
  //...
}
module.exports = { a, b }

// ---- app.js ----
const { a } = require("./moduls")
a();
```

## ES6
ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```
上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。

### 严格模式
ES6 模块默认采用严格模式，严格模式的限制参考[严格模式](./Strict_Mode.md)

除此之外，ES6 模块之中，顶层的this指向undefined，即不应该在顶层代码使用this

### export
**注意区别于CommonJS规范的`exports`，不是一回事**

export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。同CommonJS规范一样，一个ES6模块就是一个文件，文件内部变量和方法外部无法访问，只能通过 export 关键字输出变量。

```js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 或者使用另一种写法
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export { firstName, lastName, year };
```

export 也可以输出函数或者类，用法如下。
```js
export function hi() {
    console.log("hi");
}

// 或者
function hi() {
    console.log("hi");
}
export { hi };
// 也可以使用 as 来指定输出的名字
export { hi as hello};

// 下方写法会报错
export hi;
```

export 可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，import命令也是如此。

### import
import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。

import 也可以使用 as 来重命名导入的模块变量，用法同 export。
```js
import { hi } from "./greeting.js";

hi();
```

import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径。如果不带有路径，只是一个模块名，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。
```js
import { myMethod } from 'util';
```
上面代码中，util是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块。

import 中可以使用 `*` 来整体加载模块，而不用逐一加载每个变量和函数。
```js
// greeting.js
export function hi() {
}

export function hello() {
}

// main.js
import * as greeting from "./greeting";

greeting.hi();
greeting.hello();
```

### export default
export default命令可以为模块指定默认输出。当导入模块时，可以为匿名变量或函数指定任意名字，示例如下。

```js
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

export default 也可以用在非匿名函数上。
```js
export default function foo() {
  console.log('foo');
}

// 以下代码效果相同
function foo() {
  console.log('foo');
}
export default foo;
```

和默认方式对比如下：
```js
// export 输出，import { name } 导入
export function crc32() {
  // ...
};

import {crc32} from 'crc32';

//-----------------------------------

// export default 输出，import 重命名导入
export default function crc32() {
  // ...
}

import crc32 from 'crc32';
```

export default 只能使用一次，本质上是输出一个叫做 default 的变量或方法，然后系统允许你为它取任意名字。


## CommonJS 模块与 ES6 模块的差异
主要差异有三点：
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

### Node.js
Node.js 要求 ES6 模块采用 `.mjs` 后缀文件名。也就是说，只要脚本文件里面使用 import 或者 export 命令，那么就必须采用.mjs后缀名。

Node.js 遇到.mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"。

