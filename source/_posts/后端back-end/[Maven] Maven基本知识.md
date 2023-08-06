---
title: "[Maven] Maven基本知识"
date: 2020-02-05
tags:
- "Maven"
categories:
- "后端"
---
**Maven-tomcat插件好像跑不了9...  直接部署tomcat9启动即可**

本文记录Maven的基本概念和常用指令
<!--more-->
## Maven仓库概念
就是能自动帮你引入jar包，减少不必要的操作

其中仓库有**本地仓库，远程仓库，中央仓库**

本地仓库：本地的jar包（本机）

远程仓库：本地上传的或者联网缓存的，私服...（内网共用 *实际上并不一定是内网只是为了方便理解*）

中央仓库：集中存储的资源站（外网共用）

若实际开发中maven无法从三个仓库中找到相应jar包的坐标，则报错

## Maven工程
```
src/main/java 核心代码
src/main/resources  配置文件
src/test/java 测试代码
src/test/resources  测试配置
src/main/webapp 页面资源如js,css,image
```

## Maven常用命令
```html
compile 编译命令
将src/main/java下文件编译为class文件输出到target目录下

test  测试命令

clean 删除target文件夹

package 默认打包成war包放置于target

install 将maven编译打包放于本地仓库

```