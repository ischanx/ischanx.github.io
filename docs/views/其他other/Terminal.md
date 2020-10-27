---
title: '你可能需要Windows Terminal'
date: 2020-10-27 19:51:41
# 永久链接
permalink: '/WindowsTerminal'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# isShowComment: true
categories:
- '其他other'
---

一款新的windows终端程序
<!-- more -->

不说废话，先上图

![image-20201027195830982](https://chanx-1251137349.file.myqcloud.com/image-20201027195830982.png)

![image-20201027195415759](https://chanx-1251137349.file.myqcloud.com/image-20201027195415759.png)

经常使用vscode跑服务，终端不想看的时候需要进行拖拉，不然遮挡代码

直接打开cmd跑吧，多窗口不好管理

**那就用Windows Terminal！Ohhhhhhhhhhhhhhhh**

https://www.microsoft.com/zh-cn/p/windows-terminal-preview/9n0dx20hk701?activetab=pivot:overviewtab#





你可能还想更方便地打开，如

<img src="https://chanx-1251137349.file.myqcloud.com/image-20201027200001700.png" alt="image-20201027200001700" style="zoom: 50%;" />

- `win + R`打开运行窗口，输入`regedit`
- 打开`计算机\HKEY_CLASSES_ROOT\Directory\Background\shell`
- 右键新建项`在此处打开 Terminal`
- 新建项`command`
- 修改默认值为`cmd /c set CURRENT_PATH="%V" & start C:\Users\admin\AppData\Local\Microsoft\WindowsApps\wt.exe`

注意`C:\Users\admin\AppData\Local\Microsoft\WindowsApps\wt.exe`要修改为你自己的路径