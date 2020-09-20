---
title: 'AceEditor开发的坑'
date: 2020-09-20 14:01:33
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
- 'Javascript'
categories:
- '前端front-end'
---

## 禁止首行编辑
使用到ace实现一个首行禁止编辑的功能，我们知道编辑操作可以这些：插入、删除、粘贴。只要阻止第一行的相关操作就可以了

但是，中文输入法输入会导致一些奇奇怪怪的问题。**所以我们另外对光标进行处理，只要光标点击第一行我们就给他跳转到第二行**

show me the code...
```Javascript
//光标跳转
this.ace.getSession().selection.on('changeCursor', (e)=>{
  if(this.ace.getSelectionRange().start.row == 0 || this.ace.getSelectionRange().end.row == 0){
    this.ace.gotoLine(2);
  }
});
//不能对第一行进行粘贴、删除操作
this.ace.commands.on("exec", (e)=>{
    const hasFirst = this.ace.getSelectionRange().start.row == 0 ;
    const command = e.command.description;
    if ((hasFirst && ( command == "Paste" || command == "Backspace"))) {
      e.preventDefault()
      e.stopPropagation()
    }
});
```

## 初始内容可被撤销/重置撤销栈

每次ace初始化完毕并赋值初始内容后，此时ctrl+z会发生内容消失的情况。因为赋值初始内容其实是一次输入（空 => 初始内容），此时撤销栈会压栈。

解决办法就是，在初始内容赋值完成后立即重置撤销栈。

```Javascript
//初始内容
editor.setValue("And now how can I reset the\nundo stack,-1");
//重置撤销栈UndoManager是保持所有历史的
editor.getSession().setUndoManager(new ace.UndoManager())
```