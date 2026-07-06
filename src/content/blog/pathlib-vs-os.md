---
title: "Python之道：究竟是OS库还是Pathlib库，探索最优文件处理利器"
description: "对比 Python pathlib 和 os 模块在文件路径处理中的写法、优势和适用场景。"
publishDate: "2024-05-01T09:22:35+08:00"
categories:
  - "Data Analysis"
tags:
  - "Python"
draft: false
---

## 写在前面

在进行编程时我们时常会遇到需要对文件和目录进行操作的情况，为此，Python提供了两种不同的标准库模块来协助我们：`os`和`pathlib`。

在本文中，我们将结合一些示例来比较这两个库的特点。

## `os` vs `pathlib`

首先，通过Linux终端打开Python3，导入这两个模块。

```python
>>> import os
>>> from pathlib import Path
```

### 1. 获取当前工作目录

```python
>>> os.getcwd()
'/home/atlrwt'
>>>Path.cwd()
PosixPath('/home/atlrwt')
```

从返回结果可以看出`os`返回的格式为字符串，而`pathlib`则是PosixPath类。

### 2. 判断指定的路径是否为目录

```python
>>> os.path.isdir('/home/atlrwt')
True
>>> Path('/home/atlrwt').is_dir()
True
```

这里两个库的返回结果都是逻辑值。

### 3. 判断指定的路径是否存在

```python
>>> os.path.exists('/home/atlrwt/test_os')
False
>>> Path('/home/atlrwt/test_pathlib').exists()
False
```

同上，这里返回结果也相同。

### 4. 创建一个新目录

```python
>>> os.mkdir('/home/atlrwt/test_os')
>>> Path('/home/atlrwt/test_pathlib').mkdir()
```

### 5. 返回指定目录下的所有文件

我们先退回终端界面，新建几个测试文件（这里可以用`ctrl + z`将Python3进程挂起）。

```bash
~$ touch test_os/1.txt test_os/2.txt test_os/3.txt
~$ touch test_pathlib/p1.txt test_pathlib/p2.txt test_pathlib/p3.txt
```

输入`fg`回到Python3。

```python
>>> os.listdir('/home/atlrwt/test_os')
['3.txt', '1.txt', 'a', '2.txt']
>>> Path('/home/atlrwt/test_pathlib').iterdir()
<generator object Path.iterdir at Oxxxxxxxxxx>
>>> list(Path('/home/atlrwt/test_pathlib').iterdir())
[PosixPath('/home/atlrwt/test_pathlib/p3.txt'), PosixPath('/home/atlrwt/test_pathlib/p2.txt'), PosixPath('/home/atlrwt/test_pathlib/p1.txt'), PosixPath('/home/atlrwt/test_pathlib/a')]
```

可以看到`pathlib`返回结果为一个生成器，在结果比较多的场景下可以节省内存空间，提高效率。

### 6. 判断指定的路径是否为文件

```python
>>> os.path.isfile('/home/atlrwt/test_os/a')
True
>>> Path('/home/atlrwt/test_pathlib/a').is_file()
True
```

返回结果都为逻辑值。

### 7. 将文件重命名

```python
>>> os.rename('/home/atlrwt/test_os/a', '/home/atlrwt/test_os/README.md')
>>> Path('/home/atlrwt/test_pathlib/a').rename('/home/atlrwt/test_pathlib/README.md')
PosixPath('/home/atlrwt/test_pathlib/README.md')
```

### 8. 删除一个文件

```python
>>> os.remove('/home/atlrwt/test_os/1.txt')
>>> Path('/home/atlrwt/test_pathlib/p2.txt').unlink()
```

## 小结

从上面的对比中可以看出，相比较采用面向过程风格的`os`库，`pathlib`库则是采用了更现代和Pythonic的面向对象风格，更加直观和易于理解。

此外，`pathlib`在跨平台兼容性上也比`os`表现更好。

我们知道，UNIX系统和Windows系统采用了不同的路径分隔符（UNIX: `/`，Windows: `\`），在使用`os`库进行操作时需要根据不同的系统来进行针对性的区分，而`pathlib`不存在这样的问题，统一使用反斜线（`/`）作为分隔符，这样既简洁了代码，也方便了跨平台移植。

总而言之，`pathlib`是从Python3.4版本开始正式加入标准库的模块，其采用了面向对象的方式来表达和处理路径，相比较`os`库而言具有易理解易操作的优点，因此在日常的开发和使用过程中我们应该尽量将其作为路径处理的首选库模块。

<center>- EOF -</center>
