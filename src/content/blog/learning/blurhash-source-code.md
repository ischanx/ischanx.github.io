---
title: BlurHash 为什么能用一串字符生成一张模糊图
description: 从最小使用例子出发，沿着 TypeScript 实现理解 BlurHash 的数据表示、编码解码、参数选择和生产接入。
createDate: 2026-08-09T00:00:00.000Z
updateDate: 2026-08-09T00:00:00.000Z
image: https://cdn.chanx.tech/image/covers/blurhash-source-code.webp
tags:
  - open-source
  - frontend
  - math
draft: false
sticky: false
---

用户打开图片列表时，真实图片通常还在网络中加载。BlurHash 提供了一种轻量的占位方式，服务端保存一串短字符，客户端先计算出一张接近原图色调的模糊图。

## 先从一个最小使用例子开始

把一串 BlurHash 交给 `decode`，指定输出为 32 乘 32 像素。

```ts
import { decode, isBlurhashValid } from "blurhash";

const hash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
const pixels = decode(hash, 32, 32);

console.log({
  valid: isBlurhashValid(hash),
  bytes: pixels.length,
  firstPixel: Array.from(pixels.slice(0, 4)),
});
```

本地运行得到的关键信息如下。

```text
valid: { result: true }
bytes: 4096
firstPixel: [135, 164, 177, 255]
```

`decode` 返回一个 `Uint8ClampedArray`。可以先把它理解成一段只能保存 0 到 255 的字节数组。32 乘 32 个像素，每个像素有红、绿、蓝和透明度四个数字，因此数组长度是 `32 * 32 * 4`。

浏览器还需要把这段像素写进 Canvas。

```js
const canvas = document.createElement("canvas");
canvas.width = 32;
canvas.height = 32;

const context = canvas.getContext("2d");
const imageData = context.createImageData(32, 32);
imageData.data.set(pixels);
context.putImageData(imageData, 0, 0);

document.body.append(canvas);
```

输入是一串 BlurHash 字符。`decode` 返回的是 RGBA 像素数组，字符串里没有可直接显示的图片文件。浏览器还要把这些像素写入 Canvas，才能把结果画出来。

这串字符里到底保存了什么，解码器又为什么能根据它计算出一张图片？

## BlurHash 到底保存了什么

缩略图、Base64 和 BlurHash 都可能出现在图片加载代码里，三者保存的东西并不相同。

| 方案 | 生成方式 | 保留的信息 | 客户端拿到的内容 | 常见用途 |
| --- | --- | --- | --- | --- |
| 缩略图 | 重新采样生成小尺寸图片 | 低频和部分高频 | 图片文件 | 预览 |
| Base64 | 将二进制字节转换成文本 | 完整数据 | 原始文件的文本表示 | 传输、内嵌资源 |
| BlurHash | 计算整张图的低频分量 | 低频颜色和空间变化 | 短字符串 | 图片加载占位 |

Base64 可以从文本还原出原始字节，长度通常还会增加约三分之一。它解决的是二进制数据如何写成文本。BlurHash 只为图片占位保留低频信息，无法还原原图。

BlurHash 保存的也不是缩小后的像素。编码器让整张图参与计算，最后留下的是一组描述平均颜色和空间变化的参数。可以先把一张图片写成下面这个近似关系。

```text
图片
≈
平均颜色
+ 横向变化
+ 纵向变化
+ 其他更复杂的变化
```

