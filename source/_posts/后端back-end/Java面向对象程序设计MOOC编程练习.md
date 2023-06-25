---
title: "Java的MOOC编程练习"
date: 2019-12-09
sidebarDepth: 2
tags:
- "Java"
- "练习"
categories:
- "后端back-end"
---



> 课程地址：[点击传送](https://www.icourse163.org/course/ZJU-1001542001/)
> 没有 Submit 给系统判题，所以代码不能保证完全正确。

<!-- more -->
## **第一周：类与对象**

**题目：分数**

设计一个表示分数的类Fraction。这个类用两个int类型的变量分别表示分子和分母。

这个类的构造函数是：

Fraction(int a, int b)
> 构造一个a/b的分数。

**这个类要提供以下的功能：**

double toDouble();

> 将分数转换为double

Fraction plus(Fraction r);

> 将自己的分数和r的分数相加，产生一个新的Fraction的对象。注意小学四年级学过两个分数如何相加的哈。

Fraction multiply(Fraction r);

> 将自己的分数和r的分数相乘，产生一个新的Fraction的对象。

void print();

> 将自己以“分子/分母”的形式输出到标准输出，并带有回车换行。如果分数是1/1，应该输出1。当分子大于分母时，不需要提出整数部分，即31/30是一个正确的输出。



==注意，在创建和做完运算后应该化简分数为最简形式。如2/4应该被化简为1/2==。


你写的类要和以下的代码放在一起，并请勿修改这个代码：

```java
import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		Fraction a = new Fraction(in.nextInt(), in.nextInt());
		Fraction b = new Fraction(in.nextInt(),in.nextInt());
		a.print();
		b.print();
		a.plus(b).print();
		a.multiply(b).plus(new Fraction(5,6)).print();
		a.print();
		b.print();
		in.close();
	}
}
```



注意，你的类的定义应该这样开始：

```
class Fraction {
```
也就是说，在你的类的class前面不要有public。

**输入格式:**

程序运行时会得到四个数字，分别构成两个分数，依次是分子和分母。



**输出格式：**

输出一些算式。这些输入和输出都是由Main类的代码完成的，你的代码不要做输入和输出。


**输入样例：**

```
2 4 1 3
```
**输出样例：**

```
1/2
1/3
5/6
1
1/2
1/3
```
#### 代码
```java
class Fraction 
{
	private int a;
	private int b;
	Fraction(int a, int b)
	{
		this.a=a;
		this.b=b;
		toeasy();
	}
	//构造一个a/b的分数。
	void toeasy()
	{
		int c = this.a;
		int d = this.b;
		int t=1;
		while(d>0)
		{
			t=c%d;
			c=d;
			d=t;
		}
		this.a = this.a/c;
		this.b = this.b/c;
	}
	//化简
	double toDouble()
	{
		double ans = (double)a/(double)b;
		return ans;
	}
	//将分数转换为double
	
	Fraction plus(Fraction r)
	{
		int up = this.a*r.b+r.a*this.b;
		int down = this.b*r.b;
		Fraction ans = new Fraction(up,down);
		ans.toeasy();
		return ans;
	}
	//将自己的分数和r的分数相加，产生一个新的Fraction的对象。注意小学四年级学过两个分数如何相加的哈。
	
	Fraction multiply(Fraction r)
	{
		Fraction ans = new Fraction(this.a*r.a,this.b*r.b);
		ans.toeasy();
		return ans;		
	}
	//将自己的分数和r的分数相乘，产生一个新的Fraction的对象。

	void print()
	{
		if(this.a==this.b)
			System.out.println(1);
		else if(this.a==0)
			System.out.println(0);
		else System.out.println(this.a+"/"+this.b);
	}
	// 将自己以“分子/分母”的形式输出到标准输出，并带有回车换行。如果分数是1/1，应该输出1。当分子大于分母时，不需要提出整数部分，即31/30是一个正确的输出。
	//注意，在创建和做完运算后应该化简分数为最简形式。如2/4应该被化简为1/2。
}
```

---
## **第二周：对象交互**


**题目：有秒计时的数字时钟**

这一周的编程题是需要你在课程所给的时钟程序的基础上修改而成。但是我们并不直接给你时钟程序的代码，请根据视频自己输入时钟程序的 Display 和 Clock 类的代码，然后来做这个题目。

我们需要给时钟程序加上一个表示秒的 Display，然后为 Clock 增加以下 public 的成员函数：



public Clock(int hour, int minute, int second);

>     用 hour, minute 和 second 初始化时间。

public void tick();

>     “嘀嗒” 一下，时间走 1 秒。

public String toString();

>  返回一个 String 的值，以 “hh:mm:ss“的形式表示当前时间。这里每个数值都占据两位，不足两位时补 0。如 “00:01:22"。注意其中的冒号是西文的，不是中文的。

提示：String.format () 可以用和 printf 一样的方式来格式化一个字符串。


另外写一个 Main 类，它的 main 函数为下面的样子，注意，必须原封不动地作为 Main 的 main 函数：

```java
public static void main(String[] args) {
    java.util.Scanner in = new java.util.Scanner(System.in);
    Clock clock = new Clock(in.nextInt(), in.nextInt(), in.nextInt());
    clock.tick();
    System.out.println(clock);
    in.close();
}
```

注意！在提交的时候，把 Main、Clock 和 Display 三个类的代码合并在一起，其中 Main 类是 public 的，而 Clock 和 Display 类是没有修饰符的。另外，千万注意第一行不能有 package 语句。

#### 代码
```java
public class Main{
	public static void main(String[] args) {
	    java.util.Scanner in = new java.util.Scanner(System.in);
	    Clock clock = new Clock(in.nextInt(), in.nextInt(), in.nextInt());
	    clock.tick();
	    System.out.println(clock);
	    in.close();
	}
}

class Display {
	private int value = 0;
	private int limit = 0;
	Display(int limit){
		this.limit = limit;
	}
	int getvalue() {
		return this.value;
	}
	void increase() {
		this.value++;
		if(this.value == limit) {
			this.value = 0;
		}
	}
	void setvalue(int value) {
		this.value =  value;
	}
}

class Clock{
	Display h = new Display(24);
	Display m =  new Display(60);
	Display s =  new Display(60);
	Clock(int hour,int minute,int second){
		h.setvalue(hour);
		m.setvalue(minute);
		s.setvalue(second);
	}
	public void tick() {
			s.increase();
			if(s.getvalue()==0){
				m.increase();
				if(m.getvalue()==0)
					h.increase();
		}
	}
	public String toString() {
		String str = String.format("%02d:%02d:%02d", h.getvalue(),m.getvalue(),s.getvalue());
		return str;
	}
}
```


---

## **第三周：对象容器**

**题目：查找里程**

**输入格式:**

首先，你会读到若干个城市的名字。每个名字都只是一个英文单词，中间不含空格或其他符号。当读到名字为 “###”（三个 #号）时，表示城市名字输入结束，## 并不是一个城市的名字。如果记读到的城市名字的数量为 n。

然后，你会读到 nxn 的一个整数矩阵。第一行的每一个数字，表示上述城市名单中第一个城市依次到另一个城市之间的里程。表中同一个城市之间的里程为 0。

最后，你会读到两个城市的名字。


**输出格式：**

输出这两个城市之间的距离。


**输入样例**：

```
Hagzou	Hugzou	Jigxng    ###
0	1108	708
1108	0	994
708	994	0
Hagzou    Jigxng
```


**输出样例**：

```
708
```

#### 代码
```java
import java.util.Scanner;
import java.util.ArrayList;
import java.util.HashMap;
public class Main {

	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		ArrayList<String> city = new ArrayList<String>();
		//顺序容器存城市的名称
		while(true) {
			String temp = in.next();
			if(temp.equals("###"))
				break;
			else city.add(temp);
		}
		int size = city.size();
		//嵌套哈希表存二维数据表
		HashMap<String,HashMap<String,Integer>> data = new HashMap();
		int i=0,j=0;
		for(i=0;i<size;i++){
			String name = city.get(i);
			for(j=0;j<size;j++){
				int distance  = in.nextInt();
				if(data.get(name)== null) {
					data.put(name,new HashMap());
				}
				else data.get(name).put(city.get(j),distance);
			}
		}
		//读取城市并输出结果
		String first = in.next();
		String second = in.next();
		System.out.println(data.get(first).get(second));
	}
}
```

---

## **第四周：继承与多态**
