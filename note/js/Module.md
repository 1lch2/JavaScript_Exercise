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


## ES6
TODO