![BlurHash 从像素到占位图的数据流](https://cdn.chanx.tech/image/blurhash/ai/pixel-to-hash.webp)

先看一张没有变化的图片。假设 4 乘 4 个像素全是同一种蓝色，描述它只需要一个平均颜色。这个平均颜色叫作 DC（Direct Current，直流分量），负责整张图的整体色调和明暗基准。

真实图片会在不同位置变亮、变暗或换色。平均颜色说明不了太阳在右侧还是天空在左侧，于是还要记录平均颜色之外的空间变化。这些变化叫作 AC（Alternating Current，交流分量）。一个 AC 只能表示一种固定的变化模式，真实画面通常要叠加多个 AC。

代码里的 component 可以理解为一项能够叠加的图像分量。每个 component 都包含一张由 `(x, y)` 决定的余弦变化模板，以及这张模板在红、绿、蓝三个通道上的权重。常用的 4 乘 3 配置可以写成下面这样。

```text
4 × 3 components
= 12 个图像分量
= 1 个 DC + 11 个 AC
```

这些 AC 模板由 `(x, y)` 坐标和余弦函数自动生成。`(0, 0)` 没有空间变化，对应 DC；`(1, 0)` 主要表示横向变化；`(0, 1)` 主要表示纵向变化；`(1, 1)` 同时在两个方向变化。坐标越大，颜色变化越快，空间频率也越高。

`componentX` 和 `componentY` 决定横向、纵向各取多少个坐标。AC 的生成规则固定，数量由 `componentX * componentY - 1` 决定。文中的 `AC1`、`AC2` 只是讲解编号，源码实际使用 `(x, y)` 坐标。字符串也不需要保存模板本身，只保存每个模板对应的 RGB 权重，也就是该用什么颜色、叠加多大强度。

![BlurHash 将 DC 和多个 AC 变化模板叠加成模糊图](https://cdn.chanx.tech/image/blurhash/ai/dc-ac-basis.webp)

这种把图片拆成余弦变化的思路来自离散余弦变换（DCT）。可以把余弦模板看成一组固定画笔，低频画笔铺开大面积渐变，高频画笔补充更快的明暗变化。BlurHash 只选择少量低频分量，因此重建出的画面平滑，文字、发丝和纹理不会留下来。

计算这些权重时还要处理颜色空间。图片和显示器常用 sRGB，它对亮度做过非线性编码。直接拿 sRGB 数字加权会让结果偏暗，所以编码器先转成线性 RGB，解码完成后再转回 sRGB。

到这里，字符串里的数据可以概括成一份很小的模型。

```text
BlurHash
= 分量数量
+ 平均颜色
+ 若干空间变化的权重
```

## 从像素到字符串：编码过程

编码入口位于 `TypeScript/src/encode.ts`。

```ts
encode(pixels, width, height, componentX, componentY)
```

`pixels` 是 RGBA 像素数组，最后两个参数决定横向和纵向分量数量。源码先检查分量是否在 1 到 9 之间，还会确认数组长度等于 `width * height * 4`。

首先，编码器计算图片对每个模板的贡献。它按照纵向分量和横向分量建立余弦模板。下面是模板中最关键的计算。

```ts
normalisation *
  Math.cos((Math.PI * x * i) / width) *
  Math.cos((Math.PI * y * j) / height)
```

`i` 和 `j` 表示原图中的像素位置，`x` 和 `y` 表示当前分量。`multiplyBasisFunction` 遍历整张图片，把每个像素从 sRGB 转成线性 RGB，再乘上模板权重并累加。最后除以像素总数，得到当前模板对整张图片的贡献。

当 `x` 和 `y` 都为 0 时，两个余弦值始终为 1，算出的就是整张图的平均颜色 DC。其余组合会产生横向、纵向或两个方向同时变化的 AC。

接着，编码器把连续数值压成有限等级。DC 会转回 sRGB，再打包成一个 24 位 RGB 整数。当前 TypeScript 实现会取所有 AC 通道数值中的最大值，用它确定一套全局范围，然后把每个颜色通道量化到 0 至 18。这里没有取绝对值，因此不能把它理解成绝对幅度。量化值 9 接近零，0 到 8 表示负向变化，10 到 18 表示正向变化。

每个 AC 的三个通道都会落进 19 个等级，因此一种 AC 共有 `19 * 19 * 19` 种组合。量化会丢掉一部分精度，换来稳定而短小的表示。占位图只需要保留整体色调，少量量化误差通常看不出来。

最后，编码器用 Base83 拼成字符串。Base83 是一套拥有 83 个字符的进位表示。BlurHash 的字符串按下面的顺序排列。

```text
尺寸标记
最大 AC 范围
DC
AC1
AC2
...
```

第一个字符中的 `sizeFlag` 同时记录横向与纵向分量数量。

```ts
const sizeFlag = componentX - 1 + (componentY - 1) * 9;
```

DC 固定占四个字符，每个 AC 占两个字符。总长度可以直接写成 `4 + 2 * componentX * componentY`。4 乘 3 的配置有 12 个分量，最终长度就是 28 个字符。

Base83 选择 83 个字符有两个原因。首先，低位 ASCII 中大约能挑出 83 个适合放进 JSON、HTML 字符串和 Shell 参数的字符，命令行中仍要按 Shell 规则引用。其次，`83 * 83` 等于 6889，刚好大于 `19 * 19 * 19` 的 6859。两个 Base83 字符恰好能容纳一个 AC 的三通道组合。

## 从字符串到像素：解码过程

编码完成后，原图已经变成一串可以与图片 URL 一起存储和传输的文本。字符串到了客户端，`TypeScript/src/decode.ts` 沿着相反方向恢复分量，再用这些分量生成像素。

它先从第一个字符读出 `sizeFlag`，再拆出两个方向的分量数量。

```ts
const numY = Math.floor(sizeFlag / 9) + 1;
const numX = (sizeFlag % 9) + 1;
```

分量数量决定了字符串应该有多长。校验器会用 `4 + 2 * numX * numY` 计算期望值，提前拒绝被截断或多出字符的输入。这一步只覆盖最短长度和总长度，不会逐个检查字符是否属于 Base83 字符集。长度正确以后，解码器从四个字符还原 DC，再把每两个字符还原成一个 AC。AC 中的整数等级会经过 `signPow`，变回带正负方向的线性 RGB 变化值。

接下来才真正生成像素。对于输出画布中的每一个位置，解码器遍历全部分量，把分量颜色乘上该位置的余弦权重，然后累加。

```ts
for (let j = 0; j < numY; j++) {
  const basisY = Math.cos((Math.PI * y * j) / height);
  for (let i = 0; i < numX; i++) {
    const basis = Math.cos((Math.PI * x * i) / width) * basisY;
    const color = colors[i + j * numX];
    r += color[0] * basis;
    g += color[1] * basis;
    b += color[2] * basis;
  }
}
```

解码器不会从字符串里直接读取某个像素的颜色。它会在当前位置计算每个分量能贡献多少颜色，再把结果相加。把这段循环写成简化公式，就是下面的关系。

```text
pixel(x, y)
= DC
+ AC1 × basis1(x, y)
+ AC2 × basis2(x, y)
+ ...
```

这一步对应 DCT 中逆变换的思想，余弦基函数和权重重新组合出了空间中的颜色。分量越少，能够叠加的变化模板越少，画面也越平滑。累加结束后，源码把线性 RGB 转回 sRGB，写入 RGBA 数组，并把透明度设为 255。

## 参数如何影响结果

参数先从一个小实验看。构造一张很小的渐变图，再用三组分量编码。

```ts
import { encode } from "blurhash";

const width = 4;
const height = 3;
const pixels = new Uint8ClampedArray(width * height * 4);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const offset = (y * width + x) * 4;
    pixels[offset] = x * 60;
    pixels[offset + 1] = y * 80;
    pixels[offset + 2] = 150;
    pixels[offset + 3] = 255;
  }
}

for (const [componentX, componentY] of [[1, 1], [4, 3], [9, 9]]) {
  const hash = encode(pixels, width, height, componentX, componentY);
  console.log(componentX, componentY, hash.length);
}
```

输出长度分别是 6、28 和 166。

![不同分量数量下的 BlurHash 平滑重建结果](https://cdn.chanx.tech/image/blurhash/ai/component-count-smooth.webp)

1 乘 1 只有 DC，解码后几乎是一整块平均颜色。它能填掉空白，却无法表达渐变方向。增加到 4 乘 3 后，11 个 AC 开始描述横向和纵向变化。继续增加到 9 乘 9，字符串更长，编码与解码需要遍历的分量也更多。

实践中常把 4 乘 3 当作起点，不过它并非固定答案。横幅图可以增加横向分量、减少纵向分量，竖图则反过来。选择时先看宽高比，再在真实图片上比较结果。过多分量不一定更好，DCT 模板的形状可能逐渐显露，画面会出现不自然的波纹。

这些参数也直接影响计算量。编码成本大致与 `输入像素数 * componentX * componentY` 成正比，解码成本大致与 `输出像素数 * componentX * componentY` 成正比。输出宽度和高度同时翻倍时，像素数量约变为 4 倍。增加分量和增大解码尺寸都会增加工作量，二者需要分开控制。

## 生产环境如何接入

生产环境通常让服务端在图片处理流程中生成 hash，浏览器只负责小尺寸解码和显示。完整流程可以这样组织。

```text
用户上传图片
    ↓
图片处理服务缩小输入并生成 BlurHash
    ↓
数据库保存 URL、宽高和 hash
    ↓
接口一起返回
    ↓
客户端按展示框宽高比解码成 20～32 像素的小图
    ↓
界面放大显示
    ↓
真实图片加载完成后替换
```

编码只需要在图片入库时做一次，适合放在服务端或异步媒体任务中。编码前先缩小原图，因为高频细节最终都会被丢掉，在全尺寸原图上计算没有收益。客户端只生成 20～32 像素的小图，并保持展示框的宽高比，再交给界面层放大。这样可以减少像素循环，也能避免在 UI 线程上制造一次较大的同步计算。

图片列表、媒体画廊、视频封面和商品列表都可以采用这套流程。接口返回真实图片地址时，同时带上宽高和 hash。前端先用宽高预留布局，用 hash 画出占位图，真实图片加载完成后再替换。BlurHash 还可以承担色调预览或敏感内容的视觉占位，但后者仍要由权限系统决定真实资源能否访问。只需要纯色回退时，DC 也能提供一份接近原图平均色的背景色。

落地时还要准备失败回退。hash 可能缺失、长度不对或解码失败，纯色背景或普通骨架屏应当始终可用。BlurHash 适合图片加载占位和色调预览，不能替代包含真实像素的缩略图，也无法恢复文字、人脸和商品细节。它不具备加密或权限控制能力，不能单独承担安全遮挡。当前 TypeScript 解码器输出不透明像素，透明图片还要先考虑与页面背景的合成方式。

BlurHash 没有把完整图片塞进几十个字符。它只保存一组低频颜色参数，DC 记录整体色调，多个 AC 记录不同方向的空间变化。解码器把这些参数放回固定的余弦模板中逐像素求和，于是得到一张平滑的模糊图。它恢复不了原图细节，却足够在真实图片到达前交代大致的颜色、明暗和构图。
