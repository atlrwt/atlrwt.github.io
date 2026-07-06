---
title: "macOS ClashX代理端口为0问题"
description: "记录 ClashX 升级或重装后代理端口变为 0 时，通过手动配置端口恢复代理的方法。"
publishDate: "2023-02-24T13:58:04+08:00"
categories: []
tags:
  - "VPN"
draft: false
---

## 1. 问题背景
不小心升级了ClashX，结果升级完成后遇到了托管配置文件格式不正确的问题，重新导入配置文件问题仍未解决，于是选择重装ClashX，然后ClashX就提示“系统代理设置已被另一个进程修改，Clashx不再是默认代理”，进一步研究后发现ClashX的Socks5和HTTP代理端口均为0。

## 2. 问题描述
- ClashX升级后提示“托管配置文件格式不正确”
- 重装ClashX后提示“系统代理设置已被另一个进程修改，Clashx不再是默认代理”
- Socks5和HTTP代理端口均为0

## 3. 解决方案
在终端打开`.config/clash/config.yaml`配置文件，手动添加如下端口信息：

	socks-port: 7891  // socks5代理端口  
	port: 7892        // http代理端口 

保存退出，重启ClashX后问题解决。

![](/images/blog/ClashX-Proxy-Port-0-Solution/ClashX_port.png)

<center>- EOF -</center>
