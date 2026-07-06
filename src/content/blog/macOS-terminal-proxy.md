---
title: "如何让MacOS「终端」走代理"
description: "说明如何为 macOS 终端配置 HTTP 和 SOCKS5 代理，让命令行流量走代理。"
publishDate: "2024-09-09T11:09:05+08:00"
categories: []
tags:
  - "VPN"
draft: false
---

本文记录了如何通过修改.zshrc配置文件实现终端走代理。

首先，我们通过vim打开家目录下zsh的配置文件。

> 由于bash license的问题，从Catalina（10.15）开始，macOS的默认shell变为了zsh。

```bash
$ vim ~/.zshrc
```

> 如果之前没有生成过.zshrc文件，则该命令会自动创建一个。

输入如下内容：

```bash
function proxyOn() {
    export https_proxy=http://127.0.0.1:<port>
    export http_proxy=http://127.0.0.1:<port>
    export all_proxy=socks5://127.0.0.1:<port>
    printf "Proxy On\n"
}

function proxyOff() {
    unset https_proxy
    unset http_proxy
    unset all_proxy
    printf "Proxy Off\n"
}
```

> \<port\>需要替换为代理监听的端口。

配置完后保存退出。

通过`source`命令让更改后的配置文件生效。

```bash
$ source ~/.zshrc
$ proxyOn
Proxy On
```

此时代理已打开，我们可以使用`curl ipinfo.io`命令查看代理的连接情况。

```bash
$ curl ipinfo.io
{
  "ip": "43.167.247.180",
  "city": "Singapore",
  "region": "Singapore",
  "country": "SG",
  "loc": "1.2771,103.8481",
  "org": "AS132203 Tencent Building, Kejizhongyi Avenue",
  "postal": "068897",
  "timezone": "Asia/Singapore",
  "readme": "https://ipinfo.io/missingauth"
}%
```

可见ip地址已经成功切换到了国外。

如果不想记`curl ipinfo.io`命令，或者觉得每次输入这么长太麻烦，我们也可以把它写成一个函数放到.zshrc中。

```bash
function checkProxyStatus() {
    curl ipinfo.io
}
```

这样，每次只需要输入`checkProxyStatus`命令即可查看当前的代理情况。

```bash
$ source ~/.zshrc
$ checkProxyStatus
{
  "ip": "43.167.247.180",
  "city": "Singapore",
  "region": "Singapore",
  "country": "SG",
  "loc": "1.2771,103.8481",
  "org": "AS132203 Tencent Building, Kejizhongyi Avenue",
  "postal": "068897",
  "timezone": "Asia/Singapore",
  "readme": "https://ipinfo.io/missingauth"
}%
```

<center>- EOF -</center>
