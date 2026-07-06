---
title: "用 vimdiff 实现文件差异的查询与合并"
description: "介绍如何使用 vimdiff 查看文件差异，并通过 do、dp 等命令完成差异合并。"
publishDate: "2024-05-28T19:30:24+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
draft: false
---

## 前言

`vimdiff` 是 Vim 编辑器的一个功能，可以方便地进行文件之间的比较，特别是在需要合并不同版本的文件或代码时非常有用。

本文将简单介绍它的使用方法。

## 正文

假设我们在 `~/vim_compare/` 目录下有两个文件 file1.txt 和 file2.txt，它们的内容如下：

file1.txt
```
Hello, this is file 1.
This is an example file for vimdiff.
```

file2.txt
```
Hello, this is file 2.
This is an example file for vimdiff.
Added a new line here.
```

现在我们要使用 `vimdiff` 来比较这两个文件的差异，我们可以按照以下步骤进行操作：

1. 打开终端，进入包含这两个文件的目录。

```bash
~$ cd vim_compare
```

2. 输入 `vimdiff` 来比较这两个文件。

```bash
~/vim_compare$ vimdiff file1.txt file2.txt
```

3. Vim 将会以分屏模式打开两个文件，显示它们之间的差异。在这个例子中，我们可以看到两个文件的内容在第一行就有差异。

<img src="/images/blog/vimdiff/vimdiff.png" width="1000">

4. 我们可以使用以下命令在比较结果中导航：
 
- `Ctrl + w, l`：切换到右侧窗口。
- `Ctrl + w, h`：切换到左侧窗口。
- `Ctrl + w, w`：在两个窗口间来回切换。
- `]c`：跳转到下一个差异处。
- `[c`：跳转到上一个差异处。

5. 合并差异

可以通过如下命令将两个文件的内容进行合并。

- `:diffget`（或 `do`）：将另一个文件的差异应用到当前文件中。
- `:diffput`（或 `dp`）：将当前文件的差异应用到另一个文件中。

例如，我想将 file1.txt 中的第一行改为 `Hello, this is file 2.`，可以通过输入 `do` 命令来实现。

<img src="/images/blog/vimdiff/vimdiff_do.png" width="1000">

此外，我还想将 file2.txt 中的第三行应用到 file1.txt 中，可以先通过 `Ctrl + w, w` 命令切换到 file2.txt，再通过 `dp` 命令来实现。

<img src="/images/blog/vimdiff/vimdiff_dp.png" width="1000">

`:wq` 保存退出，即可完成合并操作。

<center>- EOF -</center>
