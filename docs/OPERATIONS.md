# Operations Log

This log records significant project operations for traceability.

## 2026-07-07 16:25 CST

- Operation: Implemented production analytics wiring for Umami.
- Changes:
  - Added `PUBLIC_UMAMI_DOMAINS` support to `UmamiAnalytics.astro`.
  - Injected Umami public variables through the GitHub Pages workflow.
  - Extended `check:deploy` to validate Umami script output when `PUBLIC_UMAMI_*` variables are provided.
  - Documented Umami production analytics setup in `README.md` and `README.en.md`.
- Verification:
  - `node --check scripts/check-deploy.mjs`
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
  - `npm run check:deploy`
  - Test build with `PUBLIC_UMAMI_WEBSITE_ID`, `PUBLIC_UMAMI_SRC`, and `PUBLIC_UMAMI_DOMAINS`
- Pending external step:
  - Configure real Umami Cloud website values in GitHub Actions Variables.
  - Redeploy and run `npm run check:deploy` with the real `PUBLIC_UMAMI_*` values.

## 2026-07-07 16:08 CST

- Operation: Added README status badges.
- Changes:
  - Added Astro version badge.
  - Added Node.js requirement badge.
  - Added GitHub Pages deployment workflow badge.
  - Added live site badge.
- Note: License badge was not added because the repository does not currently define a license.
- Verification:
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
  - `npm run check:deploy`

## 2026-07-07 16:03 CST

- Operation: Added project operation log convention.
- Context: The project needed a durable record of what was done and when.
- Changes:
  - Added `docs/OPERATIONS.md`.
  - Added operation log rules to `AGENTS.md`.
  - Added operation log references to `README.md` and `README.en.md`.
  - Added `npm run check:deploy` documentation created earlier in the working session.
- Verification:
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`

## 2026-07-07 16:01 CST

- Operation: Added post-deploy verification script.
- Changes:
  - Added `scripts/check-deploy.mjs`.
  - Added `npm run check:deploy`.
  - Documented post-deploy checks in `AGENTS.md`, `README.md`, and `README.en.md`.
- Verification:
  - `node --check scripts/check-deploy.mjs`
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
  - `npm run check:deploy`

## 2026-07-06 16:40 CST

- Operation: Sanitized public content examples.
- Commit: `4eaf6ee Sanitize public content examples`
- Changes:
  - Replaced real-looking proxy IP and location output in `src/content/blog/macOS-terminal-proxy.md`.
  - Replaced `password=123` examples with `<password>` placeholders in `src/content/blog/curl-command-usage.md`.
- Verification:
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
- Deployment:
  - Pushed to `origin/main`.
  - GitHub Pages workflow completed successfully.

## 2026-07-06 13:21 CST

- Operation: Added content workflow documentation.
- Commit: `7517670 Add content workflow documentation`
- Changes:
  - Added default Chinese `README.md`.
  - Added English `README.en.md`.
  - Added writing workflow scripts:
    - `scripts/new-post.mjs`
    - `scripts/check-content.mjs`
  - Added post templates under `templates/posts/`.
  - Updated `AGENTS.md` and `package.json`.
  - Fixed content issues found by the new checks.
- Verification:
  - `npm run lint:content`
  - `npm run check:publish`
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
- Deployment:
  - Pushed to `origin/main`.
  - GitHub Pages workflow completed successfully.

## 2026-07-06 11:07 CST

- Operation: Migrated Hexo posts to Astro.
- Commit: `d8de84a Migrate Hexo posts to Astro`
- Changes:
  - Migrated 36 Hexo posts into `src/content/blog/`.
  - Migrated post images into `public/images/blog/`.
  - Added category pages and category support.
  - Added KaTeX math rendering support.
  - Added Markdown table styling.
  - Added `scripts/migrate-hexo-posts.mjs`.
- Decisions:
  - Did not preserve legacy Hexo URLs.
  - Generated descriptions by reading the article content.
  - Did not add a `legacyUrl` field.
- Verification:
  - `npm run check -- --minimumFailingSeverity error`
  - `npm run build`
  - `npm audit --audit-level=moderate --cache .npm-cache`
- Deployment:
  - Pushed to `origin/main`.
  - GitHub Pages workflow completed successfully.

## 2026-07-02 17:12 CST

- Operation: Updated GitHub Pages deploy action.
- Commit: `ab15c48 Update GitHub Pages deploy action`
- Changes:
  - Configured GitHub Pages deployment workflow.
  - Set GitHub Pages source to GitHub Actions.
- Deployment:
  - Pushed to `origin/main`.
  - GitHub Pages workflow completed successfully.

## 2026-07-02 17:03 CST

- Operation: Initialized Astro GitHub Pages site.
- Commit: `75487d0 Initialize Astro GitHub Pages site`
- Changes:
  - Created Astro static site foundation.
  - Added initial blog, project, layout, style, RSS, sitemap, and placeholder components.
  - Added project rules in `AGENTS.md`.
- Verification:
  - `npm run check`
  - `npm run build`
