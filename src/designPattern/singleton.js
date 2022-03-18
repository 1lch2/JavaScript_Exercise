/**
 * 单例模式
 * @param {Object} param 
 */
function Singleton(param) {
  this.param = param;
  this.instance = null;
}

Singleton.prototype.getInstance = function(param) {
  if(!this.instance) {
    this.instance = new Singleton(param);
  }
  return this.instance;
};