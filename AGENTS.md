---
name: "blog_system project rules"
description: "Astro personal technical site rules"
---

# Project Rules

## Goal

This repository is a long-running personal technical website built with Astro.

The site must support:

- Personal brand pages
- Technical blog posts
- Project portfolio pages
- GitHub Pages deployment in phase 2
- Synology NAS migration in phase 3

## Phases

1. Phase 1: Local Astro website foundation.
2. Phase 2: GitHub Pages publishing workflow.
3. Phase 3: NAS hosting migration.

Do not mix phase 2 or phase 3 implementation into phase 1 unless explicitly requested.

## Architecture

- Use Astro static output first.
- Store content as Markdown or MDX in Git.
- Keep blog content and project content in Astro content collections.
- Do not add a database, CMS, user system, or backend service in phase 1.
- Comments and analytics must be isolated behind components so they can be replaced later.

## Directory Rules

```text
src/content/blog/        Blog posts in .md or .mdx
src/content/projects/    Portfolio entries in .md or .mdx
src/pages/               Routes
src/layouts/             Page layouts
src/components/          Reusable UI components
src/components/comments/ Future comment integrations
src/components/analytics/Future analytics integrations
src/styles/              Global CSS
src/lib/                 Small shared helpers
public/                  Static assets copied as-is
deploy/                  Future deployment notes and config
```

## Naming Rules

- Use kebab-case for files and route segments.
- New blog files should start with a date: `yyyy-mm-dd-topic.mdx`.
- Migrated legacy posts may keep their source slug, such as `sql-row-number.md`, when the slug is part of the public URL strategy.
- Project files should use the project slug: `project-name.mdx`.
- Keep frontmatter fields stable once published.

## Content Rules

Blog posts must include:

- `title`
- `description`
- `publishDate`
- `categories`
- `tags`
- `draft`

Project entries must include:

- `title`
- `description`
- `publishDate`
- `tags`
- `status`
- `draft`

Draft content is visible during local development and excluded in production builds.

## Verification

After code changes, run:

```bash
npm run check
npm run build
```

For local preview:

```bash
npm run dev
```

## Red Lines

Ask before:

- Deleting files or directories
- Git rollback or destructive Git operations
- Editing `.env`, secrets, tokens, or CI/CD configs
- Database schema changes or data migrations
- Installing global dependencies or changing system config
- Public publishing or production deployment
