# Prisma

> Prisma 是下一代 TypeScript ORM，核心优势是**类型安全**和**Schema-first 设计**。面试考察重点：Schema 基础、关联关系、事务、N+1 问题、与其他 ORM 的对比。

## Prisma 是什么

Prisma 是一个用于 Node.js 和 TypeScript 的 ORM，包含三个核心组件：

| 组件 | 作用 |
|------|------|
| **Prisma Schema** | 声明式数据模型定义（`.prisma` 文件） |
| **Prisma Client** | 自动生成的类型安全查询客户端 |
| **Prisma Migrate** | 声明式数据库迁移系统 |

> **面试一句话**：Prisma 的核心思想是 **Schema-first**——先在 `.prisma` 文件中定义数据模型，然后自动生成类型安全的 Client 和数据库迁移，开发者不手写实体类或 SQL。

## Schema 基础

### 数据源配置

```prisma
datasource db {
  provider = "postgresql"  // 支持 postgresql, mysql, sqlite, sqlserver, mongodb
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 模型定义

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(true)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}

enum Role {
  USER
  ADMIN
}
```

**常用属性速查**：

| 属性 | 说明 | 示例 |
|------|------|------|
| `@id` | 主键 | `@id @default(autoincrement())` 或 `@id @default(uuid())` |
| `@unique` | 唯一约束 | `email String @unique` |
| `@relation` | 关联关系 | `@relation(fields: [authorId], references: [id])` |
| `@default` | 默认值 | `@default(true)` / `@default(now())` / `@default(uuid())` |
| `@map` / `@@map` | 字段/表名映射数据库列名 | `@map("created_at")` |
| `?` | 可选字段（nullable） | `name String?` |
| `[]` | 数组字段 | `tags String[]` |

## 关联关系

### 一对一

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?  // 一个用户可有零或一个 Profile
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique  // @unique 保证一对一
  user   User @relation(fields: [userId], references: [id])
}
```

### 一对多

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]  // 一个用户有多篇 Post
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

### 多对多

Prisma 支持两种多对多方式：**隐式**（自动创建中间表）和**显式**（手动定义中间表模型）。

```prisma
// 隐式多对多：Prisma 自动创建 _PostToCategory 中间表
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

// 显式多对多：手动定义中间表，可在中间表添加额外字段
model Post {
  id          Int           @id @default(autoincrement())
  categories  PostCategory[]
}

model Category {
  id    Int           @id @default(autoincrement())
  posts PostCategory[]
}

model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())  // 中间表可加额外字段
  post       Post     @relation(fields: [postId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])  // 复合主键
}
```

> **面试追问**：隐式多对多的局限是什么？不能在中间表添加额外字段（如 assignedAt），需要额外字段时必须用显式多对多。

## Prisma Client 常用查询

```typescript
const prisma = new PrismaClient();

// 创建
const user = await prisma.user.create({
  data: { email: 'alice@example.com', name: 'Alice' },
});

// 批量创建
await prisma.user.createMany({
  data: [
    { email: 'a@example.com', name: 'A' },
    { email: 'b@example.com', name: 'B' },
  ],
});

// 查询
const user = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
const users = await prisma.user.findMany({ where: { role: 'USER' } });
const first = await prisma.user.findFirst({ where: { name: 'Alice' } });

// 更新
await prisma.user.update({ where: { id: 1 }, data: { name: 'Bob' } });
await prisma.user.updateMany({ where: { role: 'USER' }, data: { profileViews: { increment: 1 } } });

// 删除
await prisma.user.delete({ where: { id: 1 } });
await prisma.user.deleteMany({ where: { role: 'USER' } });

// 关联查询（include / select）
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },  // 返回所有关联字段
});

// 精细选择（select 比 include 更可控）
const userSelect = await prisma.user.findUnique({
  where: { id: 1 },
  select: { name: true, posts: { select: { title: true } } },
});

// 过滤、排序、分页
const users = await prisma.user.findMany({
  where: { name: { contains: 'Ali' }, role: { in: ['USER', 'ADMIN'] } },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 20,  // offset 分页
});

