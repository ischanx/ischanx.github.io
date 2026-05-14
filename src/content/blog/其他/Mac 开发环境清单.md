---
title: Mac 开发环境清单
description: 本文记录我在一台全新 macOS 设备上，从零开始搭建开发环境的完整流程与常用工具清单
createDate: 2024-11-23T00:00:00.000Z
updateDate: 2024-11-23T00:00:00.000Z
image: ''
tags:
  - 前端
  - 配置
category: 其他
draft: false
sticky: false
permalink: /macos-landing-log/
---

## 一、基础软件与效率工具

### 浏览器

**Chrome**
[https://www.google.com/intl/zh-CN/chrome/](https://www.google.com/intl/zh-CN/chrome/)

日常开发主力浏览器，调试工具与插件生态最为成熟。

---

### 网络代理工具

**Clash Verge Rev**
[https://github.com/clash-verge-rev/clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)

用于本地代理与规则管理，开发过程中访问 GitHub、npm、Docker Hub 等服务基本离不开。

---

### Hosts 管理工具

**SwitchHosts**
[https://github.com/oldj/SwitchHosts](https://github.com/oldj/SwitchHosts)

跨平台的 Hosts 文件管理工具，用于在不同环境之间快速切换 Hosts 配置。

典型使用场景：

* 本地开发域名指向（`local / dev / test`）
* 临时劫持线上域名进行问题排查
* 配合代理工具精细控制流量走向

相比手动编辑 `/etc/hosts`，SwitchHosts 提供了可视化管理、分组与一键切换能力，长期使用更安全，也更不容易出错。

---

### 系统状态监控

**Stats**
[https://github.com/exelban/stats](https://github.com/exelban/stats)

在菜单栏实时显示 CPU、内存、磁盘、网络等系统状态，轻量直观，适合长期常驻。

---

### 代码编辑器

**Visual Studio Code**
[https://code.visualstudio.com/](https://code.visualstudio.com/)

安装完成后，建议配置命令行启动能力，方便在终端中直接打开项目：

```text
command + shift + p
```

搜索并执行：
**Shell Command: Install 'code' command in PATH**

---

### 终端工具

**Warp（AI 终端）**
[https://www.warp.dev/](https://www.warp.dev/)

现代化终端，支持命令历史、块级交互以及 AI 辅助，日常使用体验较好。

**Electerm（SSH / SFTP）**
[https://github.com/electerm/electerm](https://github.com/electerm/electerm)

跨平台 SSH / SFTP 客户端，适合服务器管理与远程文件操作。

---

### 截图与翻译工具

**Snipaste（截图 & 贴图）**
[https://zh.snipaste.com/](https://zh.snipaste.com/)

**Bob（翻译 + OCR）**
[https://bobtranslate.com/](https://bobtranslate.com/)

这两个是高频使用工具，对日常开发、阅读文档和写博客帮助很大。

---

## 二、安装 Homebrew

Homebrew 是 macOS 下事实上的包管理器，后续大部分工具都会通过它安装，建议优先完成。

### 官方安装方式

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

### 常见问题

如果安装过程中出现如下错误：

```text
curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to raw.githubusercontent.com:443
```

通常与代理配置有关，建议**先关闭本地代理**后重试。

---

### 国内镜像（备用）

网络环境不佳时，可使用国内镜像：

```bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

---

## 三、安装 Git 并配置

### 安装 Git

Git 官网下载安装包：
[https://git-scm.com/downloads/mac](https://git-scm.com/downloads/mac)

或使用 Homebrew：

```bash
brew install git
```

安装完成后检查版本：

```bash
git -v
```

---

### 配置全局 Git 信息

```bash
git config --global user.name "这里填写用户名"
git config --global user.email "这里填写邮箱"
```

---

### 配置 GitHub SSH Key

生成 SSH 密钥：

```bash
ssh-keygen -t rsa -C "这里填写邮箱"
```

查看并复制公钥内容：

```bash
cat ~/.ssh/id_rsa.pub
```

将公钥配置到 GitHub 后，测试连接：

```bash
ssh -T git@github.com
```

---

## 四、安装 Node.js（使用 NVM）

推荐使用 **NVM** 管理 Node.js 版本，避免不同项目之间的版本冲突。

### 安装 NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

安装完成后**重启终端**，确认是否成功：

```bash
nvm -v
```

---

### 安装并使用 Node.js

```bash
nvm ls-remote
nvm install v22
nvm use v22
node -v
```

---

## 五、安装前端包管理工具

```bash
npm i -g yarn pnpm
```

根据项目要求选择使用即可，一般不会同时依赖三者。

---

## 六、终端代理快捷配置

在 `~/.zshrc` 或 `~/.bashrc` 中添加以下函数，用于快速切换代理状态：

```bash
proxy() {
    export http_proxy="http://127.0.0.1:7897"
    export https_proxy="http://127.0.0.1:7897"
    echo "代理已开启"
}

noproxy() {
    unset http_proxy
    unset https_proxy
    echo "代理已关闭"
}
```

默认开启代理：

```bash
proxy
```

