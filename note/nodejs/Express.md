# Express
## 入门

TODO：

## 与 Koa 的区别
- express内置了许多中间件可供使用，而koa没有。
- express包含路由，视图渲染等特性，而koa只有http模块。
- express的中间件模型为线型，而koa的中间件模型为U型，也可称为洋葱模型构造中间件。
- express通过回调实现异步函数，在多个回调、多个中间件中写起来容易逻辑混乱。

## 样例
使用 sequelize 访问 MySQL 并返回查询结果。数据表参考 [Sequelize](./Sequelize.md)

```js
const config = require("./config");
const { Sequelize, DataTypes } = require('sequelize');
const express = require("express");

const app = express();

const server = app.listen(8080, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(server.address());
  console.log(`Access location: ${host}:${port}`);
});

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: "mysql",
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  }
});

const Person = sequelize.define("persons", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  city: DataTypes.STRING,
  age: DataTypes.INTEGER
}, { timestamps: false });

async function getDataBeijing() {
  let person = await Person.findAll({
    attributes: [
      "city",
      [sequelize.fn("count", sequelize.col("*")), "total"]
    ],
    order: [[sequelize.literal("total"), "DESC"]],
    group: ["city"]
  });

  return JSON.stringify(person);
}

app.get("/get", function(req, res) {
  getDataBeijing().then(r => res.send(r));
});
```
