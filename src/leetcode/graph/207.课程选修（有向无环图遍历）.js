// 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

// 在选修某些课程之前需要一些先修课程。 
// 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，
// 表示如果要学习课程 ai 则 必须 先学习课程  bi 。

// 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
// 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。

// 示例 1：
// 输入：numCourses = 2, prerequisites = [[1,0]]
// 输出：true
// 解释：总共有 2 门课程。学习课程 1 之前，你需要完成课程 0 。这是可能的。

// 示例 2：
// 输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
// 输出：false
// 解释：总共有 2 门课程。学习课程 1 之前，你需要先完成课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。

// 提示：
// 1 <= numCourses <= 105
// 0 <= prerequisites.length <= 5000
// prerequisites[i].length == 2
// 0 <= ai, bi < numCourses
// prerequisites[i] 中的所有课程对 互不相同

/**
 * @copyright https://leetcode-cn.com/problems/course-schedule/solution/
 *            course-schedule-tuo-bu-pai-xu-bfsdfsliang-chong-fa/
 * 
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
  // 统计每个节点的入度，下标为节点编号，值为入度的数量
  let inDegree = new Array(numCourses).fill(0);
  // 邻接矩阵，[i] 存储从下标 i 到 对应值的边
  let adjacent = {};

  for(let i = 0; i < prerequisites.length; i++) {
    let edge = prerequisites[i];
    // 对应节点的入度
    inDegree[edge[0]]++;

    if(adjacent[edge[1]] !== undefined) {
      adjacent[edge[1]].push(edge[0]);
    } else {
      adjacent[edge[1]] = [edge[0]];
    }
  }

  // 统计入度为 0 的节点，值为节点编号
  let queue = [];
  for(let i = 0; i < inDegree.length; i++) {
    if(inDegree[i] === 0) {
      queue.push(i);
    }
  }

  // 拓扑排序，不断删除每一个没有入度的节点
  while(queue.length !== 0) {
    // 删除一个没有入度的节点后，将计数减一
    let currentNode = queue.shift();
    numCourses--;

    // 可能存在无邻接的节点，需要多一步判断
    if(adjacent[currentNode] !== undefined) {
      // 遍历被删除节点的邻接数组，修改入度表
      for(let node of adjacent[currentNode]) {
        inDegree[node]--;
        // 若出现 0 入度的节点则更新入度表
        if(inDegree[node] === 0) {
          queue.push(node);
        }
      }
    }
  }

  // 拓扑排序完成后，如果有剩余的节点，则有向图中存在环
  return numCourses === 0;
};

(function(){
  console.log(canFinish(2, [[1,0]]));
  console.log(canFinish(2, [[1,0], [0,1]]));
})();