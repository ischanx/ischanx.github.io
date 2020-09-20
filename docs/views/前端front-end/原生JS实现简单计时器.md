---
title: '原生JS实现简单计时器'
date: 2020-06-06 22:47:05
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
tags:
- 'Javascript'
- 'Demo'
categories:
- '前端front-end'
---

在线预览: **[点我查看demo](http://demo.chanx.tech/timer.html)**
<!-- more -->

## 做什么
用原生的js实现一个简单计时器。比如说记录编辑框他输入内容所用的时间。
## 怎么做
**HTML**

一个编辑框和一个时间显示器

**JS**

编辑框获得焦点时`setInterval()`进行计时,失去焦点时`clearInterval()`取消计时
另外利用`localStorage`可以进行数据的保存，刷新后能读取上次的时间

## 代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>计时器</title>
</head>
<body>
    <div id="container">
        <h3 id="status">计时器案例 - 未做题</h3>
        <textarea rows="5" cols="20" onfocus="inputFocus()" onblur="innputBlur()" placeholder="点击输入框开始计时"></textarea>
        <h4 id="timer">做题时长: 0时0分0秒</h4>
        <button onclick="resetTime()">重新计时</button>
    </div>

    <script>
        var second = 0; //记录时间-秒
        var timing;     //定时器

        //更新显示时间
        function updateTime(){
            let _hour = Math.floor(second /3600);
            let _minute =  Math.floor((second%3600) / 60);
            let _second = (second%3600) %60;
            document.getElementById("timer").innerText = "做题时长："+_hour+"时"+_minute+"分"+_second+"秒";
        }

        function resetTime(){
            window.localStorage.setItem("status",0);
            second = 0;
            updateTime();
        }
        //输入框获得焦点时开始计时
        function inputFocus(){
            document.getElementById("status").innerText = "计时器案例 - 做题中";
            timing = setInterval(function(){
                second ++;
                updateTime();
            },1000);
        }

        //输入框失去焦点取消计时
        function innputBlur(){
            document.getElementById("status").innerText = "计时器案例 - 未做题";
            clearInterval(timing);
        }

        //网页加载完执行数据初始化
        window.onload = function(){
            let t = window.localStorage.getItem("time");
            second = t?t:0; //无数据时默认为0
            updateTime();
        }

        //网页刷新前进行数据缓存
        window.onbeforeunload = function(){
            innputBlur();
            window.localStorage.setItem("time",second);
        }
    </script>
</body>
</html>
```

## 思考

是否可以利用两个开始和结束的两个时间戳获取一个时间段？但是需要注意的是我们`new Date()`获取的时间可能会受到系统时间的影响，导致获取的数据不合法。