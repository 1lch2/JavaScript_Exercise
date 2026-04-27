// 给你一个长度固定的整数数组 arr ，请你将该数组中出现的每个零都复写一遍，并将其余的元素向右平移。

// 注意：请不要在超过该数组长度的位置写入元素。请对输入的数组 就地 进行上述修改，不要从函数返回任何东西。

// 示例 1：

// 输入：arr = [1,0,2,3,0,4,5,0]
// 输出：[1,0,0,2,3,0,0,4]
// 解释：调用函数后，输入的数组将被修改为：[1,0,0,2,3,0,0,4]
// 示例 2：

// 输入：arr = [1,2,3]
// 输出：[1,2,3]
// 解释：调用函数后，输入的数组将被修改为：[1,2,3]

// 提示：

// 1 <= arr.length <= 10^4
// 0 <= arr[i] <= 9

/**
 Do not return anything, modify arr in-place instead.
 */
function duplicateZeros(arr: number[]): void {
  const N = arr.length;
  if (N === 1) return;

  // 先找到最后一个位置
  let i = 0;
  let j = 0;
  while (j < N) {
    if (arr[i] === 0) {
      j++;
    }
    j++;
    i++;
  }

  // 循环停止时候会多走一步，这里往回减一
  i--;

  let k = N - 1;
  if (j > N) {
    // 此时start可能为 N 或者 N + 1
    // N + 1 说明最后一个元素是 0 ，而且重复的 0 会越界
    // 先写好最后一个 0
    arr[k] = 0;
    k--;
    i--;
  }

  // 从后往前填充
  for (; k >= 0; k--) {
    if (arr[i] === 0) {
      arr[k] = 0;
      arr[k - 1] = 0;
      k--;
    } else {
      arr[k] = arr[i];
    }
    i--;
  }
}

let input = [1, 0, 2, 3, 0, 4, 5, 0];
duplicateZeros(input);
console.log(input);

input = [0, 1, 7, 6, 0, 2, 0, 7];
duplicateZeros(input);
console.log(input);

input = [8, 4, 5, 0, 0, 0, 0, 7];
duplicateZeros(input);
console.log(input);
