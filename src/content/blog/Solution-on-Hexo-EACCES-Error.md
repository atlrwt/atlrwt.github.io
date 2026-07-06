---
title: "macOS在安装Hexo时遇到EACCES权限错误的解决方法"
description: "记录 macOS 安装 Hexo 遇到 npm EACCES 权限错误时的推荐修复方案。"
publishDate: "2023-03-08T09:34:38+08:00"
categories:
  - "Blog"
tags:
  - "Hexo"
draft: false
---

## 写在前面

此方法基于官方放出的解决方案，并做了加工整合。

在安装Hexo时，遇到了EACCES权限错误。

```bash
$ npm install -g hexo-cli
node_modules/hexo-cli
npm ERR! dest /usr/local/lib/node_modules/.hexo-cli-2J2VY37q
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, rename '/usr/local/lib/node_modules/hexo-cli' -> '/usr/local/lib/node_modules/.hexo-cli-2J2VY37q'
npm ERR!  [Error: EACCES: permission denied, rename '/usr/local/lib/node_modules/hexo-cli' -> '/usr/local/lib/node_modules/.hexo-cli-2J2VY37q'] {
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'rename',
npm ERR!   path: '/usr/local/lib/node_modules/hexo-cli',
npm ERR!   dest: '/usr/local/lib/node_modules/.hexo-cli-2J2VY37q'
npm ERR! }
npm ERR!
npm ERR! The operation was rejected by your operating system.
npm ERR! It is likely you do not have the permissions to access this file as the current user
npm ERR!
npm ERR! If you believe this might be a permissions issue, please double-check the
npm ERR! permissions of the file and its containing directories, or try running
npm ERR! the command again as root/Administrator.
```

针对这个情况，npmjs官方给出了两种解决方案：
- 通过node version manager重新安装npm（**推荐**）
- 手动更改npm的默认文件夹

这里官方推荐了第一种解决方案，该方案更安全操作也相对简单，不需要移除现有的npm和Node.js。

所以接下来我们就采用第一种方案来解决这个问题。

## 通过Node Version Manager重新安装npm

这里需要用到`nvm`这个node版本管理器。

首先我们看看当前系统的node和npm版本。

```bash
$ node -v
v18.14.2
$ npm -v
9.5.0
```

接下来通过`curl`命令安装`nvm`。

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

上述命令会将GitHub上的nvm repository克隆至`~/.nvm`，同时会尝试将配置信息添加至相应的文件中（如`~/.bash_profile`，`~/.zshrc`，`~/.profile`，`~/.bashrc`等）。

加载nvm。

```bash
$ export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

验证nvm是否安装成功。

```bash
$ command -v nvm
nvm
```

终端显示`nvm`即代表安装成功，接下来通过nvm重新安装npm。

由于我们系统里当前node版本为18.14.2，所以我们重新安装一次该版本。

```bash
$ nvm install 18
...
Now using node v18.14.2 (npm v9.5.0)
Creating default alias: default -> 18 (-> v18.14.2)
```

根据各自系统情况的不同，安装需要耗费一定时间。

`npm`安装完成后即可继续hexo的安装。

## 参考
1. [Resolving EACCES permissions errors when installing packages globally ]([https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally])
2. [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. [Node Version Manager](https://github.com/nvm-sh/nvm)

<center>- EOF -</center>
