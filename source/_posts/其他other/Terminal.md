---
title: '你可能需要Windows Terminal'
date: 2020-10-27 19:51:41
# 永久链接
permalink: /WindowsTerminal/
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# hideComments: false
categories:
- '其他other'
---

一款新的windows终端程序
<!-- more -->

不说废话，先上图

![image-20201027195830982](https://img.chanx.tech/i/2022/06/12/8jfb5_0.png)

![image-20201027195415759](https://img.chanx.tech/i/2022/06/12/8k1vk_0.png)

经常使用vscode跑服务，终端不想看的时候需要进行拖拉，不然遮挡代码

直接打开cmd跑吧，多窗口不好管理

**那就用Windows Terminal！Ohhhhhhhhhhhhhhhh**



## Windows Terminal作为主要命令行工具

首先从微软商店下载好，并确认可以使用

https://www.microsoft.com/zh-cn/p/windows-terminal-preview/9n0dx20hk701?activetab=pivot:overviewtab#

###  右键打开Terminal

你可能还想更方便地打开，如

<img src="https://img.chanx.tech/i/2022/06/12/8ksri_0.png" alt="image-20201027200001700" style="zoom: 50%;" />

- `win + R`打开运行窗口，输入`regedit`

- 打开`计算机\HKEY_CLASSES_ROOT\Directory\Background\shell`

- 右键新建项命名为`wt`，修改默认值为你想要的名字如`在此打开 Terminal`

- 如有需要的话可以将这个命令置顶，则添加新字符串值`Position`，值为`Top`

- 新建一个项`command`，默认值`%USERPROFILE%\AppData\Local\Microsoft\WindowsApps\wt.exe`

  注意：如失效，可尝试将%USERPROFILE%改为指定用户目录如`C:\Users\<username>`，并重启，`<username>`记得改成自己的用户名

一般出现`explorer.exe`错误多是没有用管理员权限写入导致的

### 在当前目录打开

添加一行配置`"startingDirectory": null,`

目的是从目录右键打开时终端路径在你当前的目录下

![image-20201031111710347](https://img.chanx.tech/i/2022/06/12/8ly7m_0.png)

![image-20201031111732159](https://img.chanx.tech/i/2022/06/12/8mjgl_0.png)

其他配置文件可以查看[官方文档](https://aka.ms/terminal-profile-settings)