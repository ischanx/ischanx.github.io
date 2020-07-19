---
title: "Taro-ui开发的坑"
date: 2020-05-18
sidebarDepth: 2
tags:
- "Taro"
- "H5"
categories:
- "前端front-end"
---

记录使用[Taro-UI](https://taro-ui.jd.com/#/docs/introduction)开发的一些问题
<!-- more -->

## 搜索框问题
补充：这个搜索框问题是事后很久才补的，修修改改不知道是不是正确做法了，但是就是这么个思路。
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

## 置底输入框问题
需求是想要一个置底(`position:absolute;`)的输入框，但是在ios里面点击输入框后，软键盘会完全遮挡输入框。

经过分析，是因为在安卓手机打开软键盘后，页面高度和显示高度取的是**屏幕高度 - 软键盘高度**，即大约原来一半

但是在ios手机上，此时页面高度还是屏幕高度，但是显示的区域只有原来一半，这时候taro的壳会自动出现滚动条，而且我们无法进行手动滚动

（啊！我也不知道怎么描述/不懂具体原因啊，反正就是不能实现手动滚动

于是我针对ios手机进行高度的特殊处理,将页面高度与显示区域进行同步，实现手动滚动

首先是判断手机类型，默认是安卓，防止意外情况。
```javascript
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    let type;
    if(!isAndroid && isIOS){
        type = "ios";
    }else type = "android";
    this.setState({phoneType:type});
```
然后监听输入框的获得焦点事件，触发下列行为
```javascript
    setTimeout(function () {
        //ios高度特殊处理，-30px是为了页面样式
        if(_this.state.phoneType == "ios"){
            document.getElementsByClassName("taro_router")[0].style.minHeight = 'calc(50%-30px)';
            document.getElementsByClassName("taro_router")[0].style.maxHeight = 'calc(50%-30px)';
        }
        //输入框滚动置底，底部与页面底部对齐
        document.getElementsByClassName("item__footer")[0].scrollIntoViewIfNeeded(false);
    }, 10);
```
记得失去焦点的时候进行恢复操作即可