// 字典 wordList 中从单词 beginWord 和 endWord 的 转换序列 是一个按下述规格形成的序列 beginWord -> s1 -> s2 -> ... -> sk：

// 每一对相邻的单词只差一个字母。
// 对于 1 <= i <= k 时，每个 si 都在 wordList 中。
// 注意， beginWord 不需要在 wordList 中。
// s_k == endWord
// 给你两个单词 beginWord 和 endWord 和一个字典 wordList ，
// 返回 从 beginWord 到 endWord 的 最短转换序列 中的 单词数目 。
// 如果不存在这样的转换序列，返回 0 。

// 示例 1：
// 输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
// 输出：5
// 解释：一个最短转换序列是 "hit" -> "hot" -> "dot" -> "dog" -> "cog", 返回它的长度 5。

// 示例 2：
// 输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
// 输出：0
// 解释：endWord "cog" 不在字典中，所以无法进行转换。

// 提示：
// 1 <= beginWord.length <= 10
// endWord.length == beginWord.length
// 1 <= wordList.length <= 5000
// wordList[i].length == beginWord.length
// beginWord、endWord 和 wordList[i] 由小写英文字母组成
// beginWord != endWord
// wordList 中的所有字符串 互不相同

/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
  // 将单词视为图的顶点，相差一个字母的单词之间有边相连
  // 问题转化为寻找无向图中两个顶点之间的的最短路径

  let wordSet = new Set(wordList);

  // endWord 不在列表中
  if (!wordSet.has(endWord) || wordSet.size === 0) {
    return 0;
  }

  // 去除起始单词避免误判
  wordSet.delete(beginWord);

  // BFS队列
  let queue = [beginWord];
  // 记录已经访问过的单词
  let visited = new Set([beginWord]);

  /**
   * @param {String} word 
   */
  const checkWordDiff = (word) => {
    const charCode = "a".charCodeAt();
    // 对每个位置的字符轮流替换，从a遍历到z
    for (let i = 0; i < word.length; i++) {
      let charArr = word.split("");

      for (let j = 0; j < 26; j++) {
        let replaced = String.fromCharCode(charCode + j);
        charArr[i] = replaced;
        let newWord = charArr.join("");
        // 判断替换后的新单词是否在单词列表中
        if (wordSet.has(newWord)) {
          if (newWord === endWord) {
            return true;
          }

          // 当前新单词未访问过时则将单词加入遍历队列并标记
          if (!visited.has(newWord)) {
            queue.push(newWord);
            visited.add(newWord);
          }
        }
      }
    }
    return false;
  };

  // 包含起点
  let steps = 1;
  while (queue.length > 0) {
    // 记录当前队列长度，遍历每个元素
    let currentSize = queue.length;
    for (let i = 0; i < currentSize; i++) {
      let currentWord = queue.shift();
      // 若当前单词只与目标差一个字符，则返回结果
      if (checkWordDiff(currentWord)) {
        return steps + 1;
      }
    }
    steps++;
  }

  return 0;
};
