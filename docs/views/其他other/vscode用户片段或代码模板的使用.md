---
title: 'vscode用户片段或代码模板的使用'
date: 2020-05-30 15:46:31
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
tags:
- "教程"
categories:
- '其他other'
---

使用vscode的时候，肯定想自定义一些代码模板来提高效率

<!-- more -->

## 配置模板

**这里举一个我码博客文章的一个Markdown模板**

![image-20200530162713944](https://chanx-1251137349.file.myqcloud.com/image-20200530162713944.png)

<u>打开配置文件：文件 - 首选项 - 用户片段  - markdown.json</u>

可以看到一个默认的Example

```json
	// Place your snippets for markdown here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	// "Print to console": {
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
    // }
```

那么我的模板是什么呢？

```json
    "Blog Template": {			//用于区别的名称
		"prefix": "blog",		//使用模板的命令   比如这里就是输入blog就能打开该模板
		"body": [				//body里面就是模板每一行的内容
            "---",
            "title: '$TM_FILENAME_BASE$1'",		//$TM_FILENAME_BASE自动获取不带扩展名的文件名
            "date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND",	//详细日期如2020-05-30 16:34:30
            "# 永久链接",
            "# permalink: '/hello-world'",
            "# 文章访问密码",
            "# keys: '123'",
            "# 是否发布文章",
            "# publish: false",
            "# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级",
            "# sticky: 1",
            "tags:",
            "- '$2'",
            "categories:",
            "- '$TM_DIRECTORY$3'",	//自动获取目录路径
            "---",
            "",
            "$0",
		],
		"description": "blog file template."	//模板的描述信息
	}
```

其中有一些$或${}变量能让我们设置：

```
TM_FILENAME 当前文件名
TM_FILENAME_BASE 当前文件名，不带扩展名
CURRENT_YEAR 当前年份
CURRENT_YEAR_SHORT 当前年份，最后两位数字
CURRENT_MONTH 当前月份数字形式，两位表示
CURRENT_MONTH_NAME 当前月份英文形式，如 July
CURRENT_MONTH_NAME_SHORT 当前月份英文缩写形式，如 Jul
CURRENT_DATE 当前日
CURRENT_DAY_NAME 当前星期，如 Monday
CURRENT_DAY_NAME_SHORT 当前星期缩写形式，如 Mon
CURRENT_HOUR 当前小时，24小时格式，两位表示
CURRENT_MINUTE 当前分钟，两位表示
CURRENT_SECOND 当前秒，两位表示
TM_DIRECTORY 当前文件所属目录的绝对路径
TM_FILEPATH 当前文件的绝对路径
```

更多的语法可以参考[vscode文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)



你可能会好奇$1,$2,$0这些是什么东西

```
$1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the same ids are connected.

他们是光标停止的地方，能让你快速切换至下一编辑点,$0是最后一个编辑点。${1:label}能设置占位符，id相同的占位符会被连接起来。

举例：打开模板后你的光标将会自动跳到$1处，按下tab光标跳到$2处，最后跳到$0。
```

## 激活模板

完成模板设置之后，你打开一个markdown文件，输入使用模板的命令如blog

发现居然没反应！

**你还需要打开vscode的配置文件setting.json**

![image-20200530164742943](https://chanx-1251137349.file.myqcloud.com/image-20200530164742943.png)

**添加如下代码**

```json
"[markdown]":{
 "editor.quickSuggestions": true
   }
```



## 享受快乐

然后享受模板带来的快乐吧！

![image-20200530164913044](https://chanx-1251137349.file.myqcloud.com/image-20200530164913044.png)

![image-20200530164906681](https://chanx-1251137349.file.myqcloud.com/image-20200530164906681.png)