// 原始 SQL（复杂查询的 fallback）
const result = await prisma.$queryRaw`SELECT * FROM "User" WHERE "name" LIKE ${searchTerm}`;
const count = await prisma.$executeRaw`UPDATE "User" SET "views" = "views" + 1`;
```

> **面试要点**：`include` 返回关联的所有字段，`select` 可以精确控制返回哪些字段（包括关联字段的子选择）。生产环境应优先用 `select` 减少数据传输。

## N+1 问题

N+1 是 ORM 的经典性能陷阱：先查询 N 条主记录，再对每条主记录单独查询关联数据，产生 N+1 次数据库请求。

```typescript
// ❌ N+1 问题：先查所有用户，再逐个查每个用户的文章
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// ✅ 正确做法：用 include 嵌套查询，一次请求获取所有数据
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true },
});

// ✅ 更优做法：用 select 精细控制
const usersWithPosts = await prisma.user.findMany({
  select: { id: true, name: true, posts: { select: { id: true, title: true } } },
});
```

> **面试答题要点**：Prisma 通过 `include`/`select` 嵌套查询天然解决了 N+1 问题，一次查询即可获取主记录和关联数据。但要注意 `include` 多层嵌套也可能产生复杂 JOIN，需根据实际性能监控决定。

## 事务

Prisma 提供两种事务 API：**Batch Transaction** 和 **Interactive Transaction**。

### Batch Transaction

```typescript
// 所有操作作为一个批次发送，操作之间无依赖关系
const [deleted, created] = await prisma.$transaction([
  prisma.post.deleteMany({ where: { authorId: 7 } }),
  prisma.user.delete({ where: { id: 7 } }),
]);
```

### Interactive Transaction

```typescript
// 回调函数方式，操作之间可依赖前一步结果
await prisma.$transaction(async (tx) => {
  // 1. 查余额
  const sender = await tx.user.findUnique({ where: { id: fromId } });
  if (!sender || sender.balance < amount) {
    throw new Error('余额不足');  // throw → 自动回滚
  }

  // 2. 扣款（依赖前一步的验证结果）
  await tx.user.update({
    where: { id: fromId },
    data: { balance: { decrement: amount } },
  });

  // 3. 收款
  await tx.user.update({
    where: { id: toId },
    data: { balance: { increment: amount } },
  });
}, {
  maxWait: 5000,   // 等待获取事务连接的最大时间
  timeout: 10000,  // 事务执行的最大时间
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,  // 隔离级别
});
```

### 两种事务对比

| 对比维度 | Batch Transaction | Interactive Transaction |
|----------|-------------------|------------------------|
| API 形式 | `$transaction([...])` | `$transaction(async (tx) => { ... })` |
| 能否使用前一步结果 | 不能 | 能 |
| 能否写条件逻辑 | 不能 | 能 |
| SQL 发送方式 | 一次性批量发送 | 逐条发送 |
| 性能 | 更优（网络往返少） | 较慢（多次网络往返） |
| 随离级别自定义 | 不支持 | 支持 |
| 回滚方式 | 任一操作失败自动回滚 | 失败自动 + throw 手动 |

> **面试关键点**：转账这类需要"先读后写"的场景必须用 Interactive Transaction；简单的批量删除/更新用 Batch Transaction 性能更好。Interactive Transaction 会独占一个数据库连接，大量并发长事务可能导致连接池耗尽。

## Prisma Migrate

```bash
# 开发环境：创建迁移 + 应用到数据库 + 生成 Client
prisma migrate dev --name init

# 生产环境：仅应用迁移（不创建新迁移）
prisma migrate deploy

# 重置数据库（删除所有数据 + 重新应用所有迁移 + seed）
prisma migrate reset

