// 给你一个字符串数组 words 。
// words 中每个元素都是一个包含 两个 小写英文字母的单词。

// 请你从 words 中选择一些元素并按 任意顺序 连接它们，
// 并得到一个 尽可能长的回文串 。
// 每个元素 至多 只能使用一次。

// 请你返回你能得到的最长回文串的 长度 。
// 如果没办法得到任何一个回文串，请你返回 0 。

// 回文串 指的是从前往后和从后往前读一样的字符串。

// 示例 1：
// 输入：words = ["lc","cl","gg"]
// 输出：6
// 解释：一个最长的回文串为 "lc" + "gg" + "cl" = "lcggcl" ，长度为 6 。
// "clgglc" 是另一个可以得到的最长回文串。

// 示例 2：
// 输入：words = ["ab","ty","yt","lc","cl","ab"]
// 输出：8
// 解释：最长回文串是 "ty" + "lc" + "cl" + "yt" = "tylcclyt" ，长度为 8 。
// "lcyttycl" 是另一个可以得到的最长回文串。

// 示例 3：
// 输入：words = ["cc","ll","xx"]
// 输出：2
// 解释：最长回文串是 "cc" ，长度为 2 。
// "ll" 是另一个可以得到的最长回文串。"xx" 也是。

// 提示：
// 1 <= words.length <= 105
// words[i].length == 2
// words[i] 仅包含小写英文字母。

/**
 * @param {string[]} words
 * @return {number}
 */
var longestPalindrome = function(words) {
  // 结构：非对称 - 对称重复 - 单个对称 - 对称重复 - 非对称
  // ab - ab - bc - dd - dd - ee - dd - dd - cb - ba - ba

  // 分别存储对称的词和非对称的词
  let symmetric = new Map();
  let normal = new Map();

  for(let word of words) {
    if(word[0] === word[1]) {
      save(symmetric, word);
    } else {
      save(normal, word);
    }
  }

  let result = 0;
  // 处理非对称词
  for(let word of normal.keys()) {
    let reverse = word[1] + word[0];
    // 直接找翻转后的词是否存在
    let count = normal.get(word);
    let _count = normal.get(reverse);
    if(_count) {
      // 取最多能成对的数量
      let minPair = Math.min(count, _count);
      result += 4 * minPair;
      // 修改数量避免重复计算
      normal.set(word, count - minPair);
      normal.set(reverse, _count - minPair);
    }
  }
  
  // 处理对称词
  let singleFlag = false;
  for(let word of symmetric.keys()) {
    // 偶数对的对称词作为外围
    // 奇数对且超过2对的取偶数部分

    // count 标记使用后的余数
    let count = symmetric.get(word);
    if(count >= 2) {
      if(count % 2 === 0) {
        result += count * 2;
        count = 0;
      } else {
        // 向下取最大偶数: 2 * (num >> 1)
        result += (count >> 1) * 2 * 2;
        count = 1;
      }
    }
    if(count === 1) {
      singleFlag = true;
    }
  }

  // 只从单个对称词中选一个作为中心
  result = singleFlag ? result + 2 : result;

  return result;
};

// dd dd aa bb cc cc cc bb aa dd dd

/**
 * add or increse
 * @param {Map<string, number>} map 
 * @param {string} key 
 */
const save = (map, key) => {
  if(!map.has(key)) {
    map.set(key, 1);
  } else {
    map.set(key, map.get(key) + 1);
  }
};

let input = ["em","pe","mp","ee","pp","me","ep","em","em","me"];
console.log(longestPalindrome(input));
