// 有一个整数数组 parcel[] 代表每个中心拥有的包裹数量。
// 每天每个中心都会发送相同数量的包裹。

// 求将所有包裹发送完毕需要的最少天数。

// 例1：
// 输入：parcel = [4, 2, 3, 2];
// 输出：3
// 过程：
// 第一天运送 2 个：[2, 0, 1, 0]
// 第二天运送 1 个：[1, 0, 0, 0]
// 第三天运送 1 个：[0, 0, 0, 1]

// 0 <= parcel.length <= 10^5

/**
 * 
 * @param {Number[]} parcel 
 * @returns {Number}
 */
function leastShippingDays(parcel) {
  if(parcel.length <= 1) {
    return parcel.length;
  }

  // O(nlogn) 复杂度排序，之后可以避免每次用 O(n) 复杂度求最大最小值
  parcel.sort((a, b) => a - b);

  let minUnit = 0;
  for(let i = 0; i < parcel.length; i++) {
    if(parcel[i] !== 0) {
      minUnit = parcel[i];
      break;
    }
  }

  let days = 0;
  while(parcel[parcel.length - 1] !== 0) {
    let unitFlag = true;
    for(let i = 0; i < parcel.length; i++) {
      if(parcel[i] === 0) {
        continue;
      }
      parcel[i] -= minUnit;

      // 找到第一个不为 0 的元素
      if(unitFlag && parcel[i] !== 0) {
        minUnit = parcel[i];
        unitFlag = false;
      }
    }
    days++;
  }

  return days;
}