# pnpm

> 快速、磁盘高效的 Node.js 包管理器，天然适配 Monorepo 场景

## 核心机制：Content-addressable Store

pnpm 的所有依赖并非直接下载到各项目的 `node_modules` 中，而是存储在全局的 **Content-addressable Store**（通常位于 `~/.local/share/pnpm-store`）。该 Store 以包内容的 Hash 为索引，同一版本的包只会存储一份。

项目 `node_modules` 中的文件通过 **硬链接（hard link）** 指向 Store 中的实体文件，再通过 **符号链接（symlink）** 构建依赖层级关系。这意味着：

- **磁盘占用极低**：10 个项目依赖同一版本的 `lodash`，磁盘上只存在一份 `lodash` 的文件内容
- **安装速度极快**：依赖已存在于 Store 时，只需创建硬链接，无需重复下载

## 依赖结构：对比 npm 的扁平模式

npm 默认采用**扁平化（hoisted）** 的 `node_modules` 结构，所有依赖被提升到顶层目录。这导致一个严重问题——**幽灵依赖（phantom dependency）**：项目代码可以引用 `package.json` 中未声明的包，因为它们被提升到了可访问的位置。

pnpm 的 `node_modules` 结构截然不同：

```
node_modules
├── .pnpm/                        # 所有包的真实存放位置（硬链接 + 符号链接）
│   ├── foo@1.0.0
│   │   └── node_modules
│   │       ├── foo               # 硬链接到 Store
│   │       ├── bar -> ../../bar@1.0.0/node_modules/bar  # 符号链接
│   ├── bar@1.0.0
│   │   └── node_modules
│   │       └── bar
├── foo -> .pnpm/foo@1.0.0/node_modules/foo  # 顶层符号链接
```

**只有 `package.json` 中显式声明的依赖才会出现在 `node_modules` 顶层**，其余依赖被隔离在 `.pnpm` 目录中，无法被直接引用。这种严格隔离避免了幽灵依赖，确保依赖访问的可预测性。

## Monorepo 支持

pnpm 内置 Workspace 功能，是 Monorepo 管理的首选方案之一。核心配置文件为 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'       # 声明 Workspace 中的子包路径
```

### workspace: 协议

子包之间的内部依赖使用 `workspace:` 协议声明：

```json
{
  "name": "@myorg/app",
  "dependencies": {
    "@myorg/utils": "workspace:*"
  }
}
```

`workspace:*` 确保依赖只指向 Workspace 内的本地包，不会从远程 Registry 安装。发布时，pnpm 会自动将 `workspace:*` 替换为实际版本号。

### catalog: 协议

Monorepo 中多个子包常依赖同一第三方库的相同版本。**Catalog** 提供集中化的版本管理：

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'

catalog:
  react: ^18.3.1
  lodash: ^4.17.21
```

子包的 `package.json` 通过 `catalog:` 引用版本：

```json
{
  "dependencies": {
    "react": "catalog:",
    "lodash": "catalog:"
  }
}
```

所有子包的 `react` 版号由 `pnpm-workspace.yaml` 统一管控，避免版本漂移。需要同一依赖的不同版本时，可使用命名 Catalog：

```yaml
catalogs:
  react18:
    react: ^18.3.1
    react-dom: ^18.3.1
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2
```

引用时使用 `catalog:react18` 或 `catalog:react17`。

### pnpm 与 Monorepo 的适配优势

| 特性 | 说明 |
| ---- | ---- |
| 严格依赖隔离 | 子包只能访问自身声明的依赖，防止 Monorepo 中跨包的幽灵依赖 |
| Store 共享 | 多个子包依赖同一版本时共享同一份磁盘文件，Monorepo 规模越大节省越明显 |
| Catalog | 集中管控第三方依赖版本，避免子包间版本不一致 |
| workspace: 协议 | 内部依赖始终链接本地代码，发布时自动替换为版本号 |
| --filter | `pnpm --filter @myorg/app build` 只构建指定子包及其依赖链 |

## 对比总结

| 维度 | npm | pnpm |
| ---- | --- | ---- |
| 依赖结构 | 扁平化（幽灵依赖） | 非扁平（严格隔离） |
| 磁盘效率 | 每个项目独立存储 | 全局 Store + 硬链接共享 |
| Monorepo | 需 Lerna 等外部工具 | 内置 Workspace |
| 版本管理 | 各 `package.json` 独立声明 | Catalog 集中管控 |
| 安装速度 | 较慢（重复下载） | 较快（Store 已有则仅创建链接）
