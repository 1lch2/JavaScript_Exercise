// 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

// 示例 1：
// 输入：s = "We are happy."
// 输出："We%20are%20happy."

// 限制：
// 0 <= s 的长度 <= 10000

/**
 * @param {string} s
 * @return {string}
 */
var replaceSpace = function(s) {
  // 比split join 更快
  const LEN = s.length;
  let charList = s.split("");
  for(let i = 0; i < LEN; i++) {
    if(charList[i] === " ") {
      charList[i] = "%20";
    }
  }
  return charList.join("");
};

(function(){
  console.log(replaceSpace("hello world"));
})();