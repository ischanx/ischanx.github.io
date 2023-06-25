---
title: '网页DarkMode'
date: 2021-11-22 18:04:05
permalink: '/darkmode/'
tags:
- 'Javascript'
- 'CSS'
categories:
- '前端front-end'
---



## 目标

主题化功能长期存在，可供用户前端自行切换

- LightMode：日间模式、浅色模式、白色模式
- DarkMode：夜间模式、深色模式、黑色模式

> 中文表达较多，下文默认使用英文表达





色板：

https://materialui.co/colors

[Tailwind Color Palette](https://tailwindcolor.com/)

https://antv.vision/zh/docs/specification/language/palette



**Ant Design**关于配色的

https://ant.design/docs/spec/colors-cn

https://ant.design/docs/spec/dark-cn

https://github.com/ant-design/ant-design/blob/5ab2783ff00d4b1da04bb213c6b12de43e7649eb/components/style/color/colors.less





Leetcode是如何做Darkmode的？

CSS中`var()`和`:root`。root设置默认色板，切换成darkmode时添加`.dark`类名，该类下有主题色板，优先级覆盖默认色板，达到切换效果。

> 叫法：C - s - s，var（哇！）



## 现有方案

可以按变量出现的时间分为**运行时**和**编译时**两种类型的方案

### 运行时方案

- 使用`css var`方式
- 使用`less`运行时方式，可以在线实时编译`less`代码
- 使用`js`操作样式代码

### 编译时方案

使用`css预处理器`，使用`scss/sass`、`less`等预处理器在项目构建时生成多套样式代码

## 预期问题

1. 项目内无样式规范，已有样式不统一
2. `ElementUI`样式处理
3. 是否存在特殊组件不希望被主题切换影响
4. 主题化方案，及色板
