# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for Aichata Boujima (mobile developer, coach, entrepreneur). Plain HTML/CSS/vanilla JS front end (no build step, no package manager, no tests, no linter) plus a small PHP + MySQL backend for managing projects, events and gallery images. All user-facing content and code comments are in **French**; keep new content in French.

## Running locally

`demarrer-site.bat` starts the portable MySQL (`C:/Users/RPC/mysql`, config `my.ini`, data dir `C:/Users/RPC/mysql/data`) and the PHP built-in server on http://localhost:8000. PHP is at `C:/php`; `pdo_mysql` is disabled in its php.ini, so always run PHP with `-d extension=pdo_mysql`:

```bash
php -d extension=pdo_mysql -S localhost:8000      # from the site root
php -l api/admin.php                              # syntax check
node --check script.js && node --check admin/admin.js
```

Opening the HTML files directly (file://) still works: the API fetch is skipped and the static HTML content is shown. Do not use Docker for this project (the user explicitly does not want it).

Deployment targets mentioned in README: GitHub Pages, Netlify, Vercel (upload the folder as-is).

## Architecture

- **Multi-page site**: `index.html` (hero, 3 pillars, image "explore" cards, quote band, CTA), `a-propos.html`, `expertise.html` (expertise cards + values), `projets.html`, `conferences.html`, `blog.html`, `contact.html`. Every page duplicates the same `<head>` (fonts: Plus Jakarta Sans + Fraunces), navbar and footer; a change to nav/footer must be applied to all 7 files. The active nav link is hardcoded per page (`class="nav-link active"`).
- **Inner pages** start with a dark `.page-hero` banner, so their `<nav>` has class `on-dark` (white text until scrolled). `index.html` has a light hero and no `on-dark`.
- **Shared assets**: every page loads `styles.css`, then `data.js` followed by `script.js` at the end of `<body>`. `script.js` reads the global `siteData` from `data.js`.
- **`data.js` is the content source of truth**: personal info, `formspreeId` (empty = form shows a mailto fallback), `social` URLs, `blogPosts` (optional `image` field), `conferencePhotos`, `projects.*.url`.
- **`script.js`** (one `DOMContentLoaded` handler; every block null-guards its elements):
  - any element with `data-network="instagram|tiktok|whatsapp|linkedin|github"` gets its href from `siteData.social`; any `data-project="aichataMindset|weekendDigital|formationsTech|sillage"` from `siteData.projects`. Elements whose URL is empty or `"#"` are hidden (`hidden` attribute).
  - `.reveal` elements fade in via IntersectionObserver (`.reveal-delay-1..4` for stagger).
  - renders `blogPosts` into `#blogGrid` and `conferencePhotos` into `.conferences-gallery`, replacing the `.empty-state` placeholders only when arrays are non-empty.
  - contact form (`#contactForm`) POSTs JSON to `https://formspree.io/f/<formspreeId>`.
- **Styling**: `styles.css` design tokens in `:root` (emerald `#00866A`, forest `#063D35`, gold `#D4AF37`). Reusable pieces: `.section`/`.section-soft`, `.section-head` + `.eyebrow` + `.section-title` with `.serif-accent` for the italic accent word, `.chip`, `.btn-primary/-outline/-light/-ghost-light`, `.cta-box`, `.empty-state`. Breakpoints at 1100/960/600px; the mobile menu is an off-canvas drawer below 960px.
- **Images**: `images/photos/*.jpg` are Unsplash stock photos (free licence) used on cards (explorer-*, expertise-*, valeur-*, projet-*, etc.). Replace them with real photos by keeping the same filename. `images/icons/` is no longer used.

## Backend (PHP 8 + MySQL)

- `api/config.php` (gitignored; template `api/config.sample.php`): DB credentials, `setup_key`, `max_upload_mb`.
- `api/setup.php`: one-time web installer. Runs `database/schema.sql`, creates the first admin (requires `setup_key`), imports `database/seed.sql` if tables are empty. Locks itself once an admin exists.
- `api/public.php`: GET, no auth. Returns `{projects, events: {upcoming, past}, gallery}` (published rows only). Events dated today or later are "upcoming".
- `api/admin.php?action=login|logout|me|list|save|delete[&resource=projects|events|gallery]`: session auth (cookie `ab_admin`, SameSite=Strict); CSRF token returned by `login`/`me`, required in `X-CSRF-Token` on every POST; login rate limit via `login_attempts`.
- `api/resources.php`: whitelist of editable fields per resource + validation (`clean_fields`). Adding a column = update `schema.sql`, this map, `FORMS` in `admin/admin.js`, and the renderers in `script.js`.
- Uploads: `handle_upload()` checks MIME with finfo, re-encodes with GD (max width 1600px), stores in `uploads/` with a random name. DB image paths are relative to the site root (`uploads/...` or `images/photos/...`); `delete_upload()` only deletes files under `uploads/`.
- `.htaccess` files deny `database/`, internal `api/*.php`, and script execution in `uploads/` (Apache only; PHP's built-in server ignores them).
- Admin UI: `admin/index.html` + `admin.js` + `admin.css` (standalone, does not load `styles.css`).
- Front end: `script.js` fetches `siteData.apiUrl` and replaces `#projectsList`, `#eventsList`, `#upcomingEvents`, `.conferences-gallery` only when the API returns non-empty arrays. DB strings go through `escapeHtml`, URLs through `safeUrl`.

## Docs in this folder

Several French guide files (`README.md`, `START-HERE.txt`, `GUIDE_PERSONNALISATION.md`, `CONFIGURATION-FORMSPREE.md`, `FORMSPREE-GUIDE-RAPIDE.txt`, `TODO-LIST.md`, `RESUME-FINAL.md`, `CHANGELOG.md`, `LIENS-PAGES.txt`) are end-user instructions for the site owner. Note `.gitignore` lists `README.md` and `.idea/`.
