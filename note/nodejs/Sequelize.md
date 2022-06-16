# Node.js ORM 库 - Sequelize
数据库名：sample，数据表名：persons。数据表内容如下：
```
+--------+------+----------+------+
| id     | name | city     | age  |
+--------+------+----------+------+
|      0 | A    | Beijing  |   24 |
|      1 | B    | Shanghai |   25 |
|      2 | C    | Nanjing  |   20 |
|      3 | D    | Beijing  |   30 |
|      4 | E    | Shanghai |   10 |
|      5 | F    | Beijing  |   29 |
|      6 | G    | Nanjing  |   40 |
| 114514 | H    | Beijing  |   24 |
+--------+------+----------+------+
```

## 连接数据库
```js
const { Sequelize, DataTypes } = require('sequelize');

const config = {
  database: "sample", // 使用哪个数据库
  username: "root", // 用户名
  password: "pwd123456", // 密码
  host: "localhost", // 主机名
  port: 3306 // 端口号
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  }
});
```

## 创建DAO
```js
const Person = sequelize.define("persons", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true // 设置主键
  },
  name: DataTypes.STRING,
  city: DataTypes.STRING,
  age: DataTypes.INTEGER
}, { timestamps: false }); 
// timestamps 防止MySQL自动插入时间戳
```

定义DAO属性名时候可以指定变量名，以及数据是否可为空，如下所示
```js
const Person = sequelize.define("persons", {
  uid: {
    fieldName: "id",
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
```

## 查询
条件查询
```sql
SELECT id, name as n FROM persons 
WHERE city="Beijing"
ORDER BY age ASC
LIMIT 3 OFFSET 1
```

```js
const persons = await Person.findAll({
    attributes: ["id", ["name", "n"]],
    where: {
        city: "Beijing"
    },
    order: [["age", "ASC"]]
    limit: 3,
    offset: 1
});
```

分组查询
```sql
SELECT city, COUNT(*) total FROM persons GROUP BY city
ORDER BY total DESC
```

```js
const person = await Person.findAll({
    attributes: [
      "city",
      [sequelize.fn("count", sequelize.col("*")), "total"]
    ],
    order: [[sequelize.literal("total"), "DESC"]],
    group: ["city"]
  });
```

TODO

## 插入
```sql
INSERT INTO persons
VALUES (20, "I", "Nanjing", 90);
```

```js
let res = await Person.create({
  id: 20,
  name: "I",
  city: "Nanjing",
  age: 90
});

// 原样返回插入的数据
```

## 更新
```sql
UPDATE persons
SET id=7, age=24
WHERE id=114514
```

```js
let res = await Person.update(
    {
        id: 7,
        age: 24
    },
    {
        where: {
        id: 114514
        }
    }
);
// 若更新成功则返回 "[1]"，否则返回 "[0]"
// 转为 boolean 结果
let result = JSON.parse(res)[0] == 0;
```

## 插入或更新
```sql
INSERT INTO persons (id, name, city, age)
VALUES (1, "AA", "Beijing", 42) 
ON DUPLICATE KEY
UPDATE name="AA", city="Beijing", age=42
```

```js
let res = await Person.upsert({
    id: 1,
    name: "AA",
    city: "Beijing",
    age: 42
});
```

## 删除
TODO:
