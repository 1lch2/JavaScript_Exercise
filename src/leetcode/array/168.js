// 给你一个整数 columnNumber ，返回它在 Excel 表中相对应的列名称。

// 例如：

// A -> 1
// B -> 2
// C -> 3
// ...
// Z -> 26
// AA -> 27
// AB -> 28 
// ...

// 示例 1：
// 输入：columnNumber = 1
// 输出："A"

// 示例 2：
// 输入：columnNumber = 28
// 输出："AB"

// 示例 3：
// 输入：columnNumber = 701
// 输出："ZY"

// 示例 4：
// 输入：columnNumber = 2147483647
// 输出："FXSHRXW"

// 提示：
// 1 <= columnNumber <= 231 - 1

/**
 * @copyright https://leetcode-cn.com/problems/excel-sheet-column-title/solution/
 *            jin-zhi-zhuan-huan-de-bian-chong-by-qyun-t5e5/
 * @param {number} columnNumber
 * @return {string}
 */
var convertToTitle = function(columnNumber) {
  let res = "";
  while(columnNumber !== 0) {
    // 26进制的数字为 0~25，此处A到Z对应1~26，需要减去 1 来符合映射条件
    columnNumber--;
    let residue = columnNumber % 26;

    // Unicode 按序存储，找到和 A 的偏移即可构造对应字母
    // 计算结果为从低到高位的基数
    res = String.fromCharCode("A".charCodeAt() + residue) + res;

    columnNumber = Math.floor(columnNumber / 26);
  }

  return res;
};

(function(){
  console.log(convertToTitle("2147483647"));
})();