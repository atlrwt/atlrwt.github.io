# Blog System

[English](README.en.md)

![Astro](https://img.shields.io/badge/Astro-7.0.5-ff5d01?logo=astro&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-339933?logo=node.js&logoColor=white)
[![Deploy to GitHub Pages](https://github.com/atlrwt/atlrwt.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/atlrwt/atlrwt.github.io/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/badge/GitHub%20Pages-live-2ea44f?logo=github)](https://atlrwt.github.io/)

基于 Astro 的个人技术网站，用于个人品牌展示、技术博客沉淀和项目作品集展示。

## 路线图

| Phase 1：本地 Astro 基础 | Phase 2：GitHub Pages 发布 | Phase 3：群晖 NAS 迁移 |
| --- | --- | --- |
| 已完成 | 已完成 | 未开始 |
| 搭建本地静态网站基础，支持内容写作、本地预览和静态构建。 | 通过 GitHub Actions 将 Astro 站点自动发布到 GitHub Pages。 | 将静态站点迁移到群晖 NAS 托管，同时保持构建和部署流程清晰。 |
| [x] Astro 静态站点结构<br>[x] MDX 支持<br>[x] 博客和项目内容集合<br>[x] RSS<br>[x] 站点地图<br>[x] 基础 SEO<br>[x] 评论和统计占位组件<br>[x] Hexo 文章迁移<br>[x] 图片迁移<br>[x] 分类<br>[x] 标签<br>[x] Markdown 表格样式<br>[x] KaTeX 数学公式渲染<br>[x] 内容写作工作流脚本<br>[ ] 视觉设计优化<br>[ ] 全文搜索<br>[ ] 评论<br>[ ] 访问统计<br>[ ] SEO 深化<br>[ ] 内容发布检查完善 | [x] `atlrwt/atlrwt.github.io` 仓库配置<br>[x] GitHub Pages workflow<br>[x] GitHub Actions 部署源<br>[x] Hexo 静态站点备份分支<br>[x] 源码分支为 `main`<br>[x] 旧 Hexo 静态站点备份在 `legacy-hexo-static`<br>[x] 生产环境成功部署到 `https://atlrwt.github.io/`<br>[ ] 可选自定义域名<br>[ ] 更完整的 Open Graph 图片<br>[ ] 生产评论<br>[ ] 生产统计<br>[ ] 部署后验证清单 | [ ] 选择 NAS 托管方式<br>[ ] 托管生成后的 `dist/`<br>[ ] 配置域名或反向代理<br>[ ] 配置 HTTPS<br>[ ] 定义从本地或 GitHub 到 NAS 的部署流程<br>[ ] 评估 Docker + Nginx<br>[ ] 评估 Synology Web Station<br>[ ] 评估静态文件服务前的反向代理<br>[ ] 决定 NAS 是主站还是备份镜像<br>[ ] 实现自动化和运维说明 |

当前生产站点：

```text
https://atlrwt.github.io/
```

## 环境要求

- Node.js `>=22.12.0`
- npm `>=9.6.5`

## 本地启动

```bash
npm install
npm run lint:content
npm run check:publish
npm run check -- --minimumFailingSeverity error
npm run build
npm run dev
```

本地预览地址：

```text
http://localhost:4321/
```

## 内容目录

```text
src/content/blog/        博客文章
src/content/projects/    项目作品集条目
templates/posts/         博客写作模板
scripts/                 本地自动化脚本
docs/                    项目操作日志和维护记录
```

草稿内容使用：

```yaml
draft: true
```

草稿会在本地开发环境显示，但会在生产构建中排除。

## 新文章工作流

创建一篇草稿文章：

```bash
npm run new:post -- "文章标题"
```

文件会生成到：

```text
src/content/blog/yyyy-mm-dd-slug.mdx
```

博客文章必需 frontmatter：

```yaml
title: ""
description: ""
publishDate: 2026-07-06
categories: []
tags: []
draft: true
```

常用文章模板位于 `templates/posts/`：

- 技术问题排查
- 技术概念解释
- 工具教程
- 项目复盘
- 读书笔记

## 内容检查

写作过程中运行内容检查：

```bash
npm run lint:content
```

该命令会检查 frontmatter、日期、分类、本地图片、内部链接和本地绝对路径。

部署前运行默认发布检查：

```bash
npm run check:publish
```

该命令会检查所有已发布内容，并忽略无关草稿。

如果有多篇草稿，但只发布其中一篇，运行：

```bash
npm run check:publish -- src/content/blog/your-post.mdx
```

目标文章必须设置：

```yaml
draft: false
```

目标文章不能包含 `TODO`、`待补充`、`待完善` 等未完成标记。

## 发布工作流

发布单篇文章的标准流程：

```bash
npm run new:post -- "文章标题"

# 写正文，补充 description/categories/tags，添加图片。
# 文章准备发布时，将 draft 改为 false。

npm run lint:content
npm run check:publish -- src/content/blog/your-post.mdx
npm run check -- --minimumFailingSeverity error
npm run build

git status
git add .
git commit -m "Add post: Post title"
git push origin main
```

推送到 `main` 后会触发 GitHub Pages workflow：

```text
.github/workflows/deploy.yml
```

部署目标：

```text
https://atlrwt.github.io/
```

部署完成后运行线上验证：

```bash
npm run check:deploy
```

该命令会检查核心页面、RSS、sitemap、代表性文章、SEO 输出、静态资源和常见敏感信息模式。

## 生产访问统计

生产访问统计使用 Umami。当前站点只需要在 GitHub Actions Variables 中配置公开构建变量：

```text
PUBLIC_UMAMI_WEBSITE_ID
PUBLIC_UMAMI_SRC
PUBLIC_UMAMI_DOMAINS=atlrwt.github.io
```

这些值会在 GitHub Pages workflow 构建时注入，并由 `src/components/analytics/UmamiAnalytics.astro` 输出到页面 `<head>`。如果变量为空，则不会输出统计脚本。

部署后可带上同样的变量验证线上统计脚本：

```bash
PUBLIC_UMAMI_WEBSITE_ID=... \
PUBLIC_UMAMI_SRC=... \
PUBLIC_UMAMI_DOMAINS=atlrwt.github.io \
npm run check:deploy
```

## 操作日志

重要操作记录在：

```text
docs/OPERATIONS.md
```

需要记录的事件包括：

- 部署和部署后检查
- 内容迁移或批量修改
- 安全和隐私检查
- 工作流或基础设施调整
- 后续 NAS 迁移操作

## 后续阶段

Phase 3 会迁移到群晖 NAS 静态托管。NAS 目标应该托管构建生成的 `dist/` 目录。
