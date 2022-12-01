// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。
// 请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

// 示例 1：
// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].

// 示例 2：
// 输入：intervals = [[1,4],[4,5]]
// 输出：[[1,5]]
// 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。

// 提示：
// 1 <= intervals.length <= 104
// intervals[i].length == 2
// 0 <= starti <= endi <= 104

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  // 按区间左端点降序排列
  let orderedInterval = intervals.sort((first, second) => {
    return first[0] - second[0];
  });

  let res = [orderedInterval[0]];
  let current = [];
  for (let i = 1; i < orderedInterval.length; i++) {
    let len = res.length;
    current = res[len - 1];

    // 当前区间存在重叠时则更新右边界
    if (current[1] >= orderedInterval[i][0]) {
      if (current[1] < orderedInterval[i][1]) {
        current[1] = orderedInterval[i][1];
      }

    } else {
      // 没有重叠则将不重叠的第一个加入结果
      res.push(orderedInterval[i]);
    }
  }

  return res;
};

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge_dualPointer = function(intervals) {
  if(intervals.length < 2) {
    return intervals;
  }

  // 按区间起始端点升序排列
  let orderedInterval = intervals.sort((first, second) => {
    return first[0] - second[0];
  });

  const LENGTH = orderedInterval.length;

  let i = 0; // 区间下标
  let right = orderedInterval[0][1]; // 当前连续区间的右端点
  let temp = orderedInterval[0]; // 临时数组
  let res = [];
  while(i < LENGTH) {
    right = orderedInterval[i][1];
    temp = orderedInterval[i];

    // 若下一个区间左端点在当前连续区间内，则更新右端点位置
    while(i + 1 < LENGTH && orderedInterval[i + 1][0] <= right) {
      right = Math.max(orderedInterval[i + 1][1], right);
      i++;
    } 
    temp[1] = right;
    res.push(temp.slice(0));
    i++;
  }

  return res;
};

(function() {
  // console.log(merge([
  //   [1, 4],
  //   [4, 5]
  // ]));
  // console.log(merge([
  //   [1, 3],
  //   [2, 6],
  //   [8, 10],
  //   [15, 18]
  // ]));
  // console.log(merge([
  //   [1, 2]
  // ]));

  console.log(merge_dualPointer([
    [1, 4],
    [5, 6]
  ]));
  console.log(merge_dualPointer([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18]
  ]));
  console.log(merge_dualPointer([
    [1, 2]
  ]));
})();