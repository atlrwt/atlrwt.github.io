---
title: "如何将Hexo迁移至新的Server"
description: "记录将 Hexo 博客迁移到新服务器时需要完成的 Node.js、Git、Hexo 安装和文件迁移步骤。"
publishDate: "2024-09-07T11:05:44+08:00"
categories:
  - "Blog"
tags:
  - "Hexo"
draft: false
---

## 背景

最近重装了系统，需要将老系统上Hexo相关的文件迁移到新系统中。

本文详细记录了迁移过程的所有步骤，以便今后再有类似需求可快速查看。

## 步骤

### 1. 备份

将老系统中Hexo项目文件夹下的所有内容打包备份。

例如，我在家目录下创建了一个Blog文件夹，并通过 `hexo init Blog` 将其初始化为Hexo项目文件夹，则备份时需将整个Blog文件夹进行备份。

### 2. 安装Hexo

之前曾经写文章整理过Hexo的[安装教程](/blog/personal-blog-from-scrach-hexo-x-github/)，然而过去了这么久，有些安装步骤已经过时，所以借此机会重新梳理一下。

#### 2.1 安装Node.js

为避免遇到EACCES权限错误（[解决方法在此](/blog/solution-on-hexo-eacces-error/)），这里直接采用nvm来安装。

首先在终端输入如下命令将nvm下载到本地。

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

将nvm的配置信息添加至配置文件中。

```bash
$ export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

验证nvm是否安装成功。

```bash
$ command -v nvm
nvm
```

终端显示nvm即代表安装成功，接下来安装npm。

通过[Node.js官网](https://nodejs.org/zh-cn)查到目前最新的LTS版本为20.17.0。

```bash
$ nvm install 20
...
Now using node v20.17.0 (npm v10.8.2)
Creating default alias: default -> 20 (-> v20.17.0)
```

查看是否安装成功。

```bash
$ node --version
v20.17.0
$ npm --version
10.8.2
```

#### 2.2 安装及配置Git

macOS可以通过homebrew轻松实现安装。

```bash
$ brew install git
```

配置本地信息。

```bash
$ git config --global user.name "your_name"
$ git config --global user.email "your_email@example.com"
```

生成密钥并上传至GitHub。

```bash
$ ssh-keygen -t ed25519 -C "your_email@example.com"
```

测试连通性。

```bash
$ ssh -T git@github.com
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 2.3 安装Hexo

前置工作都完成后终于可以安装Hexo啦。

```bash
$ npm install -g hexo-cli
```

### 3. 迁移

在目标路径下初始化Hexo工程文件夹。这里我还是选择家目录下的Blog文件夹。

```bash
~$ mkdir Blog
~$ hexo init Blog
```

将之前备份的老系统中所有的文件全部复制到~/Blog文件夹下并覆盖原有内容。

至此迁移工作完成。

<center>- EOF -</center>
