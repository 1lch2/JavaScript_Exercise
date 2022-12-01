// 给你一个整数 n ，按字典序返回范围 [1, n] 内所有整数。

// 你必须设计一个时间复杂度为 O(n) 且使用 O(1) 额外空间的算法。

// 示例 1：
// 输入：n = 13
// 输出：[1,10,11,12,13,2,3,4,5,6,7,8,9]

// 示例 2：
// 输入：n = 2
// 输出：[1,2]

// 提示：
// 1 <= n <= 5 * 10^4

/**
 * @param {number} n
 * @return {number[]}
 */
var lexicalOrder = function(n) {
  let res = [];

  const dfs = (num) => {
    if(num > n) {
      return;
    }

    // 10 叉树先序遍历
    res.push(num);
    // 下一层增加一位数
    for(let i = 10 * num; i < 10 * num + 10; i++) {
      dfs(i);
    }
  };

  // 遍历9个相似的10叉树
  for(let i = 1; i < 10; i++) {
    dfs(i);
  }
  return res;
};

(function(){
  console.log(lexicalOrder(23));
})();