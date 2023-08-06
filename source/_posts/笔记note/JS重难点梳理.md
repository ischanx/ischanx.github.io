---
title: 'JS重难点梳理'
date: 2020-10-22 20:38:32
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
# hideComments: false
tags:
- 'Javascript'
- ''
categories:
- '笔记'
---



## 第6章 面向对象的程序设计

### 理解对象

#### 属性类型

#### 定义多个属性

#### 读取属性的特性

### 创建对象

#### 工厂模式

#### 构造函数模式

#### 原型模式

#### 组合使用构造函数模式和原型模式

#### 动态原型模式

#### 寄生构造函数模式

#### 稳妥构造函数模式

### 继承

#### 原型链

#### 借用构造函数

#### 组合继承

#### 原型式继承

#### 寄生式继承

#### 寄生组合式继承



## 第7章 函数表达式

### 递归

### 闭包

**闭包**：函数中有权访问另一个函数作用域中的变量

#### 闭包与变量

```javascript
function createFunctions(){
	var result = new Array();
	for(var i = 0; i < 10; i++){
		result[i] = function(){
			return i;
		};
	}
	return result;
}
```

上述例子每个函数都引用着保存变量i的同一个变量对象，所以每一个函数内部i的值都是10

```javascript
function createFunctions(){
	var result = new Array();
	for(var i = 0; i < 10; i++){
		result[i] = (function(num){
            return function(){
                return num;
            }
		})(i);
	}
	return result;
}
```

这个例子中我们没有直接把闭包赋值给数组，二十定义一个匿名函数并立即执行。由于函数参数式**按值传递**的，所以就会将变量i的当前值复制给参数num。而在这个匿名函数内部，又创建并返回了一个访问num的闭包。这样一来，result数组中的每个函数都有自己的num变量的一个副本，因此就可以返回各自不同的数值

#### 关于this对象

```javascript
var name = "The Window";

var object = {
	name : "My Object",
	getNameFunc: function(){
		return function(){
			return this.name;
		}
	}
};

alert(object.getNameFunc()());	//"The Window"(在非严格模式下)
```
每个函数在被调用的时候，其活动对象都会自动取得两个特殊变量：this和arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量
```javascript
var name = "The Window";

var object = {
	name : "My Object",
	getNameFunc: function(){
        var _this = this;
		return function(){
			return _this.name;
		}
	}
};

alert(object.getNameFunc()());	//"My Object"
```

另外，在几种特殊情况下，this的值可能会意外地改变。

```javascript
var name = "The Window";
var object = {
	name : "My Object",
	getName: function(){
		return this.name;
	}
};


object.getName();	//"My Object"
(object.getName)();	//"My Object"
(object.getName = object.getName)();	//"The Window"，在非严格模式下
```

第一和第二行代码其实是一样的，第三行代码先执行赋值语句再调用赋值后的结果。因为这个赋值表达式的值是函数本身，所以this的值得不到维持。常见情况下并不会出现二三两种写法，只是为了更好地说明细微的语法变化可能会导致this的值发生改变。

#### 内存泄漏

`IE9`之前的版本对`JScript`对象和`COM`对象使用不同的垃圾收集例程，因此闭包在IE的这些版本里会导致一些特殊问题。具体来说，如果闭包的作用域链中保存着一个`HTML`元素，那么就意味着该元素将会无法被销毁

```javascript
function assignHandler(){
	var element = document.getElementById("someElement");
	element.onclick = function(){
		alert(element.id)
	};
}
```

以上代码创建了一个作为`element`元素事件处理程序的闭包，而这个闭包则又创建了一个循环引用。由于匿名函数保存了一个对`assignHandler()`的活动对象的引用，因此就会导致无法减少element的引用数。只要匿名函数存在，`element`的引用数至少也是1，因此它所占用的内存就永远不会被回收

```javascript
function assignHandler(){
	var element = document.getElementById("someElement");
    var id = element.id;
	element.onclick = function(){
		alert(id)
	};
    element = null;
}
```

在上面的代码中，通过把`element.id`的一个副本保存在一个变量中，并且在闭包中引用该变量消除了循环引用。但仅仅做到这一步还是不能解决内存泄漏的问题。必须要记住：**闭包会引用包含函数的整个活动对象**，而其中包含着`element`。即使闭包不直接引用`element`，包含函数的活动对象中也仍然会保存一个引用。因此，有必要把`element`设置为`null`。这样就能接触对`DOM`对象的引用，顺利减少其因引用数，确保正常回收其占用的内存。

### 模仿块级作用域

在Javascript中没有块级作用域的概念（ES6中出现了`let`）

```javascript
(function output(){
    for(var i = 0; i < 5; i++){
    	alert(i);
    }
    alert(i);	//"5"
})();
```

在Java、C++等语言中，变量i只会在for循环的语句中有定义，循环一旦结束，变量i就被销毁。

可是在Javascript中变量i是定义在`output()`的活动对象中的，因此从它有定义开始，就可以在函数内部的任意处访问它



**匿名函数可以用来模仿块级作用域（又称私有作用域）并避免这个问题**

```javascript
function(){
	//这里是块级作用域
}();	//出错
```

Javascript将function关键字当作一个函数声明的开始，而函数声明后面不能跟圆括号。然而，**函数表达式的后面可以跟圆括号**

```javascript
(function(){
	//这里是块级作用域
})();
```

无论在什么地方，要临时使用变量就可以使用私有作用域

```javascript
function output(count){
    (function(){
        for(var i = 0; i < count; i++){
    		alert(i);
    	}
    })();
    alert(i);	//导致一个错误
}
```

在for循环的外部插入了一个私有作用域。在匿名函数中定义的任何变量都会在执行结束时被销毁，因此变量i只能在循环中使用。而在私有作用域中能够访问变量count，是因为这个匿名函数是一个闭包，它能够访问包含作用域内的所有变量

### 私有变量

#### 静态私有变量

#### 模块模式

#### 增强的模块模式

### 小结