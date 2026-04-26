# Monorepo

> 将多个项目（应用、库）放在同一个 Git 仓库中统一管理的工程策略。

## 什么是 Monorepo

**Monorepo**（Mono + Repository）是指将多个相关联的项目放在**同一个代码仓库**中进行管理的开发模式。这些项目可以是独立的应用（App）、共享的工具库（Library）、配置包等，它们共享同一套版本历史和协作流程。

与之相对的是 **Polyrepo**（多仓库模式），每个项目各自拥有独立仓库。

### 典型目录结构

```
my-monorepo/
├── apps/                    # 可部署的应用
│   ├── web/                 # Web 前端
│   └── admin/               # 管理后台
├── packages/                # 共享库
│   ├── ui/                  # UI 组件库
│   ├── utils/               # 工具函数
│   └── tsconfig/            # 共享 TypeScript 配置
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── package.json
└── .npmrc
```

## 为什么选择 Monorepo

### 优势

| 优势 | 说明 |
|------|------|
| **代码共享便捷** | 包之间直接引用，无需发布到 npm 即可使用，开发体验接近本地模块 |
| **原子化提交** | 跨包的修改可以在一次提交中完成，避免多仓库间版本不一致的问题 |
| **统一工具链** | ESLint、TypeScript、Prettier 等配置统一管理，减少重复配置和风格差异 |
| **依赖版本一致** | 通过 `catalog:` 等机制统一第三方依赖版本，避免不同包使用不同版本的 React 等核心库 |
| **重构更安全** | 修改共享 API 时，可以一次性更新所有调用方，编译器直接报错而非运行时才发现 |
| **CI/CD 优化** | 结合工具只构建/测试受影响的包，而非全量构建 |

### 挑战与取舍

| 挑战 | 应对策略 |
|------|----------|
| 仓库体积增大 | 使用 Git 浅克隆、Monorepo 工具的增量构建 |
| 构建速度变慢 | 使用 Turborepo/Nx 的任务缓存和并行执行 |
| 包之间循环依赖 | 通过 `madge` 或 Nx 的依赖规则强制检测 |
| 权限管理困难 | 大厂可使用 CODEOWNERS 按目录分配审核权限 |
| CI 跑全量测试 | 使用 `affected` 命令只测试变更涉及的包 |

### 适用场景

- **中大型前端团队**：多个应用共享组件库和工具函数
- **微前端架构**：多个子应用统一管理
- **开源项目生态**：如 Babel、Vue、React 等核心库与插件同仓管理
- **全栈项目**：前端、后端、共享类型定义放在同一仓库

**不适用场景**：项目之间完全无关联、团队权限隔离要求严格、仓库已有超大历史记录。

## 主流工具对比

| 工具 | 定位 | 核心能力 | 适用规模 |
|------|------|----------|----------|
| **pnpm workspaces** | 包管理 | 符号链接式依赖管理，严格隔离 | 小型 ~ 中型 |
| **Turborepo** | 任务编排 | 构建缓存、并行执行、远程缓存 | 中型 ~ 大型 |
| **Nx** | 全功能平台 | 依赖图分析、affected 命令、代码生成 | 大型 |

> **实践建议**：pnpm workspaces 是基础层，Turborepo 或 Nx 在其之上提供任务编排能力。小型项目用 pnpm workspaces 即可，规模增长后再引入 Turborepo。

## 极简示例：pnpm workspaces + TypeScript

下面用 pnpm workspaces 搭建一个最小可运行的 Monorepo，包含一个应用和一个共享工具库。

### 项目结构

```
mini-monorepo/
├── apps/
│   └── web/                 # 应用：依赖 @mini/utils
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── utils/               # 共享库：导出工具函数
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json       # 共享 TS 配置
└── .npmrc
```

### 1. 根目录配置

**`package.json`**

```json
{
  "name": "mini-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm -r run build",
    "dev": "pnpm -r --parallel run dev"
  }
}
```

- `"private": true` 防止根包被误发布到 npm
- `pnpm -r` 递归执行所有工作区包的脚本
- `--parallel` 并行运行 dev 脚本

**`pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

声明工作区包含的包路径，pnpm 会自动识别这些目录下的 `package.json`。

**`.npmrc`**

```ini
strict-peer-dependencies=true
auto-install-peers=true
```

- `strict-peer-dependencies`：peer 依赖不匹配时直接报错，避免运行时问题
- `auto-install-peers`：自动安装 peer 依赖

### 2. 共享 TypeScript 配置

**`tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

各包通过 `extends` 继承此配置，避免重复定义。

### 3. packages/utils —— 共享工具库

**`packages/utils/package.json`**

```json
{
  "name": "@mini/utils",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  }
}
```

- `"main"` 直接指向源文件，开发时无需构建即可被其他包引用（需配合 TS 的 `moduleResolution`）
- `"@mini/` 是内部作用域前缀，避免与 npm 上的包名冲突

**`packages/utils/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

**`packages/utils/src/index.ts`**

```typescript
// 格式化日期为 YYYY-MM-DD
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 生成指定范围的随机整数
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### 4. apps/web —— 应用

**`apps/web/package.json`**

```json
{
  "name": "@mini/web",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "@mini/utils": "workspace:*"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "typescript": "^5.4.0"
  }
}
```

- `"@mini/utils": "workspace:*"`：使用 `workspace:` 协议引用工作区内部包，pnpm 会创建符号链接
- 发布时 pnpm 自动将 `workspace:*` 替换为实际版本号

**`apps/web/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/utils" }
  ]
}
```

- `references` 启用 TypeScript 项目引用，支持增量编译

**`apps/web/src/index.ts`**

```typescript
import { formatDate, randomInt } from '@mini/utils';

// 模拟业务逻辑：生成一条随机订单记录
const orderId = randomInt(10000, 99999);
const createdAt = formatDate(new Date());

console.log(`订单 #${orderId}，创建于 ${createdAt}`);
```

### 5. 安装与运行

```bash
# 安装所有依赖（pnpm 自动创建符号链接）
pnpm install

# 构建所有包
pnpm build

# 运行应用
pnpm --filter @mini/web dev
```

`--filter` 用于指定只操作某个包及其依赖，避免全量执行：

```bash
# 只构建 utils 及依赖它的包
pnpm build --filter @mini/utils...

# 只构建 web 依赖的包
pnpm build --filter ...@mini/web
```

### 6. Catalog：统一依赖版本

当多个包依赖同一库（如 TypeScript）时，版本可能不一致。pnpm 9+ 提供了 `catalog:` 协议解决这个问题。

**`pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'

catalog:
  typescript: ^5.4.0
  tsx: ^4.7.0
```

**`apps/web/package.json`**（使用 catalog 引用）

```json
{
  "devDependencies": {
    "tsx": "catalog:",
    "typescript": "catalog:"
  }
}
```

所有包通过 `catalog:` 引用同一版本，修改时只需更新 `pnpm-workspace.yaml` 一处。

## 参考

- [pnpm Workspaces 官方文档](https://pnpm.io/workspaces)
- [pnpm-workspace.yaml 配置](https://pnpm.io/pnpm-workspace_yaml)
- [Turborepo 官方文档](https://turbo.build/repo/docs)
- [Nx 官方文档](https://nx.dev/concepts)
