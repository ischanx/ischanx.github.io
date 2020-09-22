---
title: 'JS原型链那些事'
date: 2020-09-22 19:04:59
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



在使用JavaScript的时候，可能会经常看见控制台输出信息里有`__proto__`或者`prototype`；又或者是你在使用字符串的时候用到一些方法，你会好奇它究竟是写在哪里；又或者是你对JavaScript里面没有类的产生疑惑



## 几种函数

### 作为普通函数

```javascript
//定义函数
function foo(){}
//调用函数
foo();
```

### 作为构造函数

当一个函数被用来创建新对象的时候，我们会叫他为`构造函数`

```javascript
//按照惯例，作为构造函数的函数名首字母需要大写
function Foo(){}
const obj = new Foo();

//当我们使用new操作符的时候，实际上会进行下面几个步骤
//创建一个新的对象
const obj = {};
//原型链连接/对象关联
obj.__proto__ = Foo.prototype;
//把新对象作为函数的上下文
Foo.apply(obj, arguments);
//Foo不返回对象，所以返回新对象
return obj;
```

### 作为对象

```javascript
function foo(){}
foo.name = "tom";
foo['age'] = 20;
```

以上这三种使用方式中，以普通函数来调用的方式十分常见，不再赘述。下面要讲的就是当一个函数**被作为构造函数**来使用和**被作为对象**来使用的时候，分别是什么样的，以及它们之间与原型链的关系是什么样的

## `__proto__`和`prototype`

**对象**有一个特殊的`__proto__`的内置属性，**其实它就是对其他对象的引用**。几乎所有的对象在创建这个属性的时候都会被赋予一个非空的值。**需要注意的是，这个属性可以为空，虽然少见。**它是实现原型链的关键，因为它会指向构造函数的原型对象，即 prototype 属性上的对象，而构造函数原型对象上的`__proto__` 又指向上一级，即：`构造函数.prototype.__proto__ === 上一级构造函数.prototype`，以此类推层层往上，就形成了我们所说的原型链。



`prototype`是**函数**特有的一个属性，它是构造函数的原型对象。JavaScript 是一种基于原型的语言，每个对象都拥有一个原型对象，对象以其原型为模板，从原型继承方法和属性。



先来看看下面的代码

```javascript
var obj = {
	a = 2;
};
obj.a;	//2
```

相信大家都能一下子把结果说出来，结果是2



我们再来看看

```javascript
var anotherObj = {
	a = 2;
};
//创建一个关联到anotherObj的对象
var obj = Object.create(anotherObj);
obj.a;	//2
```

显然，此时`obj`上并没有`a`属性，那么这个值是哪里来的？这就是我们即将要说的**原型链**



当你试图引用对象的属性时会触发`get`操作：

1. 对于默认的`get`操作，第一步是检查对象本身是否有这个属性，如果有的话就直接使用。
2. 但是如果`a`属性不在对象本身，就会继续访问原型链（`???.__proto__`）找到这个属性直至跑完整条原型链

**哪里是原型链的尽头**

由于所有普通（内置）对象都源于`Object.prototype`，所以他们的原型链最终都会指向`Object.prototype`。而`Object.prototype.__proto__`为`null`，这不就断了吗。



## 函数和对象

### 基本

首先我们要知道下面几个关系

1. 所有的原型对象都是由`Object`创建出来的
2. 所有函数对象都是由`Function`创建出来的。Function是一个构造函数，通过new调用可以生成函数对象，即我们一般自定义的那种函数。所以`Fucntion`这个构造函数的`prototype`是所有函数的`__proto__`

另外，`__proto__`是对象的属性；`prototype`是函数的属性

```javascript
Function.prototype.__proto__ === Object.prototype

Object.__proto__ === Function.prototype
```

分析以上两行代码：

1. 看到`Function.prototype`，说明此时`Function`是当成构造函数来使用的。前面说过构造函数都由`Object`创建出来的
2. 看到`Object.__proto__`，说明此时`Object`是被当前对象来使用的，前面说过函数对象都是由`Function`创建出来的

### 特例

Object和Function既是对象，又是函数，两者内部同时含有`__proto__`和`prototype`属性，他们关系较为复杂，以下做归纳。

> Function.prototype指向”内置函数“。而Object.prototype指向”根源对象“

```javascript
Object.__proto__ === Function.prototype //true
Object.__proto__ === Function.__proto__//true
Object.prototype === Function.prototype.__proto__ // true
//因此
Function instanceof Object //true
Object instanceof Function //true
```

![image-20200922205901071](https://chanx-1251137349.file.myqcloud.com/image-20200922205901071.png)

### 梳理

![proto](https://chanx-1251137349.file.myqcloud.com/proto.png)

1. 函数`prototype`属性指向原型对象
2. 所有的原型对象都是由`Object`创建出来的
   - `Foo.prototype.__proto__ === Object.prototype`
   -  `Function.prototype.__proto__ === Object.prototype`
3. 所有函数对象都是由`Function`创建出来的
   - `Foo.__proto__ === Function.prototype`
   - `Function.__proto__ === Function.prototype`
   - `Object.__proto__ === Function.prototype`

4. 普通对象指向构造函数的原型
   - `Obj.__proto__ === Foo.prototype`



::: right

部分内容参考自[不要做切图仔](https://blog.csdn.net/qq_36470086/article/details/82599604)、[dingpanqing3307](https://blog.csdn.net/dingpanqing3307/article/details/101261244?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param)、[山水有轻音](http://blod.wxinxianyun.com/views/category1/2019/091205.html#%E8%A7%A3%E5%86%B3%E9%A2%84%E7%95%99%E9%97%AE%E9%A2%98)

:::

