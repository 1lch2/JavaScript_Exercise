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


## 事务
### 非托管事务
提交和回滚事务应该手动完成(通过调用适当的 Sequelize 方法)

```js
// 首先,我们开始一个事务并将其保存到变量中
const t = await sequelize.transaction();

try {
  // 然后,我们进行一些调用以将此事务作为参数传递:
  const user = await User.create({
    firstName: '张',
    lastName: '三'
  }, { transaction: t });

  await user.addSibling({
    firstName: '李',
    lastName: '四'
  }, { transaction: t });

  // 如果执行到此行,且没有引发任何错误.
  // 我们提交事务.
  await t.commit();
} catch (error) {
  // 如果执行到达此行,则抛出错误.
  // 我们回滚事务.
  await t.rollback();
}
```

### 托管事务
如果抛出任何错误, Sequelize 将会自动回滚事务, 否则将提交事务

不需要直接调用 t.commit() 和 t.rollback()
```js
try {
  const result = await sequelize.transaction(async (t) => {
    const user = await User.create({
        firstName: '张',
        lastName: '三'
    }, { transaction: t });

    await user.setShooter({
        firstName: '李',
        lastName: '四'
    }, { transaction: t });

    return user;
  });

  // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
  // `result` 就是从事务回调中返回的结果(在这种情况下为 `user`)
} catch (error) {
  // 如果执行到此,则发生错误.
  // 该事务已由 Sequelize 自动回滚！
}
```