---
title: '重新认识 window.open()'
date: 2021-08-15
tags:
- 'Javascript'
- 'HTML'
categories:
- '前端front-end'
---





# window.open的返回值

重新认识一下这个函数`window.open(url, ``*windowName, windowFeatures)*`

执行`window.open`函数，我们可以打开一个新的标签页



**其实，它是有返回值的，它返回新窗口的引用**`**WindowProxy**`

通过返回值这个新窗口的引用，我们可以做一些符合同源策略的操作

> If the window couldn't be opened, the returned value is instead `null`. The returned reference can be used to access properties and methods of the new window as long as it complies with [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) security requirements.



那么，我们可以这么操作（A标签页下通过`window.open`打开B标签页）：

- A和B标签页同源的情况下，在A标签页通过**新窗口引用**操作B的`localStorage`

![img](https://static.chanx.tech/image/12osuh7_0.png)

- A和B标签页不同源的情况下，在A标签页通过**新窗口引用**操作B的`localStorage`

![img](https://static.chanx.tech/image/12ot31t_0.png)

学到了学到了，但是好像并没有什么用...

尝试一下改变`location`？**你会发现标签页进行了跳转。**

![img](https://static.chanx.tech/image/12ot89f_0.png)

# window.opener

上面讲的是「父标签页」操作「子标签页」，这里讲的就是相反的。

标签页在打开的时候会在`window.opener`存着对父标签页的引用

跟前面所讲到的一样，通过引用可以执行一些操作，比如修改父标签页的`location`达到重定向的效果

如果`window.open`打开的是一个恶意网址B，B修改A的`location`，就可以偷偷的把你的A转到钓鱼网址



# 多种打开新标签页的方式

1. 带上`_blank`属性

```HTML
<a href="https://www.feishu.cn/" target="_blank">打开新的标签页</a>
```

1. 带上`_blank` 属性并且带 `opener`

```HTML
<a href="https://www.feishu.cn/" rel="opener" target="_blank">打开新的标签页</a>
```

1. 带上 `_blank` 属性并且带`noopener`

```HTML
<a href="https://www.feishu.cn/" rel="noopener" target="_blank">打开新的标签页</a>
```

1. `window.open()` 且不清除 `opener` 的值

```TypeScript
<span class="link" onclick="openNewTabWithOpener()">打开新的标签页</span>

// js
function openNewTabWithOpener(){
    window.open("真实地址");
}
```

1. `window.open()`后再清除 `opener`

```TypeScript
<span class="link" onclick="openNewTabWithoutOpener()">打开新的标签页</span>

// js
function openNewTabWithoutOpener(){
    window.open("");
    window.opener = null;
    window.location = "真实地址";
}
```

1. `window.open()`时带 `noopener`属性

```TypeScript
<span class="link" onclick="openNewTabWithoutOpener()">打开新的标签页</span>

// js
function openNewTabWithoutOpener(){
    window.open("真实地址","_blank","noopener")
}
```

# `noopener`一定要加上吗？

1. `chrome88`版本对超链接的`rel`默认设置为`noopener`

> 舒舒服服，默认就有，不用加了

1. `chrome89`版本`noopener`终止`clone sessionStorage`

> 要是登录态存在session，那`noopener`打开一个相同网址的标签页就要重新登录

> 上述新标签页打开方式3和6就受这条更新的影响



所以，`noopener`并不是随便加的。在不确认新链接指向哪的时候，加上`noopener`比较稳妥；而在明确的可信链接指向下，加不加就看心情。



但是需要注意，由于`chrome89`版本的这一特性，标签页使用`a标签`还需要考虑加上`rel="opener"`。







# 补充

在代码中执行`window.open`经常会被浏览器或者是一些插件认为上不友好的行为，然后被拦截

> 想起被弹窗广告支配的时代吗？

怎么优雅地用`JavaScript`打开一个新标签页？

**新建一个**`**<a>**`**并加上**`**noopener**`**属性,再触发点击**

```TypeScript
<span class="link" onclick="openNewTab()">打开新的标签页</span>

// js
function openNewTab(){
    const link = document.createElement("a");
    link.href = "真实地址";
    link.rel = "noopener";    // 这个视情况决定
    link.target = "_blank";
    link.click();
}
```



当然，除了`noopener`这一属性外，还有`noreferrer`属性来设置新标签页请求的`referer`
