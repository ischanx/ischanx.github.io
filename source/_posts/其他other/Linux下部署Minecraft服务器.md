---
title: 'Linux下部署Minecraft服务器'
date: 2021-10-24 14:19:56
# 永久链接
permalink: /linux-minecraft-server/
categories:
- '其他other'
---





[xftp、xshell连接远程服务器，所选的用户密钥未在远程主机上注册_墨浅-CSDN博客](https://blog.csdn.net/moqianmoqian/article/details/105210028)

1. 连接`shell`和`ftp`
2. 下载`JAVA`并上传安装

注意安装jdk8，高版本不兼容

- 执行解压`tar -zxvf jdk-linux-x64.tar.gz`
- 执行`vim /etc/profile`进入环境变量编辑，末尾加入下面配置并保存

```Shell
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

