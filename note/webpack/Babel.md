# Babel 原理
## 编译过程
1. parsing ：将原始代码解析为抽象语法树（ast）
   1. 词法分析，也就是将原始代码拆分成一个个的 token（用于描述最小独立语法单元的对象）
   2. 语法分析，递归遍历 tokens 数组，构建 ast
2. transforming ：变换第一步的 ast，得到新的 ast
3. generating（也可称为 printing）： 遍历新的 ast，生成目标代码

