# Blog System

[中文](README.md)

Astro-based personal technical website for personal branding, technical writing,
and project portfolio pages.

## Roadmap

| Phase 1: Local Astro Foundation | Phase 2: GitHub Pages Publishing | Phase 3: Synology NAS Migration |
| --- | --- | --- |
| Complete | Complete | Not started |
| Build a local static website foundation for writing, previewing, and building content. | Publish the Astro site from GitHub to GitHub Pages through an automated workflow. | Move static hosting to Synology NAS while keeping the site easy to build and redeploy. |
| [x] Astro static site structure<br>[x] MDX support<br>[x] Blog and project content collections<br>[x] RSS<br>[x] Sitemap<br>[x] SEO basics<br>[x] Comment and analytics placeholders<br>[x] Hexo article migration<br>[x] Image migration<br>[x] Categories<br>[x] Tags<br>[x] Markdown table styling<br>[x] Math rendering with KaTeX<br>[x] Content writing workflow scripts<br>[ ] Improve visual design<br>[ ] Add search<br>[ ] Add comments<br>[ ] Add analytics<br>[ ] Refine SEO<br>[ ] Refine content publishing checks | [x] `atlrwt/atlrwt.github.io` repository setup<br>[x] GitHub Pages workflow<br>[x] GitHub Actions deployment source<br>[x] Hexo static backup branch<br>[x] Source branch is `main`<br>[x] Legacy Hexo static site is backed up in `legacy-hexo-static`<br>[x] Successful production deployment to `https://atlrwt.github.io/`<br>[ ] Optional custom domain<br>[ ] Richer Open Graph images<br>[ ] Production comments<br>[ ] Production analytics<br>[ ] Post-deploy verification checklist | [ ] Choose NAS hosting mode<br>[ ] Serve generated `dist/`<br>[ ] Configure domain or reverse proxy<br>[ ] Configure HTTPS<br>[ ] Define deployment process from local/GitHub to NAS<br>[ ] Evaluate Docker + Nginx<br>[ ] Evaluate Synology Web Station<br>[ ] Evaluate reverse proxy in front of a static file server<br>[ ] Decide whether NAS becomes primary site or backup mirror<br>[ ] Implement automation and operational notes |

Current production site:

```text
https://atlrwt.github.io/
```

## Requirements

- Node.js `>=22.12.0`
- npm `>=9.6.5`

## Local Setup

```bash
npm install
npm run lint:content
npm run check:publish
npm run check -- --minimumFailingSeverity error
npm run build
npm run dev
```

Local preview:

```text
http://localhost:4321/
```

## Content Locations

```text
src/content/blog/        Blog posts
src/content/projects/    Project portfolio entries
templates/posts/         Blog writing templates
scripts/                 Local automation scripts
```

Draft content uses:

```yaml
draft: true
```

Drafts are available during local development and excluded from production
builds.

## New Post Workflow

Create a draft post:

```bash
npm run new:post -- "Post title"
```

This creates a file under:

```text
src/content/blog/yyyy-mm-dd-slug.mdx
```

Required blog frontmatter:

```yaml
title: ""
description: ""
publishDate: 2026-07-06
categories: []
tags: []
draft: true
```

Use the templates in `templates/posts/` for common article types:

- Technical troubleshooting
- Technical concept
- Tool guide
- Project review
- Reading note

## Content Checks

Run content lint while writing:

```bash
npm run lint:content
```

It checks frontmatter, dates, categories, local images, internal links, and
local absolute paths.

Run the default publish check before deploying:

```bash
npm run check:publish
```

This checks all published content and ignores unrelated drafts.

When publishing one target post while other drafts still exist, run:

```bash
npm run check:publish -- src/content/blog/your-post.mdx
```

The target post must have:

```yaml
draft: false
```

The target post must not contain unfinished placeholders such as `TODO`,
`待补充`, or `待完善`.

## Publish Workflow

Standard flow for publishing one post:

```bash
npm run new:post -- "Post title"

# Write content, update description/categories/tags, add images.
# Set draft: false when the post is ready.

npm run lint:content
npm run check:publish -- src/content/blog/your-post.mdx
npm run check -- --minimumFailingSeverity error
npm run build

git status
git add .
git commit -m "Add post: Post title"
git push origin main
```

Pushing to `main` triggers the GitHub Pages workflow:

```text
.github/workflows/deploy.yml
```

Deployment target:

```text
https://atlrwt.github.io/
```

## Future Phase

Phase 3 will migrate static hosting to Synology NAS. The NAS target should serve
the generated `dist/` directory.
