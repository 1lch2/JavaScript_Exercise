# NestJS 请求管道

> 从 React 到后端，**请求-响应生命周期** 是最需要适应的概念之一。在 React 中，关注点是组件渲染、状态变化、副作用；在后端，面对的是”一个请求进来了，经过层层关卡，最终变成响应返回”。

NestJS 把整个流程设计得非常清晰，具有严格的顺序。每个环节都是一个”切入点”，可以插入自定义逻辑。对于熟悉 React 的开发者，可以把它们看作**高阶组件（HOC）管道**，只不过嵌套的是请求，而不是组件。

---

## 完整生命周期的阶段（按顺序）

```text
客户端发起请求
        │
        ▼
┌──────────────────────────────┐
│  1. 中间件 (Middleware)       │  处理原始请求对象（req, res），类似 CORS、日志、静态文件等
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│  2. 守卫 (Guard)             │  鉴权：决定请求是否能继续（用户是否有权限访问？）
└──────────────────────────────┘
        │ (如果守卫返回 false 或抛出异常，直接跳到异常过滤器)
        ▼
┌──────────────────────────────────────────┐
│  3. 拦截器 - 请求前 (Interceptor - Pre)   │  在控制器处理前拦截请求，可记录时间、转换数据等
└──────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────┐
│  4. 管道 (Pipe)                     │  验证和转换数据：确保参数类型正确，或把字符串转整数
└────────────────────────────────────┘
        │ (如果验证失败，抛出异常，跳到异常过滤器)
        ▼
┌──────────────────────────────┐
│  5. 控制器 (Controller)       │  路由处理器：调用 Service、组装响应
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  6. 服务 (Service)                       │  业务逻辑、数据库 CRUD
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  7. 拦截器 - 响应后 (Interceptor - Post)  │  对返回的数据进行包装（如统一格式 { code, data }）
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  8. 异常过滤器 (Exception Filter)         │  捕获任何异常（包括上面所有阶段抛出的），格式化错误响应
└──────────────────────────────────────────┘
        │
        ▼
   响应发送给客户端
```

> 注意：如果在 **守卫、管道、控制器、服务** 等任何阶段抛出异常，会**直接跳过后续所有正常步骤**，进入 **异常过滤器**，由它来决定最终返回什么错误。

---

## 逐一拆解：每个阶段在做什么？与 React 类比

### 1. 中间件（Middleware）

**职责**：在最外层处理原始的 `req` 和 `res` 对象，不等同于后面的“业务逻辑”，更偏底层。

典型场景：

- 设置跨域头（CORS）
- 请求日志记录
- 解析 Cookie 或请求体（比如 `express.json()`）
- 静态文件服务

**React 类比**：类似 React 中最外层的 `BrowserRouter` 或 `Provider`，不直接参与业务，但为后续处理提供基础环境。

NestJS 中，可以使用类中间件或函数中间件，在模块中全局应用或路由级应用：

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // 必须调用 next，否则请求会挂起
  }
}
```

然后在 `AppModule` 里配置：

```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*"); // 对所有路由生效
  }
}
```

---

### 2. 守卫（Guard）

**职责**：决定**“这个请求能不能进到这个路由？”**——通常是鉴权、角色权限。
守卫可以返回 `true`（放行）或 `false`（拒绝，通常返回 403），或者抛出异常（例如 401 未授权）。

**React 类比**：**React Router 的路由守卫**（比如 `<ProtectedRoute>` 组件），如果未登录，重定向到登录页。

NestJS 中，创建一个 `AuthGuard`，使用 JWT 策略：

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // 检查请求头中的 token，验证通过返回 true，否则 false
    return validateToken(request.headers.authorization);
  }
}
```

然后在控制器或方法上使用：

```typescript
@Controller('users')
@UseGuards(AuthGuard)   // 该模块所有路由都需要登录
export class UserController { ... }
```

**关键**：如果守卫返回 `false` 或抛出 `UnauthorizedException`，请求**不会进入控制器**，而是直接飞往异常过滤器。

---

### 3. 拦截器 - 请求前（Interceptor Pre-Controller）

**职责**：在方法执行**前**做一些事情，或是**替换**传入的参数、调用控制器前的逻辑。也可以记录性能、添加响应头。

典型场景：

- 记录每个请求的开始时间，以便计算耗时
- 把请求数据进行统一转换（例如把前端传来的 `userId` 从字符串转数字）
- 缓存：检查缓存是否存在，如果存在直接返回，不再调用控制器

**React 类比**：**axios 的请求拦截器**，例如统一给请求添加 Authorization 头。

拦截器是更强大的工具，它可以访问控制器的执行上下文，并可以调用 `next.handle()`，这就像管道的下一个环节。

