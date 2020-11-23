---
title: 'JS实现拖拽移动元素'
date: 2020-11-23 20:32:43
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
tags:
- 'Javascript'
categories:
- '前端front-end'
---



**实现的效果如图**

<img src="https://chanx-1251137349.file.myqcloud.com/%E5%BD%95%E5%88%B6_2020_11_23_20_10_35_670.gif" alt="录制_2020_11_23_20_10_35_670" style="zoom:50%;" />

**实现步骤：**

- 鼠标按下时进入拖拽状态`onmousedown`
- 鼠标移动时，如果是拖拽状态，则元素跟随移动`onmousemove`
- 鼠标弹起或鼠标离开元素范围时退出拖拽状态`onmouseup`和`onmouseleave`

<img src="https://chanx-1251137349.file.myqcloud.com/image-20201123202140098.png" style="zoom:50%;" />

**如何跟随移动？计算两个鼠标指针的距离差，然后应用到目标元素上**

需要注意的是：

- 若是对移动范围有要求，需要做相应处理禁止移动
- 若是对性能有要求，记得做**防抖**处理



代码如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>拖拽移动元素</title>
  <style>
    #tools {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 100px;
      width: 100px;
      background-color: cadetblue;
      cursor: move;
    }
  </style>
</head>
    
<body>
  <div id="tools"></div>
  <script>
    let start = null;   // 鼠标位置记录
    let isDrag = false; // 拖拽状态
    const tools = document.getElementById("tools");
    // 鼠标按下的时候记录初始鼠标位置
    tools.onmousedown = function (e) {
      start = {
        x: e.x,
        y: e.y,
      };
      isDrag = true;
    }
    // 鼠标抬起时结束拖拽
    tools.onmouseup = function (e) {
      isDrag = false;
    }
    // 鼠标移出目标元素范围自动结束拖拽
    tools.onmouseleave = function (e) {
      isDrag = false;
    }
    // 鼠标移动时移动目标元素
    tools.onmousemove = function (e) {
      if (isDrag) {
        // 计算两次鼠标的位置差
        let distance = {
          x: e.x - start.x,
          y: e.y - start.y,
        }
        // 移动目标元素
        tools.style.left = tools.offsetLeft + distance.x + 'px';
        tools.style.top = tools.offsetTop + distance.y + 'px';
        // 保存本次鼠标位置
        start.x = e.x;
        start.y = e.y;
      }
    }
  </script>
</body>
</html>
```



