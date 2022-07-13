// 输入一个正整数 n，输出 n 层 的等腰三角形。

// 例：n: 5
// 输出：
//     1
//    121
//   12321
//  1234321
// 123454321

/**
 * 输出三角形
 * @param {Number} n 三角形层数
 * @returns 
 */
function triangle(n) {
  if(n < 1 || n > 10) {
    return;
  }

  for(let i = 0; i < n; i++) {
    let space = Array.from(new Array(n - i - 1)).fill(" ").join("");
    let nums = Array.from(new Array(i + 1)).fill(0).map((val, index) => {
      return index + 1;
    });

    let str = space + nums.join("");
    nums.pop();
    str += nums.reverse().join("") + space;

    console.log(str);
  }
}

triangle(5);