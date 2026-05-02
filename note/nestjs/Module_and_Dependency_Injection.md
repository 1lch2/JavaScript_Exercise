# NestJS 的 Module 和依赖注入

> NestJS 的 Module 是应用架构的基本组织单元，负责依赖注入容器的边界管理和组件注册。

## Module 是什么

Module 是使用 `@Module()` 装饰器标注的类，它提供元数据供 NestJS 构建应用依赖图。每个 Nest 应用至少有一个根模块（`AppModule`），NestJS 以此为起点构建应用图，解析模块和 Provider 之间的依赖关系。

Module 装饰器接收一个配置对象，包含以下属性：

| 属性 | 作用 |
| ---- | ---- |
| `controllers` | 需要实例化的 Controller 列表 |
| `providers` | 可在模块内共享的 Provider 列表 |
| `imports` | 需要导入的其他模块列表 |
| `exports` | 需要暴露给其他模块的 Provider 列表 |

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController], // 注册路由处理器
  providers: [CatsService], // 注册可注入的 Provider
  exports: [CatsService], // 暴露给其他模块
})
export class CatsModule {}
```

## 为什么需要 Module

### 依赖注入容器的边界

NestJS 基于依赖注入（DI）模式构建。DI 容器需要明确知道哪些类需要被实例化、如何解析依赖关系。**Module 是 DI 容器的作用域边界**——模块内的 Provider 默认对该模块私有，其他模块无法直接访问。

如果不使用 Module，Controller 和 Service 之间的依赖关系将无法自动解析：

```typescript
// 没有 Module 注册，NestJS 无法自动注入 UserService
class UserController {
  constructor(private userService: UserService) {} // 运行时无法解析
}
```

Module 通过声明式注册解决了这个问题：

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

NestJS 启动时扫描所有 Module，自动构建完整的依赖树。

### 功能组织与代码分割

随着项目规模增长，按功能域组织代码是必要的。Module 提供自然的边界划分：

```
src/
├── user/
│   ├── user.module.ts
│   ├── user.controller.ts
│   └── user.service.ts
├── article/
│   ├── article.module.ts
│   ├── article.controller.ts
│   └── article.service.ts
└── app.module.ts
```

每个 Module 自成独立单元，内部高内聚，对外通过 `exports` 暴露清晰的接口。这种模块化架构提升了代码可读性和可维护性。

### 模块级配置

Guard、Pipe、Filter 等功能支持模块级别的配置。虽然可以在 Controller 层级使用装饰器，但 Module 配合 `APP_GUARD` 等 InjectionToken 可以实现更灵活的模块级配置。

## Module 的核心机制

### Provider 的作用域

Module 内的 Provider 默认遵循以下规则：

- **单例**：同一模块内的 Provider 实例是共享的
- **私有**：未通过 `exports` 暴露的 Provider 不可被外部模块访问
- **共享模块**：模块本身是单例，多个模块导入同一模块时共享相同的 Provider 实例

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // 暴露后，导入此模块的模块均可注入 DatabaseService
})
export class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  providers: [UserService], // UserService 可以注入 DatabaseService
})
export class UserModule {}
```

### 全局模块

使用 `@Global()` 装饰器可以将模块定义为全局作用域，其导出的 Provider 无需在其他模块中显式导入即可使用：

```typescript
import { Global, Module } from '@nestjs/common';

@Global() // 全局模块，无需其他模块导入即可使用
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

### 动态模块

动态模块允许运行时生成模块配置，常用于数据库连接、缓存等需要配置参数的场景：

```typescript
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  // forRoot 模式——在应用启动时配置
  static.forRoot(config: DatabaseConfig): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_CONFIG',
          useValue: config,
        },
      ],
      exports: ['DATABASE_CONFIG'],
    };
  }
}

// 使用方式
@Module({
  imports: [DatabaseModule.forRoot({ host: 'localhost', port: 5432 })],
})
export class AppModule {}
```

### 懒加载模块

通过 `LazyModuleLoader` 实现按需加载模块，适用于降低启动时间或条件加载的场景：

```typescript
import { Injectable, Module } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class AppModule {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async loadFeatureModule() {
    // 运行时动态加载模块
    const { FeatureModule } = await import('./feature/feature.module');
    return this.lazyModuleLoader.loadModule(FeatureModule);
  }
}
```

## 应用场景

### 数据库模块的跨模块共享

```typescript
// prisma.module.ts —— 将数据库服务暴露给所有需要数据访问的模块
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 数据库连接通常全局可用
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// user.module.ts —— 导入数据库模块，注入 PrismaService
@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

### 认证模块的守卫复用

```typescript
// auth.module.ts —— 导出认证服务和守卫
@Module({
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}

// order.module.ts —— 导入认证模块，使用守卫保护路由
@Module({
  imports: [AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
```

### 模块间依赖管理

| 场景 | 方案 |
| ---- | ---- |
| 多个模块共享数据库连接 | `@Global()` 装饰器标记数据库模块 |
| 模块间共享 Service | `exports` 暴露 + 目标模块 `imports` 导入 |
| 条件加载功能模块 | `LazyModuleLoader` 动态加载 |
| 运行时配置 | 动态模块 `forRoot()` 模式 |

## 常见面试问题

### Module 和 Provider 的关系

Provider 注册在 Module 的 `providers` 数组中，其生命周期和可见性由 Module 控制。Provider 可以是 Service、Factory、Value 或 Class 等形式，NestJS 支持构造函数注入、属性注入和方法注入三种方式。

### 循环依赖问题

当两个模块互相导入时会产生循环依赖。解决方案：

1. 使用 `ForwardRef` 解决模块级循环依赖
2. 提取公共逻辑到第三个模块
3. 使用事件模式（`EventEmitterModule`）解耦

```typescript
import { ForwardRef, Module } from '@nestjs/common';

@Module({
  imports: [ForwardRef(() => OtherModule)], // 前向引用解决循环依赖
})
export class AModule {}
```

### Module 是单例吗

Module 本身是单例，同一模块内注册的 Provider 也是单例。多个模块导入同一模块时，共享相同的 Provider 实例。这是 NestJS 默认的共享模块行为。

---

> 参考：NestJS 官方文档 Modules、Dependency Injection 章节