---
title: "element-ui开发中遇坑记录"
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