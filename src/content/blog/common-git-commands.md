---
title: "常用 Git 命令速查"
description: "按配置、提交、远程、分支和排查场景整理常用 Git 命令速查表。"
publishDate: "2025-11-03T11:45:22+08:00"
categories:
  - "Ops"
tags:
  - "Git"
draft: false
---

本文记录了一些常用的 Git 命令，用于自查。

# 1. 仓库初始化与配置

| 命令 | 作用 |
| --- | --- |
| git init | 初始化新仓库 |
| git clone \<repository-url> | 克隆远程仓库到本地 |
| git config --global user.name "Name" | 设置全局用户名 |
| git config --global user.email "email" | 设置全局邮箱 |

# 2. 日常工作流

| 命令 | 作用 |
| --- | --- |
| git status | 查看工作区和暂存区的状态 |
| git add \<file> | 将文件添加到暂存区 |
| git add . | 添加当前目录所有变更 |
| git commit -m "your-comments" | 提交暂存区内容到版本库 |
| git log | 查看提交历史 |
| git log --oneline | 简洁版提交历史 |

# 3. 远程操作
| 命令 | 作用 |
| --- | --- |
| git remote -v | 查看远程仓库信息 |
| git remote add origin \<repository-url> | 添加远程仓库地址 |
| git push \<remote> \<branch> | 推送本地提交到远程仓库 |
| git pull origin \<branch> | 拉取远程仓库最新代码 |

# 4. 分支管理
| 命令 | 作用 |
| --- | --- |
| git branch | 列出所有本地分支 |
| git branch -r | 列出所有远程分支 |
| git branch \<branch-name> | 创建新分支 |
| git checkout \<branch-name> | 切换到指定分支 |
| git checkout -b \<branch-name> | 新建并切换到该分支（该远程分支必须存在） |
| git merge \<branch-name> | 合并分支到当前分支 |
| git branch -d \<branch-name> | 删除本地分支 |

# 5. 撤销与回退
| 命令 | 作用 |
| --- | --- |
| git reset \<file> | 取消暂存文件 |
| git reset --hear \<commit> | 回退到指定提交 |

# 6. 其他命令
| 命令 | 作用 |
| --- | --- |
| git diff \<file> | 查看文件具体修改 |
| git tag \<version> | 给当前提交打标签 |
| git help \<command> | 查看命令帮助 |

<center>-- EOF --</center>
