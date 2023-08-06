---
title: 'vue多页面应用配置'
date: 2020-10-27 19:45:41
# 永久链接
permalink: /vue-pages/
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
- 'Vue'
categories:
- '前端'
---



首先搭建一个脚手架项目，`vuecli4 + vue2默认配置 + router + vuex`。此时得到一个原始的**vue单页面应用**项目，去掉组件。

## 多页面应用结构

### 了解单页面

在项目根目录下新建`vue.config.js`文件，我们先看看默认配置了解一下单页应用

![image-20201027173459149](https://static.chanx.tech/image/aghmr_0.png)

```javascript
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  // 页面入口
  pages:{
    index: {
      entry: "src/main.js",
      title: "标题",
    },
  },
  devServer: {
    open: false, //关闭自动打开浏览器
  }
 }
```

此时打包后的`index.html`会使用`main.js`作为入口，可以理解为初始化的执行文件

当然，我们不想让他叫`index.html`，给他换个名字是吧，比如`demo.html`

我们修改一下页面对象的名字，如下

```javascript
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  // 页面入口
  pages:{
    demo: {
      entry: "src/main.js",
      title: "标题",
    },
  },
  devServer: {
    open: false, //关闭自动打开浏览器
  }
 }
```

此时打包后的页面文件为`demo.html`，它会使用`main.js`作为入口

当然，我们可能还要加入**模板页面**，打包的时候以它为模板

我们在根目录新建一个HTML文件，就叫`template.html`吧

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8>
    <meta name=viewport content="width=device-width,initial-scale=1">
    <title>
        <%= htmlWebpackPlugin.options.title %>
    </title>
</head>

<body>
  <div id=app></div>
</body>

</html>
```

`<%= htmlWebpackPlugin.options.title %>`对应的是页面对象的`title`属性，当然还有其他一些属性

此时，`vue.config.js`需要修改一下

```javascript
module.exports = {
  publicPath: "/",
  productionSourceMap: false,
  // 页面入口
  pages:{
    index: {
      entry: "src/main.js",
      // 模板文件
      template: "template.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "标题",
    },
  },
  devServer: {
    open: false, //关闭自动打开浏览器
  }
 }
```

此时打包后会输出`index.html`文件

> 问题来了，修改页面对象的名字跟页面对象中的filename属性有什么关系呢？
>
> 我认为在filename为空的情况下，打包时会使用页面对象的名字
>
> 总的来说，就是filename属性优先

这么一来，`vue单页面应用`的结构好像摸得差不多了

**访问HTML文件，然后通过入口JS文件进行初始化（如实例化Vue），把`App.vue`挂到网页上**



### 基于单页面改造多页面

基于单页面应用，如何改造成多页面应用？

上面我们知道，一个`Vue单页面应用`入口由三部分组成：网页模板`.html`、入口文件`.js`、Vue页面`.vue`

> 网页模板不是必须提供的，但打包时会生成默认的模板

那么每一个页面都是这样子的咯，我们开始改造？

![image-20201027181144590](https://static.chanx.tech/image/apwha_0.png)

根据两个页面对象的`filename`，我们知道打包后是两个页面文件`app1.html`和`app2.html`

那`index.html`是什么？

![image-20201027181312761](https://static.chanx.tech/image/cr4xb_0.png)

可以看到`index.html`里面并没有逻辑代码，所以纯粹就是输出了一个默认的网页模板

打开浏览器，看下我们的成果

![image-20201027181619615](https://static.chanx.tech/image/aqb4q_0.png)

**多页面应用get!!!**

>多页面应用中各页面是相互独立的, 因为他们各自拥有自己的Vue实例和router实例和vuex实例
>
>可以说是两个独立的项目

### 自动生成页面对象

```javascript
const glob = require("glob");
// 获取文件信息 => 生成pages对象
function handleEntry(entry) {
  const entries = {};
  let entryBaseName = "";
  let entryPathName = "";
  let entryTemplate = "";

  glob.sync(entry).forEach(item => {
    entryBaseName = path.basename(item, path.extname(item));
    entryTemplate = item.split("/").splice(-3);
    entryPathName = entryBaseName;
    /**
     * entry为pages下页面文件夹名字的js文件，如pages/app1/app1.js
     * template为pages下页面文件夹的html文件
     */
    entries[entryPathName] = {
      entry: `src/${entryTemplate[0]}/${entryTemplate[1]}/${entryTemplate[1]}.js`,
      template: `src/${entryTemplate[0]}/${entryTemplate[1]}/${entryTemplate[2]}`,
      title: entryTemplate[2],
      filename: entryTemplate[2],
    };
  });

  return entries;
}

const pages = handleEntry("./src/pages/**?/*.html"); // 调用函数扫描pages文件夹


module.exports = {
	pages,
}
```

**注意: 用此方法生成页面对象时必须保证pages下文件夹与相应入口js文件同名, 如pages/app1/app1.js**

##   隐藏html后缀

然后我们兴奋地打包文件部署到生产环境`Nginx`上，然后访问

![image-20201027183545808](https://static.chanx.tech/image/arf0c_0.png)

一脸问号？？？那我们换个方式....

> index.html 是默认网页，在服务器上比如访问'/'时，服务器会指向index.html。故不会发生这种情况

![image-20201027183640128](https://static.chanx.tech/image/as3v1_0.png)

啊这...每次都要加个html后缀才能访问，甲方会不会炸的？

> **注意：路由模式为History的请往下看,此方法不适用**

我们配置一下`nginx`让他在没有后缀名的情况下也能找到文件，配置文件为`XX.conf`

```
 location / {
     if (!-f $request_filename){
         rewrite (.*)$ $1.html last;
         break;
     }
 }
```

大功告成

**注意: 在隐藏html后缀的情况下,url不允许"."的出现; 即参数不能出现点, 同时页面跳转无需加后缀`<a href="./app2"></a>`**

## 路由使用history

甲方可能又要说了：你这个网址怎么每次都有一个`#`呀，去掉去掉

噢！万能的工具人此时应该想到了路由里面的`mode: "history"`

我们把路由改成`history`模式，热情高涨地进行开发



### 路由跳转路径有误

尝试切换路由，不对劲 => `/app1`应该切换到`/app1/about`的，但实际上是切成`/about`

好活！路由加个前缀应该就没问题了

```javascript
const router = new VueRouter({
  mode: "history",
  base:"/app1/",
  routes
})
```



### 刷新路由丢失

开发环境中，路由跳转后刷新页面可能会出现404错误。**因为刷新页面时访问的资源找不到，因为`vue-router`设置的路径不是真实存在的路径。**`vue.config.js`加入以下配置

```javascript
  devServer: {
    open: false, //关闭自动打开浏览器
    historyApiFallback: {
      verbose: true,
      rewrites: [
        { from: /^\/app1\/.*$/, to: "/app1.html" },
        { from: /^\/app2\/.*$/, to: "/app2.html" },
      ],
    },
  }
```

既然本地开发的服务端要做配置，那么生产环境的`nginx`服务器也需配置

```
location / {
    try_files $uri $uri/ @router;
    index index.html;
}


location @router {
    # rewrite ^.*$ /index.html  last;
    # 多页面 时刷新配置如下 
    # rewrite ^((?!/(app1|app2)/*).)*$ /index.html last; 
    rewrite ^/app1/*  /app1.html  last;
    rewrite ^/app2/*  /app2.html  last;
}
```



## 其他错误

### Uncaught SyntaxError:Unexpected token

`vue.config.js`配置

```javascript
module.exports = {
  publicPath: "/",
}
```

