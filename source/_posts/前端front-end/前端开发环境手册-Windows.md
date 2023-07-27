---
title: '前端开发环境手册（Windows 篇）'
date: 2023-07-08
# 永久链接
permalink: '/fe-landing-log-windows/'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 4
# isTimeLine: false
# hideComments: false

categories:
- '前端front-end'
---


# Git

## 安装

访问[下载地址](https://git-scm.com/download/win)，下载独立安装程序，默认配置点点点就好

![](https://static.chanx.tech/image/FzzrbWQv1oK29vxsmsTcltK6nPH.png)

## 基本配置

打开 `Git Bash`，执行以下命令进行全局配置

> Git Bash 不能使用快捷键粘贴，请使用**右键菜单**进行复制粘贴

- `git config --global core.autocrlf input`（统一换行符为 LF）
- `git config --global --replace core.editor "code --wait"`（用 VSCode 编辑，默认是 Vim）
- `git config --global user.name "``此处填用户名``"`
- `git config --global user.email "``此处填邮箱``"`（邮箱是和 GitHub/Gitea/Gitlab 账号一致的邮箱）
- `git config --global --list`（查看上述配置结果）

## 配置 SSH

> git clone 支持 https 和 ssh 两种方式克隆代码，当使用 ssh 方式时如果没有配置过 ssh key，会有如下错误提示：
>
> ```
> ```

git@github.com：Permission denied(publickey).
fatal: Could not read from remote repository.

```

### 生成公钥和私钥

1. 打开`Git Bash`并执行以下命令，邮箱使用上一步配置的

```javascript
ssh-keygen -t rsa -C "此处填邮箱"
```

执行上面命令后需要进行几次确认，**一般直接回车就行，可能需要输入 Y 进行覆盖**

- 确认秘钥的保存路径（如果不需要改路径则直接回车）
- 如果上一步保存路径下已经有秘钥文件，则需要确认是否覆盖（输入 Y 进行覆盖）
- 创建密码（如果不需要密码则直接回车）
- 确认密码（如果不需要密码则直接回车）

命令执行完会在** 。ssh 文件夹路径（这个后面有用）**下会生成 2 个文件：（如图为 `c/Users/chanx/.ssh`）

- `id_rsa` 私钥文件
- `id_rsa.pub` 公钥文件

1. 打开 `Git Bash` 继续执行命令

```bash
cat ~/.ssh/id_rsa.pub
```

执行命令后输出的 ssh-rsa 开头文本即为公钥

![](https://static.chanx.tech/image/SUJFbKxDfoBpkBx2h4OcDyLvncB.png)

### 远程仓库配置公钥（Github 为例）

打开 GitHub，进入到个人账号设置页配置公钥： Settings -> SSH and GPG keys -> New SSH key

将上一步骤生成的公钥复制到 Key 下面的文本框，Title 根据实际情况命名，然后点保存即可

![](https://static.chanx.tech/image/TvkFb6k18ot4N9xEms8ccWY2naf.png)

**一般其他远程****仓库****到这已经配置完成了**

但是 Github 还需要另外配置：

打开上一步提到的 。ssh 文件夹路径 `/c/Users/chanx/.ssh`（因人而异）

给其中名字为 config 文件添加以下内容并保存

```javascript
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
```

`Git Bash` 执行以下命令，中间过程输入 `yes` 进行二次确认，看见如图提示即为配置完成

```bash
ssh -T git@github.com
```

![](https://static.chanx.tech/image/NkosbmGFhoGkaGx3zelcdXy9nsC.png)

# Node.js

## 为什么不直接安装某个版本的 Node.js？

nvm 可以控制管理 Node.js 版本，**快速切换版本以支持不同的场景**，比如：

- 开发时需要使用稳定的 LTS 版本，不同项目需要使用不同的 Node.js 版本
- 其他场景可以使用最新的 latest 版本，体验 Node.js 新特性

## 安装 nvm-windows

访问[下载地址](https://github.com/coreybutler/nvm-windows/releases)，下载最新版本的 **nvm-setup.exe**，下载完成直接运行安装即可

### 配置镜像地址

nvm 默认的下载地址是 [http://nodejs.org/dist/ ](http://nodejs.org/dist/)，这是国外的服务器，在国内下载速度很慢

但是来自阿里的国内镜像站拯救了我们，感谢阿里（笑

**方法一（推荐）：**

打开任意控制台终端（比如 CMD），执行以下命令

- `nvm node_mirror ``https://npmmirror.com/mirrors/node/`
- `nvm npm_mirror ``https://registry.npmmirror.com`

**方法二：**
在 nvm 的安装路径下，找到 settings.txt** **打开，加上

```
node_mirror:  https://npmmirror.com/mirrors/node/
npm_mirror:  https://registry.npmmirror.com
```

## 安装 Node.js

上一步已经安装 nvm，下面执行 nvm 的命令完成 Node.js 的安装

1. `nvm list available` 获取当前可用的 node 版本
2. `nvm install 版本号` 就可以安装指定版本的 node（根据项目安装对应的版本
3. `nvm use 版本号` 就可以切换到该版本的 node 环境
4. `nvm list` 获取当前已安装的 node 版本列表
5. `nvm -v` 获取当前 nvm 的版本

这里有个小技巧快速安装某个大版本的 node（比如 node18）

- `nvm install v18`
- `nvm use v18`

![](https://static.chanx.tech/image/CForbTHAwotIXyxgn3PcTRPzn5d.png)

## npm 包管理器

Nodejs 安装时默认会附带安装 npm，此时镜像源是国外的

```bash
# 更换国内源
npm config set registry https://registry.npmmirror.com
# 查询配置是否成功
npm config get registry
```

目前实际使用中，更多会使用到 `yarn` 和 `pnpm` 两个包管理器，也需要安装和配置

```bash
# 安装yarn
npm i -g yarn
# 查看 yarn 版本
yarn -v
# 更换国内源
yarn config set registry https://registry.npmmirror.com
# 查询配置是否成功
yarn config get registry
```

```bash
# 安装 pnpm
npm i -g pnpm
# 查看 pnpm 版本
pnpm -v
# 更换国内源
pnpm config set registry https://registry.npmmirror.com
# 查询配置是否成功
pnpm config get registry
```

### 常见问题

1. 遇到如图报错“禁止运行脚本”，执行以下指令更改策略，[详情可见](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.3)

![](https://static.chanx.tech/image/ULZMblvT5oKlZkx3zGQcYssznzf.png)

```shell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

1. `npm i` 安装长时间卡在 idealTree buildDeps 这一步不动

按一下顺序尝试：`npm cache clean` 清除 npm 缓存、nvm 重新安装 node、nvm 更换 node 版本

# VS Code

访问[ VSCode 官网](https://code.visualstudio.com/)，下载安装包，正常运行安装即可

## 推荐安装字体

JetBrains Mono: [https://www.jetbrains.com/lp/mono/](https://www.jetbrains.com/lp/mono/)

1. 下载解压后，双击 **ttf **文件内任一打开，点击左上角安装按钮即可

区别是文字的粗细和斜体，我目前使用的是 **JetBrainsMono-Regular.ttf **

![](https://static.chanx.tech/image/Sa9FbCphgoDuCExMyfOcWc8Hn2f.gif)

1. 安装后打开 VSCode -> 设置 -> Editor: Font Family，在前面加入 `JetBrains Mono,` 或直接使用以下内容覆盖

```bash
JetBrains Mono, Consolas, 'Courier New', monospace
```

![](https://static.chanx.tech/image/RLtWbNMUUoPvEwx3jwpcLu3gnAc.gif)

## 推荐安装插件

| 序号 | 插件名                                                                                                                                                                 | 描述                                              | 备注 |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---- |
| 1    | [Chinese （Simplified） （简体中文） Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans) | 官方的汉化包，老玩家直接默认英文                  |      |
| 2    | [Color Info](https://marketplace.visualstudio.com/items?itemName=bierner.color-info)                                                                                   | 代码显示色值信息                                  |      |
| 3    | [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)                                                                     | 更多图标                                          |      |
| 4    | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)                                                                                   | 代码静态检查和修复工具                            |      |
| 5    | [filesize](https://marketplace.visualstudio.com/items?itemName=mkxml.vscode-filesize)                                                                                  | 显示当前文件的体积                                |      |
| 6    | [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)                                                                                         | 显示 git 相关的信息，常用的是显示当前行的提交记录 |      |
| 7    | [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)                                                              | import 语句中自动补充 npm 模块名                  |      |
| 8    | [Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)                                                                    | 提供代码路径自动补全                              |      |
| 9    | [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)                                                                         | Vue、Vitepress 和 petite-vue 构建的语言支持扩展   |      |
| 10   | [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)                                                  | 为。vue 文件提供 ts 检查                          |      |
| 11   | [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)                                                        | 检查代码的命名错误                                |      |

# WebStorm

[https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)

WebStorm 也是较为常见的前端开发工具，相比于 VSCode 来说会更加智能

因常用编辑为 VSCode，这里不赘述。
