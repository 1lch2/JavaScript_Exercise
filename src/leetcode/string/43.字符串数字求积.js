// 给定两个以字符串形式表示的非负整数 num1 和 num2，
// 返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

// 注意：不能使用任何内置的 BigInteger 库或直接将输入转换为整数。

// 示例 1:
// 输入: num1 = "2", num2 = "3"
// 输出: "6"

// 示例 2:
// 输入: num1 = "123", num2 = "456"
// 输出: "56088"

// 提示：
// 1 <= num1.length, num2.length <= 200
// num1 和 num2 只能由数字组成。
// num1 和 num2 都不包含任何前导零，除了数字0本身。

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
  if(Number(num1) === 0 || Number(num2) === 0) {
    return "0";
  }

  /**
   * 两个字符串数字相加
   * @param {string} num1 
   * @param {string} num2 
   * @returns {string} 字符串结果
   */
  const add = (num1, num2) => {
    // 高位补零保证位数一致
    if (num1.length !== num2.length) {
      let delta = num1.length - num2.length;
      if (delta < 0) {
        [num1, num2] = [num2, num1];
        delta = -delta;
      }
      for (let i = 0; i < delta; i++) {
        num2 = "0" + num2;
      }
    }

    let carry = 0;
    let temp = "";
    for (let i = num1.length - 1; i >= 0; i--) {
      let addResult = Number(num1[i]) + Number(num2[i]) + carry;
      let currentDigit = addResult % 10;
      carry = Math.floor(addResult / 10);
      temp = currentDigit + temp;
    }

    if (carry !== 0) {
      temp = carry + temp;
    }

    return temp;
  };

  // 保证 num1 长度比 num2 小
  if (num1.length > num2.length) {
    [num1, num2] = [num2, num1];
  }

  // 进位
  let carry = 0;
  // 存储每一轮的结果
  let result = "";
  // 每次乘法结果的起始位，每一轮乘法后多一位零
  let base = "";

  // 注意遍历顺序从后往前
  for (let i = num1.length - 1; i >= 0; i--) {
    // 当前轮次的乘法结果
    let temp = base;
    for (let j = num2.length - 1; j >= 0; j--) {
      // 当前乘法加进位结果
      let multiRes = Number(num1[i]) * Number(num2[j]) + carry;
      // 当前位应填入的数字
      let currentDigit = multiRes % 10;
      // 计算给下一位的进位
      carry = Math.floor(multiRes / 10);
      // 放入当前轮次的结果前方
      temp = currentDigit + temp;
    }

    // 处理最后剩余的进位
    if (carry !== 0) {
      temp = carry + temp;
      carry = 0;
    }
    // 计算完一轮后需要进一位，空位补上 0 
    base += "0";

    if(result !== "") {
      result = add(result, temp);
    } else {
      result = temp;
    }
  }

  return result;
};

let input = ["456", "123"];
console.log(multiply(...input));
