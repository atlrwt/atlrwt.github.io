---
title: "浅析Linux定时任务调度 - crontab"
description: "梳理 Linux crontab 的基本命令、时间表达式和周期性任务调度的核心用法。"
publishDate: "2025-01-13T09:23:55+08:00"
categories:
  - "Ops"
tags:
  - "Linux"
draft: false
---

## TL-DR

Linux的周期性定时任务

```bash
$ crontab [-u username] [-l|-e|-r]
-u：指定用户（只有root账户才可使用）
-e：编辑crontab任务
-l：列出所有执行中的crontab任务
-r：移除所有的crontab任务
```

```bash
Example of job definition:
.---------------- minute (0 - 59)
|  .------------- hour (0 - 23)
|  |  .---------- day of month (1 - 31)
|  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
|  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) 
|  |  |  |  |     OR sun,mon,tue,wed,thu,fri,sat
|  |  |  |  |
*  *  *  *  * username  command to be executed
```

## 正文

<center>- EOF -</center>
