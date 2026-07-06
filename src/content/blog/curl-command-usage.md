---
title: "curl命令的常见使用方法"
description: "整理 curl 在接口访问、请求参数、文件下载和调试中的常见用法。"
publishDate: "2024-04-08T20:24:06+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
draft: false
---

## 写在前面

`curl`是Linux常用的命令行工具，用于向Web服务器发送请求，本文记录其常见使用方式。

## 基本用法

### 无参数

不带有任何参数时默认发出GET请求：

```bash
$ curl http://www.example.com
```

向www.example.com发送GET请求，返回内容会在终端输出。

### -d

`-d`用于发送POST请求的数据体，通常用于提交表单。

```bash
$ curl -d "login=<username>&password=<password>" -X POST http://www.example.com
```

### -H

`-H`用于在请求中添加头部信息。

```bash
$ curl -H "Content-Type:appliation/json" -X POST -d "" http://www.example.com
```

### -X

`-X`用于指定请求的方法。

```bash
$ curl -d "login=<username>&password=<password>" -X POST http://www.example.com
```

## 参考资料

1. [curl 的用法指南](https://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

<center>-- EOF --</center>
