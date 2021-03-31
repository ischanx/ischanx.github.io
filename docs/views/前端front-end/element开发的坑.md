---
title: "Element-ui开发的坑"
date: 2020-04-22
sidebarDepth: 2
tags:
- "Element"
- "Vue"
categories:
- "前端front-end"
---
记录一些常见不正确使用导致的错误
<!-- more -->

## [Vue][Element Warn][Form]model is required for validate to work!

### 1. 属性绑定错误(常见)
确保使用`:model`，而不是`v-model`
```html
<el-form :model="form" ref="form" :rules="rules"
    label-position="left" label-width="120px">
</el-form>
```
### 2. ref重复
检查是否在其他el-form中使用了相同的ref名，多个el-form组件ref命名要独立

## el-upload多选文件时触发多次上传钩子

1. 上传钩子不做实际上传操作，另外设置上传按钮触发正式上传

2. 对上传钩子进行聚合，多次触发合并一次。可见[前端函数或请求的聚合](./前端函数或请求的聚合.md)的思路

## Todo

```
<el-table-column>
	<templete>
		****
	</templete>
</el-table-column>
自定义列时要加templete

<el-upload>的隐藏做法：官方思路和github两个实现方法

多选表格的状态保留：单页和多页

vue-quill-editor空格问题white-space

template or render function not defined 重新run dev

深浅拷贝

动态路由
```

