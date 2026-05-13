# Redis - 基础
## 概念
Redis，英文全称是Remote Dictionary Server（远程字典服务），是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

与MySQL数据库不同的是，Redis的数据是存在内存中的。它的读写速度非常快，每秒可以处理超过10万次读写操作，因此redis被广泛应用于缓存。

另外，Redis也经常用来做分布式锁。除此之外，Redis支持事务、持久化、LUA 脚本、LRU 驱动事件、多种集群方案。

## 数据类型
五种基本数据类型:
- String（字符串）
- Hash（哈希）
- List（列表）
- Set（集合）
- zset（有序集合）

三种特殊的数据结构类型：
- Geospatial
- Hyperloglog
- Bitmap

### String
String 是最基本的 key-value 结构，key 是唯一标识，value 是具体的值，value其实不仅是字符串，也可以是数字（整数或浮点数）。

二进制安全，可以存储图片或者序列化的对象，值最大存储为 512M

#### 基本使用
普通字符串操作
```
# 设置 key-value 类型的值
> SET name lin
OK
# 根据 key 获得对应的 value
> GET name
"lin"
# 判断某个 key 是否存在
> EXISTS name
(integer) 1
# 返回 key 所储存的字符串值的长度
> STRLEN name
(integer) 3
# 删除某个 key 对应的值
> DEL name
(integer) 1
```

计数器
```
# 设置 key-value 类型的值
> SET number 0
OK
# 将 key 中储存的数字值增一
> INCR number
(integer) 1
# 将key中存储的数字值加 10
> INCRBY number 10
(integer) 11
# 将 key 中储存的数字值减一
> DECR number
(integer) 10
# 将key中存储的数字值键 10
> DECRBY number 10
(integer) 0
```

#### 内部实现
int 和 sds（simple dynamic string）

SDS 的优势：
- SDS 不仅可以保存文本数据，还可以保存二进制数据。
- SDS 获取字符串长度的时间复杂度是 O(1)。
- Redis 的 SDS API 是安全的，拼接字符串不会造成缓冲区溢出。
    - SDS 在拼接字符串之前会检查 SDS 空间是否满足要求，如果空间不够会自动扩容

#### 应用场景
缓存对象：
- 直接缓存整个对象的 JSON，命令例子： `SET user:1 '{"name":"xiaolin", "age":18}'`。
- 采用将 key 进行分离为 `user : ID : 属性`，采用 MSET 存储，用 MGET 获取各属性值，命令例子： `MSET user:1:name xiaolin user:1:age 18 user:2:name xiaomei user:2:age 20`。

常规计数：

因为 Redis 处理命令是单线程，所以执行命令的过程是原子的。因此 String 数据类型适合计数场景，比如计算访问次数、点赞、转发、库存数量等等。

分布式锁：

SET 命令有个 NX 参数可以实现「key不存在才插入」，可以用它来实现分布式锁：
- 如果 key 不存在，则显示插入成功，可以用来表示加锁成功；
- 如果 key 存在，则会显示插入失败，可以用来表示加锁失败。

### Hash
Hash 是一个键值对（key - value）集合，其中 value 的形式： `value=[{field1，value1}，...{fieldN，valueN}]`。

#### 应用场景
缓存对象：

购物车：

TODO: