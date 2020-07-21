---
title: '[Hrbust-1754] Minimum Scalar Product'
date: 2020-07-19 00:12:12
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
- '数据结构与算法'
---

## 题目描述-Description
You are given two vectors v1=(x1,x2,...,xn) and v2=(y1,y2,...,yn). The scalar product of these vectors is a single number, calculated as x1y1+x2y2+...+xnyn.


Suppose you are allowed to permute the coordinates of each vector as you wish. Choose two permutations such that the scalar product of your two new vectors is the smallest possible, and output that minimum scalar product.
### 输入-Input
There are multiple test cases.

For each test case, the first line contains integer number n. The next two lines contain n integers each (1<=n<=800), giving the coordinates of v1 and v2 respectively.

 Process to the end of file.
```
3
1 3 -5
-2 4 1
5
1 2 3 4 5
1 0 1 0 1
```
### 输出-Output
For each test case, output a line X, where X is the minimum scalar product of all permutations of the two given vectors.
```
-25
6
```
### 提示-Hint
无
## 分析思路
输入整数n，给两行分别有长度n的数字。对每行数字进行排列，使得两行数字的向量积是最小的

思路：每一项都是最小的*最大的
## 代码实现
```cpp
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <queue>
#include <iostream>
#include <vector>
#include <cstdlib>
#define eps 1e-6
#define ll long long
#define INF 0x3f3f3f3f
using namespace std;

int main(){
    int n;
    while(cin>>n){
        int a[805];
        int b[805];
        for(int i = 0;i<n;i++){
            cin>>a[i];
        }
        for(int i = 0;i<n;i++){
            cin>>b[i];
        }
        sort(a,a+n);
        sort(b,b+n);
        long long sum = 0;
        for(int i = 0;i<n;i++){
            sum+=(long long)a[i]*(long long)b[n-i-1];
        }
        cout<<sum<<endl;
    }
    return 0;
}
```
## 错误分析