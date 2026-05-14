---
title: Vue踩过的坑
description: Vue踩过的坑
createDate: 2020-08-15T00:00:00.000Z
updateDate: 2020-08-15T00:00:00.000Z
image: ''
tags:
  - Vue
category: 前端
draft: false
sticky: false
permalink: vue-development
---

## vue-router的beforeEach第一次打开页面不执行
分析：`vue.use`的时候已经初始化了，挂载的时候hash值没有发生变化，所以不会执行`beforeEach`

所以正确的代码顺序如下（先路由再初始化）：
```javascript
router.beforeEach((to, from, next) => {
  //token校验
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

## `form`只有一个`input`时按回车会自动提交
W3C 标准中有如下[规定](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2)：

> *When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.*

即：当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 `<el-form>` 标签上添加 `@submit.native.prevent`。

