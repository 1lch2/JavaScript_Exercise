/**
 * 二分查找法求平方根
 * 
 * @param {number} x 待开平方数
 * @param {number} k 精确位数，科学记数法表示
 * @return {number}
 */
const mySqrt = function(x, k) {
  if(k === undefined) {
    k = 1e-3;
  }

  const roughEqual = (first, second) => {
    return Math.abs(first - second) <= k;
  };

  let low = 0;
  let high = x;
  let mid;
  let sq;
  while (low <= high) {
    mid = (low + high) / 2;
    sq = mid * mid;
    if (roughEqual(sq, x)) {
      return mid;
    } else if (sq < x) {
      low = mid;
    } else {
      high = mid;
    }
  }
};

(function() {
  let input = 10;
  let standardRes = Math.sqrt(input);
  let myRes = mySqrt(input);
  console.log(`>>> Square root ${input} = ` + standardRes);
  console.log(">>> My sqrt = " + myRes);
  console.log(">>> Delta: " + Math.abs(myRes - standardRes));
})();