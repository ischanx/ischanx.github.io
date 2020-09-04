---
title: 'Vue踩过的坑'
date: 2020-08-15 23:48:30
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
- 'Vue'
categories:
- '前端front-end'
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