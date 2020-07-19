---
title: "Javascript高级程序设计"
date: 2020-05-02
sidebarDepth: 2
tags:
- "Javascript"
categories:
- "前端front-end"
- "笔记note"
---
阅读《Javascript高级程序设计》红宝书的笔记记录，参杂一些个人的思考和想法。
<!-- more -->

## Javascript简介
### JS和ES的关系
就Javascript和ECMAscript来说，一般我们认为是同一个东西。

实际上，一个完整的Javascript应该由 **核心（ECMAscript）、文档对象模型（Document Object Model）、浏览器对象模型（Browser Object Model）** 三部分组成

由此看来，Javascript的范围比ECMAscript大得多


>个人理解ECMAscript是语法部分
## 基本概念

### Typeof操作符

基于ECMAscript是松散类型的，因此需要有一种手段来检测给定变量的数据类型

typeof就是负责提供这方面信息的**操作符**。

```javascript
var message = "some string";
alert(typeof message);	//"string"
alert(typeof (message));//"string"
alert(typeof 95);		//"number"
```



是的，没错，它是一个操作符而不是一个函数。尽管例子中的圆括号可以使用，但是它并不是必需的。

### Undefined类型和Null类型

Undefined类型只有一个值，即特殊的undefined。

```javascript
var message;
alert(message == undefined);	//true

var message = undefined;
alert(message == undefined);	//true
```

以上两段代码实际上是等价的，在声明变量时未对变量进行初始化，它就会被隐式初始化为undefined



## Todo

```
P33	string字符串
p48	加性操作符
p51	相等操作符
p60	with语句
p64	js参数
（js无函数签名、不能重载、跟js数据类型也应该有关系）
p68	类型问题是否可以引出深浅拷贝这个概念（复制）
没有块级作用域
变量提升=>变量先声明
变量查询标识符从下往上找，故局部变量和外部变量同名，局部变量有效。另外还有局部变量与形参同名的情况
```

