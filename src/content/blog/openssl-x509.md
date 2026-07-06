---
title: "Linux SSL证书有效期查询"
description: "说明如何使用 openssl x509 命令查看 Linux SSL 证书的有效期信息。"
publishDate: "2024-04-21T13:52:35+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
draft: false
---

## 写在前面

本文用于记录如何通过命令行工具`openssl`的`x509`命令查看Linux SSL的证书有效期。

## openssl x509命令

用于对证书数据进行管理。

### 命令描述

```bash
$ openssl x509 -in /path/to/your/certificate.pem -noout -dates
```

`-in`：指定证书文件

`-noout`：不输出证书的编码部分

`-dates`：输出证书有效期，包括`startdate`和`enddate`

### 示例

Linux的ssl证书通常保存在`/etc/ssl/certs/`目录下，我们以其中的Microsoft_RSA_Root_Certificate_Authority_2017.pem为例看一下输出结果。

```bash
$ openssl x509 -in /etc/ssl/certs/Microsoft_RSA_Root_Certificate_Authority_2017.pem -noout -dates
notBefore=Dec 18 22:51:22 2019 GMT
notAfter=Jul 18 23:00:23 2042 GMT
```

<center>- EOF -</center>
