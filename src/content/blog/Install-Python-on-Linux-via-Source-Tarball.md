---
title: "Linux环境下Python的安装与删除（用编译源码的方法实现）"
description: "讲解在 Linux 上通过源码编译安装 Python，并清理手动安装版本的操作方法。"
publishDate: "2025-01-23T10:35:37+08:00"
categories:
  - "Ops"
tags:
  - "Python"
draft: false
---

本文记录了:
1. 如何通过编译source tarball的方式将Python安装到Linux系统中。
2. 如何删除手动安装的Python。

## 正文

### 环境信息

- 系统版本： Ubuntu 22.04.2 LTS

- 系统自带Python版本：3.10.12

### 通过源码编译安装Python

如果我们需要通过源码形式将3.8.20版本的Python安装到Linux系统中，可以采用如下步骤。

#### 步骤1：安装系统依赖

参考[Python Developer's Guide](https://devguide.python.org/getting-started/setup-building/index.html#install-dependencies)，根据不同的系统安装编译所需的依赖。

首先，更新包索引。

```bash
$ sudo apt-get update
```

然后安装依赖。

```bash
$ sudo apt-get build-dep python3
$ sudo apt-get install pkg-config
```

如果想要编译所有可选的模块（`module`），可以输入如下命令：

```bash
$ sudo apt-get install build-essential gdb lcov pkg-config \
       libbz2-dev libffi-dev libgdbm-dev libgdbm-compat-dev liblzma-dev \
       libncurses5-dev libreadline6-dev libsqlite3-dev libssl-dev \
       lzma lzma-dev tk-dev uuid-dev zlib1g-dev libmpdec-dev
```

#### 步骤2：下载源码文件

我们选择将Python源码放到`/usr/src/`路径下进行编译。

```bash
~ $ cd /usr/src
/usr/src $ sudo wget https://www.python.org/ftp/python/3.8.20/Python-3.8.20.tgz
```

#### 步骤3：解压缩源码

```bash
/usr/src $ sudo tar -zxf Python-3.8.20.tgz
```

#### 步骤4：编译及安装

```bash
/usr/src $ cd Python-3.8.20
/usr/src/Python-3.8.20 $ sudo ./configure --enable-optimizations
/usr/src/Python-3.8.20 $ sudo make altinstall
```

这里使用`make altinstall`以避免源码安装的Python覆盖掉系统自带的Python。

#### 步骤5：验证结果

安装完的Python执行程序会放置在`/usr/local/bin/`路径下，我们可以去这里查看。

```bash
~ $ ls -lh /usr/local/bin/
-rwxr-xr-x 1 root root  101 Jan 23 05:53 2to3-3.8
-rwxr-xr-x 1 root root   99 Jan 23 05:53 idle3.8
-rwxr-xr-x 1 root root  229 Jan 23 05:53 pip3.8
-rwxr-xr-x 1 root root   84 Jan 23 05:53 pydoc3.8
-rwxr-xr-x 1 root root  14M Jan 23 05:50 python3.8
-rwxr-xr-x 1 root root 3.0K Jan 23 05:53 python3.8-config
```

检查一下版本。

```bash
~ $ python3.8 --version
Python 3.8.20
```

### 删除源码安装的Python

在Linux中，删除源码安装的Python通常需要一些手动操作，步骤如下。

#### 步骤1: 找到安装路径

默认情况下源码安装的Python会安装在`/usr/local/bin`、`/usr/local/lib`和相关的目录中，我们可以使用如下命令来进行查找：

```bash
$ whereis python3.8
python3.8: /usr/local/bin/python3.8 /usr/local/lib/python3.8
```

#### 步骤2: 删除可执行文件

```bash
$ sudo rm -f /usr/local/bin/python3.8
```

#### 步骤3: 删除库文件

```bash
$ sudo rm -rf /usr/local/lib/python3.8
```

#### 步骤4: 删除其他相关文件

如果在安装时使用了`make altinstall`，我们还需要删除其他相关文件，例如pip等：

```bash
$ ls -lh /usr/local/bin/
-rwxr-xr-x 1 root root  101 Jan 23 05:53 2to3-3.8
-rwxr-xr-x 1 root root   99 Jan 23 05:53 idle3.8
-rwxr-xr-x 1 root root  229 Jan 23 05:53 pip3.8
-rwxr-xr-x 1 root root   84 Jan 23 05:53 pydoc3.8
-rwxr-xr-x 1 root root  14M Jan 23 05:50 python3.8
-rwxr-xr-x 1 root root 3.0K Jan 23 05:53 python3.8-config
$ sudo rm -f /usr/local/bin/*3.8*
```

#### 步骤5: 验证删除

```bash
$ whereis python3.8
python3.8:
$ python3.8 --version
Command 'python3.8' not found, did you mean:
...
```

如果显示`command not found`或类似的错误，说明Python已成功删除。

<center>- EOF -</center>
