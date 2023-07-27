---
title: 'Vuepress基于Valine的评论功能'
date: 2020-06-08 23:31:22
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
sidebarDepth: 2
tags:
- 'Vuepress'
- '教程'
categories:
- '前端front-end'
---





## 安装插件

如果使用 `npm`：

```sh
npm install --save vuepress-plugin-comment
```

如果使用 `yarn`:

```sh
yarn add vuepress-plugin-comment -D
```

## 配置插件

### vuepress项目引用

将 `vuepress-plugin-comment` 添加到vuepress项目的插件配置中：

```javascript
module.exports = {
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine', 
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: 'Your own appId',
          appKey: 'Your own appKey'
        }
      }
    ]
  ]
}
```

### 获取appId和appKey

请先[登录](https://leancloud.cn/dashboard/login.html#/signin)或[注册](https://leancloud.cn/dashboard/login.html#/signup) `LeanCloud`, 进入[控制台](https://leancloud.cn/dashboard/applist.html#/apps)后点击左下角[创建应用](https://leancloud.cn/dashboard/applist.html#/newapp)：

![img](https://static.chanx.tech/image/atlyz_0.jpeg)

应用创建好以后，进入刚刚创建的应用，选择左下角的`设置`>`应用Key`，然后就能看到你的`APP ID`和`APP Key`了：

![img](https://static.chanx.tech/image/atxsc_0.jpeg)



把获取到的appId和appKey填入vuepress的插件配置当中，就可以使用评论功能了。

### 更多配置项

#### el

- 类型:`String`
- 默认值:`null`
- 必要性:`true`

Valine 的初始化挂载器。可以是一个`CSS 选择器`，也可以是一个实际的`HTML元素`。

#### appId

- 类型:`String`
- 默认值:`null`
- 必要性:`true`

从`LeanCloud`的应用中得到的`appId`.

> [获取appId 和 appKey](https://valine.js.org/quickstart.html)。

#### appKey

- 类型:`String`
- 默认值:`null`
- 必要性:`true`

从`LeanCloud`的应用中得到的`appKey`.

> [获取appId 和 appKey](https://valine.js.org/quickstart.html)。

#### placeholder

- 类型:`String`
- 默认值:`Just go go`
- 必要性:`false`

评论框`占位提示符`。

#### path

- 类型:`String`
- 默认值:`window.location.pathname`
- 必要性:`false`

当前`文章页`路径，用于区分不同的`文章页`，以保证正确读取该`文章页`下的评论列表。
可选值：

- `window.location.pathname` (默认值，推荐)
- `window.location.href`
- `自定义`

> - I. 请保证每个`文章页`路径的唯一性，否则可能会出现不同`文章页`下加载相同评论列表的情况。
> - II. 如果值为`window.location.href`，可能会出现随便加`不同参数`进入该页面，而被判断成新页面的情况。

#### avatar

- 类型:`String`
- 默认值:`mm`
- 必要性:`false`

`Gravatar` 头像展示方式。

可选值：

- `''`(空字符串)
- `mp`
- `identicon`
- `monsterid`
- `wavatar`
- `retro`
- `robohash`
- `hide`

更多信息，请查看[头像配置](https://valine.js.org/avatar.html)。

#### meta

- 类型:`Array`
- 默认值:`['nick','mail','link']`
- 必要性:`false`

评论者相关属性。

#### pageSize

- 类型:`Number`
- 默认值:`10`
- 必要性:`false`

评论列表分页，每页条数。

#### lang

- 类型:`String`
- 默认值:`zh-CN`
- 必要性:`false`

多语言支持。

可选值：

- `zh-CN`
- `zh-TW`
- `en`
- `ja`

如需`自定义语言`，请参考[i18n](https://valine.js.org/i18n.html)。

#### visitor

- 类型:`Boolean`
- 默认值:`false`
- 必要性:`false`

[文章访问量统计](https://valine.js.org/visitor.html)。

#### highlight

- 类型：`Boolean`
- 默认值: `true`
- 必要性: `false`

`代码高亮`，默认开启，若不需要，请手动关闭

#### avatarForce

- 类型: `Boolean`
- 默认值: `false`
- 必要性: `false`

每次访问`强制`拉取最新的`评论列表头像`

> 不推荐设置为`true`，目前的`评论列表头像`会自动带上`Valine`的版本号

#### recordIP

- 类型: `Boolean`
- 默认值: `false`
- 必要性: `false`

是否记录评论者IP

> ```
> v1.3.5+
> ```

#### serverURLs

- 类型: `String`
- 默认值: `http[s]://[tab/us].avoscloud.com`
- 必要性: `false`

> ⚠️ 该配置适用于国内`自定义域名`用户, `海外版本`会自动检测(无需手动填写) `v1.3.10+`

#### emojiCDN

- 类型: `String`
- 默认值: ``
- 必要性: `false`

设置`表情包CDN`，参考[自定义表情](https://valine.js.org/emoji.html)

> ```
> v1.4.5+
> ```

#### emojiMaps

- 类型: `Object`
- 默认值: `null`
- 必要性: `false`

设置`表情包映射`，参考[自定义表情](https://valine.js.org/emoji.html)

> ```
> v1.4.5+
> ```

#### enableQQ

- 类型: `Boolean`
- 默认值: `false`
- 必要性: `false`

是否启用`昵称框`自动获取`QQ昵称`和`QQ头像`, 默认关闭，需`博/网站主`主动启用

> ```
> v1.4.6+
> ```

#### requiredFields

- 类型: `Array`
- 默认值: `[]`
- 必要性: `false`

设置`必填项`，默认`匿名`，可选值：

- `['nick']`
- `['nick','mail']`

> ```
> v1.4.6+
> ```



## 扩展功能

[头像配置](https://valine.js.org/avatar.html)、[邮件提醒](http://www.zhaojun.im/hexo-valine-admin/)、[多语言支持](https://valine.js.org/i18n.html)、[文章阅读量统计](https://valine.js.org/visitor.html)、[自定义表情](https://valine.js.org/emoji.html)



<u>其中，邮件提醒有几个小问题</u>：

1. **国内版的绑定域名貌似需要备案**

2. **LeanCloud休眠调整，定时任务self_wake无法唤醒** => 解决办法可以参考[小康博客](https://www.antmoe.com/posts/ff6aef7b/)

   **我的解决办法**是利用我windows服务器自带的计划任务定时访问评论后台达到唤醒效果：

   首先新建一个bat文件（效果大概是自动打开IE浏览器访问指定网页，30秒后关闭浏览器）

   > 建好bat文件之后最好先自己访问一遍确定IE浏览器访问的时候能正常访问到网页
   >
   > 如果访问速度较慢，建议把30秒调成更长的时间来保证稳定
   >
   > 

   ```sh
   explorer.exe open=你的评论后台地址
   Ping -n 30 127.1>nul
   Taskkill /f /im "iexplore.exe"
   ```

   ![image-20200613101522289](https://static.chanx.tech/image/avokr_0.png)

   ![image-20200613101209202](https://static.chanx.tech/image/avz41_0.png)

   ![image-20200613101238985](https://static.chanx.tech/image/avvcm_0.png)

   ![image-20200613101304356](https://static.chanx.tech/image/awllk_0.png)

3. **Valine的管理员账户（部署后/sign-up页面出现Not Found）**

   ```
   LeanCloud结构化数据里_User表添加一行
   必备三个字段email（此 email 必须为配置中的 SMTP_USER 或 TO_EMAIL）、username、password
   然后进入到评论管理后台
   账号为email字段输入的信息
   密码为password字段输入的信息
   ```



---

::: tip
部分文字整理自[Valine官网](https://valine.js.org/)、[Valine-Admin](https://github.com/zhaojun1998/Valine-Admin)及其他相关网页
:::