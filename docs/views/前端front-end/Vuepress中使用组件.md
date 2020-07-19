---
title: 'Vuepress中使用Vue组件'
date: 2020-07-11 23:47:33
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
sidebar: false
# sidebarDepth: 2
# isTimeLine: false
isShowComment: true
tags:
- 'Vuepress'
categories:
- '前端front-end'
---

在Vuepress使用Vue组件

<!-- more -->

所有在`.vuepress/components`中找到的`*.vue`文件将会自动地被注册为全局的异步组件，如：

```
.
└─ .vuepress
   └─ components
      ├─ demo-1.vue
      ├─ OtherComponent.vue
      └─ Foo
         └─ Bar.vue
```
现在我们有一个组件是`Example.vue`

## 页面组件
我们现在有一个页面是`Readme.md`，然后在Front Matter里填写字段`Layout: Example`，此时整个页面会被组件代替

## 功能组件
有时候我们只是想在页面里引入一个小组件，而不是想引入一个页面。那么可以直接在Markdown文件里写下`<Example/>`（markdown文件里支持vue的语法，而组件被全局注册，所以直接写就行，另外还有一些表达式什么的都可以）

详细介绍文档可以见：[Vuepress官方文档](https://www.vuepress.cn/guide/using-vue.html)