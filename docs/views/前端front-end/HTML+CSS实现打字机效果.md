---
title: 'HTML+CSS实现打字机效果'
date: 2020-11-21 17:30:38
# 永久链接
# permalink: '/hello-world'
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
- '前端front-end'
---

看到了一些Hexo博客首页用到了打字机效果。于是思考不使用Javascript，如何实现打字机效果呢？

<!-- more -->



![录制_2020_11_17_23_11_09_655](https://chanx-1251137349.file.myqcloud.com/%E5%BD%95%E5%88%B6_2020_11_17_23_11_09_655.gif)

一个字总结：**丑**。

**实现：利用css中`animiation`实现关键帧组成循环动画。`width`减少模仿字体被删除；`border-right`黑白变色模仿光标闪烁**



直接上源码：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #demo {
      white-space: nowrap;
      font-family: 'Courier New', Courier, monospace;
      width: 250px;
      font-size: 2em;
      font-weight: 700;
      overflow: hidden;
      animation: first 6s step-end infinite;
      display: inline-block
    }
    #key {
      margin-top: -200px;
      line-height: 50px;
      font-size: 1em;
      color: blue;
    }
    @keyframes first {
      0% {
        width: 250px;
        border-right: 3px solid black;
      }

      5% {
        width: 250px;
        border-right: 3px solid white;
      }

      10% {
        width: 250px;
        border-right: 3px solid black;
      }

      20% {
        width: 200px;
        border-right: 3px solid white;
      }

      25% {
        width: 200px;
        border-right: 3px solid black;
      }

      30% {
        width: 200px;
        border-right: 3px solid white;
      }

      40% {
        width: 150px;
        border-right: 3px solid black;
      }

      45% {
        width: 150px;
        border-right: 3px solid white;
      }

      50% {
        width: 150px;
        border-right: 3px solid black;
      }

      60% {
        width: 100px;
        border-right: 3px solid white;
      }

      80% {
        width: 50px;
        border-right: 3px solid black;
      }

      100% {
        width: 0px;
        border-right: 3px solid white;
      }
    }
  </style>
</head>

<body>
  <span id="demo">THIS DEMO</span>
</body>

</html>
```

