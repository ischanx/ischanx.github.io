---
title: '原生JS实现复制功能'
date: 2020-08-06 14:24:53
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





使用`document.execCommand("Copy");`但是它只能是操作可编辑区域的内容，也就是意味着除了 `<input>`、`<textarea>` 这样的输入域以外，是无法使用这个方法的。但是我们可以这个样子实现其他元素的复制：

```Javascript
var text=document.getElementById("id").innerText;
var t = document.createElement('input');
t.style.display='none';//隐藏这个输入框
t.value = text;
document.body.appendChild(t);
t.select(); // 选择对象
document.execCommand("Copy"); // 执行浏览器复制命令
alert('复制成功');
```



**遇到的坑**

在Chrome下调试的时候，这个方法时完美运行的。然后到了移动端调试的时候，坑就出来了。

对，没错，就是你，ios...

**1、点击复制时屏幕下方会出现白屏抖动，仔细看是拉起键盘又瞬间收起**

知道了抖动是由于什么产生的就比较好解决了。既然是拉起键盘，那就是聚焦到了输入域，那只要让输入域不可输入就好了，在代码中添加`input.setAttribute('readonly', 'readonly');`使这个`<input>`是只读的，就不会拉起键盘了。

**2、无法复制**

这个问题是由于`input.select()`在ios下并没有选中全部内容，我们需要使用另一个方法来选中内容，这个方法就是 `input.setSelectionRange(0, input.value.length);`

完整代码如下：

```javascript
const btn = document.querySelector('#btn');
btn.addEventListener('click',() => {
	const input = document.createElement('input');
 input.setAttribute('readonly', 'readonly');
 input.setAttribute('value', 'hello world');
 document.body.appendChild(input);
	input.setSelectionRange(0, 9999);
	if (document.execCommand('copy')) {
		document.execCommand('copy');
		console.log('复制成功');
	}
 document.body.removeChild(input);
})
```



::: tip

部分内容来自[axuebin](https://github.com/axuebin/articles/issues/26)

:::