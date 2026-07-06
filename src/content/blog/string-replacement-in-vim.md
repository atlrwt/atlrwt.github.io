---
title: "vim字符串替换方法"
description: "整理 Vim 中 substitute 命令的字符串替换范围、模式匹配和常见替换技巧。"
publishDate: "2025-01-07T14:40:51+08:00"
categories:
  - "Ops"
tags:
  - "Vim"
  - "Linux"
draft: false
---

## TL-DR

将光标所在行所有的`old_string`替换为`new_string`：
```bash
:s/old_string/new_string/g
```

将当前文件所有的`old_string`替换为`new_string`：
```bash
:%s/old_string/new_string/g
```

## 正文

vim中的字符串替换是通过`:substitute`(`:s`)来实现的，格式如下：

```bash
:[range]s/{pattern}/{string}/[flags]
```

这个命令会在指定范围（`range`）内搜索所有满足`pattern`的字符串，并将其替换为`string`。

其中共有四个参数可以进行调整，包括两个必填参数`pattern`、`string`，和两个可选参数`range`、`flags`。

接下来我们一个一个介绍。

### [range]

先从最简单的使用方式开始，如果不指定`range`和`flags`，上面的命令就会变成这样：

```bash
:s/{pattern}/{string}/
```

它会把当前光标所在行中第一个满足`pattern`的字符串替换为`string`。（**无论光标在行中什么位置**）

例如有如下一行文本：

```bash
The quick brown fox jumps over the quick dog.
```

现在我们想将其中的第一个`quick`替换为`slow`，可以在vim中输入如下命令：

```bash
:s/quick/slow/
```

替换后的文本如下：

```bash
The slow brown fox jumps over the quick dog.
```

有的时候我们想要替换掉文件中每一行第一个符合`pattern`的字符串，可以将`range`指定为`%`。

首先将之前的文本扩写一行：

```bash
The quick brown fox jumps over the quick dog.
The quick red fox jumps over the lazy cat.
```

这次，我们想把文本中每一行第一次出现的`quick`都改成`slow`，可以输入如下命令来实现：

```bash
:%s/quick/slow/
```

结果如下：

```bash
The slow brown fox jumps over the quick dog.
The slow red fox jumps over the lazy cat.
```

此外，我们也可以指定一个具体的搜索范围来进行查找和替换。对于如下文本：

```bash
The quick brown fox jumps over the quick dog.
The quick red fox jumps over the lazy cat.
The quick yellow fox jumps over the lazy rat.
The quick black fox jumps over the lazy monkey.
The quick green fox jumps over the lazy pig.
```

如果我们想把其中第2至4行里的`fox`改为`rabbit`，可以输入如下命令：

```bash
:2,4s/fox/rabbit/
```

结果如下：

```bash
The quick brown fox jumps over the quick dog.
The quick red rabbit jumps over the lazy cat.
The quick yellow rabbit jumps over the lazy rat.
The quick black rabbit jumps over the lazy monkey.
The quick green fox jumps over the lazy pig.
```

如果光标在第3行，我们想将从第3行到文件末尾的`quick`都改为`slow`，可以输入如下命令：

```bash
:.,$s/quick/slow/
```

结果如下：

```bash
The quick brown fox jumps over the quick dog.
The quick red fox jumps over the lazy cat.
The slow yellow fox jumps over the lazy rat.
The slow black fox jumps over the lazy monkey.
The slow green fox jumps over the lazy pig.
```

我们还可以将搜索范围设定为光标所在行开始n行内，例如光标在第1行，我们想将第1行至第3行中所有的`the`改为`a`，可以通过输入如下命令来实现：

```bash
:.,+2s/the/a/
```

结果如下：

```bash
The quick brown fox jumps over a quick dog.
The quick red fox jumps over a lazy cat.
The quick yellow fox jumps over a lazy rat.
The quick black fox jumps over the lazy monkey.
The quick green fox jumps over the lazy pig.
```

### {pattern}

通常`pattern`会匹配所有满足要求的字符串，假设我们将`pattern`指定为`the`，那么所有包含`the`的字符串的都会被匹配出来。（比如`the`，`there`, `whether`等）

如果我们想要完全匹配单词`the`，可以用`\<`和`\>`指定：

```bash
:s/\<the\>/a/
```

上面这条命令就可以只把`the`替换为`a`，而不会匹配到其他包含`the`的字符串了。

此外，[正则表达式](/blog/regular-expression-cheatsheet/)也可以用来作为`pattern`的搜索样式。

### {string}

如果我们不输入`string`，则会删除第一个满足`pattern`的字符串，比如对于文本：

```bash
The quick brown fox jumps over the quick dog.
```

我们想要删掉第一个出现的`quick`，可以用下面这条命令：

```bash
:s/quick//
```

结果如下：

```bash
The  brown fox jumps over the quick dog.
```

### [flags]

`flags`里面常用的参数包括`g`、`i`和`c`。

#### g

如果想替换掉指定`range`内所有匹配的字符串，可以用`g`（g表示global）。

例如，对于文本：

```bash
The quick brown fox jumps over the quick dog.
```

我们想将文本中所有的`quick`都替换为`slow`，可以输入如下命令：

```bash
:s/quick/slow/g
```

得到的结果如下：

```bash
The slow brown fox jumps over the slow dog.
```

#### i

`i`标签可以忽略大小写敏感。还是下面这段文本：

```bash
The quick brown fox jumps over the quick dog.
```

我们想把所有的`the`都替换为`a`（无论大小写），可以用下面的命令来实现：

```bash
:s/the/a/gi
```

结果如下：

```bash
a quick brown fox jumps over a quick dog.
```

#### c

`c`标签会要求我们在每次操作的时候进行确认。让我们回到上一段`i`标签的例子中，如果将`c`加入到输入的命令中：

```bash
:s/the/a/gic
```

回车后我们会看到如下提示：

```bash
replace with a (y/n/a/q/l/^E/^Y)?
```

其中每个选项的解释如下：

- y：确认替换
- n：跳到下一个匹配项（需要配合`g`标签）
- a：全部替换
- q：退出
- l：替换当前匹配项并退出
- ^E（CTRL+E）：向上翻滚屏幕
- ^Y（CTRL+Y）：向下翻滚屏幕

这样就可以针对每一个匹配项进行相应的操作了。

<center>- EOF -</center>
