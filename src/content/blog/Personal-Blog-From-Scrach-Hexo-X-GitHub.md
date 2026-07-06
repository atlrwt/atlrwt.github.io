---
title: "从零开始的免费个人博客搭建之旅 - Hexo X GitHub"
description: "复盘从零使用 Hexo 和 GitHub Pages 搭建免费个人博客的环境准备、配置和发布流程。"
publishDate: "2023-03-02T11:18:42+08:00"
categories:
  - "Blog"
tags:
  - "Hexo"
  - "GitHub"
  - "Git"
draft: false
---

## 0. 写在前面

博客搭建方案：Hexo + GitHub Pages
系统：macOS

## 1. 环境准备

在正式安装Hexo之前需要先在macOS上安装如下程序：
- Node.js
- Git

并完成GitHub上面的配置工作，下面我们一步一步来。

### 1.1 安装Node.js

根据[Hexo官方文档](https://hexo.io/zh-cn/docs/)的要求，Node.js的版本需不低于10.13，建议使用 Node.js 12.0 及以上版本。

我们可以直接去[Node.js官网](https://nodejs.org/en/)下载程序安装包，这里出于稳定性考虑我选择下载LTS版本（部署该Blog时最新的LTS版本为18.14.2）。

下载下来的程序为`.pkg`格式，直接打开根据提示安装即可。

安装完成后打开终端，输入`node --version`验证一下安装是否成功。

```bash
$ node --version
v18.14.2
```

### 1.2 安装Git

macOS上可以通过`homebrew`来安装git。

```bash
$ brew install git
```

> homebrew是macOS系统非常方便好用的包管理工具，类似于Ubuntu的apt，CentOS的yum等，感兴趣的朋友可以去[homebrew官网](https://brew.sh/)了解。

验证git是否安装成功

```bash
$ git --version
git version 2.32.0
```

### 1.3 注册GitHub
安装完git后我们还需要在GitHub上新建一个repository用来存放博客。

1. 首先，新建一个`Repositories`

![Create a New Repository](/images/blog/Personal-Blog-From-Scrach-Hexo-X-GitHub/New_Repository.png)

2. 依下图所示填写`Repository name`，勾选`Add a README file`，最后点击`Create repository`完成创建。

> 注：`Repository name`格式为\<owner\>/\<username\>.github.io。通常username和owner相同，假设不同，则生成的网址会变成：\<owner\>.github.io/\<username\>.github.io

![](/images/blog/Personal-Blog-From-Scrach-Hexo-X-GitHub/Configuration.png)

### 1.4 连接GitHub与本地

首先在终端输入如下命令生成key。

```bash
$ git config --global user.name "<username>"
$ git config --global user.email "<email>"
$ ssh-keygen -t ras -C "<email>"         # 会提示生成key的位置，默认位置为~/.ssh/id_rsa/
```

打开GitHub -\> Settings -\> SSH and GPG keys -\> New SSH key，Title可以随意起，这里我起名叫for Blog。

接下来通过`cat`命令将刚刚生成的key复制到Key中，点击`Add SSH key`。

```bash
$ cat ~/.ssh/id_rsa.pub
```

最后，通过`ssh`命令验证本地git和GitHub的连通性。

```bash
$ ssh git@github.com
Hi atlrwt! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
```

出现类似上述内容证明本地和GitHub连接已成功。到这里为止，我们所有的环境准备工作均已完成。

## 2. 安装Hexo

准备工作都完成后接下来我们就可以正式安装hexo啦。方法很简单，在终端输入如下命令即可完成安装：

```bash
$ npm install -g hexo-cli
```

> 这个环节我遇到了`EACCES`权限错误，Hexo作者在文档中给出了npmjs官方的[解决方案](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)，并强调不要用sudo或root权限强行安装。这个解决方案读起来有点绕，嫌麻烦的朋友可以[点击这里](/blog/solution-on-hexo-eacces-error/)看我根据官方方案做的整理。

## 3. Hexo建站

首先在指定位置创建一个文件夹用于存放Hexo文件，这里我在用户根目录下创建了一个名为Blog的文件夹。然后通过`hexo init Blog`命令初始化hexo。

```bash
$ mkdir ~/Blog
$ hexo init Blog
INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
INFO  Install dependencies
INFO  Start blogging with Hexo!
```

出现`INFO  Start blogging with Hexo!`信息表明Hexo初始化成功。下面我们来预览一下。

```bash
$ cd ~/Blog           # 定位到刚刚初始化的目录
$ hexo s              # hexo server -- 启动服务预览
INFO  Validating config
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/ . Press Ctrl+C to stop.
```

打开浏览器，输入`http://localhost:4000/` 即可看到hexo的hello world界面。

## 4. 如何发布文章
 
首先我们在`Blog`文件夹下创建一篇新文章，就把它起名为“My First Blog”吧。

```bash
$ hexo new "My First Blog"
INFO  Validating config
INFO  Created: ~/Blog/source/_posts/My-First-Blog.md
```

> 注意：中文名称会导致在deploy时出现Spawn failed的错误，所以建议用英文命名`hexo new`创建的文章，后续我们可以在正文中将标题改为中文。

新生成的文章默认会存放在`source/_posts/`路径下，用markdown编辑器将其打开随便编辑些内容并保存退出。

接下来进入到Blog的根目录，编辑其中的`_config.yml`文件。

```bash
$ cd ~/Blog
$ vim _config.yml
```

找到`# Deployment` 部分，添加下述内容（注意修改其中的`username`）。

```vim
deploy:
  type: git
  repository: git@github.com:atlrwt/atlrwt.github.io.git
  branch: main
```

参考官网给出的一键部署方案，我们还需要安装`hexo-deployer-git`。

```bash
$ npm install hexo-deployer-git --save
```

安装完成后执行：

```bash
$ hexo clean && hexo deploy
```

当执行 `hexo deploy` 时，Hexo 会将 `public` 目录中的文件和目录推送至 `_config.yml` 中指定的远端仓库和分支中，并且**完全覆盖**该分支下的已有内容。

上传完成后稍等片刻打开\<username\>.github.io网页即可看到更新后的博客。

至此，我们博客的安装、部署和发布工作均已完成。当然，Hexo的功能远远没有这么简单，在接下来的文章里我们将会对其进行各种参数配置，并搭配人气超高的[NexT](https://theme-next.js.org/)主题来打造属于自己的炫酷博客。

敬请期待吧～

<center>- EOF -</center>
