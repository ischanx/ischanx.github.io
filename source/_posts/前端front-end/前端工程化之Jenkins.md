---
title: '前端工程化之Jenkins'
date: 2021-11-14 22:50:00
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: true
# sidebarDepth: 2
# isTimeLine: false
# hideComments: false
tags:
- '前端工程化'
categories:
- '前端front-end'
---







> 下文安装通过「war安装包」安装，使用Docker安装方式可忽略本文

![img](https://static.chanx.tech/image/nvzng_0.png)

# 安装运行

1. 安装Java环境
2. 下载Jenkins的war包，[下载地址](https://www.jenkins.io/zh/download/)
3. 运行war包`java -jar jenkins.war --httpPort=8080`
4. 打开`http://localhost:8080`，等待Jenkins启动
5. 初次进入页面会要求输入初始密码，初始密码可以启动时在`shell`看到

![img](https://static.chanx.tech/image/nw0j5_0.png)

1. 跟随提示进行设置。设置管理员账户和密码、安装插件、设置网址等
2. 完成

# 配置

### 推荐插件

| [Environment Injector Plugin](https://plugins.jenkins.io/envinject) | 用于注入环境变量  |
| ------------------------------------------------------------ | ----------------- |
| [Git Parameter Plug-In](https://plugins.jenkins.io/git-parameter) | 构建时选择git参数 |
| [Publish Over FTP](https://plugins.jenkins.io/publish-over-ftp) | 执行FTP相关操作   |
| [Publish Over SSH](https://plugins.jenkins.io/publish-over-ssh) | 执行Shell相关操作 |
| [NodeJS Plugin](https://plugins.jenkins.io/nodejs)           | 安装Nodejs环境    |

# 

### 配置Git

1. Jenkins服务器生成Git密钥，[Git - 生成 SSH 公钥](https://git-scm.com/book/zh/v2/服务器上的-Git-生成-SSH-公钥)
2. 将`id_dsa`私钥配置到Jenkins凭证当中

![img](https://static.chanx.tech/image/nw3sc_0.png)

1. 将`id_dsa.pub`公钥配置到Git Server中

![img](https://static.chanx.tech/image/nw2z6_0.png)![img](https://static.chanx.tech/image/nw2rp_0.png)

### 配置FTP Server

![img](https://static.chanx.tech/image/nw3bb_0.png)![img](https://static.chanx.tech/image/nvyl8_0.png)



### 配置Node环境

![img](https://static.chanx.tech/image/nw8qr_0.png)![img](https://static.chanx.tech/image/nwa3q_0.png)











# 尝试新建一个构建项目

1. 新建构建项目，并进入配置页面

2. 配置「构建前选择代码分支」（需要安装插件）

![img](https://static.chanx.tech/image/nwc4b_0.png)

3. 配置Git仓库地址，没有凭证则需要添加

![img](https://static.chanx.tech/image/nw8ep_0.png)

4. 配置构建命令，通过Shell命令执行

![img](https://static.chanx.tech/image/nw6ru_0.png)

5. 构建后进行打包保存和FTP服务器部署

![img](https://static.chanx.tech/image/nwgrz_0.png)

6. 保存配置，执行构建

![img](https://static.chanx.tech/image/nwhz9_0.png)

7. 等待构建完成



一个简单的前端项目构建流程就是上面这些，除此之外可以通过Shell、插件、Jenkins自带的环境变量等实现更定制化的功能。比如`node_modules`的缓存提高构建速度、通过构建参数执行不同环境的打包。

```Bash
 # 通过判断package.json的md5来确认是否需要yarn安装依赖
    CACHE_FOLDER=${HOME}/md5_cache/md5
    echo "EXECUTOR_NUMBER: ${EXECUTOR_NUMBER}"
    MD5_FILE_NAME=package-json_${EXECUTOR_NUMBER}.md5sum

    [ -d ${CACHE_FOLDER} ] || mkdir -p ${CACHE_FOLDER}
    ls ${CACHE_FOLDER}

    if [ -f ${CACHE_FOLDER}/${MD5_FILE_NAME} ];then
      cp ${CACHE_FOLDER}/${MD5_FILE_NAME} ${MD5_FILE_NAME}
      md5sum package.json
      cat ${MD5_FILE_NAME}
      md5sum -c ${MD5_FILE_NAME} || yarn
    else
      echo "No md5sum backup"
      yarn
    fi

    echo "create new md5sum backup"
    md5sum package.json
    md5sum package.json > ${MD5_FILE_NAME}
    cp ${MD5_FILE_NAME} ${CACHE_FOLDER}
```



**总结：相比于Gitlab，Jenkins在代码管理并不擅长，更多是侧重于构建部署。**