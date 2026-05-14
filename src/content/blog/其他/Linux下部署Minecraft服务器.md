---
title: Linux下部署Minecraft服务器
description: 详细介绍如何在Linux系统上搭建和配置Minecraft服务器，包括Java环境配置、服务端安装和常见问题解决方案
createDate: 2021-10-24T14:19:56.000Z
updateDate: 2021-10-24T14:19:56.000Z
tags:
  - Minecraft
  - Linux
  - 服务器
category: 其他
draft: true
sticky: false
permalink: /linux-minecraft-server/
---





[xftp、xshell连接远程服务器，所选的用户密钥未在远程主机上注册_墨浅-CSDN博客](https://blog.csdn.net/moqianmoqian/article/details/105210028)

1. 连接`shell`和`ftp`
2. 下载`JAVA`并上传安装

注意安装jdk8，高版本不兼容

- 执行解压`tar -zxvf jdk-linux-x64.tar.gz`
- 执行`vim /etc/profile`进入环境变量编辑，末尾加入下面配置并保存

```shell
JAVA_HOME=/root/jdk1.8.0_131
CLASSPATH=$JAVA_HOME/lib/
PATH=$PATH:$JAVA_HOME/bin
export PATH JAVA_HOME CLASSPATH
```

- 重新加载配置`source /etc/profile`
- 验证是否安装成功`java -version`

1. 上传服务端



```
问题：These libraries failed to download. Try again.
```

下载依赖不成功，需要单独下载相应的包
