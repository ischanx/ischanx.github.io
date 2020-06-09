---
title: "Taro-ui开发的坑"
date: 2020-05-18
sidebarDepth: 2
tags:
- "Taro"
categories:
- "前端front-end"

---

记录使用[Taro-UI](https://taro-ui.jd.com/#/docs/introduction)开发的一些问题
<!-- more -->

## 搜索框问题
### 使用`<input>`原生开发

```html
<input type="search"/>
```

但是需求想把**手机软键盘右下角换成搜索按钮**，安卓上述方法可以实现，但是ios实现 '换行' 变 '搜索' 

```html
<form action="javascript:return true">
	<input type="search" placeholder="请输入">
</form>
```

补充：ios真的是麻烦得飞起

```html
<!--'换行'变'前往'-->
<form action="javascript:return true">
	<input type="text" placeholder="请输入">
</form>

<!--直接唤醒数字九键键盘-->
<input type="text" pattern="[0-9]*" placeholder="请输入数字">

<!--显示26键数字键盘，带有标点符号-->
<form action="javascript:return true">
	<input type="number" placeholder="请输入数字2">
</form>
```

另外[移动端H5开发软键盘的坑](https://www.cnblogs.com/ypppt/p/12846185.html)

###  使用组件`AtSearchBar`

```html
<AtSearchBar
    value={this.state.value}
    onChange={this.onChange.bind(this)}
    onActionClick={this.onActionClick.bind(this)}
/>
```

套上了组件你以为可以了？不不不不

```html
<Atform onSubmit={this.onActionClick.bind(this)}>
    <AtSearchBar
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        onActionClick={this.onActionClick.bind(this)}
    />
</Atform>
```
这样子软键盘上的搜索按钮就能起作用了

那ios软键盘还有一个完成按钮怎么触发呢？

```html
<Atform onSubmit={this.onActionClick.bind(this)}>
    <AtSearchBar
        value={this.state.value}
        onChange={this.onChange.bind(this)}
        onActionClick={this.onActionClick.bind(this)}
        onBlur={this.onActionClick.bind(this)}
    />
</Atform>
```
采用失去焦点即搜索的办法即可