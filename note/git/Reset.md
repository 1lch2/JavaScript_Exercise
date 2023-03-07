# Git reset
## 用法
将当前的 HEAD 改为指向特定状态

## 场景
### 撤销 git add 并保留工作区改动
改动了文件并 add 后，需要 git pull 拉取最新改动，但是新的 commit 里有修改自己刚刚动过的文件，这时候需要用 reset，操作如下：

```bash
git add . # 改动
git reset # 撤销 add
git pull # 拉取新 commit
```
### 撤销 git commit 并保留改动
已经 commit 后想起来有东西不对，这时候需要撤销刚才的 commit，操作如下：

```bash
git commit -m "something" # 直接commit
git reset --soft HEAD^ # 撤销commit，将HEAD指向当前HEAD的前一个
```
> **注意**：Windows下直接写 `HEAD^` 可能会不起作用，cmd 会把`^`当成转义符，要么改用 powershell，要么加上引号，例如：`"HEAD^"`

> `--soft`: 这个选项完全不会修改工作区，会把已经改动的文件变回未commit的状态

### 撤销 git commit 且不保留改动
适用于彻底不想要某些commit的场景，操作如下：

```bash
git commit ... # 一个或多个commit
git reset --hard HEAD~3 # 完全撤销倒数三个commit
```

> `--hard`：会重置工作区文件，已经修改的文件直接退回commit前，新增加的文件则会直接删除

### 撤销单个文件的 git add
已经用了 git add 后，发现自己不想让某个文件 commit 上去，操作如下：

```bash
git reset -- somefile.js
git commit -m "log"
```

### 保留当前工作区改动同时撤销前几次的 commit
当前改动的内容想移到另一个分支，但是又不想要之前的一部分无关的commit，这时候可以新建分支并使用 reset 来保留改动，操作如下：

```bash
git tag start # 打tag标记节点
git switch -c branch1 # 切换branch1
edit    # 本地修改
git commit ...  # 提交
edit    # 本地再次修改，此时想切换到另一分支
git switch -c branch2  # 切换到branch2
git reset --keep start  # 保留修改但是去除了 start 标记之后 commit的改动
```

> `switch`：相比于 `checkout`，`switch`仅用于切换分支，也就是说只想切换分支的时候，switch 和 checkout 的功能和用法是一样的。

> `--keep`：