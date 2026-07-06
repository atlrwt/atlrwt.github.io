---
title: "Docker的离线升级"
description: "说明在内网生产环境中通过静态二进制包离线升级 Docker 的完整操作流程。"
publishDate: "2023-03-27T16:34:15+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
  - "Docker"
draft: false
---

## 1. 问题背景
由于Linux系统打patch升级了kernel导致docker版本与kernel版本不兼容，docker服务无法启动，需要对docker版本进行升级。

企业的生产系统通常都是内网环境，系统管理员往往无法直接通过连接外网来更新系统软件，此时便需要通过离线方式对docker进行升级。

## 2. 实现目标
通过离线方式将docker升级（v19.03.10 -\> 20.10.17）。

## 3. 解决方案
1. 下载docker文件
从[https://download.docker.com/linux/static/stable/x86\_64/](https://download.docker.com/linux/static/stable/x86_64/)将目标版本docker文件下载至本地。

2. 上传docker升级文件至Linux服务器
通过SFTP等方式将docker文件上传至Linux服务器中。

3. 解压docker文件

```bash
$ tar -zxvf docker-<version>.tgz
```

4. 备份旧docker文件

我们这台服务器的docker安装在了`/usr/bin/`路径下。进入该路径下备份docker相关的文件。

```bash
~ $ cd /usr/bin
/usr/bin $ sudo tar -zcvf old_docker_bak.tgz docker dockerd docker-init docker-proxy ctr runc containerd containerd-shim
```

5. 停止所有docker应用

停止所有docker应用。

6. 停止docker服务

```bash
$ sudo systemctl stop docker
```

7. 将docker升级文件移动至`/usr/bin/`

```bash
$ sudo cp docker/* /usr/bin
```

8. 检查docker版本

```bash
$ docker --version
```

9. 重载守护进程并启动docker

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl start docker
$ sudo systemctl enable docker.service
```

10. 查看docker状态

```bash
$ sudo systemctl status docker
```

## 参考
1. [Install Docker Engine from binaries](https://docs.docker.com/engine/install/binaries/#install-static-binaries)

<center>- EOF -</center>
