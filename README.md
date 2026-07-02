# Blog System

Astro-based personal technical website for personal branding, technical writing,
and project portfolio pages.

## Current Phase

Phase 1: local Astro foundation.

This phase includes:

- Astro static site structure
- MDX support
- Blog and project content collections
- RSS
- Sitemap integration
- SEO basics
- Comment and analytics component placeholders

This phase does not include:

- Public publishing
- NAS deployment
- Comment service setup
- Analytics service setup

## Requirements

- Node.js `>=22.12.0`
- npm `>=9.6.5`

## Local Setup

```bash
npm install
npm run check
npm run build
npm run dev
```

## Content

```text
src/content/blog/        Blog posts
src/content/projects/    Project portfolio entries
```

Draft content uses:

```yaml
draft: true
```

Drafts are available during local development and excluded from production
builds.

## Future Phases

Phase 2 publishes the site to GitHub Pages at:

```text
https://atlrwt.github.io/
```

The GitHub Pages workflow lives at:

```text
.github/workflows/deploy.yml
```

Phase 3 migrates static hosting to Synology NAS.
