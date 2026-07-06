---
title: "Jupyter Notebook 中系统命令和魔法命令的使用方法"
description: "系统说明 Jupyter Notebook 中系统命令、行魔法和单元格魔法的使用方式。"
publishDate: "2025-03-13T20:19:51+08:00"
categories:
  - "Data Analysis"
tags:
  - "Python"
draft: false
---

## TL-DR

在 Jupyter Notebook 中存在两种不同的命令：`!` 和 `%`，其中：

`!` 用于在 Jupyter Notebook 中直接运行系统 Shell 命令。

`%` 称为魔法命令，用于增强 Jupyter Notebook 的功能，具体可以分为两种：

- 单行魔法命令：以 `%` 开头，作用于单行代码。
- 单元格魔法命令：以 `%%` 开头，作用于整个单元格。

## 系统命令（`!`）

常用系统命令可以通过 `!` 来执行，例如我们想查看当前工作目录，可以在 Jupyter Notebook 的单元格内输入 `!pwd`：

```python
!pwd

# Output
/home/user
```

需要注意的是 `!` 命令的结果并不会对当前 Notebook 产生实际效果，例如用 `!cd` 命令切换路径：

```python
!cd /data
```

然后我们再查看当前工作目录：

```python
!pwd

# Output
/home/user
```

可以看到路径并没有切换成功，如果想要 `cd` 命令真正起作用需要使用接下来讲到的魔法命令。

## 魔法命令（`%`和`%%`）

魔法命令是 IPython 提供的特殊命令，以 `%` 或 `%%` 开头，能增强 Python 交互环境的功能。

我们可以使用 `%lsmagic` 命令查看所有可用的魔法命令。

接下来将介绍几个常用的魔法命令。

### 单行魔法命令（`%`）

常用单行魔法命令如下。

#### 1. 代码计时相关

`%time`：用于测量单个语句的执行时间。

```python
%time sum([i for i in range(1000000)])

# Output
CPU times: user 19.4 ms, sys: 55.9 ms, total: 75.3 ms
Wall time: 74.2 ms
499999500000
```

`%timeit`：多次运行单个语句并给出平均执行时间。

```python
%timeit sum([i for i in range(100)])

# Output
4.01 µs ± 59.9 ns per loop (mean ± std. dev. of 7 runs, 100000 loops each)
```

#### 2. 历史命令相关

`%history`：显示历史输入的命令。

例如我们新建一个 Notebook 并导入一些 Python 模块。

```python
import numpy as np
import pandas as pd
```

接下来执行 `%history` 命令：

```python
%history

# Output
import numpy as np
import pandas as pd
%history
```

需要注意的是这里 `%history` 命令自身也会被输出。

我们还可以指定参数来显示特定范围的历史命令，例如显示第 1 条命令：

```python
%history -n 1

# Output
import numpy as np
import pandas as pd
```

#### 3. 路径和文件操作相关

`%pwd`：显示当前工作目录。

```python
%pwd

# Output
/home/user
```

`%cd`：改变当前工作目录。

```python
%cd /data

# Output
/data
```

```python
%pwd

# Output
/data
```

可以看到不同于 `!` 命令，通过 `%` 命令我们成功将工作目录从 `/home/user` 切换到了 `/data`。

#### 4. 变量和命名空间相关

`%who`：列出当前命名空间中的所有变量。

我们先给一些变量赋值：

```python
a = 10
b = "hello"
```

接下来输入 `%who` 命令：

```python
%who

a    b
```

`%whos`：列出当前命名空间中的所有变量，并显示其类型和值的简要信息。

```python
%whos

Variable   Type      Data/Info
------------------------------
a          int       10
b          str       hello
```

### 多行魔法命令（`%%`）

多行魔法命令以 `%%` 开头。

#### 1. 代码保存相关

`%%writefile`：将单元格中的代码保存到指定文件中。

```python
%%writefile test.py
print("This is a test file.")

# Output
Writing test.py
```

接下来我们查看一下代码是否保存成功：

```python
%ls

# Output
test.py    Untitled.ipynb
```

```python
%cat test.py

# Output
print("This is a test file.")
```

#### 2. 代码执行环境相关

`%%bash`：在单元格中执行 Bash 脚本。

```python
%%bash
ls -l

# Output
total 832
-rw-r--r-- 1 user user 30 Mar 10 13:04 test.py
-rw-r--r-- 1 user user 30 Mar 10 13:06 Untitled.ipynb
```

#### 3. 代码分析相关

`%%prun`：对单元格中的代码进行性能分析，显示函数调用的时间统计信息。

```python
%%prun
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n-1)
factorial(10)

# Output
      13 function calls (4 primitive calls) in 0.000 seconds
 
Ordered by: internal time
 
ncalls  tottime  percall  cumtime  percall filename:lineno(function)
     1    0.000    0.000    0.000    0.000 {built-in method builtins.exec}
  10/1    0.000    0.000    0.000    0.000 <string>:1(factorial)
     1    0.000    0.000    0.000    0.000 <string>:1(<module>)
     1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
```

<center>- EOF -</center>
