---
title: '[转]Vuepress中Last Updated时间有误'
description: Vuepress中Last Updated时间有误
createDate: 2020-07-20T00:00:00.000Z
updateDate: 2020-07-20T00:00:00.000Z
image: ''
tags:
  - Vuepress
category: 前端
draft: false
sticky: false
permalink: vuepress-last-updated-time
---

原文出处：[ty-peng - VuePress Last Updated 时间有误的解决](https://ty-peng.gitee.io/views/note/ops/202004141352-vuepress-last-updated.html)

<!-- more -->

## **此文章为转载**

## 正文

之前一直以为文章`Last Updated`的时间每次都是取最新的时间是因为推送Pages分支时强制提交，只有一个最新提交的原因， 所以一直没去管，今天发觉按理编译之前`Last Updated`时间就已经确定了才对，于是找了下原因。

去VuePress的文档页面看了下，在默认主题的配置里有说明：

:::blue
VuePress的插件`last-updated`是基于`git`的，使用`git commit`的时间戳作为最后更新时间。
:::

我在本地编译运行了一下，发现`Last Updated`时间是对的， 但是通过GitHub Actions编译后的时间有误，都只是最新的时间。

检查workflow文件`main.yml`， 其中和之前本地部署不同的步骤应该只有`Checkout`那一步，

找到相关文档，查看配置项，其中有一项：

:::blue
```yaml
# Number of commits to fetch. 0 indicates all history.
# Default: 1
fetch-depth: ''
```
`fetch-depth`：要获取的提交数，0表示所有历史记录，默认为1。
:::

这就是问题的根源所在，在GitHub Actions中，按之前的配置，`fetch-depth`未配置取默认值1， 使用`Checkout`插件checkout代码只会fetch一个提交， 所以`Last Updated`插件获取不到其他文章的正确提交时间， 最后编译时都使用了最后一次提交时间作为最后更新时间。

修改如下：
```yaml
name: Checkout 🛎️
uses: actions/checkout@v2
with:
  persist-credentials: false
  # Number of commits to fetch. 0 indicates all history.
  fetch-depth: 0
```
提交推送远程仓库，自动部署，`Last Updated`时间恢复正常。