示例：记录请求耗时

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`耗时 ${Date.now() - now}ms`)));
  }
}
```

注意，这里的 `next.handle()` 返回的是一个 Observable（RxJS），NestJS 的内部实现基于 RxJS，这也是拦截器强大之处——可以用操作符处理响应流。

---

### 4. 管道（Pipe）

**职责**：**验证和转换输入数据**。这是后端安全的第一道防线，保证进入控制器的参数是合法的。

两个主要用途：

1. **转换**：将输入数据转为期望的类型，例如把路径参数 `id` 从字符串转为 `number`。
2. **验证**：检查数据是否符合规则（如 `email` 必须为邮件格式），如果不符合则抛出异常。

**React 类比**：运行时的 PropTypes 检查或 zod/yup 验证。前端验证只是提升体验，后端验证才是真正的安全底线。

NestJS 内置了 `ValidationPipe`，配合 `class-validator` 和 `class-transformer` 可以实现声明式验证。

```typescript
// 数据定义 (DTO)
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// 控制器中使用
@Post()
create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
  // 如果验证失败，会自动抛出 400 Bad Request，包含详细错误信息
  return this.userService.create(createUserDto);
}
```

也可以在全局启用管道：

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

`transform: true` 开启后，管道会尝试将输入转换成 DTO 类的实例，甚至可将字符串 `"1"` 转为数字 `1`。

如果管道抛出 `BadRequestException`，请求同样会跳转到异常过滤器。

---

### 5. 控制器（Controller）& 6. 服务（Service）

**职责**：这是业务逻辑的核心。

- **控制器**：专门处理 HTTP 请求、响应，调用相应的 Service，然后返回响应。它应该很薄，不包含复杂逻辑。
- **服务**：包含业务逻辑、与数据库交互，可被多个控制器重用。通过依赖注入获得。

**React 类比**：控制器相当于事件处理器（例如 `handleSubmit`），但它直接返回数据；服务对应抽取出来的业务 hook 或 API 层函数。

```typescript
// user.controller.ts
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    // ParseIntPipe 是一个内建管道，将 id 转为数字
    return this.userService.findById(id);
  }
}

// user.service.ts
@Injectable()
export class UserService {
  findById(id: number) {
    return { id, name: "John" }; // 实际会查数据库
  }
}
```

注意：管道 `ParseIntPipe` 在参数级别上提前工作，如果转换失败（比如 id 是 `abc`），会直接抛出 400 错误，不会进入控制器方法。

---

### 7. 拦截器 - 响应后（Interceptor Post-Controller）

**职责**：在控制器返回结果之后、发送给客户端之前的最后一道防线。典型操作：

- 统一包装响应格式：例如把控制器返回的 `{ name: 'John' }` 包装成 `{ code: 200, data: { name: 'John' } }`。
- 添加额外的响应头。
- 序列化数据：排除敏感字段（如用户密码）。

之前提到的 `LoggingInterceptor` 就是同时利用了前和后：在 `next.handle()` 前记录开始时间，在 `tap` 里记录结束时间。

统一包装示例：

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({ code: 200, data })));
  }
}
```

这样，所有接口返回的数据都会自动包上一层 `{ code, data }`，前端可以统一解析。

---

### 8. 异常过滤器（Exception Filter）

**职责**：**捕获整个生命周期中抛出的所有异常**（包括错误代码、预期外崩溃），统一格式化并返回给客户端。

- 如果没有异常过滤器，NestJS 有一个默认的全局异常过滤器，它会处理 `HttpException`，返回类似 `{ statusCode: 400, message: '...' }` 的 JSON。
- 可以自定义异常过滤器，来实现自己的错误格式，或者针对特定异常做不同处理。

**React 类比**：**ErrorBoundary**，防止一个错误导致整个应用崩溃，并显示友好的回退界面。对于后端，即防止错误信息直接暴露给用户，同时保证返回合法的 JSON 而非 HTML 崩溃页面。

创建自定义异常过滤器：

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      code: status,
      message: (exception as any).message || "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
}
```

然后在全局使用：

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

有了这个过滤器，无论哪里抛出异常，最终都会以统一的 JSON 格式返回，并且隐藏了内部错误栈（生产环境可以记录日志而不发送到客户端）。

---

## 生命周期顺序图（一张图总结）

```text
请求 ──> 中间件 ──> 守卫 ──> 拦截器(前) ──> 管道 ──> 控制器 ──> 服务 ──> 拦截器(后) ──> 异常过滤器(捕获所有异常) ──> 响应
```

- 如果守卫不通过：请求 → 中间件 → 守卫(拒绝) → 异常过滤器 → 响应
- 如果管道验证失败：请求 → ... → 管道(抛出异常) → 异常过滤器 → 响应
- 如果控制器/服务内部出错：请求 → ... → 控制器/服务(异常) → 异常过滤器 → 响应

---

## 为什么这样设计？—— 后端关注点分离的艺术

这些环节让**横切关注点**（cross-cutting concerns）从具体的业务代码中脱离出来。比如：

- 不需要在每个路由里写 `if (!req.user) throw Unauthorized...`，只需加上 `@UseGuards(AuthGuard)`。
- 不需要在每个方法开头校验参数，管道自动处理。
- 不需要在每个返回值里包一层 `{ code: 200, data }`，拦截器统一搞定。

这对应于 React 社区常说的 **“切面式”** 或 **“中间件模式”**，NestJS 通过装饰器、元数据和依赖注入把这种模式推向了极致。理解这个生命周期，就能轻松驾驭 NestJS 的开发模式了。
