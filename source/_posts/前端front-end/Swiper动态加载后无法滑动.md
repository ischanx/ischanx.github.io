---
title: 'Swiper动态加载后无法滑动'
date: 2020-08-06 13:28:10
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
# hideComments: false
tags:
- 'Swiper'
- 'Vue'
categories:
- '前端front-end'
---



## 说明

Vue中使用Swiper，但是父组件会有状态切换，切换后Swiper出现异常（卡着其中一组不能滑动切换）

![image-20200806133320474](https://static.chanx.tech/image/acoq3_0.png)

查资料找到解决办法，原因为**swiper在初始化的时候会扫描swiper-wrapper下面的swiper-slide的个数，从而完成初始化，但是由于动态加载是在初始化之后的动作，所以导致无法滑动**

## 解决方法1：在动态获取数据后，马上对swiper进行初始化

每次获取数据后再对swiper进行初始化操作，说白了就是先后顺序不能错

```javascript
$.ajax({
    type:"get",
    url:finalUrl,
    dataType:"json",
    success:function(data){
        $("#reportList").empty();
        for(var i=0;i<reportLength;i++){
            var url="'"+"reportDetial.html"+location.search+"&noticeId="+reportList[i].id+"'";
            reportHtml+='<div class="swiper-slide report-item" onclick="reportJump('+url+')">'
                +'<div class="item-title">'+data.resp[i].title+'</div>'
                +'<div class="item-content">'+data.resp[i].content+'</div>'
                +'<div class="item-date">'+data.resp[i].createTime+'</div>'
            +'</div>';
        }
        $("#reportList").append(reportHtml);
        var swiper = new Swiper('.swiper-container', {
            slidesPerView : 3
        });
    }
});
```



## 解决方法2：修改Swiper参数实现监听变化

 observer:true,	//修改swiper自己或子元素时，自动初始化swiper
 observeParents:true,	//修改swiper的父元素时，自动初始化swiper

```js
var mySwiper = new Swiper ('.swiper-container', {
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        loop: true, // 循环模式选项
        pagination: {
            el: '.swiper-pagination',
        },

    })
```

::: tip

部分内容来自[Carina](https://www.cnblogs.com/yangguoe/p/9857398.html)

:::