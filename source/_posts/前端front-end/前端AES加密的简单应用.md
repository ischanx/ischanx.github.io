---
title: '前端AES加密的简单应用'
date: 2020-11-21 20:43:32
# 永久链接
# permalink: '/hello-world'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
sidebarDepth: 4
# isTimeLine: false
# hideComments: false

categories:
- '前端front-end'
---



本文并不会系统地讲AES及其应用，只是遇到案例学习了然后记录一下

<!-- more -->

再次说明，本文并不是为了系统学习和比较各种加密方式...(我还不会)

## 什么是AES

高级加密标准(AES,Advanced Encryption Standard)为最常见的对称加密算法。对称加密算法也就是**加密和解密用相同的密钥**

## 如何利用AES

首先AES这家伙只要你知道密钥就能加密解密的，而前端代码一般是公开的，或者说是破解可能需要一定成本。最终也只是为了数据不要明文存着让人一眼看出这个样子罢了。遇到了两个例子，分享一下。

### 数据传输加密

> 背景：遇上了某qt应用，学校用其发布活动，但各种功能极其不人性化，于是想通过前端代码找到接口做个定时器抓取数据，过程中遇到一些小困难(知识点)。

如题，前端后端交互的时候数据会被丢来丢去。要是中途被人截胡，明文的话可能会导致某些数据的泄露，加个密就能让数据难看一点。

#### 固定密钥

固定密钥就是前后端约定好一个密钥，然后写死在代码里面就完事。我用密钥`“123456”`加密，你用`“123456”`解密，你说这好吗？

#### 变化密钥

比固定密钥高大上一点点...就是密钥能通过逻辑生成，每次不是同一个

但是是同一套逻辑，花点时间搞懂就也就能生成密钥了（不然哪里来的本文

密钥是变化的，那么前后端如何都知道密钥是什么呢？

>  张三：这个我知道！把密钥放在请求里送给后端
>
> 我：那密钥明文放在请求里我加密有什么用？
>
> 李四：那就把密钥放在密文里
>
> 我：？？？后端不知道密钥，看着密文拿头去解密是吧
>
> 张三李四：有道理，那怎么办？
>
> 我：整点看起来比较正常而且经常变化的**数据**去生成密钥不就得了，然后同时把**数据**发给后端

以上提到的一个数据实例便是：**时间戳**

时间戳这种看起来普普通通的东西 => 好东西

**前端利用时间戳生成密钥并对数据进行加密，再把时间戳附带在请求头里**

**后端接收到数据密文的时候，提取请求头的时间戳生成密钥，再去解密**

如果直接就用时间戳当密钥的话，那真的是不太行噢。那我们就对时间戳做些简单处理，要是有人拿时间戳去碰碰，也能让他碰一脸灰！

------

**下面就是案例具体代码，仅提供思路，不能直接跑。敏感部分已去掉**

涉及到的js库有：[js-md5](https://github.com/emn178/js-md5)、[crypto-js](https://github.com/brix/crypto-js)

**时间戳混淆/获取密钥**

```javascript
function u(t) {
  var e = kmd5("5%^&#@*321!`~,;:" + t + "TT_APP000000';-="),	//加长版时间戳利用md5生成固定长度字符串
      n = parseInt(t / 1e3);
  e = e.split("");
  // 再做处理，为了生成密钥
  let i = (e = n % 2 == 0 ? e.filter(function(t, e) {
      return e % 2 == 0
  }) : e.filter(function(t, e) {
      return e % 2 != 0
  })).join("");
  return CryptoJS.enc.Utf8.parse(i)
}
```

**参数加密**

参数t为字符串类型，请用`JSON.stringify`处理相关类型的数据，e为请求头中的时间戳

```javascript
function encryptHttp(t, e) {
  let n = u(e),
  i = CryptoJS.enc.Utf8.parse(t);
  return CryptoJS.AES.encrypt(i, n, {
      mode: CryptoJS.mode.ECB
  }).toString()
}
```

加密后还需做相关处理（视具体情况

```javascript
let miwen = encryptHttp(data,time)
miwen = encodeURI(miwen);
miwen = miwen.replace("+", "%2B");

// 最后把密文放进参数里
{
    params:miwen
}
```



**响应解密**

参数t为响应的密文，e为请求头中的时间戳

```javascript
function decryptHttp(t, e) {
  let n = u(e);
  let i = CryptoJS.AES.decrypt(t, n, {
      mode: CryptoJS.mode.ECB
  });
  return CryptoJS.enc.Utf8.stringify(i).toString()
}
```



### 数据持久化加密

数据持久化保存到浏览器`storage`里，明文保存可能也不太好。那就加个密再丢进去吧！

#### 固定密钥

一般也就用这个办法了。比如说`Vuex持久化`，在刷新前保存数据，刷新后读取数据。

#### 变化密钥

没仔细想过，要实现的话估计也就是上面那个思路，找些普普通通的当变化源



------

下面是`Vuex持久化`一个案例，仅提供思路，不保证能使用：

```js
    // 不使用持久化插件：插件每次操作vuex都会触发storage保存，vuex操作比较多的时候有一定影响且插件保存数据为明文信息
    // 页面加载时读取缓存数据到vuex
    if (sessionStorage.getItem("miwen")) {
      // 取缓存中经过加密的密文
      const saveData = JSON.parse(CryptoJS.AES.decrypt(sessionStorage.getItem("miwen"), "123456").toString(CryptoJS.enc.Utf8));
      // 数据导入到vuex
      this.$store.replaceState(Object.assign(this.$store.state, saveData));
    }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      // 选择需要保存的数据
      const saveKeys = ["user", "token"];
      const saveData = {};
      const state = this.$store.state;
      saveKeys.forEach(key => {
        saveData[key] = state[key];
      });
      // 取需要保存的数据并进行AES加密
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(saveData), "123456").toString();
      sessionStorage.setItem("miwen", ciphertext);
    });
```

