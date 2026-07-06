---
title: "Python彩色打印终端文本"
description: "介绍如何使用 ANSI 转义序列和 colorama 在 Python 终端输出彩色文本。"
publishDate: "2024-04-29T16:33:32+08:00"
categories: []
tags:
  - "Python"
draft: false
---

## 写在前面

本文用于记录如何将Python的`print`结果以彩色形式输出。

## 方法一： 使用ANSI转义序列

[ANSI转义序列](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors)是一种用于控制终端显示和格式化文本的特殊字符序列。这些序列通常以`\033`（或`\e`）开头，例如`\033[1;31m`可以用于改变文本颜色为红色。

其具体格式如下：

```
\033[显示方式;前景色;背景色m + 需要打印的内容 + \033[0m
```

其中，

>- \033: 表示ASCII码中的Escape字符。在ANSI转义序列中，\033用于引入后续的控制字符，以便终端能够解释和执行相应的操作。
>- \033[0m：用于重置文本样式，通常在文本结束时使用，以确保后续文本不受影响。

显示方式包括：

<table style="width: 70%">
  <tr>
    <th style="width: 15%">样式代码</th>
    <th style="width: 55%">描述</th>
  </tr>
  <tr>
    <td>0</td>
    <td>重置所有样式，恢复默认状态</td>
  </tr>
  <tr>
    <td>1</td>
    <td>加粗效果</td>
  </tr>
  <tr>
    <td>2</td>
    <td>常规文本</td>
  </tr>
  <tr>
    <td>3x</td>
    <td>设置文本颜色，其中x为颜色代码（0-7）</td>
  </tr>
  <tr>
    <td>4x</td>
    <td>设置背景颜色，其中x为颜色代码（0-7）</td>
  </tr>
  <tr>
    <td>5</td>
    <td>闪烁效果</td>
  </tr>
  <tr>
    <td>7</td>
    <td>反显效果（交换前景色和背景色）</td>
  </tr>
  <tr>
    <td>9</td>
    <td>划掉文本</td>
  </tr>
  <tr>
    <td>22</td>
    <td>取消加粗、斜体、下划线效果</td>
  </tr>
  <tr>
    <td>39</td>
    <td>重置文本颜色为默认值</td>
  </tr>
  <tr>
    <td>49</td>
    <td>重置背景颜色为默认值</td>
  </tr>
</table>

常见的前景色及背景色如下：

<table style="width: 70%">
  <tr>
    <th style="width: 20%">颜色</th>
    <th style="width: 25%">前景色</th>
    <th style="width: 25%">背景色</th>
  </tr>
  <tr>
    <td>黑色</td>
    <td>30</td>
    <td>40</td>
  </tr>
  <tr>
    <td>红色</td>
    <td>31</td>
    <td>41</td>
  </tr>
  <tr>
    <td>绿色</td>
    <td>32</td>
    <td>42</td>
  </tr>
  <tr>
    <td>黄色</td>
    <td>33</td>
    <td>43</td>
  </tr>
  <tr>
    <td>蓝色</td>
    <td>34</td>
    <td>44</td>
  </tr>
  <tr>
    <td>洋红色（品红）</td>
    <td>35</td>
    <td>45</td>
  </tr>
  <tr>
    <td>青色</td>
    <td>36</td>
    <td>46</td>
  </tr>
  <tr>
    <td>白色</td>
    <td>37</td>
    <td>47</td>
  </tr>
</table>

结合上面的内容，就可以用`print`输出想要的内容啦：

```python
print("\033[1;31mThis is red text.\033[0m")
print("\033[1;32mThis is green text.\033[0m")
print("\033[1;33mThis is yellow text.\033[0m")
print("\033[1;34mThis is blue text.\033[0m")
print("\033[1;35mThis is purple text.\033[0m")
print("\033[1;36mThis is cyan text.\033[0m")
print("\033[1;37mThis is write text.\033[0m")
```

结果如下：

<img src="/images/blog/Python-Colorful-Print/print_ANSI.png" alt="" width="500">

## 方法二：使用第三方库

如果不想记复杂的ANSI转义信息，也可以使用`colorama`或`termcolor`等第三方库，下面以`colorama`库为例。

`colorama`可以通过`Fore`、`Back`和`Style`来调整输出文本样式，例如：

```python
from colorama import Fore, Back, Style, init

# Initialize colorama
init()

# Print colored text
print(Fore.RED + 'Red Text')
print(Back.GREEN + 'Green Background')
print(Fore.CYAN + Back.YELLOW + 'Cyan Text on Yellow Background')

# Reset colors
print(Style.RESET_ALL + 'Back to normal text')
```

结果如下：

<img src="/images/blog/Python-Colorful-Print/print_colorama.png" width="500">

<center>- EOF -</center>
