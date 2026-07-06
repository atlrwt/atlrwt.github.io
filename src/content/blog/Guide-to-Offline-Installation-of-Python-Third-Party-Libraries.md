---
title: "Python 第三方依赖包的离线安装指南"
description: "演示如何在外网环境下载 Python 依赖包，并在内网服务器离线安装第三方库。"
publishDate: "2024-05-17T11:33:28+08:00"
categories:
  - "Ops"
tags:
  - "Python"
draft: false
---

## 背景介绍

我们在一台服务器上搭建完 Python 环境之后，有时会因为服务器的网络限制原因，不能直接通过`pip`命令下载安装 Python 的依赖包。

此时，需要先在外网服务器上下载好所需的依赖包文件，然后拷贝到内网服务器，再通过`pip`进行安装。

本文将通过一个示例讲解这个流程。

## 解决方案

假设我们需要在一台内网的 Linux 服务器上面做机器学习的项目，目前已经通过 `conda` 创建了名为`ds_project`的环境，由于网络的限制项目用到的`scikit-learn`依赖包需要离线进行安装。

### 1. 导出内网服务器中 Python 的环境信息

通过`conda`我们可以很方便的导出当前环境的信息。

```bash
(base) ~$ conda activate ds_project
(ds_project) ~$ conda env export > ds_project_environment.yml 
```

这行命令将创建一个名为`ds_project_environment.yml`的文件，其中包含了当前环境的名称、通道、所有包的详细信息等。

```bash
(ds_project) ~$ cat ds_project_environment.yml
name: ds_project
channels:
  - defaults
dependencies:
  - _libgcc_mutex=0.1=main
  - _openmp_mutex=5.1=1_gnu
  - ca-certificates=2024.3.11=h06a4308_0
  - ld_impl_linux-64=2.38=h1181459_1
  - libffi=3.4.4=h6a678d5_1
  - libgcc-ng=11.2.0=h1234567_1
  - libgomp=11.2.0=h1234567_1
  - libstdcxx-ng=11.2.0=h1234567_1
  - ncurses=6.4=h6a678d5_0
  - openssl=3.0.13=h7f8727e_1
  - pip=24.0=py38h06a4308_0
  - python=3.8.19=h955ad1f_0
  - readline=8.2=h5eee18b_0
  - setuptools=69.5.1=py38h06a4308_0
  - sqlite=3.45.3=h5eee18b_0
  - tk=8.6.14=h39e8969_0
  - wheel=0.43.0=py38h06a4308_0
  - xz=5.4.6=h5eee18b_1
  - zlib=1.2.13=h5eee18b_1
prefix: /home/atlrwt/miniconda3/envs/ds_project
```

### 2. 复制导出的环境到外网服务器

将上一步创建的`ds_project_environment.yml`文件复制到外网服务器，然后通过下面的命令创建一套同样的环境。

```bash
(base) ~$ conda env create -f ds_project_environment.yml
Channels:
 - defaults
Platform: linux-64
Collecting package metadata (repodata.json): done
Solving environment: done

Downloading and Extracting Packages:

Preparing transaction: done
Verifying transaction: done
Executing transaction: done
#
# To activate this environment, use
#
#     $ conda activate ds_project
#
# To deactivate an active environment, use
#
#     $ conda deactivate
```

这样我们就在外网服务器中创建了一个一模一样的 Python 环境，方便后续安装需要的依赖包。

### 3. 安装依赖包

在外网服务器上的`ds_project`环境中安装需要的依赖包。

```bash
(base) ~$ conda activate ds_project
(ds_project) ~$ pip install pandas jupyterlab scikit-learn
```

### 4. 生成`requirements.txt`并下载相关依赖包文件

经过上一步的操作，我们已经将需要的第三方依赖包安装到了外网环境中，这一步我们先通过`pip freeze`生成`requirements.txt`文件用于储存环境里面`Python`包的信息，再利用`pip download`命令保存`requirements.txt`中的包到指定目录。

```bash
(ds_project) ~$ pip freeze > requirements.txt
(ds_project) ~$ pip download -r requirements.txt -d packages
```

### 5. 传回内网环境进行安装

把第4步生成的`requirements.txt`文件和保存有安装包的`packages`文件夹复制到内网服务器，然后通过`pip install`将其安装。

```bash
(ds_preject) ~$ pip install --no-index --find-links=./packages -r ./requirements.txt
```

经过这一步的操作，我们就可以将需要的第三方依赖包安装到内网服务器上了。

<center>- EOF -</center>
