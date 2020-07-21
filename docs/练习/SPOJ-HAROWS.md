---
title: '[SPOJ-HAROWS] Crazy Rows'
date: 2020-07-19 01:32:17
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
You are given an N x N matrix with 0 and 1 values. You can swap any two adjacent rows of the matrix.

Your goal is to have all the 1 values in the matrix below or on the main diagonal. That is, for each X where 1 ≤ X ≤ N, there must be no 1 values in row X that are to the right of column X.

Return the minimum number of row swaps you need to achieve the goal.
### 输入-Input
The first line of input gives the number of cases, T. T test cases follow.
The first line of each test case has one integer, N. Each of the next N lines contains N characters. Each character is either 0 or 1.
```
3
2
10
11
3
001
100
010
4
1110
1100
1100
1000
```
### 输出-Output
For each test case, output

Case #X: K
where X is the test case number, starting from 1, and K is the minimum number of row swaps needed to have all the 1 values in the matrix below or on the main diagonal.

You are guaranteed that there is a solution for each test case.
```
Case #1: 0
Case #2: 2
Case #3: 4
```
### 提示-Hint
1 ≤ T ≤ 60
1 ≤ N ≤ 8
## 分析思路
给N*N的0-1矩阵，每次只能交换其中两行，最少交换多少次能变成”下三角矩阵“（第X行的X列后不能有1

取每一行最后一个1的坐标为元素构成序列，此行无1则元素为0

对这个序列进行排序，使得第i个元素的值不大于i，输出最少的交换次数

题目保证了最后必定能出现合法的矩阵，我们从第一个元素开始，寻找最靠近并且满足此行条件的元素进行交换，这样交换次数就是最少的


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
    int t;
    cin>>t;
    int index = 1;
    while(index <= t){
        int n;
        cin>>n;
        int num[9];
        char x;
        for(int i = 1;i<=n;i++){
            num[i] = 0;//WA点
            for(int j = 1;j<=n;j++){
                cin>>x;
                //初始化序列数组
                if(x == '1'){
                    num[i] = j;
                }
            }
        }
        int cnt = 0;
        for(int i = 1;i<=n;i++){
            if(num[i] > i){
                int j = 1;
                //寻找满足条件的最近元素
                while(num[i+j]>i&&i+j<=n){
                    j++;
                }
                //将原元素与目标元素进行交换
                //由于每次只能交换相邻两行
                for(int k = i+j;k>i;k--){
                    swap(num[k],num[k-1]);
                    cnt++;
                }
            }
        }
        cout<<"Case #"<<(index++)<<": "<<cnt<<endl;
    }
    return 0;
}
```
## 错误分析
每一次都要对序列数组进行初始化