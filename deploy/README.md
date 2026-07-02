# Deployment Notes

Deployment is intentionally split by phase.

## Phase 2: GitHub Pages

GitHub Pages target:

```text
https://atlrwt.github.io/
```

Astro official guidance requires:

- `site` set to `https://atlrwt.github.io`
- `base` set to `/`
- GitHub Pages source set to GitHub Actions

Before replacing the old Hexo static site, keep a remote backup branch:

```text
legacy-hexo-static
```

## Phase 3: NAS

The NAS target should serve the static `dist/` directory.

Preferred future options:

- Docker + Nginx serving `dist/`
- Synology Web Station serving `dist/`
