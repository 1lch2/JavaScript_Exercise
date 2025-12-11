/**
 * 两数组求交集
 */
export const intersection = (arr1: any[], arr2: any[]): any[] => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // 使用数组的filter方法筛选共同元素
  return [...set1].filter((item) => set2.has(item));
};

console.log(intersection([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]));

export const intersectionMap = (arr1: any[], arr2: any[]) => {
  const map = new Map();
  const result: any[] = [];

  // 记录第一个数组的元素
  arr1.forEach((item: any) => map.set(item, true));

  // 检查第二个数组
  arr2.forEach((item: any) => {
    if (map.has(item) && !result.includes(item)) {
      result.push(item);
    }
  });

  return result;
};