# 数据库填充（seed）
prisma db seed
```

> **面试追问**：`migrate dev` 和 `migrate deploy` 的区别？`dev` 会创建新迁移文件并应用到本地数据库，适合开发；`deploy` 只应用已有迁移文件，不会创建新迁移，适合生产环境。**生产环境绝对不能用 `migrate dev`**。

## Prisma Accelerate

Prisma Accelerate 是 Prisma 的云服务产品，解决 Serverless/Edge 环境下的数据库连接问题：

- **连接池**：Serverless 函数频繁创建/销毁连接，Accelerate 提供持久连接池
- **边缘缓存**：在 CDN 边缘节点缓存查询结果，减少数据库负载
- **Edge Runtime 支持**：通过 HTTP 协议而非 TCP 连接数据库

```typescript
// Edge Runtime（如 Vercel Edge Functions）中使用 Prisma
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());
```

> **面试场景**：面试官问"Prisma 在 Edge Runtime 中有什么问题？"——Edge Runtime 不支持 TCP 连接，传统 Prisma Client 依赖 Rust 查询引擎（体积大），Accelerate 通过 HTTP + 无引擎模式（`prisma generate --no-engine`）解决了这两个问题。

## Prisma vs TypeORM vs Drizzle

| 对比维度 | Prisma | TypeORM | Drizzle |
|----------|--------|---------|---------|
| 类型安全 | 自动生成类型（最强） | 装饰器风格，部分 TS | 完全 TS 推断（无代码生成） |
| Schema 方式 | `.prisma` DSL 文件 | 实体类 + 装饰器 | 纯 TS 对象定义 |
| 查询风格 | 抽象 API（`findMany` 等） | QueryBuilder / find | SQL-like API |
| 性能 | 中等（引擎开销） | 中等偏重 | 轻量（零运行时依赖） |
| Bundle 体积 | ~3-5MB（引擎） | 中等 | 极小（几 KB） |
| 复杂查询 | 受限，需 `$queryRaw` | QueryBuilder 较灵活 | 支持任意 SQL（CTE、子查询等） |
| Serverless/Edge | Accelerate 支持 | 不友好 | 天然友好（零依赖） |
| 社区生态 | 非常大 | 大但维护堪忧 | 快速增长 |
| 学习曲线 | 低 | 中高 | 中 |

> **面试答题思路**：根据场景选择，不要无脑推荐某一个。快速原型和 CRUD 项目 → Prisma（DX 最好）；NestJS 企业项目 → TypeORM（生态兼容）；高性能 Serverless/Edge → Drizzle（零依赖）；复杂 SQL 需求 → Drizzle（不需要 raw SQL fallback）。

## 常见面试问答

**Q: Prisma 的 Schema-first 设计有什么优势？**
> Schema 是唯一的数据模型定义来源（Single Source of Truth），从中自动生成类型安全的 Client 和数据库迁移。开发者只需维护一份 `.prisma` 文件，类型定义和数据库结构始终一致，不会出现"代码类型和数据库列不匹配"的问题。

**Q: Prisma 的查询引擎是什么？为什么有人批评它？**
> Prisma 使用 Rust 编写的查询引擎来处理查询，引擎被打包进 Node.js 应用（约 3-5MB）。批评点：体积大、启动慢、在 Serverless 环境中冷启动开销大。Prisma 已通过 Accelerate + `--no-engine` 模式缓解此问题。

**Q: `include` 和 `select` 的区别？**
> `include` 在默认字段基础上额外返回关联字段；`select` 精确指定只返回哪些字段。生产环境优先用 `select`，减少数据传输量和类型推断范围。

**Q: 如何实现软删除？**
> 在模型中添加 `isDeleted Boolean @default(false)` 字段，查询时过滤：`findMany({ where: { isDeleted: false } })`。也可通过 Prisma 的 `$extends` 中间件自动过滤。

**Q: Prisma 多对多隐式关系有什么局限？**
> 隐式多对多由 Prisma 自动创建中间表，无法在中间表添加额外字段（如 `assignedAt`）。需要额外字段时必须使用显式多对多，手动定义中间表模型。

**Q: Prisma Client 的 `$extends` 是什么？**
> Prisma Client Extensions（`$extends`）允许在 Client 上添加自定义行为：结果转换、查询中间件、自定义方法等。如 `prisma.$extends({ result: { user: { fullName: { compute: (u) => u.firstName + u.lastName } } } })`。