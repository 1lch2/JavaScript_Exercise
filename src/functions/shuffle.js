/**
 * 在给定的左开右闭区间范围内随机获取一个整数
 * 
 * @param {Number} min 范围区间左端点
 * @param {Number} max 范围区间右端点
 * @returns {Number} 区间内的一个随机整数
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Fisher–Yates 洗牌算法
 * @param {Number[]} array 待洗牌的序列
 */
const shuffle = (array) => {
  let range = array.length;
  let randomIndex;

  while (range > 1) {
    randomIndex = getRandomInt(0, range);
    if (randomIndex == range - 1) {
      continue;
    }

    [array[randomIndex], array[range - 1]] = [array[range - 1], array[randomIndex]];
    range--;
  }
};

(function(){
  let testArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  shuffle(testArr);
  console.log(testArr);
})();