/**
 * 
 * @param {Promise<any>[]} promises 
 * @param {number} limit 
 * @return {Promise<any[]>}
 */
function parallelPromiseLimit(promises, limit) {
  return new Promise((resolve, reject) => {
    if (promises.length <= limit) {
      return Promise.all(promises);
    }

    let result = [];
    let start = 0;

    /**
     * @return {Promise<any>[]}
     */
    const getPromises = () => {
      let res = promises.slice(start, start + limit);
      start += limit;
      return res;
    };

    function loop() {
      let currentPromises = getPromises();
      if(currentPromises.length === 0) {
        resolve(result);
        return;
      }
  
      Promise.all(currentPromises)
        .then(data => {
  
          console.log(data);
  
          result = result.concat(data);
          loop();
        }).catch(err => {
          reject(err);
        });
    }
    loop();
  });
}

let input = new Array(10).fill(null).map((val, index) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(index);
    }, 1000);

    // TODO: no consecutive wating
  });
});

parallelPromiseLimit(input, 3).then(res => console.log("res", res));
